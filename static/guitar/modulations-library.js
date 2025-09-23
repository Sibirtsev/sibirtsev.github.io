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
        },

        // ========================================
        // NEAPOLITAN RELATIONSHIPS
        // ========================================

        neapolitan_sixth: {
            name_en: "Neapolitan Sixth",
            name_ru: "Неаполитанская секста",
            from_mode: "minor",
            to_mode: "major",
            interval_semitones: 1, // bII degree
            relationship: "bII",
            category: "chromatic",
            strength: "medium",

            // Modulation via Neapolitan sixth (A minor → Bb major)
            chords_before_pivot: [
                chord("i", [1, 3, 5]) // A C E
            ],
            pivot_chord_from: chord("N6", [2, 4, 6]), // Bb D F - Neapolitan sixth in A minor
            pivot_chord_to: chord("I", [1, 3, 5]),    // Same chord as I in Bb major
            chords_after_pivot: [
                chord("V", [5, 7, 2]),   // F A C
                chord("I", [1, 3, 5])    // Bb D F
            ],

            // Return: Bb major → A minor
            return_chords_before_pivot: [
                chord("I", [1, 3, 5]) // Bb D F
            ],
            return_pivot_chord_from: chord("I", [1, 3, 5]),  // Bb D F
            return_pivot_chord_to: chord("N6", [2, 4, 6]),   // Same chord as N6 in A minor
            return_chords_after_pivot: [
                chord("V", [5, 7, 2]),   // E G# B
                chord("i", [1, 3, 5])    // A C E
            ]
        },

        // ========================================
        // TRITONE SUBSTITUTION
        // ========================================

        tritone_substitution: {
            name_en: "Tritone Substitution",
            name_ru: "Тритоновая замена",
            from_mode: "major",
            to_mode: "major",
            interval_semitones: 6, // Tritone away
            relationship: "bV/V",
            category: "chromatic",
            strength: "weak",

            // Modulation via tritone substitution (C major → F# major)
            chords_before_pivot: [
                chord("I", [1, 3, 5]) // C E G
            ],
            pivot_chord_from: chord("bV7/V", [1, 3, 5, 7]), // Ab C Eb Gb (bV7 of G)
            pivot_chord_to: chord("V7", [5, 7, 2, 4]),      // Enharmonically C# E# G# B
            chords_after_pivot: [
                chord("I", [1, 3, 5]) // F# A# C#
            ],

            // Return: F# major → C major  
            return_chords_before_pivot: [
                chord("I", [1, 3, 5]) // F# A# C#
            ],
            return_pivot_chord_from: chord("V7", [5, 7, 2, 4]),     // C# E# G# B
            return_pivot_chord_to: chord("bV7/V", [1, 3, 5, 7]),    // Enharmonically Ab C Eb Gb
            return_chords_after_pivot: [
                chord("V", [5, 7, 2]),   // G B D
                chord("I", [1, 3, 5])    // C E G
            ]
        },

        // ========================================
        // AUGMENTED SIXTH CHORDS
        // ========================================

        augmented_sixth_italian: {
            name_en: "Italian Augmented Sixth",
            name_ru: "Итальянская увеличенная секста",
            from_mode: "minor",
            to_mode: "major",
            interval_semitones: 7, // Perfect fifth up (A minor → E major)
            relationship: "V",
            category: "chromatic",
            strength: "medium",

            // Modulation: A minor → E major via It+6
            chords_before_pivot: [
                chord("i", [1, 3, 5]) // A C E
            ],
            pivot_chord_from: chord("It+6"), // Italian +6 in A minor: F A C#
            chords_after_pivot: [
                chord("V", [5, 7, 2]),   // B D# F#
                chord("I", [1, 3, 5])    // E G# B
            ],

            // Return: E major → A minor
            return_chords_before_pivot: [
                chord("I", [1, 3, 5]) // E G# B
            ],
            return_pivot_chord_from: chord("V7", [5, 7, 2, 4]), // B D# F# A
            return_pivot_chord_to: chord("It+6"),               // Enharmonic It+6
            return_chords_after_pivot: [
                chord("V", [5, 7, 2]),   // E G# B
                chord("i", [1, 3, 5])    // A C E
            ]
        },

        augmented_sixth_french: {
            name_en: "French Augmented Sixth",
            name_ru: "Французская увеличенная секста",
            from_mode: "minor",
            to_mode: "major",
            interval_semitones: 7, // Perfect fifth up (A minor → E major)
            relationship: "V",
            category: "chromatic",
            strength: "medium",

            // Modulation: A minor → E major via Fr+6
            chords_before_pivot: [
                chord("i", [1, 3, 5]) // A C E
            ],
            pivot_chord_from: chord("Fr+6"), // French +6 in A minor: F A B C#
            chords_after_pivot: [
                chord("V", [5, 7, 2]),   // B D# F#
                chord("I", [1, 3, 5])    // E G# B
            ],

            // Return: E major → A minor
            return_chords_before_pivot: [
                chord("I", [1, 3, 5]) // E G# B
            ],
            return_pivot_chord_from: chord("V7", [5, 7, 2, 4]), // B D# F# A
            return_pivot_chord_to: chord("Fr+6"),               // Enharmonic Fr+6
            return_chords_after_pivot: [
                chord("V", [5, 7, 2]),   // E G# B
                chord("i", [1, 3, 5])    // A C E
            ]
        },

        augmented_sixth_german: {
            name_en: "German Augmented Sixth",
            name_ru: "Немецкая увеличенная секста",
            from_mode: "minor",
            to_mode: "major",
            interval_semitones: -6, // Tritone down (A minor → Eb major)
            relationship: "♭V",
            category: "chromatic",
            strength: "medium",

            // Modulation: A minor → Eb major via Gr+6 ↔ V7
            chords_before_pivot: [
                chord("i", [1, 3, 5]) // A C E
            ],
            pivot_chord_from: chord("Gr+6"), // German +6 in A minor: F Ab C D
            chords_after_pivot: [
                chord("I", [1, 3, 5])     // Eb G Bb
            ],

            // Return: Eb major → A minor
            return_chords_before_pivot: [
                chord("I", [1, 3, 5]) // Eb G Bb
            ],
            return_pivot_chord_from: chord("V7"),   // Bb D F Ab (V7 in Eb major)
            return_pivot_chord_to: chord("Gr+6"),   // enharmonic German +6 in A minor
            return_chords_after_pivot: [
                chord("V", [5, 7, 2]),    // E G# B
                chord("i", [1, 3, 5])     // A C E
            ]
        },

        // ========================================
        // DISTANT RELATIONSHIPS
        // ========================================

        chromatic_mediant_major_down: {
            name_en: "Chromatic Mediant (Major 3rd down)",
            name_ru: "Хроматическая медианта (большая терция вниз)",
            from_mode: "major",
            to_mode: "major",
            interval_semitones: -4, // Major third down
            relationship: "bVI",
            category: "distant",
            strength: "weak",

            // Modulation: C major → Ab major
            chords_before_pivot: [
                chord("I", [1, 3, 5]) // C E G
            ],
            pivot_chord_from: chord("I", [1, 3, 5]),      // C E G - enharmonic reinterpretation
            pivot_chord_to: chord("#III", [3, 5, 7]),     // Same pitches in Ab major context
            chords_after_pivot: [
                chord("IV", [4, 6, 1]),   // Db F Ab
                chord("I", [1, 3, 5])     // Ab C Eb
            ],

            // Return: Ab major → C major
            return_chords_before_pivot: [
                chord("I", [1, 3, 5]) // Ab C Eb
            ],
            return_pivot_chord_from: chord("#III", [3, 5, 7]), // C E G in Ab major context
            return_pivot_chord_to: chord("I", [1, 3, 5]),      // Same chord as I in C major
            return_chords_after_pivot: [
                chord("I", [1, 3, 5]) // C E G
            ]
        },

        // ========================================
        // ENHARMONIC MODULATIONS
        // ========================================

        enharmonic_diminished_seventh: {
            name_en: "Enharmonic Diminished Seventh",
            name_ru: "Энгармоническая модуляция через уменьшенный септаккорд",
            from_mode: "minor",
            to_mode: "minor",
            interval_semitones: 3, // Can modulate to various keys
            relationship: "vii°7",
            category: "enharmonic",
            strength: "medium",

            // Modulation via enharmonic dim7 (A minor → C# minor)
            chords_before_pivot: [
                chord("i", [1, 3, 5]) // A C E
            ],
            pivot_chord_from: chord("vii°7", [7, 2, 4, 6]), // G# B D F in A minor
            pivot_chord_to: chord("v°7", [5, 7, 2, 4]),     // Same notes in C# minor context
            chords_after_pivot: [
                chord("V", [5, 7, 2]),   // G# B# D#
                chord("i", [1, 3, 5])    // C# E G#
            ],

            // Return: C# minor → A minor
            return_chords_before_pivot: [
                chord("i", [1, 3, 5]) // C# E G#
            ],
            return_pivot_chord_from: chord("v°7", [5, 7, 2, 4]),    // G# B D F
            return_pivot_chord_to: chord("vii°7", [7, 2, 4, 6]),    // Same notes in A minor
            return_chords_after_pivot: [
                chord("V", [5, 7, 2]),   // E G# B
                chord("i", [1, 3, 5])    // A C E
            ]
        }
    };



    // Export only DETAILED_MODULATIONS (legacy COMMON_MODULATIONS no longer needed)
    // DETAILED_MODULATIONS already defined above

})();