#!/usr/bin/env python3
"""Bake the Russian publication lists / interests into index.html for search engines.

The lists are built by app.js from publications.js and i18n.js. Google renders JS, Yandex not
reliably, and without JS the page had empty boxes — so we let the real app.js render the page in
headless Chrome and copy the result between <!-- prerender:ID --> … <!-- /prerender:ID --> markers.
At runtime app.js still rebuilds these boxes (innerHTML = ''), so the visitor sees exactly the same.

Run after every change to publications.js or the Russian strings in i18n.js:
    python3 tools/prerender.py
Needs: chromium (or google-chrome). Nothing is required at deploy time.
"""
import functools, http.server, os, re, shutil, subprocess, sys, threading

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IDS = ['priest-pubs', 'math-interests', 'math-legend', 'math-pubs']


def chrome():
    for name in ('chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable'):
        if shutil.which(name):
            return name
    sys.exit('chromium / google-chrome not found')


def dump_dom(url):
    out = subprocess.run([chrome(), '--headless=new', '--disable-gpu', '--no-sandbox',
                          '--virtual-time-budget=3000', '--dump-dom', url],
                         capture_output=True, text=True, timeout=60)
    if 'id="priest-pubs"' not in out.stdout:
        sys.exit('headless Chrome returned no page:\n' + out.stderr[-2000:])
    return out.stdout


def inner(dom, el_id):
    """innerHTML of the element with id=el_id (balanced-tag scan, the DOM dump is well formed)."""
    m = re.search(r'<(\w+)[^>]*\bid="%s"[^>]*>' % re.escape(el_id), dom)
    if not m:
        sys.exit('#%s not found in rendered DOM' % el_id)
    tag, i, depth = m.group(1), m.end(), 1
    tok = re.compile(r'<(/?)%s\b[^>]*>' % tag)
    while depth:
        t = tok.search(dom, i)
        depth += -1 if t.group(1) else 1
        i = t.end()
    html = dom[m.end():t.start()]
    html = re.sub(r'<!--.*?-->', '', html, flags=re.S)   # drop old markers
    return re.sub(r'(<li\b)', r'\n\1', html).strip()     # one entry per line, readable diffs


def main():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    handler = functools.partial(Quiet, directory=ROOT)
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    try:
        dom = dump_dom('http://127.0.0.1:%d/index.html#/priest/ru' % srv.server_port)
    finally:
        srv.shutdown()

    path = os.path.join(ROOT, 'index.html')
    src = open(path, encoding='utf-8').read()
    for el_id in IDS:
        pat = re.compile(r'(<!-- prerender:%s -->)(.*?)(<!-- /prerender:%s -->)' % (el_id, el_id), re.S)
        if not pat.search(src):
            sys.exit('marker <!-- prerender:%s --> missing in index.html' % el_id)
        body = inner(dom, el_id)
        src = pat.sub(lambda m: m.group(1) + body + m.group(3), src)
        print('%-15s %6d chars' % (el_id, len(body)))
    open(path, 'w', encoding='utf-8').write(src)


if __name__ == '__main__':
    main()
