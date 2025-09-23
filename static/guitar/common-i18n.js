// Shared i18n for all pages
(function () {
  const I18N = {
    en: {
      title: 'Guitar helper',
      subtitle: 'Chord voicings • Scales & Arpeggios • Live fretboard • Audio playback',
      // tuning groups
      tuningGroupStandard: 'Standard',
      tuningGroupDrop: 'Drop',
      tuningGroupOpen: 'Open',
      tuningGroupOther: 'Other',
      // scale families
      scaleFamilyDiatonic: 'Diatonic',
      scaleFamilyPentatonic: 'Pentatonic',
      scaleFamilyBlues: 'Blues',
      scaleFamilyHarmonic: 'Harmonic',
      scaleFamilyMelodic: 'Melodic',
      scaleFamilySymmetric: 'Symmetric',
      scaleFamilyBebop: 'Bebop',
      scaleFamilyWorld: 'World',
      scaleFamilyOther: 'Other',
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
      tabArpeggios: 'Arpeggios',
      omitExtensionsLbl: 'Omit extensions',
      posOpen: 'Open position',
      play: 'Play',
      noDuplicateNotesLbl: 'Filter duplicate notes',
      fingers: 'Fingers',
      footer: 'Made with love for guitars',
      // Harmony Navigator
      harmonyNavigatorTitle: 'Harmony Navigator',
      harmonyNavigatorSubtitle: 'Scales • Chord functions • Key relationships • Cadences',
      tonicLabel: 'Tonic',
      modeLabel: 'Scale / Mode',
      helpLabel: 'Quick Help',
      helpText: "Select tonic and mode. Below you'll see the scale, all diatonic chords with functions, related keys with modulations, and popular cadences.",
      scaleInfoLabel: 'Scale',
      keyInfoLabel: 'Key Information',
      chordsLabel: 'Diatonic Chords and Functions',
      relatedKeysLabel: 'Modulations and Related Keys',
      cadencesLabel: 'Cadences (in selected key)',
      notesLabel: 'Notes',
      degreeHeader: 'Degree',
      romanHeader: 'Roman',
      functionHeader: 'Function',
      triadHeader: 'Triad',
      seventhHeader: 'Seventh',
      tensionsHeader: 'Tensions',
      familyLabel: 'Family',
      formulaLabel: 'Interval formula',
      majorFamily: 'major',
      minorFamily: 'minor',
      fromText: ' from ',
      modulation: 'Modulation',
      returnText: 'Return',
      romanNumerals: 'Roman numerals',
      example: 'Example',
      minor: ' minor',
      major: ' major',
      // New form labels
      selectionFormLabel: 'Key Selection',
      noteLabel: 'Note',
      scaleLabel: 'Scale / Mode',
      scaleInfoLabel: 'Scale Information',
      tonicInfoLabel: 'Tonic:',
      familyInfoLabel: 'Family:',
      formulaInfoLabel: 'Formula:',
      formulaTooltip: 'Semitone intervals between consecutive notes',
      degreesInfoLabel: 'Degrees:',
      notesInfoLabel: 'Notes:',
      playBtnText: 'Play Scale',
      playHeader: 'Play',
      playTriadTooltip: 'Play triad',
      playSeventhTooltip: 'Play seventh chord',
      playNinthTooltip: 'Play 9th chord (5 notes)',
      playEleventhTooltip: 'Play 11th chord (6 notes)',
      playThirteenthTooltip: 'Play 13th chord (7 notes)',
      playCadenceTooltip: 'Play cadence',
      playCadenceBtn: 'Play',
      playCadencePlaying: 'Playing...',
      // chord quality groups
      chordGroupTriads: 'Triads',
      chordGroupSeventh: 'Seventh Chords',
      chordGroupSus: 'Suspended',
      // tuning groups
      tuningGroupStandard: 'Standard',
      tuningGroupDrop: 'Drop',
      tuningGroupOpen: 'Open',
      tuningGroupOther: 'Other',
      // scale families
      scaleFamilyDiatonic: 'Diatonic',
      scaleFamilyPentatonic: 'Pentatonic',
      scaleFamilyBlues: 'Blues',
      scaleFamilyHarmonic: 'Harmonic',
      scaleFamilyMelodic: 'Melodic',
      scaleFamilySymmetric: 'Symmetric',
      scaleFamilyBebop: 'Bebop',
      scaleFamilyWorld: 'World',
      scaleFamilyOther: 'Other',
      // extension groups
      extGroupBasic: 'Basic Extensions',
      extGroupExtended: 'Extended Tones',
      // chord info labels
      chordNotes: 'Notes',
      chordDegrees: 'Degrees',
      // scales page
      chooseChord: '1) Choose a chord',
      chordInfo: '2) Chord info',
      scales: '3) Suggested scales',
      // arpeggios page
      arpeggios: '3) Chord arpeggios',
      found_header: '3) Found voicings',
      hint: 'Click a scale to reveal the fretboard. Default tuning is <strong>E Standard</strong>.',
      legend: '<span class="dot tonic"></span> — tonic · <span class="dot scale"></span> — scale notes',
      lang: 'Language',
      labNotes: 'Notes',
      labDegrees: 'Degrees'
    },
    ru: {
      title: 'Гитарный помогатор',
      subtitle: 'Аппликатуры аккордов • Гаммы и арпеджио • Интерактивный гриф • Воспроизведение',
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
      tabArpeggios: 'Арпеджио',
      omitExtensionsLbl: 'Не показывать надстройки',
      posOpen: 'Открытая позиция',
      play: 'Прослушать',
      fingers: 'Пальцы',
      noDuplicateNotesLbl: 'Фильтровать одинаковые ноты',
      // scales page
      chooseChord: '1) Выбор аккорда',
      chordInfo: '2) Информация об аккорде',
      scales: '3) Подходящие гаммы / звукоряды',
      // arpeggios page
      arpeggios: '3) Арпеджио аккорда',
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
      // Harmony Navigator
      harmonyNavigatorTitle: 'Гармонический навигатор',
      harmonyNavigatorSubtitle: 'Гаммы • Функции аккордов • Родственные тональности • Каденции',
      tonicLabel: 'Тоника',
      modeLabel: 'Лад / Гамма',
      helpLabel: 'Справка',
      helpText: 'Выберите тонику и лад. Ниже появится гамма, все диатонические аккорды с функциями, родственные тональности с оборотами туда/обратно и список популярных каденций.',
      scaleInfoLabel: 'Гамма',
      keyInfoLabel: 'Ключевая информация',
      chordsLabel: 'Диатонические аккорды и функции',
      relatedKeysLabel: 'Модуляции и родственные тональности',
      cadencesLabel: 'Каденции (в выбранной тональности)',
      notesLabel: 'Замечания',
      degreeHeader: 'Ступень',
      romanHeader: 'Римская',
      functionHeader: 'Функция',
      triadHeader: 'Трезвучие',
      seventhHeader: 'Септаккорд',
      tensionsHeader: 'Надстройки',
      familyLabel: 'Семейство',
      formulaLabel: 'Интервальная формула',
      majorFamily: 'мажорное',
      minorFamily: 'минорное',
      fromText: ' от ',
      modulation: 'Модуляция',
      returnText: 'Обратно',
      romanNumerals: 'Римские цифры',
      example: 'Пример',
      minor: ' минор',
      major: ' мажор',
      // New form labels
      selectionFormLabel: 'Выбор тональности',
      noteLabel: 'Нота',
      scaleLabel: 'Лад / Гамма',
      scaleInfoLabel: 'Информация о гамме',
      tonicInfoLabel: 'Тоника:',
      familyInfoLabel: 'Семейство:',
      formulaInfoLabel: 'Формула:',
      formulaTooltip: 'Полутоновые интервалы между соседними нотами',
      degreesInfoLabel: 'Ступени:',
      notesInfoLabel: 'Ноты:',
      playBtnText: 'Проиграть гамму',
      playHeader: 'Воспроизвести',
      playTriadTooltip: 'Проиграть трезвучие',
      playSeventhTooltip: 'Проиграть септаккорд',
      playNinthTooltip: 'Проиграть нонаккорд (5 нот)',
      playEleventhTooltip: 'Проиграть ундецимаккорд (6 нот)',
      playThirteenthTooltip: 'Проиграть терцдецимаккорд (7 нот)',
      playCadenceTooltip: 'Проиграть каденцию',
      playCadenceBtn: 'Играть',
      playCadencePlaying: 'Играет...',
      // chord quality groups
      chordGroupTriads: 'Трезвучия',
      chordGroupSeventh: 'Септаккорды',
      chordGroupSus: 'Sus аккорды',
      // tuning groups
      tuningGroupStandard: 'Стандартные',
      tuningGroupDrop: 'Дроп',
      tuningGroupOpen: 'Открытые',
      tuningGroupOther: 'Другие',
      // scale families
      scaleFamilyDiatonic: 'Диатонические',
      scaleFamilyPentatonic: 'Пентатонические',
      scaleFamilyBlues: 'Блюзовые',
      scaleFamilyHarmonic: 'Гармонические',
      scaleFamilyMelodic: 'Мелодические',
      scaleFamilySymmetric: 'Симметричные',
      scaleFamilyBebop: 'Бибоп',
      scaleFamilyWorld: 'Этнические',
      scaleFamilyOther: 'Прочие',
      // extension groups
      extGroupBasic: 'Базовые расширения',
      extGroupExtended: 'Расширенные тона',
      // chord info labels
      chordNotes: 'Ноты',
      chordDegrees: 'Ступени',
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

  // Try to find the language control element (button or select)
  function findLangControl() {
    return document.querySelector('#langToggle, #langSel, #langSelect, .lang-select');
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
    // Sync control value if present
    const control = findLangControl();
    if (control) {
      if (control.tagName === 'BUTTON') {
        control.setAttribute('data-lang', saved);
        control.textContent = saved.toUpperCase();
      } else {
        control.value = saved;
      }
    }
    document.documentElement.lang = saved || document.documentElement.lang;
  }

  // Wire language control (button or selector) to persist and apply language
  function wireLangControl() {
    const control = findLangControl();
    if (!control) return;

    // initialize control from saved or current DEFAULT_LANG
    const saved = getSavedLang();
    if (saved) {
      if (control.tagName === 'BUTTON') {
        control.setAttribute('data-lang', saved);
        control.textContent = saved.toUpperCase();
      } else {
        control.value = saved;
      }
    }

    if (control.tagName === 'BUTTON') {
      // Handle button toggle
      control.addEventListener('click', () => {
        const currentLang = control.getAttribute('data-lang') || 'en';
        const newLang = currentLang === 'en' ? 'ru' : 'en';
        control.setAttribute('data-lang', newLang);
        control.textContent = newLang.toUpperCase();
        saveLang(newLang);

        if (typeof window.applyLang === 'function') {
          try { window.applyLang(newLang); } catch (e) { /* ignore */ }
        } else {
          window.DEFAULT_LANG = newLang;
          document.documentElement.lang = newLang;
          if (typeof window.updateUITexts === 'function') {
            try { window.updateUITexts(); } catch (e) { /* ignore */ }
          }
        }
      });
    } else {
      // Handle select dropdown
      control.addEventListener('change', () => {
        const v = control.value;
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
  }

  // Run after DOM ready so selector exists
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applySavedLangIfAny();
      wireLangControl();
    });
  } else {
    applySavedLangIfAny();
    wireLangControl();
  }
})();
