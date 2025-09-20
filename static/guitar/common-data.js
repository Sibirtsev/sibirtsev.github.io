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
    }
  };

  // Chord qualities canonical with both intervals (for scales) and offsets (for chord generator)
  window.COMMON_QUALITIES = {
    maj: { id: 'maj', name_en: 'Major (maj)', name_ru: 'Мажор (maj)', intervals: [0, 4, 7], offsets: [0, 4, 7], ext: ['6', 'maj7', 'add9', '9', '#11', '13', 'sus2', 'sus4'] },
    maj7: { id: 'maj7', name_en: 'Major 7 (maj7)', name_ru: 'Мажор7 (maj7)', intervals: [0, 4, 7, 11], offsets: [0, 4, 7, 11], ext: ['9', '#11', '13', 'add9', '6', 'sus2', 'sus4'] },
    '6': { id: '6', name_en: 'Major 6 (6)', name_ru: 'Мажор6 (6)', intervals: [0, 4, 7, 9], offsets: [0, 4, 7, 9], ext: ['add9', '9', '#11', '13', 'sus2', 'sus4'] },
    dom7: { id: 'dom7', name_en: 'Dominant 7 (7)', name_ru: 'Доминантсепт (7)', intervals: [0, 4, 7, 10], offsets: [0, 4, 7, 10], ext: ['b9', '9', '#9', '11', '#11', 'b13', '13', 'sus4', 'alt'] },
    min: { id: 'min', name_en: 'Minor (m)', name_ru: 'Минор (m)', intervals: [0, 3, 7], offsets: [0, 3, 7], ext: ['6', '9', '11', 'b13', 'sus2', 'sus4'] },
    min7: { id: 'min7', name_en: 'Minor 7 (m7)', name_ru: 'Минор7 (m7)', intervals: [0, 3, 7, 10], offsets: [0, 3, 7, 10], ext: ['9', '11', 'b13', '6', 'sus2', 'sus4'] },
    minMaj7: { id: 'minMaj7', name_en: 'Minor Major 7 (mMaj7)', name_ru: 'МинорMaj7 (mMaj7)', intervals: [0, 3, 7, 11], offsets: [0, 3, 7, 11], ext: ['9', '11', '13'] },
    m7b5: { id: 'm7b5', name_en: 'Half-diminished (m7b5)', name_ru: 'Полуменьш (m7♭5)', intervals: [0, 3, 6, 10], offsets: [0, 3, 6, 10], ext: ['b9', '11', 'b13', '9'] },
    dim7: { id: 'dim7', name_en: 'Diminished 7 (dim7)', name_ru: 'Меньш7 (dim7)', intervals: [0, 3, 6, 9], offsets: [0, 3, 6, 9], ext: [] },
    aug: { id: 'aug', name_en: 'Augmented (+)', name_ru: 'Увеличенный (+)', intervals: [0, 4, 8], offsets: [0, 4, 8], ext: ['add9', 'maj7', '7', '#11'] },
    sus4: { id: 'sus4', name_en: 'Sus4', name_ru: 'Сус4', intervals: [0, 5, 7], offsets: [0, 5, 7], ext: ['7', '9', '13'] },
    sus2: { id: 'sus2', name_en: 'Sus2', name_ru: 'Сус2', intervals: [0, 2, 7], offsets: [0, 2, 7], ext: ['7', '9', '13'] }
  };

  // Shared extensions catalog
  window.COMMON_EXTENSIONS = [
    { id: '7', offset: 10 }, { id: 'maj7', offset: 11 }, { id: '6', offset: 9 }, { id: 'b9', offset: 13 }, { id: '#9', offset: 15 },
    { id: '9', offset: 14 }, { id: '11', offset: 17 }, { id: '#11', offset: 18 }, { id: 'b13', offset: 20 }, { id: '13', offset: 21 },
    { id: 'add9', offset: 14 }, { id: 'b5', offset: 6 }, { id: '#5', offset: 8 }
  ];
})();
