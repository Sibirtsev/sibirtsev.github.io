// Comprehensive modulation library with detailed chord analysis
// Provides structured information for harmonic analysis and key relationships
(function () {
    'use strict';

    // Helper function to define chord structures
    function chord(roman, degrees, quality = 'triad') {
        return {
            roman: roman,
            degrees: degrees, // Array of scale degrees (1-based)
            quality: quality  // 'triad', 'seventh', 'special'
        };
    }

    /**
     * Detailed modulation library
     * 
     * Structure for each modulation:
     * - name: название модуляции (rus/eng)
     * - from_mode: наклонение исходной тональности (major/minor)
     * - to_mode: наклонение конечной тональности (major/minor)
     * - interval_semitones: интервал в полутонах от ИТ к КТ
     * - relationship: отношение между тональностями
     * 
     * Modulation progression (ИТ → КТ):
     * - chords_before_pivot: аккорды ИТ до переходного
     * - pivot_chord_from: переходной аккорд в обозначениях ИТ
     * - pivot_chord_to: тот же переходной аккорд в обозначениях КТ
     * - chords_after_pivot: аккорды КТ после переходного
     * 
     * Return progression (КТ → ИТ):
     * - return_chords_before_pivot: аккорды КТ до переходного
     * - return_pivot_chord_from: переходной аккорд в обозначениях КТ
     * - return_pivot_chord_to: тот же переходной аккорд в обозначениях ИТ
     * - return_chords_after_pivot: аккорды ИТ после переходного
     */

    window.DETAILED_MODULATIONS = {

        // ========================================
        // CLOSE RELATIONSHIPS
        // ========================================

        relative_minor: {
            name_en: "Relative Minor",
            name_ru: "Относительный минор",
            from_mode: "major",
            to_mode: "minor",
            interval_semitones: -3, // vi degree
            relationship: "vi",
            category: "close",
            strength: "strong",

            // Modulation: Major → Relative Minor (C major → A minor)
            chords_before_pivot: [], // No chords before pivot in this progression
            pivot_chord_from: chord("vi", [6, 1, 3]), // vi in major = A C E (6-1-3 degrees)
            pivot_chord_to: chord("i", [1, 3, 5]),    // same chord as i in minor = A C E (1-3-5 degrees) 
            chords_after_pivot: [
                chord("ii°", [2, 4, 6], "diminished"), // ii° in minor = B D F
                chord("V", [5, 7, 2]),                  // V in minor = E G# B
                chord("i", [1, 3, 5])                   // i in minor = A C E
            ],

            // Return: Relative Minor → Major (A minor → C major)  
            return_chords_before_pivot: [], // No chords before pivot
            return_pivot_chord_from: chord("i", [1, 3, 5]), // i in minor = A C E
            return_pivot_chord_to: chord("vi", [6, 1, 3]),   // same chord as vi in major = A C E
            return_chords_after_pivot: [
                chord("ii", [2, 4, 6]),    // ii in major = D F A
                chord("V", [5, 7, 2]),     // V in major = G B D  
                chord("I", [1, 3, 5])      // I in major = C E G
            ]
        },

        relative_major: {
            name_en: "Relative Major",
            name_ru: "Относительный мажор",
            from_mode: "minor",
            to_mode: "major",
            interval_semitones: 3, // III degree
            relationship: "III",
            category: "close",
            strength: "strong",

            // Modulation: Minor → Relative Major (A minor → C major)
            chords_before_pivot: [], // No chords before pivot
            pivot_chord_from: chord("i", [1, 3, 5]),  // i in minor = A C E
            pivot_chord_to: chord("vi", [6, 1, 3]),   // same chord as vi in major = A C E
            chords_after_pivot: [
                chord("ii", [2, 4, 6]),    // ii in major = D F A
                chord("V", [5, 7, 2]),     // V in major = G B D
                chord("I", [1, 3, 5])      // I in major = C E G
            ],

            // Return: Major → Relative Minor (C major → A minor)
            return_chords_before_pivot: [], // No chords before pivot
            return_pivot_chord_from: chord("vi", [6, 1, 3]), // vi in major = A C E
            return_pivot_chord_to: chord("i", [1, 3, 5]),    // same chord as i in minor = A C E  
            return_chords_after_pivot: [
                chord("i", [1, 3, 5]) // Just resolve to i in minor = A C E
            ]
        },

        dominant: {
            name_en: "Dominant Key",
            name_ru: "Доминантовая тональность",
            from_mode: "major",
            to_mode: "major",
            interval_semitones: 7, // V degree
            relationship: "V",
            category: "close",
            strength: "strong",

            // Modulation: Major → Dominant (C major → G major)
            chords_before_pivot: [
                chord("V/V", [2, 4, 6]) // D F# A - secondary dominant leading to V
            ],
            pivot_chord_from: chord("V", [5, 7, 2]),  // V in original = G B D
            pivot_chord_to: chord("I", [1, 3, 5]),    // same chord as I in target = G B D  
            chords_after_pivot: [
                chord("I", [1, 3, 5]) // I in target key = G B D
            ],

            // Return: Dominant → Original (G major → C major)
            return_chords_before_pivot: [
                chord("V/IV", [1, 3, 5]) // G B D - acts as V of IV in original key
            ],
            return_pivot_chord_from: chord("I", [1, 3, 5]),  // I in dominant = G B D
            return_pivot_chord_to: chord("V", [5, 7, 2]),    // same chord as V in original = G B D
            return_chords_after_pivot: [
                chord("IV", [4, 6, 1]),   // IV in original = F A C
                chord("I", [1, 3, 5])     // I in original = C E G
            ]
        },

        subdominant: {
            name_en: "Subdominant Key",
            name_ru: "Субдоминантовая тональность",
            from_mode: "major",
            to_mode: "major",
            interval_semitones: 5, // IV degree  
            relationship: "IV",
            category: "close",
            strength: "strong",

            // Modulation: Major → Subdominant (C major → F major)
            chords_before_pivot: [
                chord("I", [1, 3, 5]) // C E G in original
            ],
            pivot_chord_from: chord("IV", [4, 6, 1]),  // IV in original = F A C
            pivot_chord_to: chord("I", [1, 3, 5]),     // same chord as I in target = F A C
            chords_after_pivot: [
                chord("I", [1, 3, 5]) // I in target = F A C
            ],

            // Return: Subdominant → Original (F major → C major)  
            return_chords_before_pivot: [
                chord("I", [1, 3, 5]) // F A C in subdominant
            ],
            return_pivot_chord_from: chord("I", [1, 3, 5]),  // I in subdominant = F A C  
            return_pivot_chord_to: chord("IV", [4, 6, 1]),   // same chord as IV in original = F A C
            return_chords_after_pivot: [
                chord("I", [1, 3, 5]) // I in original = C E G
            ]
        },

        // ========================================
        // SECONDARY DOMINANT RELATIONSHIPS  
        // ======================================== 

        secondary_dominant_ii: {
            name_en: "Secondary Dominant of ii",
            name_ru: "Вторичная доминанта ii ступени",
            from_mode: "major",
            to_mode: "major",
            interval_semitones: 2, // ii degree
            relationship: "ii",
            category: "secondary",
            strength: "medium",

            // Modulation through V/ii
            chords_before_pivot: [
                chord("I", [1, 3, 5]) // C E G
            ],
            pivot_chord_from: chord("V/ii", [6, 1, 3]), // A C# E - V of ii in original
            pivot_chord_to: chord("V", [5, 7, 2]),      // same chord as V in target = A C# E
            chords_after_pivot: [
                chord("i", [1, 3, 5]) // D F A (target ii became i)
            ],

            // Return 
            return_chords_before_pivot: [
                chord("i", [1, 3, 5]) // D F A
            ],
            return_pivot_chord_from: chord("V", [5, 7, 2]),  // A C# E in target
            return_pivot_chord_to: chord("V/ii", [6, 1, 3]), // same chord as V/ii in original
            return_chords_after_pivot: [
                chord("ii", [2, 4, 6]),   // D F A
                chord("V", [5, 7, 2]),    // G B D
                chord("I", [1, 3, 5])     // C E G
            ]
        },

        // ========================================
        // MODAL RELATIONSHIPS
        // ========================================

        parallel_minor: {
            name_en: "Parallel Minor",
            name_ru: "Параллельный минор",
            from_mode: "major",
            to_mode: "minor",
            interval_semitones: 0, // Same root
            relationship: "i",
            category: "modal",
            strength: "medium",

            // Modulation: Major → Parallel Minor (A major → A minor)
            chords_before_pivot: [
                chord("I", [1, 3, 5]) // A C# E - I in major
            ],
            pivot_chord_from: chord("♭VI", [6, 1, 3]), // F A C - ♭VI in major (borrowed)
            pivot_chord_to: chord("VI", [6, 1, 3]),    // F A C - VI in minor (natural)
            chords_after_pivot: [
                chord("♭VII", [7, 2, 4]), // G B♭ D - ♭VII in minor
                chord("i", [1, 3, 5])     // A C E - i in minor
            ],

            // Return: Parallel Minor → Major (A minor → A major)
            return_chords_before_pivot: [
                chord("i", [1, 3, 5]) // A C E - i in minor
            ],
            return_pivot_chord_from: chord("VI", [6, 1, 3]),  // F A C - VI in minor (natural)
            return_pivot_chord_to: chord("♭VI", [6, 1, 3]),   // F A C - ♭VI in major (borrowed)
            return_chords_after_pivot: [
                chord("V", [5, 7, 2]),    // E G# B - V in major
                chord("I", [1, 3, 5])     // A C# E - I in major
            ]
        },

        parallel_major: {
            name_en: "Parallel Major",
            name_ru: "Параллельный мажор",
            from_mode: "minor",
            to_mode: "major",
            interval_semitones: 0, // Same root
            relationship: "I",
            category: "modal",
            strength: "medium",

            // Modulation: Minor → Parallel Major (A minor → A major)
            chords_before_pivot: [
                chord("i", [1, 3, 5]) // A C E - i in minor
            ],
            pivot_chord_from: chord("VI", [6, 1, 3]), // F A C - VI in minor (natural)
            pivot_chord_to: chord("♭VI", [6, 1, 3]),   // F A C - ♭VI in major (borrowed)
            chords_after_pivot: [
                chord("V", [5, 7, 2]),    // E G# B - V in major
                chord("I", [1, 3, 5])     // A C# E - I in major
            ],

            // Return: Parallel Major → Minor (A major → A minor)
            return_chords_before_pivot: [
                chord("I", [1, 3, 5])     // A C# E - I in major
            ],
            return_pivot_chord_from: chord("♭VI", [6, 1, 3]), // F A C - ♭VI in major (borrowed)
            return_pivot_chord_to: chord("VI", [6, 1, 3]),   // F A C - VI in minor (natural)
            return_chords_after_pivot: [
                chord("♭VII", [7, 2, 4]), // G B♭ D - ♭VII in minor
                chord("i", [1, 3, 5])     // A C E - i in minor
            ]
        },

        // ========================================
        // CHROMATIC RELATIONSHIPS
        // ========================================

        chromatic_mediant_major_up: {
            name_en: "Chromatic Mediant (Major 3rd up)",
            name_ru: "Хроматическая медианта (большая терция вверх)",
            from_mode: "major",
            to_mode: "major",
            interval_semitones: 4, // Major third up
            relationship: "♭VI",
            category: "chromatic",
            strength: "weak",

            // Modulation: C major → E major
            chords_before_pivot: [
                chord("I", [1, 3, 5]) // C E G
            ],
            pivot_chord_from: chord("I", [1, 3, 5]),     // C E G - enharmonic reinterpretation
            pivot_chord_to: chord("♭VI", [6, 1, 3]),     // same pitches as ♭VI in target = C E G  
            chords_after_pivot: [
                chord("♭VII", [7, 2, 4]), // D F# A
                chord("I", [1, 3, 5])     // E G# B
            ],

            // Return: E major → C major
            return_chords_before_pivot: [
                chord("I", [1, 3, 5]) // E G# B
            ],
            return_pivot_chord_from: chord("♭VI", [6, 1, 3]), // C E G in E major context
            return_pivot_chord_to: chord("I", [1, 3, 5]),     // same chord as I in C major
            return_chords_after_pivot: [
                chord("I", [1, 3, 5]) // C E G
            ]
        }

        // TODO: Add more modulations:
        // - Neapolitan sixth relationships  
        // - Tritone substitutions
        // - Augmented sixth chords
        // - Distant relationships
        // - Enharmonic modulations
    };

    // Convert detailed format to legacy format for backward compatibility
    function convertToLegacyFormat() {
        const legacy = {};

        Object.entries(window.DETAILED_MODULATIONS).forEach(([key, modulation]) => {
            // Convert detailed chord progressions to simple roman numeral arrays
            const modulation_rn = [];
            const return_rn = [];

            // Build forward progression
            if (modulation.chords_before_pivot) {
                modulation.chords_before_pivot.forEach(chord => modulation_rn.push(chord.roman));
            }
            if (modulation.pivot_chord_from) {
                modulation_rn.push(modulation.pivot_chord_from.roman);
            }
            if (modulation.chords_after_pivot) {
                modulation.chords_after_pivot.forEach(chord => modulation_rn.push(chord.roman));
            }

            // Build return progression  
            if (modulation.return_chords_before_pivot) {
                modulation.return_chords_before_pivot.forEach(chord => return_rn.push(chord.roman));
            }
            if (modulation.return_pivot_chord_from) {
                return_rn.push(modulation.return_pivot_chord_from.roman);
            }
            if (modulation.return_chords_after_pivot) {
                modulation.return_chords_after_pivot.forEach(chord => return_rn.push(chord.roman));
            }

            // Calculate pivot indices
            const pivot_index = modulation.chords_before_pivot ? modulation.chords_before_pivot.length : 0;
            const return_pivot_index = modulation.return_chords_before_pivot ? modulation.return_chords_before_pivot.length : 0;

            // Create legacy format entry
            legacy[key] = {
                ...modulation, // Copy all new properties
                modulation_rn: modulation_rn,
                return_rn: return_rn,
                pivot_index: pivot_index,
                return_pivot_index: return_pivot_index,
                common_chord: modulation.pivot_chord_from ? modulation.pivot_chord_from.roman : "unknown",
                description_en: `${modulation.name_en} modulation`,
                description_ru: `Модуляция в ${modulation.name_ru}`
            };
        });

        return legacy;
    }

    // Export both old and new formats for compatibility
    // DETAILED_MODULATIONS already defined above
    window.COMMON_MODULATIONS = convertToLegacyFormat();

})();