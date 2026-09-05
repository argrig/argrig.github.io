/* Hash router + renderer for the two-sided card.
 * Routes: #/priest/ru, #/priest/en, #/math/ru, #/math/en. Anything else → #/priest/ru.
 * Changing the hash is the only way state changes; the controls are plain links.
 */
(function () {
  'use strict';

  var DEFAULT_HASH = '#/priest/ru';
  var ROUTE_RE = /^#\/(priest|math)\/(ru|en)\/?$/;
  var FLIP_MS = 900;                 /* must be ≥ the CSS transition duration */

  var I18N = window.I18N || {};
  var PUB = window.PUBLICATIONS || { math: [], priest: [] };

  var card, faces, state = { persona: null, lang: null };
  var firstRender = true, flipTimer = null;

  /* ---------- helpers ---------- */
  function t(lang, key) {
    var d = I18N[lang] || {};
    if (Object.prototype.hasOwnProperty.call(d, key)) return d[key];
    var f = I18N.ru || {};
    return Object.prototype.hasOwnProperty.call(f, key) ? f[key] : key;
  }
  function fmt(s, vars) {
    return String(s).replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ''; });
  }
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (attrs[k] == null) return;
      if (k === 'class') n.className = attrs[k]; else n.setAttribute(k, attrs[k]);
    });
    if (children != null) {
      (Array.isArray(children) ? children : [children]).forEach(function (c) {
        if (c == null) return;
        n.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
      });
    }
    return n;
  }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }
  function byId(id) { return document.getElementById(id); }
  function extLink(url, label, cls) {
    return el('a', { class: cls || null, href: url, target: '_blank', rel: 'noopener' }, label);
  }
  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* ---------- routing ---------- */
  function parseHash(h) {
    var m = ROUTE_RE.exec(h || '');
    return m ? { persona: m[1], lang: m[2] } : null;
  }
  function hashFor(persona, lang) { return '#/' + persona + '/' + lang; }

  function route() {
    var s = parseHash(location.hash);
    if (!s) { location.replace(DEFAULT_HASH); return; }   /* replace → no junk history entry */
    render(s);
  }

  /* ---------- static text ---------- */
  function applyI18n(lang) {
    each(document.querySelectorAll('[data-i18n]'), function (n) { n.textContent = t(lang, n.getAttribute('data-i18n')); });
    each(document.querySelectorAll('[data-i18n-html]'), function (n) { n.innerHTML = t(lang, n.getAttribute('data-i18n-html')); });
    each(document.querySelectorAll('[data-i18n-alt]'), function (n) { n.setAttribute('alt', t(lang, n.getAttribute('data-i18n-alt'))); });
    each(document.querySelectorAll('[data-i18n-aria]'), function (n) { n.setAttribute('aria-label', t(lang, n.getAttribute('data-i18n-aria'))); });
    each(document.querySelectorAll('[data-i18n-title]'), function (n) { n.setAttribute('title', t(lang, n.getAttribute('data-i18n-title'))); });
  }

  function renderInterests(lang) {
    var ul = byId('math-interests');
    if (!ul) return;
    ul.innerHTML = '';
    var items = t(lang, 'm.interests');
    (Array.isArray(items) ? items : []).forEach(function (s) { ul.appendChild(el('li', { class: 'chip' }, s)); });
  }

  /* ---------- math publications ---------- */
  function mathEntry(e, lang) {
    var li = el('li', { class: 'pub' });
    li.appendChild(el('div', { class: 'pub__title' }, [
      e.year ? el('span', { class: 'pub__year' }, e.year) : null,
      el('span', null, e.title)
    ]));
    if (lang !== 'ru' && e.titleEn) li.appendChild(el('div', { class: 'pub__translation' }, e.titleEn));
    li.appendChild(el('div', { class: 'pub__venue' }, e.venue));

    var meta = [];
    if (e.pages) meta.push(fmt(t(lang, 'm.pages'), { n: e.pages }));
    if (e.coauthors) meta.push(fmt(t(lang, 'm.coauthors'), { list: e.coauthors }));
    if (meta.length) li.appendChild(el('div', { class: 'pub__meta' }, meta.join(' · ')));

    if (e.translation) {
      li.appendChild(el('div', { class: 'pub__translation' }, [
        el('span', { class: 'pub__label' }, t(lang, 'm.translation') + ' '),
        el('span', null, e.translation.title + '. ' + e.translation.venue)
      ]));
    }

    var tags = el('div', { class: 'pub__tags' });
    if (e.manuscript) tags.appendChild(el('span', { class: 'ix ix--kind' }, t(lang, 'm.manuscript')));
    else if (e.kind && e.kind !== 'article') tags.appendChild(el('span', { class: 'ix ix--kind' }, t(lang, 'm.kind.' + e.kind)));
    (e.indexed || []).forEach(function (code) {
      tags.appendChild(el('span', { class: 'ix ix--' + code, title: t(lang, 'ix.' + code + '.tip') }, t(lang, 'ix.' + code)));
    });
    (e.links || []).forEach(function (l) { tags.appendChild(extLink(l.url, l.label, 'pub__link')); });
    if (tags.childNodes.length) li.appendChild(tags);
    return li;
  }

  function mathList(entries, lang) {
    var ol = el('ol', { class: 'pub-list' });
    entries.forEach(function (e) { ol.appendChild(mathEntry(e, lang)); });
    return ol;
  }

  function renderMath(lang) {
    var box = byId('math-pubs');
    if (!box) return;
    box.innerHTML = '';
    box.appendChild(PUB.math.length
      ? mathList(PUB.math, lang)
      : el('p', { class: 'pubs__empty' }, t(lang, 'm.pubs.empty')));
  }

  /* ---------- priest publications ---------- */
  function priestEntry(e, lang) {
    var li = el('li', { class: 'pub' });
    li.appendChild(el('div', { class: 'pub__title' }, [
      el('span', { class: 'pub__year' }, e.year || t(lang, 'p.undated')),
      extLink(e.url, e.title.ru, 'pub__title-link'),
      e.group ? el('span', { class: 'ix ix--kind' }, t(lang, 'p.type.' + e.group)) : null
    ]));
    if (lang !== 'ru' && e.title[lang]) li.appendChild(el('div', { class: 'pub__translation' }, e.title[lang]));
    li.appendChild(el('div', { class: 'pub__venue' }, e.venue[lang] || e.venue.ru));
    if (e.related && e.related.length) {
      var tags = el('div', { class: 'pub__tags' }, el('span', { class: 'pub__label' }, t(lang, 'p.related')));
      e.related.forEach(function (r) { tags.appendChild(extLink(r.url, r.label[lang] || r.label.ru, 'pub__link')); });
      li.appendChild(tags);
    }
    return li;
  }

  function renderPriest(lang) {
    var box = byId('priest-pubs');
    if (!box) return;
    box.innerHTML = '';
    var ol = el('ol', { class: 'pub-list' });
    PUB.priest.forEach(function (e) { ol.appendChild(priestEntry(e, lang)); });
    box.appendChild(ol);
  }

  /* ---------- controls ---------- */
  function updateControls(s) {
    each(document.querySelectorAll('a[data-persona]'), function (a) {
      var p = a.getAttribute('data-persona');
      a.setAttribute('href', hashFor(p, s.lang));
      /* aria-current only on the toggle itself, not on the "flip" buttons */
      if (a.closest('.seg') && p === s.persona) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    each(document.querySelectorAll('a[data-lang]'), function (a) {
      var l = a.getAttribute('data-lang');
      a.setAttribute('href', hashFor(s.persona, l));
      if (l === s.lang) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }

  /* ---------- flip ---------- */
  function activeFaceId() { return card.classList.contains('is-flipped') ? 'face-math' : 'face-priest'; }

  /* Hide the inactive face after the animation so the card shrinks to the visible face. */
  function finishFlip() {
    clearTimeout(flipTimer);
    var active = activeFaceId();
    each(faces, function (f) { f.classList.toggle('is-hidden', f.id !== active); });
  }

  function setFace(persona, animate) {
    var flipped = persona === 'math';
    var changed = card.classList.contains('is-flipped') !== flipped;
    clearTimeout(flipTimer);
    each(faces, function (f) { f.classList.remove('is-hidden'); });   /* both visible during the turn */
    if (!animate) card.classList.add('no-transition');
    card.classList.toggle('is-flipped', flipped);

    var active = activeFaceId();
    each(faces, function (f) {
      if (f.id === active) { f.removeAttribute('aria-hidden'); f.removeAttribute('inert'); }
      else { f.setAttribute('aria-hidden', 'true'); f.setAttribute('inert', ''); }
    });

    if (!animate || !changed || reducedMotion()) {
      finishFlip();
      if (!animate) { void card.offsetWidth; card.classList.remove('no-transition'); }
    } else {
      flipTimer = setTimeout(finishFlip, FLIP_MS + 100);   /* fallback if transitionend never fires */
    }
    if (changed && animate) window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }

  /* ---------- render ---------- */
  function render(s) {
    var langChanged = s.lang !== state.lang;
    if (langChanged) {
      document.documentElement.lang = s.lang;
      applyI18n(s.lang);
      renderInterests(s.lang);
      renderMath(s.lang);
      renderPriest(s.lang);
    }
    document.title = t(s.lang, 'title.' + s.persona);
    updateControls(s);
    setFace(s.persona, !firstRender);
    firstRender = false;
    state = s;
  }

  /* ---------- init ---------- */
  function init() {
    card = byId('card');
    faces = card.querySelectorAll('.card-face');
    card.addEventListener('transitionend', function (e) {
      if (e.target === card && e.propertyName === 'transform') finishFlip();
    });
    window.addEventListener('hashchange', route);
    route();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
