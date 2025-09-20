// Shared i18n for all pages
(function () {
  const I18N = {
    en: {
      title: 'Guitar helper',
      subtitle: 'Chord fingerings and scales for playing them',
      language: 'Language',
      tuningTitle: 'Tuning',
      rootLabel: 'Root',
      qualityLabel: 'Quality',
      quality: 'Chord type',
      bassLabel: 'Bass (slash chord)',
      labelModeLabel: 'Label mode',
      labelIntervals: 'Intervals',
      labelNotes: 'Notes',
      displayMode: 'Display',
      notes: 'Notes',
      intervals: 'Intervals',
      extensions: 'Extensions',
      root: 'Root',
      bass: 'Bass (slash chord)',
      constraintsTitle: 'Constraints',
      omitRootLbl: 'Allow omit root',
      omitFifthLbl: 'Allow omit fifth',
      allowOpensLbl: 'Allow open strings',
      contiguousLbl: 'Contiguous strings',
      minStringsLabel: 'Min strings',
      found_tpl: 'Found: {n} voicings (limited to {limit}).',
      nothing: 'Nothing found. Increase limit/span or allow opens/contiguity.',
      span: 'Span',
      fretsUnit: 'frets',
      labels: 'Labels',
      no_notes: '—',
      shape: 'Shape',
      position_tpl: 'Position frets {from}–{to}',
      supported_tpl: 'Supported: {list}',
      posFretsSuffix: 'frets',
      tabChords: 'Fingerings',
      tabScales: 'Scales',
      omitExtensionsLbl: 'Omit extensions',
      posOpen: 'Open position',
      play: 'Play',
      noDuplicateNotesLbl: 'Filter duplicate notes',
      fingers: 'Fingers',
      footer: 'Made with love for guitars',
      // scales page
      chooseChord: '1) Choose a chord',
      chordInfo: '2) Chord info',
      scales: '3) Suggested scales',
      found_header: '3) Found voicings',
      hint: 'Click a scale to reveal the fretboard. Default tuning is <strong>E Standard</strong>.',
      legend: '<span class="dot tonic"></span> — tonic · <span class="dot scale"></span> — scale notes',
      lang: 'Language',
      labNotes: 'Notes',
      labDegrees: 'Degrees'
    },
    ru: {
      title: 'Гитарный помогатор',
      subtitle: 'Аппликатуры аккордов и гаммы для их обыгрывания',
      language: 'Язык',
      tuningTitle: 'Строй',
      rootLabel: 'Тоника',
      qualityLabel: 'Вид',
      quality: 'Тип аккорда',
      bassLabel: 'Бас (слэш-аккорд)',
      labelModeLabel: 'Режим подписей',
      labelIntervals: 'Интервалы',
      labelNotes: 'Ноты',
      displayMode: 'Отображение',
      notes: 'Ноты',
      intervals: 'Интервалы',
      extensions: 'Надстройки',
      root: 'Тоника',
      bass: 'Бас',
      constraintsTitle: 'Ограничения',
      omitRootLbl: 'Можно без тоники',
      omitFifthLbl: 'Можно без квинты',
      allowOpensLbl: 'Разрешать открытые',
      contiguousLbl: 'Без пропуска струн',
      minStringsLabel: 'Мин. струн',
      found_tpl: 'Найдено: {n} аппликатур (ограничено {limit}).',
      nothing: 'Ничего не найдено. Увеличьте лимит/растяжку или разрешите открытые/непрерывность.',
      span: 'Растяжка',
      fretsUnit: 'ладов',
      labels: 'Интервалы',
      no_notes: '—',
      posOpen: 'Открытая позиция',
      shape: 'Схема',
      position_tpl: 'Позиция {from}–{to} лад',
      supported_tpl: 'Поддерживаются: {list}',
      posFretsSuffix: 'лады',
      tabChords: 'Аппликатуры',
      tabScales: 'Гаммы',
      omitExtensionsLbl: 'Не показывать надстройки',
      posOpen: 'Открытая позиция',
      play: 'Прослушать',
      fingers: 'Пальцы',
      noDuplicateNotesLbl: 'Фильтровать одинаковые ноты',
      // scales page
      chooseChord: '1) Выбор аккорда',
      chordInfo: '2) Информация об аккорде',
      scales: '3) Подходящие гаммы / звукоряды',
      found_header: '3) Найденные аппликатуры',
      hint: 'Кликните по названию, чтобы раскрыть гриф. По умолчанию — строй <strong>E Standard</strong>.',
      root: 'Тоника',
      quality: 'Тип аккорда',
      bass: 'Бас',
      extensions: 'Надстройки',
      tuning: 'Строй',
      play: 'Проиграть',
      noDuplicateNotesLbl: 'Фильтровать одинаковые ноты',
      legend: '<span class="dot tonic"></span> — тоника · <span class="dot scale"></span> — ноты гаммы',
      footer: 'Сделано с любовью к гитарам',
      lang: 'Язык',
      labels: 'Подписи',
      labNotes: 'Ноты',
      labDegrees: 'Ступени'
    }
  };

  // expose globals
  window.I18N = window.I18N || I18N;
  window.DEFAULT_LANG = window.DEFAULT_LANG || 'en';
})();

// --- Language persistence and wiring for language selector ---
(function () {
  const LS_KEY = 'guitar_tools_lang';

  function getSavedLang() {
    try { return localStorage.getItem(LS_KEY); } catch (e) { return null; }
  }
  function saveLang(lang) {
    try { localStorage.setItem(LS_KEY, lang); } catch (e) { /* ignore */ }
  }

  // Try to find the language select element (support several ids/classes)
  function findLangSelect() {
    return document.querySelector('#langSel, #langSelect, .lang-select');
  }

  function applySavedLangIfAny() {
    const saved = getSavedLang();
    if (!saved) return;
    // If there is an applyLang function use it, otherwise try setting globals
    if (typeof window.applyLang === 'function') {
      try { window.applyLang(saved); } catch (e) { /* ignore */ }
    } else {
      // fallback: set DEFAULT_LANG/currentLang and trigger potential updater
      window.DEFAULT_LANG = saved;
      if (typeof window.updateUITexts === 'function') {
        try { window.updateUITexts(); } catch (e) { /* ignore */ }
      }
    }
    // Sync selector value if present
    const sel = findLangSelect();
    if (sel) sel.value = saved;
    document.documentElement.lang = saved || document.documentElement.lang;
  }

  // Wire selector to persist and apply language
  function wireLangSelect() {
    const sel = findLangSelect();
    if (!sel) return;
    // initialize selector from saved or current DEFAULT_LANG
    const saved = getSavedLang();
    if (saved) sel.value = saved;
    sel.addEventListener('change', () => {
      const v = sel.value;
      saveLang(v);
      if (typeof window.applyLang === 'function') {
        try { window.applyLang(v); } catch (e) { /* ignore */ }
      } else {
        window.DEFAULT_LANG = v;
        document.documentElement.lang = v;
        if (typeof window.updateUITexts === 'function') {
          try { window.updateUITexts(); } catch (e) { /* ignore */ }
        }
      }
    });
  }

  // Run after DOM ready so selector exists
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applySavedLangIfAny();
      wireLangSelect();
    });
  } else {
    applySavedLangIfAny();
    wireLangSelect();
  }
})();
