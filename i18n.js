/* All visible strings of the card, per language.
 * Keys are flat; markup uses data-i18n="key" (textContent), data-i18n-html="key" (innerHTML, only for
 * keys that contain <br>), data-i18n-alt="key" (alt) and data-i18n-aria="key" (aria-label).
 * Arrays (m.interests) are rendered by app.js.
 */
window.I18N = {
  ru: {
    /* controls */
    'ctl.persona': 'Сторона визитки',
    'ctl.lang': 'Язык',
    'ctl.side': 'Сторона:',
    'ctl.language': 'Язык:',
    'ctl.priest': 'Священник',
    'ctl.math': 'Математик',
    'ctl.ru': 'RU',
    'ctl.en': 'EN',
    'ctl.flip': 'Перевернуть ↻',

    /* document titles */
    'title.priest': 'Протоиерей Арсений Григорянц',
    'title.math': 'Григорянц Армен Артемович — математик',

    /* contacts */
    'c.tg': 'Telegram',
    'c.phone': 'Телефон',
    'c.email': 'Электронная почта',

    /* priest side */
    'p.church': 'РУССКАЯ ПРАВОСЛАВНАЯ ЦЕРКОВЬ',
    'p.patriarchate': 'МОСКОВСКИЙ ПАТРИАРХАТ',
    'p.diocese': 'ЕРЕВАНСКО-АРМЯНСКАЯ ЕПАРХИЯ',
    'p.rank': 'ПРОТОИЕРЕЙ',
    'p.name': 'Арсений Григорянц',
    'p.pos1': 'Секретарь епархии',
    'p.pos2': 'Благочинный Ереванского округа',
    'p.pos3': 'Настоятель Покровского храма г. Еревана',
    'p.pos4': 'Председатель БОО "Русский народный собор" в Армении',
    'p.alt.cross': 'Православный крест',
    'p.alt.photo': 'Протоиерей Арсений Григорянц',
    'p.pubs.h': 'Доклады и публикации',
    'p.type.reports': 'доклад',
    'p.type.articles': 'статья',
    'p.type.interviews': 'интервью',
    'p.related': 'См. также:',
    'p.undated': 'без даты',

    /* math side */
    'm.name': 'Григорянц Армен Артемович',
    'm.degree': 'Кандидат физико-математических наук',
    'm.affil': 'Филиал МГУ имени М.В. Ломоносова в городе Ереване',
    'm.addr': 'Республика Армения, Ереван, ул. Вардананц, 17',
    'm.alt.photo': 'Григорянц Армен Артемович',
    'm.interests.h': 'Научные интересы',
    'm.interests': ['коммутативная алгебра', 'дифференциальная геометрия', 'теория категорий', 'теория корректирующих кодов', 'основания математики', 'нестандартный анализ'],
    'm.contacts.h': 'Контакты',
    'm.profiles.h': 'Профили в базах данных',
    'm.pubs.h': 'Публикации',
    'm.pubs.empty': 'Раздел пополняется — новые публикации будут добавлены.',
    'm.pubs.legend': 'Отметки показывают, где работа проиндексирована: Scopus, Web of Science, РИНЦ, Math-Net.Ru, zbMATH, MathSciNet.',
    'm.pages': '{n} с.',
    'm.coauthors': 'Соавторы: {list}',
    'm.manuscript': 'рукопись',
    'm.translation': 'Английская версия:',
    'm.kind.book': 'учебник',
    'm.kind.preprint': 'препринт',
    'm.kind.thesis': 'диссертация',
    'm.kind.abstract': 'тезисы',

    /* index badges */
    'ix.scopus': 'Scopus',
    'ix.wos': 'Web of Science',
    'ix.rsci': 'РИНЦ',
    'ix.mathnet': 'Math-Net.Ru',
    'ix.zbmath': 'zbMATH',
    'ix.mathscinet': 'MathSciNet',
    'ix.scopus.tip': 'Индексируется в Scopus',
    'ix.wos.tip': 'Индексируется в Web of Science',
    'ix.rsci.tip': 'Индексируется в РИНЦ (eLibrary.ru)',
    'ix.mathnet.tip': 'Есть в Math-Net.Ru',
    'ix.zbmath.tip': 'Реферируется в zbMATH Open',
    'ix.mathscinet.tip': 'Реферируется в MathSciNet (Mathematical Reviews)'
  },

  en: {
    /* controls */
    'ctl.persona': 'Card side',
    'ctl.lang': 'Language',
    'ctl.side': 'Side:',
    'ctl.language': 'Language:',
    'ctl.priest': 'Priest',
    'ctl.math': 'Mathematician',
    'ctl.ru': 'RU',
    'ctl.en': 'EN',
    'ctl.flip': 'Flip the card ↻',

    /* document titles */
    'title.priest': 'Archpriest Arseny Grigoryants',
    'title.math': 'Armen Artemovich Grigoryants — Mathematician',

    /* contacts */
    'c.tg': 'Telegram',
    'c.phone': 'Phone',
    'c.email': 'E-mail',

    /* priest side */
    'p.church': 'RUSSIAN ORTHODOX CHURCH',
    'p.patriarchate': 'MOSCOW PATRIARCHATE',
    'p.diocese': 'DIOCESE OF YEREVAN AND ARMENIA',
    'p.rank': 'ARCHPRIEST',
    'p.name': 'Arseny Grigoryants',
    'p.pos1': 'Diocesan Secretary',
    'p.pos2': 'Dean of the Yerevan Deanery',
    'p.pos3': 'Rector of the Intercession (Pokrovsky) Church, Yerevan',
    'p.pos4': 'Chairman of the charitable public organization “Russian People’s Council” in Armenia',
    'p.alt.cross': 'Orthodox cross',
    'p.alt.photo': 'Archpriest Arseny Grigoryants',
    'p.pubs.h': 'Reports and publications',
    'p.type.reports': 'report',
    'p.type.articles': 'article',
    'p.type.interviews': 'interview',
    'p.related': 'See also:',
    'p.undated': 'undated',

    /* math side */
    'm.name': 'Armen Artemovich Grigoryants',
    'm.degree': 'Doctor of Mathematics',
    'm.affil': 'Lomonosov Moscow State University, Yerevan Branch',
    'm.addr': '17 Vardanants str., Yerevan, Republic of Armenia',
    'm.alt.photo': 'Armen Artemovich Grigoryants',
    'm.interests.h': 'Research interests',
    'm.interests': ['commutative algebra', 'differential geometry', 'category theory', 'error-correcting codes', 'foundations of mathematics', 'non-standard analysis'],
    'm.contacts.h': 'Contacts',
    'm.profiles.h': 'Database profiles',
    'm.pubs.h': 'Publications',
    'm.pubs.empty': 'This section is being updated — new publications will be added.',
    'm.pubs.legend': 'Badges show where a work is indexed: Scopus, Web of Science, RSCI, Math-Net.Ru, zbMATH, MathSciNet.',
    'm.pages': '{n} pp.',
    'm.coauthors': 'Co-authors: {list}',
    'm.manuscript': 'manuscript',
    'm.translation': 'English edition:',
    'm.kind.book': 'textbook',
    'm.kind.preprint': 'preprint',
    'm.kind.thesis': 'thesis',
    'm.kind.abstract': 'abstract',

    /* index badges */
    'ix.scopus': 'Scopus',
    'ix.wos': 'Web of Science',
    'ix.rsci': 'RSCI',
    'ix.mathnet': 'Math-Net.Ru',
    'ix.zbmath': 'zbMATH',
    'ix.mathscinet': 'MathSciNet',
    'ix.scopus.tip': 'Indexed in Scopus',
    'ix.wos.tip': 'Indexed in Web of Science',
    'ix.rsci.tip': 'Indexed in the Russian Science Citation Index (eLibrary.ru)',
    'ix.mathnet.tip': 'Listed in Math-Net.Ru',
    'ix.zbmath.tip': 'Reviewed in zbMATH Open',
    'ix.mathscinet.tip': 'Reviewed in MathSciNet (Mathematical Reviews)'
  }
};
