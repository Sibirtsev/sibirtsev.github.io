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

  // Cadences library - каденции с указанием подходящих ладов
  window.COMMON_CADENCES = {
    // Универсальные мажорные каденции
    perfect_authentic: {
      name_en: "Perfect Authentic",
      name_ru: "Совершенная каденция",
      rn: ["V", "I"],
      modes: ["ionian", "lydian", "mixolydian"],
      category: "authentic",
      strength: "strong"
    },

    authentic_predominant: {
      name_en: "Authentic with Predominant",
      name_ru: "Автентическая с преддоминантой",
      rn: ["ii", "V", "I"],
      modes: ["ionian", "lydian"],
      category: "authentic",
      strength: "strong"
    },

    plagal: {
      name_en: "Plagal",
      name_ru: "Плагальная",
      rn: ["IV", "I"],
      modes: ["ionian", "lydian"],
      category: "plagal",
      strength: "medium"
    },

    deceptive: {
      name_en: "Deceptive",
      name_ru: "Обманная",
      rn: ["V", "vi"],
      modes: ["ionian", "lydian"],
      category: "deceptive",
      strength: "weak"
    },

    half_cadence: {
      name_en: "Half Cadence",
      name_ru: "Полукаденция",
      rn: ["ii", "V"],
      modes: ["ionian", "lydian", "mixolydian"],
      category: "half",
      strength: "weak"
    },

    // Джазовые каденции
    ii_v_i_major: {
      name_en: "Jazz ii-V-I (Major)",
      name_ru: "Джазовая ii-V-I (мажор)",
      rn: ["ii7", "V7", "Imaj7"],
      modes: ["ionian", "lydian"],
      category: "jazz",
      strength: "strong"
    },

    tritone_substitution: {
      name_en: "Tritone Substitution",
      name_ru: "Тритоновая замена",
      rn: ["ii7", "♭II7", "Imaj7"],
      modes: ["ionian", "lydian"],
      category: "jazz",
      strength: "strong"
    },

    backdoor: {
      name_en: "Backdoor",
      name_ru: "Бэкдор",
      rn: ["iv", "♭VII", "I"],
      modes: ["ionian", "lydian", "mixolydian"],
      category: "modal",
      strength: "medium"
    },

    // Универсальные минорные каденции
    minor_authentic: {
      name_en: "Minor Authentic",
      name_ru: "Минорная автентическая",
      rn: ["V", "i"],
      modes: ["aeolian", "harmonic_minor", "dorian"],
      category: "authentic",
      strength: "strong"
    },

    minor_predominant: {
      name_en: "Minor with Predominant",
      name_ru: "Минорная с преддоминантой",
      rn: ["ii°", "V", "i"],
      modes: ["aeolian", "harmonic_minor"],
      category: "authentic",
      strength: "strong"
    },

    minor_plagal: {
      name_en: "Minor Plagal",
      name_ru: "Минорная плагальная",
      rn: ["iv", "i"],
      modes: ["aeolian", "dorian", "phrygian"],
      category: "plagal",
      strength: "medium"
    },

    phrygian_half: {
      name_en: "Phrygian Half",
      name_ru: "Фригийская полукаденция",
      rn: ["iv6", "V"],
      modes: ["aeolian", "harmonic_minor", "phrygian"],
      category: "half",
      strength: "weak"
    },

    minor_deceptive: {
      name_en: "Minor Deceptive",
      name_ru: "Минорная обманная",
      rn: ["V", "VI"],
      modes: ["aeolian", "harmonic_minor"],
      category: "deceptive",
      strength: "weak"
    },

    // Джазовые минорные каденции
    ii_v_i_minor: {
      name_en: "Jazz ii-V-i (Minor)",
      name_ru: "Джазовая ii-V-i (минор)",
      rn: ["ii7♭5", "V7", "im7"],
      modes: ["aeolian", "harmonic_minor", "dorian"],
      category: "jazz",
      strength: "strong"
    },

    // Модальные каденции для дорийского лада
    dorian_vamp: {
      name_en: "Dorian Vamp",
      name_ru: "Дорийский вамп",
      rn: ["i", "IV"],
      modes: ["dorian"],
      category: "modal",
      strength: "medium"
    },

    dorian_cadence: {
      name_en: "Dorian Cadence",
      name_ru: "Дорийская каденция",
      rn: ["ii", "i"],
      modes: ["dorian"],
      category: "modal",
      strength: "medium"
    },

    // Каденции для фригийского лада
    phrygian_cadence: {
      name_en: "Phrygian Cadence",
      name_ru: "Фригийская каденция",
      rn: ["♭II", "i"],
      modes: ["phrygian"],
      category: "modal",
      strength: "strong"
    },

    phrygian_dominant: {
      name_en: "Phrygian Dominant",
      name_ru: "Фригийский доминант",
      rn: ["♭II7", "i"],
      modes: ["phrygian", "harmonic_minor"],
      category: "modal",
      strength: "strong"
    },

    // Каденции для лидийского лада
    lydian_resolution: {
      name_en: "Lydian Resolution",
      name_ru: "Лидийское разрешение",
      rn: ["II", "I"],
      modes: ["lydian"],
      category: "modal",
      strength: "medium"
    },

    lydian_cadence: {
      name_en: "Lydian Cadence",
      name_ru: "Лидийская каденция",
      rn: ["♯iv°", "I"],
      modes: ["lydian"],
      category: "modal",
      strength: "medium"
    },

    // Каденции для миксолидийского лада
    mixolydian_cadence: {
      name_en: "Mixolydian Cadence",
      name_ru: "Миксолидийская каденция",
      rn: ["♭VII", "I"],
      modes: ["mixolydian"],
      category: "modal",
      strength: "strong"
    },

    mixolydian_vamp: {
      name_en: "Mixolydian Vamp",
      name_ru: "Миксолидийский вамп",
      rn: ["I", "♭VII"],
      modes: ["mixolydian"],
      category: "modal",
      strength: "medium"
    },

    // Каденции для локрийского лада
    locrian_resolution: {
      name_en: "Locrian Resolution",
      name_ru: "Локрийское разрешение",
      rn: ["♭V", "i°"],
      modes: ["locrian"],
      category: "modal",
      strength: "weak"
    },

    // Современные/альтернативные каденции
    chromatic_mediant: {
      name_en: "Chromatic Mediant",
      name_ru: "Хроматическая медианта",
      rn: ["I", "♭VI"],
      modes: ["ionian", "aeolian"],
      category: "contemporary",
      strength: "medium"
    },

    neapolitan_sixth: {
      name_en: "Neapolitan Sixth",
      name_ru: "Неаполитанская секста",
      rn: ["♭II6", "V", "i"],
      modes: ["aeolian", "harmonic_minor", "phrygian"],
      category: "classical",
      strength: "strong"
    },

    german_sixth: {
      name_en: "German Sixth",
      name_ru: "Немецкая секста",
      rn: ["Ger+6", "V", "I"],
      modes: ["ionian", "aeolian"],
      category: "classical",
      strength: "strong"
    },

    // Блюзовые каденции
    blues_turnaround: {
      name_en: "Blues Turnaround",
      name_ru: "Блюзовый поворот",
      rn: ["I7", "VI7", "ii7", "V7"],
      modes: ["blues", "mixolydian"],
      category: "blues",
      strength: "medium"
    },

    quick_change: {
      name_en: "Quick Change",
      name_ru: "Быстрая смена",
      rn: ["I7", "IV7", "I7"],
      modes: ["blues", "mixolydian"],
      category: "blues",
      strength: "medium"
    }
  };

  // Comprehensive modulation library for key relationships and harmonic analysis
  window.COMMON_MODULATIONS = {
    // Close relationships - First circle modulations
    relative_minor: {
      name_en: "Relative Minor",
      name_ru: "Относительный минор",
      from_mode: "major",
      to_mode: "minor",
      interval_semitones: -3, // vi degree
      relationship: "vi",
      description_en: "Through common chord vi → (to target) ii–V–i",
      description_ru: "Через общий аккорд vi → (в целевой) ii–V–i",
      modulation_rn: ["vi", "ii°", "V", "i"],
      return_rn: ["i/vi", "ii", "V", "I"],
      common_chord: "vi",
      pivot_index: 0, // "vi" is the pivot chord (1st chord in modulation)
      return_pivot_index: 0, // "i/vi" is the pivot chord (1st chord in return)
      pivot_chord_modulation: "vi", // vi in original key
      pivot_chord_target: "i", // same chord becomes i in target key
      category: "close",
      strength: "strong"
    },

    relative_major: {
      name_en: "Relative Major",
      name_ru: "Относительный мажор",
      from_mode: "minor",
      to_mode: "major",
      interval_semitones: 3, // III degree
      relationship: "III",
      description_en: "Through common i/vi (in major — vi) → ii–V–I",
      description_ru: "Через общий i/vi (в мажоре — vi) → ii–V–I",
      modulation_rn: ["i/vi", "ii", "V", "I"],
      return_rn: ["vi", "i"],
      common_chord: "i/vi",
      pivot_index: 0, // "i/vi" is the pivot chord (1st chord in modulation)
      return_pivot_index: 0, // "vi" is the pivot chord (1st chord in return)
      pivot_chord_modulation: "i", // i in original minor key
      pivot_chord_target: "vi", // same chord becomes vi in target major key
      category: "close",
      strength: "strong"
    },

    dominant: {
      name_en: "Dominant Key",
      name_ru: "Доминантовая тональность",
      from_mode: "major",
      to_mode: "major",
      interval_semitones: 7, // V degree
      relationship: "V",
      description_en: "Through secondary dominant: V/V → V → I",
      description_ru: "Через вторичную доминанту: V/V → V → I",
      modulation_rn: ["V/V", "V", "I"],
      return_rn: ["V/IV", "IV", "I"],
      common_chord: "V",
      pivot_index: 1, // "V" is the pivot chord (2nd chord in modulation)
      return_pivot_index: 1, // "IV" is the pivot chord (2nd chord in return)
      pivot_chord_modulation: "V", // V in original key
      pivot_chord_target: "IV", // same chord becomes IV in target key
      category: "close",
      strength: "strong"
    },

    subdominant: {
      name_en: "Subdominant Key",
      name_ru: "Субдоминантовая тональность",
      from_mode: "major",
      to_mode: "major",
      interval_semitones: 5, // IV degree
      relationship: "IV",
      description_en: "Through common chord IV → ii–V–I in target key",
      description_ru: "Через общий аккорд IV → ii–V–I в целевой тональности",
      modulation_rn: ["IV", "ii", "V", "I"],
      return_rn: ["I/V", "IV", "I"],
      common_chord: "IV",
      category: "close",
      strength: "medium"
    },

    // Secondary dominants modulations
    ii_dominant: {
      name_en: "ii Dominant (Supertonic)",
      name_ru: "ii доминанта (Супертоника)",
      from_mode: "major",
      to_mode: "major",
      interval_semitones: 2, // ii degree
      relationship: "ii",
      description_en: "Through V/ii → ii as new tonic",
      description_ru: "Через V/ii → ii как новая тоника",
      modulation_rn: ["V/ii", "I", "V", "I"],
      return_rn: ["vii°", "V", "I"],
      common_chord: "ii",
      category: "secondary",
      strength: "medium"
    },

    iii_dominant: {
      name_en: "iii Dominant (Mediant)",
      name_ru: "iii доминанта (Медианта)",
      from_mode: "major",
      to_mode: "minor",
      interval_semitones: 4, // iii degree
      relationship: "iii",
      description_en: "Through V/iii → iii as new tonic",
      description_ru: "Через V/iii → iii как новая тоника",
      modulation_rn: ["V/iii", "iii/i", "iv", "V", "i"],
      return_rn: ["i/iii", "♭VI", "♭VII", "I"],
      common_chord: "iii",
      category: "secondary",
      strength: "weak"
    },

    vi_dominant: {
      name_en: "vi Dominant (Submediant)",
      name_ru: "vi доминанта (Субмедианта)",
      from_mode: "major",
      to_mode: "minor",
      interval_semitones: 9, // vi degree
      relationship: "vi",
      description_en: "Through V/vi → vi as new tonic",
      description_ru: "Через V/vi → vi как новая тоника",
      modulation_rn: ["V/vi", "i", "ii°", "V", "i"],
      return_rn: ["vi", "♭VII", "I"],
      common_chord: "vi",
      category: "secondary",
      strength: "medium"
    },

    // Chromatic mediants - Third relations
    chromatic_mediant_major: {
      name_en: "Chromatic Mediant (Major)",
      name_ru: "Хроматическая медианта (мажор)",
      from_mode: "major",
      to_mode: "major",
      interval_semitones: 8, // ♭VI degree
      relationship: "♭VI",
      description_en: "Through chromatic voice leading: I → ♭VI via common tone",
      description_ru: "Через хроматическое голосоведение: I → ♭VI через общий тон",
      modulation_rn: ["I", "♭VI", "ii", "V", "I"],
      return_rn: ["I/♭III", "♯iv°", "V", "I"],
      common_chord: "common_tone",
      category: "chromatic",
      strength: "weak"
    },

    chromatic_mediant_minor: {
      name_en: "Chromatic Mediant (Minor)",
      name_ru: "Хроматическая медианта (минор)",
      from_mode: "major",
      to_mode: "minor",
      interval_semitones: 8, // ♭vi degree
      relationship: "♭vi",
      description_en: "Through chromatic descent: I → ♭vi via stepwise motion",
      description_ru: "Через хроматический спуск: I → ♭vi через поступенное движение",
      modulation_rn: ["I", "vii°/♭vi", "♭vi/i", "ii°", "V", "i"],
      return_rn: ["i/♭vi", "Ger+6", "V", "I"],
      common_chord: "chromatic_pivot",
      category: "chromatic",
      strength: "weak"
    },

    // Neapolitan relationships
    neapolitan: {
      name_en: "Neapolitan Key",
      name_ru: "Неаполитанская тональность",
      from_mode: "minor",
      to_mode: "major",
      interval_semitones: 1, // ♭II degree
      relationship: "♭II",
      description_en: "Through Neapolitan sixth chord: ♭II6 → V → I",
      description_ru: "Через неаполитанский секстаккорд: ♭II6 → V → I",
      modulation_rn: ["♭II6", "V", "I"],
      return_rn: ["♭VII", "♭II6", "V", "i"],
      common_chord: "♭II6",
      category: "modal",
      strength: "weak"
    },

    // Modal interchange
    parallel_minor: {
      name_en: "Parallel Minor",
      name_ru: "Параллельный минор",
      from_mode: "major",
      to_mode: "minor",
      interval_semitones: 0, // Same root
      relationship: "i",
      description_en: "Through modal interchange: I → i via ♭III",
      description_ru: "Через модальный обмен: I → i через ♭III",
      modulation_rn: ["I", "♭III", "♭VII", "i"],
      return_rn: ["i", "iv", "V", "I"],
      common_chord: "modal_pivot",
      category: "modal",
      strength: "medium"
    },

    parallel_major: {
      name_en: "Parallel Major",
      name_ru: "Параллельный мажор",
      from_mode: "minor",
      to_mode: "major",
      interval_semitones: 0, // Same root
      relationship: "I",
      description_en: "Through raised third: i → I via tierce de picardie",
      description_ru: "Через повышенную терцию: i → I через пикардийскую терцию",
      modulation_rn: ["i", "iv", "V", "I"],
      return_rn: ["I", "vi", "iv", "i"],
      common_chord: "modal_pivot",
      pivot_index: 1, // "iv" is the pivot chord (2nd chord in modulation)
      return_pivot_index: 2, // "iv" is the pivot chord (3rd chord in return)
      pivot_chord_modulation: "iv", // iv in original minor key  
      pivot_chord_target: "iv", // same function in both keys (modal interchange)
      category: "modal",
      strength: "medium"
    },

    // Distant relationships - Tritone substitutions
    tritone_substitute: {
      name_en: "Tritone Substitute",
      name_ru: "Тритоновая замена",
      from_mode: "major",
      to_mode: "major",
      interval_semitones: 6, // Tritone away
      relationship: "♭II",
      description_en: "Through tritone substitution: V → ♭II7 → I in new key",
      description_ru: "Через тритоновую замену: V → ♭II7 → I в новой тональности",
      modulation_rn: ["V", "♭II7", "♭II/I", "V", "I"],
      return_rn: ["I/♯IV", "♭II7", "V", "I"],
      common_chord: "tritone_pivot",
      category: "distant",
      strength: "weak"
    },

    // Enharmonic modulations
    german_sixth: {
      name_en: "German Sixth Modulation",
      name_ru: "Модуляция через увеличенный секстаккорд",
      from_mode: "major",
      to_mode: "major",
      interval_semitones: 6, // Various possibilities
      relationship: "enharmonic",
      description_en: "Through enharmonic reinterpretation: Ger+6 = Dom7",
      description_ru: "Через энгармоническую переинтерпретацию: Ger+6 = Dom7",
      modulation_rn: ["I", "Ger+6", "V", "I"],
      return_rn: ["I", "Ger+6", "V", "I"],
      common_chord: "Ger+6",
      category: "enharmonic",
      strength: "weak"
    },

    // Circle of fifths progressions
    circle_of_fifths: {
      name_en: "Circle of Fifths",
      name_ru: "Квинтовый круг",
      from_mode: "major",
      to_mode: "major",
      interval_semitones: 7, // Fifth up
      relationship: "V",
      description_en: "Through cycle of dominants: I → V → ii → V → I",
      description_ru: "Через цикл доминант: I → V → ii → V → I",
      modulation_rn: ["I", "V/V", "V", "ii/vi", "V", "I"],
      return_rn: ["I", "IV/♭VII", "♭VII", "IV", "I"],
      common_chord: "sequential",
      category: "sequential",
      strength: "medium"
    }
  };
})();
