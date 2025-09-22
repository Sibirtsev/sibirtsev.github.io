// Shared canonical data for tunings, chord qualities and extensions
// This file is included before page scripts to keep tunings/qualities/extensions in sync.
(function () {
  // Tunings: provide pcs (pitch classes low->high?), midi (low->high) and strings array (low->high)
  // We'll store strings low->high (6th -> 1st) as {name,oct}, and midi numbers low->high.
  window.COMMON_TUNINGS = {
    'E Standard': {
      name: 'E Standard',
      strings: [{ name: 'E', oct: 2 }, { name: 'A', oct: 2 }, { name: 'D', oct: 3 }, { name: 'G', oct: 3 }, { name: 'B', oct: 3 }, { name: 'E', oct: 4 }],
      pcs: [4, 9, 2, 7, 11, 4],
      midi: [40, 45, 50, 55, 59, 64]
    },
    'Eb Standard': {
      name: 'Eb Standard',
      strings: [{ name: 'D#', oct: 2 }, { name: 'G#', oct: 2 }, { name: 'C#', oct: 3 }, { name: 'F#', oct: 3 }, { name: 'A#', oct: 3 }, { name: 'D#', oct: 4 }],
      pcs: [3, 8, 1, 6, 10, 3],
      midi: [39, 44, 49, 54, 58, 63]
    },
    'D Standard': {
      name: 'D Standard',
      strings: [{ name: 'D', oct: 2 }, { name: 'G', oct: 2 }, { name: 'C', oct: 3 }, { name: 'F', oct: 3 }, { name: 'A', oct: 3 }, { name: 'D', oct: 4 }],
      pcs: [2, 7, 0, 5, 9, 2],
      midi: [38, 43, 48, 53, 57, 62]
    },
    'C Standard': {
      name: 'C Standard',
      strings: [{ name: 'C', oct: 2 }, { name: 'G', oct: 2 }, { name: 'C', oct: 3 }, { name: 'F', oct: 3 }, { name: 'A#', oct: 3 }, { name: 'D', oct: 4 }],
      pcs: [0, 5, 10, 3, 7, 0],
      midi: [36, 41, 46, 51, 55, 60]
    },
    'Drop D': {
      name: 'Drop D',
      strings: [{ name: 'D', oct: 2 }, { name: 'A', oct: 2 }, { name: 'D', oct: 3 }, { name: 'G', oct: 3 }, { name: 'B', oct: 3 }, { name: 'E', oct: 4 }],
      pcs: [2, 9, 2, 7, 11, 4],
      midi: [38, 45, 50, 55, 59, 64]
    },
    'Drop C#': {
      name: 'Drop C#',
      strings: [{ name: 'C#', oct: 2 }, { name: 'G#', oct: 2 }, { name: 'C#', oct: 3 }, { name: 'F#', oct: 3 }, { name: 'A#', oct: 3 }, { name: 'D#', oct: 4 }],
      pcs: [1, 8, 1, 6, 10, 3],
      midi: [37, 44, 49, 54, 58, 63]
    },
    'Drop C': {
      name: 'Drop C',
      strings: [{ name: 'C', oct: 2 }, { name: 'G', oct: 2 }, { name: 'C', oct: 3 }, { name: 'F', oct: 3 }, { name: 'A', oct: 3 }, { name: 'D', oct: 4 }],
      pcs: [0, 7, 0, 5, 9, 2],
      midi: [36, 43, 48, 53, 57, 62]
    },
    'Drop B': {
      name: 'Drop B',
      strings: [{ name: 'B', oct: 1 }, { name: 'F#', oct: 2 }, { name: 'B', oct: 2 }, { name: 'E', oct: 3 }, { name: 'G#', oct: 3 }, { name: 'C#', oct: 4 }],
      pcs: [11, 6, 11, 4, 8, 1],
      midi: [35, 42, 47, 52, 56, 61]
    },
    'Double Drop D': {
      name: 'Double Drop D',
      strings: [{ name: 'D', oct: 2 }, { name: 'A', oct: 2 }, { name: 'D', oct: 3 }, { name: 'G', oct: 3 }, { name: 'B', oct: 3 }, { name: 'D', oct: 4 }],
      pcs: [2, 9, 2, 7, 11, 2],
      midi: [38, 45, 50, 55, 59, 62]
    },
    'DADGAD': {
      name: 'DADGAD',
      strings: [{ name: 'D', oct: 2 }, { name: 'A', oct: 2 }, { name: 'G', oct: 3 }, { name: 'D', oct: 3 }, { name: 'A', oct: 3 }, { name: 'D', oct: 4 }],
      pcs: [2, 9, 2, 7, 9, 2],
      midi: [38, 45, 50, 55, 57, 62]
    },
    'Open D (D A D F# A D)': {
      name: 'Open D',
      strings: [{ name: 'D', oct: 2 }, { name: 'A', oct: 2 }, { name: 'D', oct: 3 }, { name: 'F#', oct: 3 }, { name: 'A', oct: 3 }, { name: 'D', oct: 4 }],
      pcs: [2, 9, 2, 6, 9, 2],
      midi: [38, 45, 50, 54, 57, 62]
    },
    'Open E (E B E G# B E)': {
      name: 'Open E',
      strings: [{ name: 'E', oct: 2 }, { name: 'B', oct: 2 }, { name: 'E', oct: 3 }, { name: 'G#', oct: 3 }, { name: 'B', oct: 3 }, { name: 'E', oct: 4 }],
      pcs: [4, 11, 4, 8, 11, 4],
      midi: [40, 47, 52, 56, 59, 64]
    },
    'Open G (D G D G B D)': {
      name: 'Open G',
      strings: [{ name: 'D', oct: 2 }, { name: 'G', oct: 2 }, { name: 'D', oct: 3 }, { name: 'G', oct: 3 }, { name: 'B', oct: 3 }, { name: 'D', oct: 4 }],
      pcs: [2, 7, 2, 7, 11, 2],
      midi: [38, 43, 50, 55, 59, 62]
    },
    'Open C (C G C G C E)': {
      name: 'Open C',
      strings: [{ name: 'C', oct: 2 }, { name: 'G', oct: 2 }, { name: 'C', oct: 3 }, { name: 'G', oct: 3 }, { name: 'C', oct: 4 }, { name: 'E', oct: 4 }],
      pcs: [0, 7, 0, 7, 0, 4],
      midi: [36, 43, 48, 55, 60, 64]
    },
    'Nashville (High-Strung)': {
      name: 'Nashville (High-Strung)',
      strings: [{ name: 'E', oct: 3 }, { name: 'A', oct: 3 }, { name: 'D', oct: 4 }, { name: 'G', oct: 4 }, { name: 'B', oct: 4 }, { name: 'E', oct: 5 }],
      pcs: [4, 9, 2, 7, 11, 4],
      midi: [52, 57, 62, 67, 71, 76]
    },
    'FACGCE Math Rock': {
      name: 'FACGCE',
      strings: [{ name: 'F', oct: 2 }, { name: 'A', oct: 2 }, { name: 'C', oct: 3 }, { name: 'G', oct: 3 }, { name: 'C', oct: 4 }, { name: 'E', oct: 4 }],
      pcs: [5, 9, 0, 7, 0, 4],
      midi: [41, 45, 48, 55, 60, 64]
    },
    'DAEAC#E Math Rock': {
      name: 'DAEAC#E',
      strings: [{ name: 'D', oct: 2 }, { name: 'A', oct: 2 }, { name: 'E', oct: 3 }, { name: 'A', oct: 3 }, { name: 'C#', oct: 4 }, { name: 'E', oct: 4 }],
      pcs: [2, 9, 4, 9, 1, 4],
      midi: [38, 45, 52, 57, 61, 64]
    }
  };

  // Tuning groups - группировка строев по категориям
  window.TUNING_GROUPS = [
    {
      key: 'tuningGroupStandard',
      tunings: ['E Standard', 'Eb Standard', 'D Standard', 'C Standard']
    },
    {
      key: 'tuningGroupDrop',
      tunings: ['Drop D', 'Drop C#', 'Drop C', 'Drop B', 'Double Drop D']
    },
    {
      key: 'tuningGroupOpen',
      tunings: ['Open D (D A D F# A D)', 'Open E (E B E G# B E)', 'Open G (D G D G B D)', 'Open C (C G C G C E)']
    },
    {
      key: 'tuningGroupOther',
      tunings: ['DADGAD', 'Nashville (High-Strung)', 'FACGCE Math Rock', 'DAEAC#E Math Rock']
    }
  ];

  // Scales - музыкальные лады и гаммы
  window.COMMON_SCALES = {
    "ionian": { name_en: "Ionian (major)", name_ru: "Ионийский (мажор)", degrees_en: "1 2 3 4 5 6 7", degrees_ru: "1 2 3 4 5 6 7", intervals: [0, 2, 4, 5, 7, 9, 11], family: "diatonic" },
    "dorian": { name_en: "Dorian", name_ru: "Дорийский", degrees_en: "1 2 ♭3 4 5 6 ♭7", degrees_ru: "1 2 ♭3 4 5 6 ♭7", intervals: [0, 2, 3, 5, 7, 9, 10], family: "diatonic" },
    "phrygian": { name_en: "Phrygian", name_ru: "Фригийский", degrees_en: "1 ♭2 ♭3 4 5 ♭6 ♭7", degrees_ru: "1 ♭2 ♭3 4 5 ♭6 ♭7", intervals: [0, 1, 3, 5, 7, 8, 10], family: "diatonic" },
    "lydian": { name_en: "Lydian", name_ru: "Лидийский", degrees_en: "1 2 3 #4 5 6 7", degrees_ru: "1 2 3 #4 5 6 7", intervals: [0, 2, 4, 6, 7, 9, 11], family: "diatonic" },
    "mixolydian": { name_en: "Mixolydian", name_ru: "Миксолидийский", degrees_en: "1 2 3 4 5 6 ♭7", degrees_ru: "1 2 3 4 5 6 ♭7", intervals: [0, 2, 4, 5, 7, 9, 10], family: "diatonic" },
    "aeolian": { name_en: "Aeolian (natural minor)", name_ru: "Эолийский (нат. минор)", degrees_en: "1 2 ♭3 4 5 ♭6 ♭7", degrees_ru: "1 2 ♭3 4 5 ♭6 ♭7", intervals: [0, 2, 3, 5, 7, 8, 10], family: "diatonic" },
    "locrian": { name_en: "Locrian", name_ru: "Локрийский", degrees_en: "1 ♭2 ♭3 4 ♭5 ♭6 ♭7", degrees_ru: "1 ♭2 ♭3 4 ♭5 ♭6 ♭7", intervals: [0, 1, 3, 5, 6, 8, 10], family: "diatonic" },
    "maj_pent": { name_en: "Major pentatonic", name_ru: "Мажорная пентатоника", degrees_en: "1 2 3 5 6", degrees_ru: "1 2 3 5 6", intervals: [0, 2, 4, 7, 9], parent: "ionian", family: "pentatonic" },
    "min_pent": { name_en: "Minor pentatonic", name_ru: "Минорная пентатоника", degrees_en: "1 ♭3 4 5 ♭7", degrees_ru: "1 ♭3 4 5 ♭7", intervals: [0, 3, 5, 7, 10], parent: "aeolian", family: "pentatonic" },
    "harm_minor": { name_en: "Harmonic minor", name_ru: "Гармонический минор", degrees_en: "1 2 ♭3 4 5 ♭6 7", degrees_ru: "1 2 ♭3 4 5 ♭6 7", intervals: [0, 2, 3, 5, 7, 8, 11], family: "harmonic" },
    "mel_minor": { name_en: "Melodic minor (asc)", name_ru: "Мелодический минор (вверх)", degrees_en: "1 2 ♭3 4 5 6 7", degrees_ru: "1 2 ♭3 4 5 6 7", intervals: [0, 2, 3, 5, 7, 9, 11], family: "melodic" },
    "lyd_dom": { name_en: "Lydian dominant (MM4)", name_ru: "Лидийский доминант (MM4)", degrees_en: "1 2 3 #4 5 6 ♭7", degrees_ru: "1 2 3 #4 5 6 ♭7", intervals: [0, 2, 4, 6, 7, 9, 10], family: "melodic" },
    "mix_b9b13": { name_en: "Mixolydian ♭9 ♭13 (HM5)", name_ru: "Миксолидийский ♭9 ♭13 (HM5)", degrees_en: "1 ♭2 3 4 5 ♭6 ♭7", degrees_ru: "1 ♭2 3 4 5 ♭6 ♭7", intervals: [0, 1, 4, 5, 7, 8, 10], family: "harmonic" },
    "altered": { name_en: "Altered (Super Locrian)", name_ru: "Альтерированная (Super Locrian)", degrees_en: "1 ♭2 ♭3 ♭4 ♭5 ♭6 ♭7", degrees_ru: "1 ♭2 ♭3 ♭4 ♭5 ♭6 ♭7", intervals: [0, 1, 3, 4, 6, 8, 10], family: "melodic" },
    "whole_half_dim": { name_en: "Whole–half diminished", name_ru: "Цел-пол уменьш.", degrees_en: "1 2 ♭3 4 ♭5 ♭6 6 7", degrees_ru: "1 2 ♭3 4 ♭5 ♭6 6 7", intervals: [0, 2, 3, 5, 6, 8, 9, 11], family: "symmetric" },
    "half_whole_dim": { name_en: "Half–whole diminished", name_ru: "Пол-цел уменьш.", degrees_en: "1 ♭2 ♭3 3 #4 5 6 ♭7", degrees_ru: "1 ♭2 ♭3 3 #4 5 6 ♭7", intervals: [0, 1, 3, 4, 6, 7, 9, 10], family: "symmetric" },
    "whole_tone": { name_en: "Whole tone", name_ru: "Целотоновый", degrees_en: "1 2 3 #4 #5 ♭7", degrees_ru: "1 2 3 #4 #5 ♭7", intervals: [0, 2, 4, 6, 8, 10], family: "symmetric" },
    "locrian_nat2": { name_en: "Locrian nat2 (MM6)", name_ru: "Локрийский nat2 (MM6)", degrees_en: "1 2 ♭3 4 ♭5 ♭6 ♭7", degrees_ru: "1 2 ♭3 4 ♭5 ♭6 ♭7", intervals: [0, 2, 3, 5, 6, 8, 10], family: "melodic" },
    "blues": { name_en: "Blues Scale", name_ru: "Блюзовая", degrees_en: "1 ♭3 4 ♭5 5 ♭7", degrees_ru: "1 ♭3 4 ♭5 5 ♭7", intervals: [0, 3, 5, 6, 7, 10], family: "blues" },
    "harmonic_major": { name_en: "Harmonic Major", name_ru: "Гармонический мажор", degrees_en: "1 2 3 4 5 ♭6 7", degrees_ru: "1 2 3 4 5 ♭6 7", intervals: [0, 2, 4, 5, 7, 8, 11], family: "harmonic" },
    "double_harmonic": { name_en: "Double Harmonic", name_ru: "Двойной гармонический", degrees_en: "1 ♭2 3 4 5 ♭6 7", degrees_ru: "1 ♭2 3 4 5 ♭6 7", intervals: [0, 1, 4, 5, 7, 8, 11], family: "world" },
    "hungarian_minor": { name_en: "Hungarian Minor", name_ru: "Венгерский минор", degrees_en: "1 2 ♭3 #4 5 ♭6 7", degrees_ru: "1 2 ♭3 #4 5 ♭6 7", intervals: [0, 2, 3, 6, 7, 8, 11], family: "world" },
    "bebop_dominant": { name_en: "Bebop Dominant", name_ru: "Бибоп доминант", degrees_en: "1 2 3 4 5 ♭6 ♭7 7", degrees_ru: "1 2 3 4 5 ♭6 ♭7 7", intervals: [0, 2, 4, 5, 7, 8, 10, 11], family: "bebop" },
    "bebop_major": { name_en: "Bebop Major", name_ru: "Бибоп мажор", degrees_en: "1 2 3 4 5 6 ♭7 7", degrees_ru: "1 2 3 4 5 6 ♭7 7", intervals: [0, 2, 4, 5, 7, 9, 10, 11], family: "bebop" },
    "persian": { name_en: "Persian", name_ru: "Персидский", degrees_en: "1 ♭2 3 ♭4 5 ♭6 ♭7", degrees_ru: "1 ♭2 3 ♭4 5 ♭6 ♭7", intervals: [0, 1, 4, 6, 7, 8, 10], family: "world" },
    "enigmatic": { name_en: "Enigmatic", name_ru: "Энигматический", degrees_en: "1 ♯2 ♯4 ♯5 ♯6 7", degrees_ru: "1 ♯2 ♯4 ♯5 ♯6 7", intervals: [0, 1, 3, 6, 8, 10, 11], family: "other" }
  };

  // Chord qualities - базовые трезвучия и септаккорды, сгруппированные логически
  window.COMMON_QUALITIES = {
    // Трезвучия
    maj: { id: 'maj', name_en: 'Major (maj)', name_ru: 'Мажор (maj)', intervals: [0, 4, 7], offsets: [0, 4, 7], category: 'triads' },
    min: { id: 'min', name_en: 'Minor (m)', name_ru: 'Минор (m)', intervals: [0, 3, 7], offsets: [0, 3, 7], category: 'triads' },
    aug: { id: 'aug', name_en: 'Augmented (+)', name_ru: 'Увеличенный (+)', intervals: [0, 4, 8], offsets: [0, 4, 8], category: 'triads' },
    dim: { id: 'dim', name_en: 'Diminished (dim)', name_ru: 'Уменьшенный (dim)', intervals: [0, 3, 6], offsets: [0, 3, 6], category: 'triads' },

    // Септаккорды
    maj7: { id: 'maj7', name_en: 'Major 7 (maj7)', name_ru: 'Мажор7 (maj7)', intervals: [0, 4, 7, 11], offsets: [0, 4, 7, 11], category: 'seventh' },
    dom7: { id: 'dom7', name_en: 'Dominant 7 (7)', name_ru: 'Доминантсепт (7)', intervals: [0, 4, 7, 10], offsets: [0, 4, 7, 10], category: 'seventh' },
    min7: { id: 'min7', name_en: 'Minor 7 (m7)', name_ru: 'Минор7 (m7)', intervals: [0, 3, 7, 10], offsets: [0, 3, 7, 10], category: 'seventh' },
    minMaj7: { id: 'minMaj7', name_en: 'Minor Major 7 (mMaj7)', name_ru: 'МинорMaj7 (mMaj7)', intervals: [0, 3, 7, 11], offsets: [0, 3, 7, 11], category: 'seventh' },
    m7b5: { id: 'm7b5', name_en: 'Half-diminished (m7b5)', name_ru: 'Полуменьш (m7♭5)', intervals: [0, 3, 6, 10], offsets: [0, 3, 6, 10], category: 'seventh' },
    dim7: { id: 'dim7', name_en: 'Diminished 7 (dim7)', name_ru: 'Меньш7 (dim7)', intervals: [0, 3, 6, 9], offsets: [0, 3, 6, 9], category: 'seventh' },

    // Sus аккорды
    sus4: { id: 'sus4', name_en: 'Sus4', name_ru: 'Сус4', intervals: [0, 5, 7], offsets: [0, 5, 7], category: 'sus' },
    sus2: { id: 'sus2', name_en: 'Sus2', name_ru: 'Сус2', intervals: [0, 2, 7], offsets: [0, 2, 7], category: 'sus' }
  };

  // Расширения - простые добавления к базовым аккордам
  window.COMMON_EXTENSIONS = [
    // Простые расширения для трезвучий
    { id: '6', offset: 9, name_en: 'Add 6th', name_ru: 'Добавить 6', category: 'basic', appliesTo: ['maj', 'min'] },
    { id: 'add9', offset: 14, name_en: 'Add 9th', name_ru: 'Добавить 9', category: 'basic', appliesTo: ['maj', 'min', 'sus4', 'sus2'] },
    { id: 'b5', offset: 6, name_en: 'Flat 5th', name_ru: 'Пониз. 5', category: 'basic', appliesTo: ['maj', 'min'] },
    { id: '#5', offset: 8, name_en: 'Sharp 5th', name_ru: 'Повыш. 5', category: 'basic', appliesTo: ['maj'] },

    // Расширенные тона для септаккордов
    { id: 'b9', offset: 13, name_en: 'Flat 9th', name_ru: 'Пониж. 9', category: 'extended', appliesTo: ['dom7', 'm7b5'] },
    { id: '9', offset: 14, name_en: '9th', name_ru: '9-я ступень', category: 'extended', appliesTo: ['maj7', 'dom7', 'min7', 'minMaj7'] },
    { id: '#9', offset: 15, name_en: 'Sharp 9th', name_ru: 'Повыш. 9', category: 'extended', appliesTo: ['dom7'] },
    { id: '11', offset: 17, name_en: '11th', name_ru: '11-я ступень', category: 'extended', appliesTo: ['maj7', 'dom7', 'min7'] },
    { id: '#11', offset: 18, name_en: 'Sharp 11th', name_ru: 'Повыш. 11', category: 'extended', appliesTo: ['maj7', 'dom7', 'aug'] },
    { id: 'b13', offset: 20, name_en: 'Flat 13th', name_ru: 'Пониз. 13', category: 'extended', appliesTo: ['dom7', 'min7'] },
    { id: '13', offset: 21, name_en: '13th', name_ru: '13-я ступень', category: 'extended', appliesTo: ['maj7', 'dom7', 'sus4', 'sus2'] }
  ];
})();
