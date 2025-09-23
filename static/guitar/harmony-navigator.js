// Music theory and utilities
const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
const NATURAL_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

// Audio System - Karplus-Strong synthesis for harmony playback
const HarmonyAudio = (() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let masterGain = null;

    function ensureMasterGain() {
        if (!masterGain) {
            masterGain = audioContext.createGain();
            masterGain.gain.value = 0.8;
            masterGain.connect(audioContext.destination);
        }
    }

    function resumeContext() {
        try {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
        } catch (e) {
            console.warn('Could not resume audio context:', e);
        }
    }

    // Convert note name to MIDI number
    function noteToMidi(noteName, octave = 4) {
        const match = noteName.match(/^([A-G])([#b]*)$/);
        if (!match) return 60; // default to C4

        const [, letter, accidentals] = match;
        const naturalPC = NATURAL_PC[letter];
        const accidentalOffset = (accidentals.match(/#/g) || []).length - (accidentals.match(/b/g) || []).length;

        return naturalPC + accidentalOffset + (octave + 1) * 12;
    }

    // Convert MIDI to frequency
    function midiToFreq(midi) {
        return 440 * Math.pow(2, (midi - 69) / 12);
    }

    // Karplus-Strong pluck synthesis
    function createPluck(frequency, duration = 0.8, when = 0, gain = 0.7) {
        resumeContext();
        ensureMasterGain();

        const sampleRate = audioContext.sampleRate;
        const bufferLength = Math.max(1, Math.floor(duration * sampleRate));
        const delayLength = Math.max(2, Math.floor(sampleRate / frequency));

        // Create buffer for Karplus-Strong algorithm
        const buffer = audioContext.createBuffer(1, bufferLength, sampleRate);
        const data = buffer.getChannelData(0);

        // Initialize with white noise
        for (let i = 0; i < delayLength; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.5;
        }

        // Apply Karplus-Strong algorithm
        for (let i = delayLength; i < bufferLength; i++) {
            const prevSample = data[i - delayLength];
            const prevPrevSample = (i - delayLength - 1 >= 0) ? data[i - delayLength - 1] : 0;
            data[i] = 0.5 * (prevSample + prevPrevSample) * 0.995; // 0.995 for decay
        }

        // Create audio nodes
        const source = audioContext.createBufferSource();
        source.buffer = buffer;

        const gainNode = audioContext.createGain();
        const lowpass = audioContext.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = Math.max(1000, frequency * 6);

        // Envelope
        const startTime = audioContext.currentTime + when;
        gainNode.gain.setValueAtTime(0.0001, startTime);
        gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain), startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        // Connect nodes
        source.connect(lowpass);
        lowpass.connect(gainNode);
        gainNode.connect(masterGain);

        // Start and stop
        source.start(startTime);
        source.stop(startTime + duration);

        // Cleanup
        source.onended = () => {
            try {
                source.disconnect();
                lowpass.disconnect();
                gainNode.disconnect();
            } catch (e) {
                // Ignore disconnect errors
            }
        };
    }

    // Play single note
    function playNote(noteName, octave = 4, duration = 0.8, when = 0) {
        const midi = noteToMidi(noteName, octave);
        const freq = midiToFreq(midi);
        createPluck(freq, duration, when, 0.7);
    }

    // Play scale (ascending then descending)
    function playScale(noteNames, rootName, baseOctave = 4, stepInterval = 0.4) {
        if (!noteNames || noteNames.length === 0) return;

        console.log('Playing scale:', noteNames);

        // Calculate proper octaves for ascending scale
        const ascending = [];
        let currentOctave = baseOctave;

        for (let i = 0; i < noteNames.length; i++) {
            const noteName = noteNames[i];

            // If not first note and current note has lower pitch class than previous, go to next octave
            if (i > 0) {
                const prevPC = NATURAL_PC[noteNames[i - 1][0]] + getAccidentalOffset(noteNames[i - 1]);
                const currPC = NATURAL_PC[noteName[0]] + getAccidentalOffset(noteName);

                if ((currPC % 12) < (prevPC % 12)) {
                    currentOctave++;
                }
            }

            ascending.push({ note: noteName, octave: currentOctave });
        }

        // Add upper tonic
        const rootPC = NATURAL_PC[rootName[0]] + getAccidentalOffset(rootName);
        const lastNote = ascending[ascending.length - 1];
        const lastPC = NATURAL_PC[lastNote.note[0]] + getAccidentalOffset(lastNote.note);

        let upperTonicOctave;
        if ((rootPC % 12) <= (lastPC % 12)) {
            upperTonicOctave = lastNote.octave + 1;
        } else {
            upperTonicOctave = lastNote.octave;
        }

        ascending.push({ note: rootName, octave: upperTonicOctave });

        // Create descending sequence (reverse of ascending)
        const descending = [...ascending].reverse();

        // Full sequence: ascending + descending (without duplicate top note)
        const fullSequence = [...ascending, ...descending.slice(1)];

        // Play the sequence
        const noteDuration = 0.6;
        fullSequence.forEach((noteObj, index) => {
            playNote(noteObj.note, noteObj.octave, noteDuration, index * stepInterval);
        });
    }

    // Play chord (multiple notes simultaneously)
    function playChord(noteNames, baseOctave = 4, duration = 2.0, arpeggiate = false) {
        if (!noteNames || noteNames.length === 0) return;

        console.log('Playing chord:', noteNames);

        // Calculate proper octaves for chord notes to ensure ascending order
        const chordNotes = [];
        let currentOctave = baseOctave;

        for (let i = 0; i < noteNames.length; i++) {
            const noteName = noteNames[i];

            // If not first note and current note has lower pitch class than previous, go to next octave
            if (i > 0) {
                const prevPC = NATURAL_PC[noteNames[i - 1][0]] + getAccidentalOffset(noteNames[i - 1]);
                const currPC = NATURAL_PC[noteName[0]] + getAccidentalOffset(noteName);

                if ((currPC % 12) < (prevPC % 12)) {
                    currentOctave++;
                }
            }

            chordNotes.push({ note: noteName, octave: currentOctave });
        }

        if (arpeggiate) {
            // Arpeggio: notes played in sequence quickly, then chord
            const arpStep = 0.15;
            const arpDuration = 0.6;
            const chordDelay = chordNotes.length * arpStep + 0.2;

            // Arpeggio with correct octaves
            chordNotes.forEach((noteObj, index) => {
                playNote(noteObj.note, noteObj.octave, arpDuration, index * arpStep);
            });

            // Full chord after arpeggio with correct octaves
            chordNotes.forEach((noteObj, index) => {
                playNote(noteObj.note, noteObj.octave, duration, chordDelay + index * 0.02);
            });
        } else {
            // Simultaneous chord with slight stagger for realism and correct octaves
            chordNotes.forEach((noteObj, index) => {
                playNote(noteObj.note, noteObj.octave, duration, index * 0.02);
            });
        }
    }

    // Helper function to get accidental offset
    function getAccidentalOffset(noteName) {
        const accidentals = noteName.slice(1); // everything after the letter
        return (accidentals.match(/#/g) || []).length - (accidentals.match(/b/g) || []).length;
    }

    return {
        playNote,
        playScale,
        playChord,
        audioContext
    };
})();

// Convert COMMON_SCALES intervals to semitone intervals for compatibility
function getScaleIntervals(scaleKey) {
    const scale = window.COMMON_SCALES[scaleKey];
    if (!scale) return [2, 2, 1, 2, 2, 2, 1]; // default to ionian

    const intervals = [];
    for (let i = 0; i < scale.intervals.length - 1; i++) {
        intervals.push(scale.intervals[i + 1] - scale.intervals[i]);
    }
    return intervals;
}

// Calculate scale formula (semitone distances) from intervals array
// Examples of calculations:
// Ionian [0,2,4,5,7,9,11] → 2-2-1-2-2-2-1
// Major pent [0,2,4,7,9] → 2-2-3-2-3
// Blues [0,3,5,6,7,10] → 3-2-1-1-3-2
// Whole tone [0,2,4,6,8,10] → 2-2-2-2-2-2
function calculateScaleFormula(scaleKey) {
    const scale = window.COMMON_SCALES[scaleKey];
    if (!scale || !scale.intervals) {
        return '—'; // default major scale formula
    }

    const intervals = scale.intervals;
    if (intervals.length < 2) {
        return '—'; // Not enough notes to calculate formula
    }

    const formula = [];

    // Calculate distances between consecutive intervals
    for (let i = 0; i < intervals.length - 1; i++) {
        const distance = intervals[i + 1] - intervals[i];
        formula.push(distance);
    }

    // For cyclic scales, add the distance from last note back to octave
    // Only if the scale doesn't already end at the octave (12 semitones)
    if (intervals.length > 1) {
        const lastInterval = intervals[intervals.length - 1];
        if (lastInterval < 12) {
            // Add the distance from last note back to root (octave)
            const wrapDistance = 12 - lastInterval;
            formula.push(wrapDistance);
        }
    }

    return formula.join('•');
}

// Create MODES from COMMON_SCALES for compatibility
function getMODES() {
    const modes = {};
    Object.entries(window.COMMON_SCALES || {}).forEach(([key, scale]) => {
        if (scale.family === 'diatonic' || scale.family === 'harmonic' || scale.family === 'melodic') {
            const intervals = getScaleIntervals(key);
            const family = (scale.family === 'diatonic' && key === 'ionian') ? 'major' :
                (scale.family === 'diatonic' && key !== 'ionian') || scale.family === 'harmonic' || scale.family === 'melodic' ? 'minor' : 'major';

            modes[key] = {
                intervals: intervals,
                family: family,
                labelEn: scale.name_en,
                labelRu: scale.name_ru
            };
        }
    });
    return modes;
}

const TONICS = [
    "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B"
];
const SHARP_KEYS = new Set(["g", "d", "a", "e", "b", "f#", "c#", "G", "D", "A", "E", "B", "F#", "C#"]);

// Use global i18n system from common-i18n.js
let LANG = window.DEFAULT_LANG || 'en';

function t(key, ...args) {
    const dict = window.I18N && window.I18N[LANG] || window.I18N && window.I18N['en'] || {};
    const value = dict[key];
    if (typeof value === 'function') {
        return value(...args);
    }
    return value || key;
}

function updateUITexts() {
    document.title = t('harmonyNavigatorTitle') || 'Harmony Navigator — Guitar Tools';
    document.getElementById('title').textContent = t('harmonyNavigatorTitle') || 'Harmony Navigator';
    document.getElementById('subtitle').textContent = t('harmonyNavigatorSubtitle') || 'Scales • Chord functions • Cadences • Key relationships';

    // New form labels
    document.getElementById('selectionFormLabel').textContent = t('selectionFormLabel') || 'Key Selection';
    document.getElementById('noteLabel').textContent = t('noteLabel') || 'Note';
    document.getElementById('scaleLabel').textContent = t('scaleLabel') || 'Scale / Mode';
    document.getElementById('scaleInfoLabel').textContent = t('scaleInfoLabel') || 'Scale Information';
    document.getElementById('tonicInfoLabel').textContent = t('tonicInfoLabel') || 'Tonic:';
    document.getElementById('familyInfoLabel').textContent = t('familyInfoLabel') || 'Family:';
    document.getElementById('formulaInfoLabel').textContent = t('formulaInfoLabel') || 'Formula:';
    document.getElementById('degreesInfoLabel').textContent = t('degreesInfoLabel') || 'Degrees:';
    document.getElementById('notesInfoLabel').textContent = t('notesInfoLabel') || 'Notes:';
    document.getElementById('playBtnText').textContent = t('playBtnText') || 'Play Scale';

    // Update formula tooltip
    const formulaValue = document.getElementById('formulaValue');
    if (formulaValue) {
        formulaValue.title = t('formulaTooltip') || 'Semitone intervals between consecutive notes';
    }

    // Legacy labels
    const tonicLabel = document.getElementById('tonicLabel');
    if (tonicLabel) tonicLabel.textContent = t('tonicLabel') || 'Tonic';
    const modeLabel = document.getElementById('modeLabel');
    if (modeLabel) modeLabel.textContent = t('modeLabel') || 'Scale / Mode';
    const helpLabel = document.getElementById('helpLabel');
    if (helpLabel) helpLabel.textContent = t('helpLabel') || 'Quick Help';
    const helpText = document.getElementById('helpText');
    if (helpText) helpText.textContent = t('helpText') || "Select tonic and mode. Below you'll see the scale, all diatonic chords with functions, popular cadences, and related keys with modulations.";
    const keyInfoLabel = document.getElementById('keyInfoLabel');
    if (keyInfoLabel) keyInfoLabel.textContent = t('keyInfoLabel') || 'Key Information';

    document.getElementById('chordsLabel').textContent = t('chordsLabel') || 'Diatonic Chords and Functions';
    document.getElementById('relatedKeysLabel').textContent = t('relatedKeysLabel') || 'Modulations and Related Keys';
    document.getElementById('cadencesLabel').textContent = t('cadencesLabel') || 'Cadences (in selected key)';


    // Table headers
    document.getElementById('degreeHeader').textContent = t('degreeHeader') || 'Degree';
    document.getElementById('romanHeader').textContent = t('romanHeader') || 'Roman';
    document.getElementById('functionHeader').textContent = t('functionHeader') || 'Function';
    document.getElementById('triadHeader').textContent = t('triadHeader') || 'Triad';
    document.getElementById('seventhHeader').textContent = t('seventhHeader') || 'Seventh';
    document.getElementById('tensionsHeader').textContent = t('tensionsHeader') || 'Tensions';

    // Update footer
    const footer = document.getElementById('footer');
    if (footer) {
        footer.textContent = t('footer') || 'Made with love for guitars';
    }

    // Update mode selector options
    const modeSelect = document.getElementById('mode');
    const currentValue = modeSelect.value;

    // Clear and rebuild selector with updated language
    modeSelect.innerHTML = '';

    // Group scales by family for better organization
    // Only include families suitable for harmonic analysis
    const allowedFamilies = ['diatonic', 'harmonic', 'melodic'];
    const scaleGroups = {
        diatonic: [],
        harmonic: [],
        melodic: []
    };

    Object.entries(window.COMMON_SCALES || {}).forEach(([key, scale]) => {
        // Only include scales from families suitable for harmonic analysis
        if (allowedFamilies.includes(scale.family)) {
            const group = scaleGroups[scale.family];
            if (group) {
                group.push({ key, scale });
            }
        }
    });

    // Add scales to selector by groups
    Object.entries(scaleGroups).forEach(([groupName, scales]) => {
        if (scales.length > 0) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = groupName.charAt(0).toUpperCase() + groupName.slice(1);

            scales.forEach(({ key, scale }) => {
                const o = document.createElement('option');
                o.value = key;
                o.textContent = LANG === 'ru' ? scale.name_ru : scale.name_en;
                optgroup.appendChild(o);
            });

            modeSelect.appendChild(optgroup);
        }
    });

    // Restore selected value with fallback
    if (currentValue && modeSelect.querySelector(`option[value="${currentValue}"]`)) {
        modeSelect.value = currentValue;
    } else {
        // Fallback to ionian or first available option
        const ionianOption = modeSelect.querySelector('option[value="ionian"]');
        if (ionianOption) {
            modeSelect.value = 'ionian';
        } else {
            const firstOption = modeSelect.querySelector('option');
            if (firstOption) {
                modeSelect.value = firstOption.value;
            }
        }
    }

    // Update function legend
    const functionLegend = document.getElementById('function-legend');
    if (functionLegend) {
        const lang = window.DEFAULT_LANG || 'en';
        const translations = window.I18N && window.I18N[lang] ? window.I18N[lang] : window.I18N.en;

        functionLegend.innerHTML = [
            translations.functionT,
            translations.functionS,
            translations.functionD,
            translations.functionPD
        ].join(' · ');
    }

    // Restore saved state after UI update
    restoreHarmonyState();

    // Re-render current content
    renderAll();
}

// Math utilities
const mod = (n, m) => ((n % m) + m) % m;

function parseNote(note) {
    const m = note.match(/^([A-G])([#b]{0,2})$/);
    if (!m) throw new Error("Invalid note: " + note);
    const letter = m[1];
    const accStr = m[2] || "";
    const acc = accStr.split("").reduce((s, ch) => s + (ch === "#" ? 1 : -1), 0);
    const pc = mod(NATURAL_PC[letter] + acc, 12);
    return { letter, acc, pc };
}

function formatAcc(acc) {
    if (acc === 0) return "";
    if (acc === 2) return "##";
    if (acc === -2) return "bb";
    if (acc === 1) return "#";
    if (acc === -1) return "b";
    return acc > 0 ? "#".repeat(acc) : "b".repeat(-acc);
}

function deriveScale(tonicStr, modeName) {
    const MODES = getMODES();
    const mode = MODES[modeName];
    if (!mode) {
        // More informative error message for debugging
        console.warn(`[HarmonyNavigator] Scale '${modeName}' not found. Available scales: ${Object.keys(MODES).join(', ')}`);
        return deriveScale(tonicStr, 'ionian');
    }

    const tonic = parseNote(tonicStr);
    const preferSharps = SHARP_KEYS.has(tonicStr);
    const degrees = [0];
    for (let i = 0; i < mode.intervals.length; i++) {
        degrees.push(degrees[i] + mode.intervals[i]);
    }
    const out = [];
    const numNotes = Math.min(7, degrees.length);
    for (let i = 0; i < numNotes; i++) {
        const targetPc = mod(tonic.pc + degrees[i], 12);
        const letter = LETTERS[mod(LETTERS.indexOf(tonic.letter) + i, 7)];
        const nat = NATURAL_PC[letter];
        let delta = mod(targetPc - nat, 12);
        if (delta > 6) delta -= 12;
        if (Math.abs(delta) === 1) {
            delta = preferSharps ? (delta === -1 ? 1 : delta) : (delta === 1 ? -1 : delta);
        }
        const note = letter + formatAcc(delta);
        const pc = mod(nat + delta, 12);
        out.push({ note, pc, letter });
    }
    return { mode, tonic, notes: out };
}

const interval = (r, o) => mod(o - r, 12);

function triadType(r, t, f) {
    const i3 = interval(r, t);
    const i5 = interval(r, f);
    if (i3 === 4 && i5 === 7) return "maj";
    if (i3 === 3 && i5 === 7) return "min";
    if (i3 === 3 && i5 === 6) return "dim";
    if (i3 === 4 && i5 === 8) return "aug";
    return "min";
}

function seventhSymbol(triad, i7) {
    if (triad === "maj") {
        if (i7 === 11) return { symbol: "maj7" };
        if (i7 === 10) return { symbol: "7" };
    }
    if (triad === "min") {
        if (i7 === 10) return { symbol: "m7" };
        if (i7 === 11) return { symbol: "m(maj7)" };
    }
    if (triad === "dim") {
        if (i7 === 9) return { symbol: "dim7" };
        if (i7 === 10) return { symbol: "m7b5" };
    }
    if (triad === "aug") {
        if (i7 === 11) return { symbol: "+maj7" };
        if (i7 === 10) return { symbol: "+7" };
    }
    return { symbol: "7" };
}

function functionByDegree(i, family) {
    const fMajorEn = ["T", "PD", "T", "S", "D", "T", "D"];
    const fMinorEn = ["T", "PD", "T", "S", "D", "S", "S/D"];
    const fMajorRu = ["Т", "ПД", "Т", "С", "Д", "Т", "Д"];
    const fMinorRu = ["Т", "ПД", "Т", "С", "Д", "С", "С/Д"];

    if (LANG === 'ru') {
        return (family === "major" ? fMajorRu : fMinorRu)[i];
    } else {
        return (family === "major" ? fMajorEn : fMinorEn)[i];
    }
}

function buildChords(scale) {
    const pcs = scale.notes.map(n => n.pc);
    const names = scale.notes.map(n => n.note);
    const fam = scale.mode.family;
    const rows = [];

    for (let i = 0; i < 7; i++) {
        const r = pcs[i];
        const t = pcs[(i + 2) % 7];
        const f = pcs[(i + 4) % 7];
        const s7pc = pcs[(i + 6) % 7];

        const tri = triadType(r, t, f);
        const triNotes = [names[i], names[(i + 2) % 7], names[(i + 4) % 7]];

        const symbolTri = tri === "maj" ? names[i] :
            tri === "min" ? names[i] + "m" :
                tri === "dim" ? names[i] + "°" : names[i] + "+";

        const i7 = interval(r, s7pc);
        const s7 = seventhSymbol(tri, i7).symbol;
        const symbol7 = s7.includes(names[i]) ? s7 : names[i] + s7;

        // Create tension chord arrays (extended chords)
        const seventhNotes = [...triNotes, names[(i + 6) % 7]]; // 7th chord (4 notes)
        const ninthNotes = [...seventhNotes, names[(i + 1) % 7]]; // 9th chord (5 notes)
        const eleventhNotes = [...ninthNotes, names[(i + 3) % 7]]; // 11th chord (6 notes)
        const thirteenthNotes = [...eleventhNotes, names[(i + 5) % 7]]; // 13th chord (7 notes)

        const tensions = [
            {
                n: "9",
                label: names[(i + 1) % 7],
                notes: ninthNotes // 5 notes for 9th chord
            },
            {
                n: "11",
                label: names[(i + 3) % 7],
                notes: eleventhNotes // 6 notes for 11th chord
            },
            {
                n: "13",
                label: names[(i + 5) % 7],
                notes: thirteenthNotes // 7 notes for 13th chord
            }
        ];

        const ROM = ["I", "II", "III", "IV", "V", "VI", "VII"];
        let base = ROM[i];
        if (tri === "min") base = base.toLowerCase();
        if (tri === "dim") base = base.toLowerCase() + "°";
        if (tri === "aug") base = base + "+";
        const rn = base;

        const func = functionByDegree(i, fam);

        rows.push({
            degree: i + 1,
            rn,
            functionRus: func,
            triad: triNotes,  // Array of note names for playing
            seventh: seventhNotes, // Array of note names for playing
            triadLabel: triNotes.join(" – "),
            seventhLabel: seventhNotes.join(" – "),
            symbolTriad: symbolTri,
            symbolSeventh: symbol7,
            tensions
        });
    }
    return rows;
}

const transposePc = (pc, semis) => mod(pc + semis, 12);

function pcToPreferedName(pc, preferSharps, context = null) {
    const SH = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const FL = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

    // Special handling for flat relationships (like ♭II, ♭VI, ♭VII)
    if (context && context.startsWith('♭')) {
        // For flat relationships, prefer flat names
        return FL[pc];
    }

    // For sharp relationships, prefer sharp names
    if (context && context.startsWith('#')) {
        return SH[pc];
    }

    // Default behavior
    return (preferSharps ? SH : FL)[pc];
}

function relatedKeys(tonicStr, modeName) {
    const base = deriveScale(tonicStr, modeName);
    const preferSharps = SHARP_KEYS.has(tonicStr);
    const family = base.mode.family;
    const tonicPc = base.tonic.pc;
    const out = [];

    // Use DETAILED_MODULATIONS library for comprehensive modulation relationships  
    const modulations = window.DETAILED_MODULATIONS || {};

    // Determine current mode family for filtering
    const currentModeFamily = family === "major" ? "major" : "minor";

    // Filter modulations that are applicable from current mode
    const applicableModulations = Object.entries(modulations).filter(([key, mod]) => {
        return mod.from_mode === currentModeFamily || mod.from_mode === "both";
    });





    // Generate modulation relationships
    applicableModulations.forEach(([key, modulation]) => {
        // Calculate target key
        let targetPc, targetName, targetMode;

        if (modulation.interval_semitones !== undefined) {
            targetPc = transposePc(tonicPc, modulation.interval_semitones);
            // Pass relationship context for better enharmonic spelling
            targetName = pcToPreferedName(targetPc, preferSharps, modulation.relationship);
            targetMode = modulation.to_mode === "major" ? "ionian" : "aeolian";
        } else {
            // Skip modulations without clear interval definition (e.g., enharmonic)
            return;
        }

        try {
            // Generate scales and chords for both keys
            const currentScale = deriveScale(tonicStr, modeName);
            const targetScale = deriveScale(targetName, targetMode);
            const currentChords = buildChords(currentScale);
            const targetChords = buildChords(targetScale);

            // Convert detailed structure to roman numeral arrays
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
            const modulationPivotIndex = modulation.chords_before_pivot ? modulation.chords_before_pivot.length : 0;
            const returnPivotIndex = modulation.return_chords_before_pivot ? modulation.return_chords_before_pivot.length : 0;

            // Generate chord examples from roman numeral arrays
            const modulationExample = generateChordSequence(modulation_rn, currentScale, targetScale, currentChords, targetChords, modulationPivotIndex);

            // For return: we go FROM target TO current, so targetScale is fromScale and currentScale is toScale
            const returnExample = generateChordSequence(return_rn, targetScale, currentScale, targetChords, currentChords, returnPivotIndex);

            // Get pivot chord information from detailed structure
            const pivotFromChord = modulation.pivot_chord_from ? modulation.pivot_chord_from.roman : null;
            const pivotToChord = modulation.pivot_chord_to ? modulation.pivot_chord_to.roman : null;
            const returnPivotFromChord = modulation.return_pivot_chord_from ? modulation.return_pivot_chord_from.roman : null;
            const returnPivotToChord = modulation.return_pivot_chord_to ? modulation.return_pivot_chord_to.roman : null;

            // Generate chord names for display with color coding
            const modulationChordNames = generateChordNames(modulation_rn, currentScale, targetScale, currentChords, targetChords, modulationPivotIndex, false, pivotFromChord, pivotToChord);

            // For return names: determine correct scale order based on modulation direction
            // Special handling for parallel modulations to ensure correct chord interpretation
            let returnChordNames;
            if (modulation.category === "modal" && (key.includes("parallel"))) {
                // For parallel modulations (same root, different mode), use target key for all chords
                // This ensures proper chord interpretation in the destination tonality
                returnChordNames = generateChordNames(return_rn, targetScale, targetScale, targetChords, targetChords, returnPivotIndex, true, returnPivotFromChord, returnPivotToChord);
            } else {
                // Standard case: FROM target TO current
                returnChordNames = generateChordNames(return_rn, targetScale, currentScale, targetChords, currentChords, returnPivotIndex, true, returnPivotFromChord, returnPivotToChord);
            }

            const targetModeLabel = modulation.to_mode === "major" ? t('major') : t('minor');
            const relationshipDesc = LANG === 'ru' ?
                `${modulation.name_ru} (${modulation.relationship})` :
                `${modulation.name_en} (${modulation.relationship})`;

            const modulationRNFormatted = generateFormattedRomanNumerals(modulation_rn, modulationPivotIndex, false, pivotFromChord, pivotToChord);
            const returnRNFormatted = generateFormattedRomanNumerals(return_rn, returnPivotIndex, true, returnPivotFromChord, returnPivotToChord);

            out.push({
                title: targetName + targetModeLabel,
                relation: relationshipDesc,
                toKey: targetName,
                toMode: targetMode,
                how: LANG === 'ru' ? `Модуляция в ${modulation.name_ru}` : `${modulation.name_en} modulation`,
                back: LANG === 'ru' ? "Возврат через обращение модуляции" : "Return through modulation inversion",
                modulationExample: modulationExample,
                modulationRN: modulationRNFormatted,
                modulationChordNames: modulationChordNames.join(" → "),
                returnExample: returnExample,
                returnRN: returnRNFormatted,
                returnChordNames: returnChordNames.join(" → "),
                category: modulation.category,
                strength: modulation.strength
            });
        } catch (error) {
            console.warn(`Could not generate modulation ${key}:`, error);
        }
    });

    // Sort by category and strength for better organization
    const categoryOrder = { close: 0, secondary: 1, modal: 2, chromatic: 3, sequential: 4, enharmonic: 5, distant: 6 };
    const strengthOrder = { strong: 0, medium: 1, weak: 2 };

    out.sort((a, b) => {
        if (categoryOrder[a.category] !== categoryOrder[b.category]) {
            return categoryOrder[a.category] - categoryOrder[b.category];
        }
        return strengthOrder[a.strength] - strengthOrder[b.strength];
    });



    return out;
}

// Helper functions to get translated category and strength labels
function getCategoryLabel(category) {
    const categoryMap = {
        'close': t('categoryClose') || 'Close relationship',
        'secondary': t('categorySecondary') || 'Secondary dominant',
        'modal': t('categoryModal') || 'Modal relationship',
        'chromatic': t('categoryChromatic') || 'Chromatic relationship'
    };
    return categoryMap[category] || category;
}

function getStrengthLabel(strength) {
    const strengthMap = {
        'strong': t('strengthStrong') || 'Strong',
        'medium': t('strengthMedium') || 'Medium',
        'weak': t('strengthWeak') || 'Weak'
    };
    return strengthMap[strength] || strength;
}

// Helper function to generate chord sequence from roman numerals
function generateChordSequence(romanNumerals, fromScale, toScale, fromChords, toChords, pivotIndex = -1) {
    const sequence = [];

    romanNumerals.forEach((rn, index) => {
        try {
            // Determine which scale/chords to use based on position relative to pivot
            const isPivotChord = index === pivotIndex;
            const isAfterPivot = pivotIndex >= 0 && index > pivotIndex;
            const isLastChord = index === romanNumerals.length - 1;

            const chord = parseRomanNumeralToChord(rn, fromScale, toScale, fromChords, toChords,
                isLastChord, isPivotChord, isAfterPivot);
            if (chord && chord.triad) {
                sequence.push(chord.triad);
            }
        } catch (error) {
            console.warn(`Could not parse roman numeral "${rn}":`, error);
        }
    });

    return sequence;
}

// Helper function to format roman numerals with pivot highlighting
function generateFormattedRomanNumerals(romanNumerals, pivotIndex = -1, isReturnProgression = false, pivotFromChord = null, pivotToChord = null) {
    return romanNumerals.map((rn, index) => {
        let className = '';
        let content = rn;

        if (index === pivotIndex) {
            // Переходной аккорд - показываем двойную функцию
            const fromKey = isReturnProgression ? 'target-key' : 'source-key';
            const toKey = isReturnProgression ? 'source-key' : 'target-key';

            // Используем информацию о переходных аккордах из детальной библиотеки
            const fromChordRoman = pivotFromChord || rn;
            const toChordRoman = pivotToChord || rn;

            content = `<span class="pivot-chord">
                <span class="${fromKey}">${fromChordRoman}</span>
                <span class="pivot-separator">↔</span>
                <span class="${toKey}">${toChordRoman}</span>
            </span>`;
        } else if (pivotIndex >= 0 && index > pivotIndex) {
            // Аккорды после переходного - в конечной тональности
            className = isReturnProgression ? 'source-key' : 'target-key';
            content = `<span class="${className}">${rn}</span>`;
        } else {
            // Аккорды до переходного - в исходной тональности  
            className = isReturnProgression ? 'target-key' : 'source-key';
            content = `<span class="${className}">${rn}</span>`;
        }

        return content;
    }).join(" → ");
}

// Helper function to generate chord names from roman numerals with color coding
function generateChordNames(romanNumerals, fromScale, toScale, fromChords, toChords, pivotIndex = -1, isReturnProgression = false, pivotFromChord = null, pivotToChord = null) {
    const names = [];

    romanNumerals.forEach((rn, index) => {
        try {
            const isPivotChord = index === pivotIndex;
            const isAfterPivot = pivotIndex >= 0 && index > pivotIndex;
            const isLastChord = index === romanNumerals.length - 1;

            const chord = parseRomanNumeralToChord(rn, fromScale, toScale, fromChords, toChords,
                isLastChord, isPivotChord, isAfterPivot);
            let chordName = "";
            if (chord && chord.symbolTriad) {
                chordName = chord.symbolTriad;
            } else {
                chordName = rn; // Fallback to roman numeral if parsing fails
            }

            // Apply color coding based on key context
            let className = '';
            let content = chordName;

            if (isPivotChord) {
                // Pivot chord shows both functional interpretations
                const fromKey = isReturnProgression ? 'target-key' : 'source-key';
                const toKey = isReturnProgression ? 'source-key' : 'target-key';

                // For pivot chord, show the same chord name but with different functions
                // The chord name should be the same (same physical chord)
                const pivotChordName = chordName;

                // Get function names (roman numerals) for both contexts
                const fromFunction = pivotFromChord || rn; // Function in source key
                const toFunction = pivotToChord || rn;     // Function in target key

                content = `<span class="pivot-chord">
                    ${pivotChordName} (<span class="${fromKey}">${fromFunction}</span>
                    <span class="pivot-separator">↔</span>
                    <span class="${toKey}">${toFunction}</span>)
                </span>`;
            } else if (isAfterPivot) {
                // Chords after pivot - in target key
                className = isReturnProgression ? 'source-key' : 'target-key';
                content = `<span class="${className}">${chordName}</span>`;
            } else {
                // Chords before pivot - in source key
                className = isReturnProgression ? 'target-key' : 'source-key';
                content = `<span class="${className}">${chordName}</span>`;
            }

            names.push(content);
        } catch (error) {
            console.warn(`Could not generate chord name for "${rn}":`, error);
            names.push(rn);
        }
    });

    return names;
}

// Helper function to parse roman numerals in modulation context
function parseRomanNumeralToChord(rn, fromScale, toScale, fromChords, toChords, isLastChord = false, isPivotChord = false, isAfterPivot = false) {
    // console.log(`Parsing chord: ${rn}, isLastChord: ${isLastChord}, isPivotChord: ${isPivotChord}, isAfterPivot: ${isAfterPivot}`);

    // Handle compound roman numerals like "V/V", "i/vi", "I/♭VII", etc.
    if (rn.includes('/')) {
        const [secondary, primary] = rn.split('/');
        // console.log(`Compound parts: secondary="${secondary}", primary="${primary}"`);

        // For compound chords, the secondary (left) is the chord to play
        // The primary (right) indicates the temporary tonic context

        // First try to get the secondary chord from available chords
        let chord = getChordByRomanNumeral(secondary, fromScale, fromChords) ||
            getChordByRomanNumeral(secondary, toScale, toChords);

        if (chord) {
            console.log(`Found chord for ${secondary}:`, chord);
            return chord;
        }

        // If not found, try to create the chord manually
        // This handles cases like I/♭VII where ♭VII might not be in standard diatonic chords
        if (secondary.match(/^[♭#]/) || primary.match(/^[♭#]/)) {
            console.log(`Creating altered compound chord: ${rn}`);
            return createAlteredCompoundChord(secondary, primary, fromScale, toScale);
        }

        // Fallback to primary chord
        return getChordByRomanNumeral(primary, fromScale, fromChords) ||
            getChordByRomanNumeral(primary, toScale, toChords);
    }

    // Handle special German and Neapolitan chords
    if (rn === "Ger+6") {
        return createGermanSixthChord(fromScale);
    }

    if (rn === "♭II6") {
        return createNeapolitanSixthChord(fromScale);
    }

    // Handle flat/sharp alterations (♭II, ♭VI, ♭VII, etc.)
    if (rn.match(/^[♭#]/)) {
        return createAlteredChord(rn, fromScale, toScale);
    }

    // Standard roman numeral - determine scale based on modulation position

    // Chords after the pivot chord (including last chord) should be in the target key
    if (isAfterPivot || (isLastChord && !isPivotChord)) {
        return getChordByRomanNumeral(rn, toScale, toChords) ||
            getChordByRomanNumeral(rn, fromScale, fromChords) ||
            createFallbackChord(rn, toScale);
    }

    // Pivot chord - determine which scale to use based on chord type and modulation direction
    if (isPivotChord) {
        // For pivot chords, prioritize the scale where the chord naturally belongs
        // Minor chords (iv, ii°, vi) should be found in minor contexts
        // Major chords (IV, II, VI) should be found in major contexts

        if (rn.toLowerCase() === rn) {
            // Lowercase = minor chord, try minor-friendly scale first
            // In minor→major modulation: fromScale is minor, toScale is major
            // In major→minor modulation: fromScale is major, toScale is minor
            const minorScale = fromScale.mode.family === 'major' ? toScale : fromScale;
            const minorChords = fromScale.mode.family === 'major' ? toChords : fromChords;
            const majorScale = fromScale.mode.family === 'major' ? fromScale : toScale;
            const majorChords = fromScale.mode.family === 'major' ? fromChords : toChords;

            return getChordByRomanNumeral(rn, minorScale, minorChords) ||
                getChordByRomanNumeral(rn, majorScale, majorChords) ||
                createFallbackChord(rn, minorScale);
        } else {
            // Uppercase = major chord, try major-friendly scale first
            const majorScale = fromScale.mode.family === 'major' ? fromScale : toScale;
            const majorChords = fromScale.mode.family === 'major' ? fromChords : toChords;
            const minorScale = fromScale.mode.family === 'major' ? toScale : fromScale;
            const minorChords = fromScale.mode.family === 'major' ? toChords : fromChords;

            return getChordByRomanNumeral(rn, majorScale, majorChords) ||
                getChordByRomanNumeral(rn, minorScale, minorChords) ||
                createFallbackChord(rn, majorScale);
        }
    }

    // Chords before the pivot chord should be in the original key
    return getChordByRomanNumeral(rn, fromScale, fromChords) ||
        getChordByRomanNumeral(rn, toScale, toChords) ||
        createFallbackChord(rn, fromScale);
}

// Create altered compound chords (like I/♭VII)
function createAlteredCompoundChord(secondary, primary, fromScale, toScale) {
    console.log(`Creating altered compound chord: ${secondary}/${primary}`);

    // Handle the secondary chord (what we actually play)
    if (secondary.match(/^[♭#]/)) {
        // Secondary is altered (like ♭VII in I/♭VII)
        return createAlteredChord(secondary, fromScale, toScale);
    }

    // Handle standard secondary with altered primary context
    if (primary.match(/^[♭#]/)) {
        // Primary provides context, but we play the secondary
        // For I/♭VII, we play I chord but in context of ♭VII
        const chord = getChordByRomanNumeral(secondary, fromScale, fromScale) ||
            getChordByRomanNumeral(secondary, toScale, toScale);

        if (chord) {
            console.log(`Using standard chord ${secondary} in altered context:`, chord);
            return chord;
        }
    }

    // Fallback
    return createFallbackChord(`${secondary}/${primary}`, fromScale);
}

// Create German sixth chord (♭6, 1, ♭3, #4)
function createGermanSixthChord(scale) {
    const tonic = scale.notes[0];
    const notes = scale.notes.map(n => n.note);

    // German sixth intervals from tonic: ♭6, 1, ♭3, #4
    // In C: Ab, C, Eb, F#
    try {
        const root = notes[0]; // Tonic
        const flatSix = transposeName(root, 8, true); // ♭6 - prefer flats
        const flatThree = transposeName(root, 3, true); // ♭3 - prefer flats
        const sharpFour = transposeName(root, 6, false); // #4 - prefer sharps

        const chord = [flatSix, root, flatThree, sharpFour];
        const symbolName = flatSix + "+6";

        return {
            triad: chord,
            seventh: chord,
            symbolTriad: symbolName,
            symbolSeventh: symbolName
        };
    } catch (error) {
        console.warn("Could not create German sixth chord:", error);
        return { triad: [], symbolTriad: "Ger+6" };
    }
}

// Create Neapolitan sixth chord (♭6, ♭2, 4)
function createNeapolitanSixthChord(scale) {
    const tonic = scale.notes[0];
    const notes = scale.notes.map(n => n.note);

    // Neapolitan sixth intervals from tonic: ♭6, ♭2, 4
    // In C: Ab, Db, F
    try {
        const root = notes[0]; // Tonic
        const flatSix = transposeName(root, 8, true); // ♭6 (bass) - prefer flats
        const flatTwo = transposeName(root, 1, true); // ♭2 (root of Neapolitan) - prefer flats
        const four = transposeName(root, 5, false); // 4 (fifth of Neapolitan)

        const chord = [flatSix, flatTwo, four];
        const symbolName = flatTwo + "6";

        return {
            triad: chord,
            seventh: chord,
            symbolTriad: symbolName,
            symbolSeventh: symbolName
        };
    } catch (error) {
        console.warn("Could not create Neapolitan sixth chord:", error);
        return { triad: [], symbolTriad: "♭II6" };
    }
}

// Create altered chords (♭II, ♭VI, ♭VII, etc.)
function createAlteredChord(rn, fromScale, toScale) {
    // Parse alteration and roman numeral
    const altMatch = rn.match(/^([♭#]+)([IVXivx]+)([°ø+7maj]*)?$/);
    if (!altMatch) {
        return createFallbackChord(rn, fromScale);
    }

    const [, alteration, roman, quality] = altMatch;
    const semitones = alteration === '♭' ? -1 : alteration === '#' ? 1 : 0;

    try {
        // Get base degree
        const romanMap = {
            'I': 0, 'II': 1, 'III': 2, 'IV': 3, 'V': 4, 'VI': 5, 'VII': 6,
            'i': 0, 'ii': 1, 'iii': 2, 'iv': 3, 'v': 4, 'vi': 5, 'vii': 6
        };

        const baseDegree = romanMap[roman];
        if (baseDegree === undefined) {
            return createFallbackChord(rn, fromScale);
        }

        // Calculate altered root
        const scaleRoot = fromScale.notes[0].note;
        const intervalFromTonic = [0, 2, 4, 5, 7, 9, 11][baseDegree] + semitones;
        // For flat alterations, prefer flat note names
        const preferFlats = alteration === '♭';
        const alteredRoot = transposeName(scaleRoot, intervalFromTonic, preferFlats);

        // Determine chord quality - quality can be undefined
        const qualityStr = quality || '';
        const isMinor = roman === roman.toLowerCase() || qualityStr.includes('°') || qualityStr.includes('ø');
        const isMajor = !isMinor;
        const isDiminished = qualityStr.includes('°');
        const isHalfDiminished = qualityStr.includes('ø');
        const isSeventh = qualityStr.includes('7');

        // Build chord intervals
        let intervals = [];
        if (isDiminished) {
            intervals = [0, 3, 6]; // dim triad
            if (isSeventh) intervals.push(9); // dim7
        } else if (isHalfDiminished) {
            intervals = [0, 3, 6, 10]; // m7♭5
        } else if (isMinor) {
            intervals = [0, 3, 7]; // minor triad
            if (isSeventh) intervals.push(10); // m7
        } else {
            intervals = [0, 4, 7]; // major triad
            if (isSeventh) intervals.push(qualityStr.includes('maj') ? 11 : 10); // maj7 or 7
        }

        // Generate chord notes
        const chordNotes = intervals.map(interval => transposeName(alteredRoot, interval, preferFlats));
        const symbolName = alteredRoot + (isMinor ? 'm' : '') + (isDiminished ? '°' : '') +
            (isHalfDiminished ? 'ø' : '') + (isSeventh ? '7' : '');

        return {
            triad: chordNotes.slice(0, 3),
            seventh: chordNotes,
            symbolTriad: symbolName,
            symbolSeventh: symbolName
        };

    } catch (error) {
        console.warn(`Could not create altered chord ${rn}:`, error);
        return createFallbackChord(rn, fromScale);
    }
}

// Create fallback chord when parsing fails
function createFallbackChord(rn, scale) {
    // Use tonic triad as fallback
    const tonic = scale.notes[0].note;
    const third = scale.notes[2].note;
    const fifth = scale.notes[4].note;

    return {
        triad: [tonic, third, fifth],
        seventh: [tonic, third, fifth, scale.notes[6].note],
        symbolTriad: rn,
        symbolSeventh: rn
    };
}

// Helper function to transpose note name by semitones
function transposeName(noteName, semitones, preferFlats = false) {
    const noteMap = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
    const sharpNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const flatNames = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

    // Parse input note
    const match = noteName.match(/^([A-G])([#b]*)$/);
    if (!match) return noteName;

    const [, letter, accidentals] = match;
    const basePC = noteMap[letter];
    const accidentalOffset = (accidentals.match(/#/g) || []).length - (accidentals.match(/b/g) || []).length;

    // Calculate target pitch class
    const targetPC = (basePC + accidentalOffset + semitones + 12) % 12;

    // Choose appropriate enharmonic spelling
    // For flat intervals (like ♭II), prefer flat names
    if (preferFlats || semitones < 0) {
        return flatNames[targetPC];
    }

    return sharpNames[targetPC];
}

// Helper function to get chord by roman numeral from scale
function getChordByRomanNumeral(rn, scale, chords) {
    const romanMap = {
        'I': 0, 'II': 1, 'III': 2, 'IV': 3, 'V': 4, 'VI': 5, 'VII': 6,
        'i': 0, 'ii': 1, 'iii': 2, 'iv': 3, 'v': 4, 'vi': 5, 'vii': 6
    };

    // Handle altered roman numerals first
    if (rn.match(/^[♭#]/)) {
        return null; // Let parseRomanNumeralToChord handle these
    }

    // Remove quality indicators to get base roman numeral
    const baseRN = rn.replace(/[°ø+7maj6]/g, '');
    const degree = romanMap[baseRN];

    if (degree !== undefined && chords && chords[degree]) {
        // Apply quality modifications if needed
        const chord = chords[degree];

        // Handle seventh chords
        if (rn.includes('7')) {
            return {
                triad: chord.seventh || chord.triad,
                seventh: chord.seventh || chord.triad,
                symbolTriad: chord.symbolSeventh || chord.symbolTriad,
                symbolSeventh: chord.symbolSeventh || chord.symbolTriad
            };
        }

        return chord;
    }

    return null;
}

function cadences(scale) {
    const currentMode = scale.mode.labelEn ? scale.mode.labelEn.toLowerCase().replace(/\s+/g, '_') : 'ionian';
    const names = scale.notes.map(n => n.note);
    const pcs = scale.notes.map(n => n.pc);

    // Expanded degree map to handle more complex roman numerals
    const degreeMap = {
        I: 0, II: 1, III: 2, IV: 3, V: 4, VI: 5, VII: 6,
        i: 0, ii: 1, iii: 2, iv: 3, v: 4, vi: 5, vii: 6
    };

    function triAt(i) {
        const r = pcs[i];
        const t = pcs[(i + 2) % 7];
        const f = pcs[(i + 4) % 7];
        return triadType(r, t, f);
    }

    function chordFromRN(rn) {
        // Enhanced regex to handle more complex roman numerals including flats, sharps, and extensions
        const m = rn.match(/^([b#♭♯]*)([ivxIVX]+|Ger\+6)([°ø+]*)([67maj]*)?$/);
        if (!m) return rn;

        const accidentals = m[1];
        const roman = m[2];
        const quality = m[3];
        const extension = m[4];

        // Handle special cases like German sixth
        if (roman === 'Ger+6') return 'Ger+6';

        // Get base degree
        const baseRoman = roman.replace(/[°ø+]/g, '').toUpperCase();
        let idx = degreeMap[baseRoman];

        if (idx === undefined) return rn;

        // Handle accidentals (transpose the degree)
        let chromaticShift = 0;
        if (accidentals.includes('b') || accidentals.includes('♭')) chromaticShift -= 1;
        if (accidentals.includes('#') || accidentals.includes('♯')) chromaticShift += 1;

        // Calculate the actual note
        const basePc = pcs[idx];
        const shiftedPc = (basePc + chromaticShift + 12) % 12;

        // Convert PC back to note name
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        let noteName = noteNames[shiftedPc];

        // Try to use enharmonic equivalent that fits better in the key
        const scaleNotes = names.map(n => n.replace(/[#b]/g, ''));
        if (!scaleNotes.includes(noteName[0])) {
            const enharmonics = {
                'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb',
                'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
            };
            noteName = enharmonics[noteName] || noteName;
        }

        // Add quality suffix
        let suffix = '';
        if (quality.includes('°')) suffix = '°';
        else if (quality.includes('ø')) suffix = 'ø';
        else if (quality.includes('+')) suffix = '+';
        else {
            // Determine quality from chord type in roman numeral
            const isLowerCase = roman.charAt(0) === roman.charAt(0).toLowerCase();
            if (isLowerCase) suffix = 'm';
        }

        // Add extensions
        if (extension) {
            if (extension.includes('7')) suffix += '7';
            if (extension.includes('maj')) suffix = suffix.replace('7', 'maj7');
            if (extension.includes('6')) suffix += '6';
        }

        return noteName + suffix;
    }

    // Function to get chord notes from Roman numeral
    function getCadenceChordNotes(rn) {
        // Enhanced regex to handle more complex roman numerals including flats, sharps, and extensions
        const m = rn.match(/^([b#♭♯]*)([ivxIVX]+|Ger\+6)([°ø+]*)([67maj]*)?$/);
        if (!m) return []; // Return empty array for unrecognized chords

        const accidentals = m[1];
        const roman = m[2];
        const quality = m[3];
        const extension = m[4];

        // Handle special cases like German sixth
        if (roman === 'Ger+6') {
            // For now, return empty array for special chords
            return [];
        }

        // Get base degree
        const baseRoman = roman.replace(/[°ø+]/g, '').toUpperCase();
        let idx = degreeMap[baseRoman];

        if (idx === undefined) return [];

        // Handle accidentals (transpose the degree)
        let chromaticShift = 0;
        if (accidentals.includes('b') || accidentals.includes('♭')) chromaticShift -= 1;
        if (accidentals.includes('#') || accidentals.includes('♯')) chromaticShift += 1;

        // Calculate the actual note
        const basePc = pcs[idx];
        const shiftedPc = (basePc + chromaticShift + 12) % 12;

        // Convert PC back to note name
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        let rootNote = noteNames[shiftedPc];

        // Try to use enharmonic equivalent that fits better in the key
        const scaleNotes = names.map(n => n.replace(/[#b]/g, ''));
        if (!scaleNotes.includes(rootNote[0])) {
            const enharmonics = {
                'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb',
                'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
            };
            rootNote = enharmonics[rootNote] || rootNote;
        }

        // Determine chord quality and build chord notes
        let chordNotes = [];
        const rootPc = parseNote(rootNote).pc;

        // Default to triad
        chordNotes = [rootNote]; // Root

        // Add third
        let thirdInterval = 4; // Major third by default
        if (quality.includes('°') || quality.includes('ø') || roman.charAt(0) === roman.charAt(0).toLowerCase()) {
            thirdInterval = 3; // Minor third for minor and diminished chords
        }
        const thirdPc = (rootPc + thirdInterval) % 12;
        const thirdNote = noteNames[thirdPc];
        chordNotes.push(thirdNote);

        // Add fifth
        let fifthInterval = 7; // Perfect fifth by default
        if (quality.includes('°')) {
            fifthInterval = 6; // Diminished fifth
        } else if (quality.includes('+')) {
            fifthInterval = 8; // Augmented fifth
        }
        const fifthPc = (rootPc + fifthInterval) % 12;
        const fifthNote = noteNames[fifthPc];
        chordNotes.push(fifthNote);

        // Add seventh if specified
        if (extension && extension.includes('7')) {
            let seventhInterval = 10; // Minor seventh by default
            if (extension.includes('maj')) {
                seventhInterval = 11; // Major seventh
            } else if (quality.includes('°')) {
                seventhInterval = 9; // Diminished seventh
            }
            const seventhPc = (rootPc + seventhInterval) % 12;
            const seventhNote = noteNames[seventhPc];
            chordNotes.push(seventhNote);
        }

        return chordNotes;
    }

    // Filter cadences that are appropriate for the current mode
    const applicableCadences = Object.entries(window.COMMON_CADENCES || {})
        .filter(([key, cadence]) => {
            // Check if current mode is in the cadence's applicable modes
            return cadence.modes.includes(currentMode) ||
                cadence.modes.includes('all') ||
                // Fallback to family-based matching
                (scale.mode.family === 'major' && cadence.modes.some(mode =>
                    ['ionian', 'lydian', 'mixolydian'].includes(mode))) ||
                (scale.mode.family === 'minor' && cadence.modes.some(mode =>
                    ['aeolian', 'dorian', 'phrygian', 'harmonic_minor'].includes(mode)));
        })
        .map(([key, cadence]) => ({
            name: LANG === 'ru' ? cadence.name_ru : cadence.name_en,
            rn: cadence.rn.join(" – "),
            rnArray: cadence.rn, // Keep original array for chord playback
            example: cadence.rn.map(ch => chordFromRN(ch)).join(" – "),
            category: cadence.category,
            strength: cadence.strength
        }))
        // Sort by strength and category
        .sort((a, b) => {
            const strengthOrder = { strong: 0, medium: 1, weak: 2 };
            const categoryOrder = { authentic: 0, jazz: 1, modal: 2, plagal: 3, classical: 4, blues: 5, contemporary: 6, half: 7, deceptive: 8 };

            if (strengthOrder[a.strength] !== strengthOrder[b.strength]) {
                return strengthOrder[a.strength] - strengthOrder[b.strength];
            }
            return categoryOrder[a.category] - categoryOrder[b.category];
        });

    return applicableCadences;
}

// Global variable to track current playing timeouts
window.currentPlayingTimeouts = [];

// Function to clear all playing timeouts (stop current playback)
function stopCurrentPlayback() {
    if (window.currentPlayingTimeouts) {
        window.currentPlayingTimeouts.forEach(timeout => clearTimeout(timeout));
        window.currentPlayingTimeouts = [];
    }
}

// Function to play a modulation (sequence of chords)
function playModulation(scale, chordSequence, modulationName) {
    if (!chordSequence || chordSequence.length === 0) return;

    // Stop any current playback
    stopCurrentPlayback();

    console.log(`Playing modulation "${modulationName}":`, chordSequence);

    // chordSequence already contains arrays of chord notes, no conversion needed
    const validChords = chordSequence.filter(chord => chord && Array.isArray(chord) && chord.length > 0);

    if (validChords.length === 0) {
        console.warn('No valid chords found in sequence');
        return;
    }

    // Play each chord in sequence
    const chordDuration = 2.0; // Duration of each chord
    const chordGap = 0.1; // Small gap between chords

    validChords.forEach((chordNotes, index) => {
        const delay = index * (chordDuration + chordGap);

        // Play chord with slight delay
        const timeout = setTimeout(() => {
            console.log(`Playing chord ${index + 1}/${validChords.length}: (${chordNotes.join('-')})`);
            HarmonyAudio.playChord(chordNotes, 4, chordDuration, false);
        }, delay * 200);

        // Track timeout for potential cancellation
        window.currentPlayingTimeouts.push(timeout);
    });

    // Return the total duration for button timing
    return ((validChords.length - 1) * (chordDuration + chordGap) + chordDuration) * 200 + 300;
}

// Function to play a cadence (sequence of chords)
function playCadence(scale, rnArray, cadenceName) {
    if (!rnArray || rnArray.length === 0) return;

    console.log(`Playing cadence "${cadenceName}":`, rnArray);

    const names = scale.notes.map(n => n.note);
    const pcs = scale.notes.map(n => n.pc);

    // Expanded degree map to handle more complex roman numerals
    const degreeMap = {
        I: 0, II: 1, III: 2, IV: 3, V: 4, VI: 5, VII: 6,
        i: 0, ii: 1, iii: 2, iv: 3, v: 4, vi: 5, vii: 6
    };

    // Function to get chord notes from Roman numeral (simplified version for cadence playback)
    function getCadenceChordNotes(rn) {
        console.log(`Parsing Roman numeral: ${rn}`);

        // Handle compound roman numerals (V/V, I/♭VII, etc.)
        if (rn.includes('/')) {
            const [secondary, primary] = rn.split('/');
            console.log(`Compound chord: ${secondary}/${primary}, using ${secondary}`);
            // Use the secondary chord (left side of /)
            return getCadenceChordNotes(secondary);
        }

        // Handle special German sixth chord
        if (rn === 'Ger+6') {
            const tonic = names[0];
            const tonicPc = pcs[0];
            const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

            const flatSix = noteNames[(tonicPc + 8) % 12];     // ♭6: 8 semitones from tonic
            const root = tonic;                                 // 1: tonic
            const flatThree = noteNames[(tonicPc + 3) % 12];   // ♭3: 3 semitones from tonic
            const sharpFour = noteNames[(tonicPc + 6) % 12];   // #4: 6 semitones from tonic

            console.log(`German Sixth in ${tonic}: [${flatSix}, ${root}, ${flatThree}, ${sharpFour}]`);
            return [flatSix, root, flatThree, sharpFour];
        }

        // Handle Neapolitan sixth chord (♭II6)
        if (rn === '♭II6') {
            const tonic = names[0];
            const tonicPc = pcs[0];
            const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

            const flatSix = noteNames[(tonicPc + 8) % 12];     // ♭6 (bass note in 1st inversion)
            const flatTwo = noteNames[(tonicPc + 1) % 12];     // ♭2 (root of Neapolitan)
            const four = noteNames[(tonicPc + 5) % 12];        // 4 (fifth of Neapolitan)

            console.log(`Neapolitan Sixth in ${tonic}: [${flatSix}, ${flatTwo}, ${four}]`);
            return [flatSix, flatTwo, four];
        }

        // Enhanced regex to handle more complex roman numerals including altered intervals
        const m = rn.match(/^([b#♭♯]*)([ivxIVX]+)([°ø+]*)(.*)$/);
        if (!m) {
            console.warn(`Could not parse Roman numeral: ${rn}`);
            return []; // Return empty array for unrecognized chords
        }

        const accidentals = m[1];
        const roman = m[2];
        const quality = m[3];
        const extensions = m[4];

        console.log(`Parsed parts: accidentals="${accidentals}", roman="${roman}", quality="${quality}", extensions="${extensions}"`);

        // Handle altered roman numerals (♭II, ♭VI, ♭VII, etc.)
        if (accidentals.length > 0) {
            const tonic = names[0];
            const tonicPc = pcs[0];
            const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

            // Get base degree interval
            const degreeIntervals = {
                'I': 0, 'II': 2, 'III': 4, 'IV': 5, 'V': 7, 'VI': 9, 'VII': 11,
                'i': 0, 'ii': 2, 'iii': 4, 'iv': 5, 'v': 7, 'vi': 9, 'vii': 11
            };

            const baseInterval = degreeIntervals[roman.toUpperCase()];
            if (baseInterval === undefined) {
                console.warn(`Unknown roman numeral base: ${roman}`);
                return [];
            }

            // Apply alterations
            let alteration = 0;
            if (accidentals.includes('♭') || accidentals.includes('b')) alteration -= 1;
            if (accidentals.includes('♯') || accidentals.includes('#')) alteration += 1;

            const alteredRootPc = (tonicPc + baseInterval + alteration + 12) % 12;
            const alteredRoot = noteNames[alteredRootPc];

            // Determine chord quality
            const isMinor = roman === roman.toLowerCase() || quality.includes('°') || quality.includes('ø');
            const isDiminished = quality.includes('°');
            const isHalfDiminished = quality.includes('ø');
            const isAugmented = quality.includes('+');
            const isSeventh = extensions.includes('7');

            // Build chord intervals
            let intervals = [0]; // Root

            // Third
            if (isDiminished || isHalfDiminished || isMinor) {
                intervals.push(3); // Minor third
            } else {
                intervals.push(4); // Major third
            }

            // Fifth  
            if (isDiminished || isHalfDiminished) {
                intervals.push(6); // Diminished fifth
            } else if (isAugmented) {
                intervals.push(8); // Augmented fifth
            } else {
                intervals.push(7); // Perfect fifth
            }

            // Seventh
            if (isSeventh) {
                if (extensions.includes('maj')) {
                    intervals.push(11); // Major seventh
                } else if (isDiminished) {
                    intervals.push(9); // Diminished seventh
                } else {
                    intervals.push(10); // Minor seventh
                }
            }

            // Generate chord notes
            const chordNotes = intervals.map(interval => {
                const notePc = (alteredRootPc + interval) % 12;
                return noteNames[notePc];
            });

            console.log(`Altered chord ${rn} in ${tonic}: ${chordNotes}`);
            return chordNotes;
        }

        // Standard roman numeral processing
        // Get base degree
        const baseRoman = roman.replace(/[°ø+]/g, '').toUpperCase();
        let idx = degreeMap[baseRoman];

        if (idx === undefined) {
            console.warn(`Unknown Roman numeral base: ${baseRoman} from ${rn}`);
            return [];
        }

        // Handle accidentals (transpose the degree)
        let chromaticShift = 0;
        if (accidentals.includes('b') || accidentals.includes('♭')) chromaticShift -= 1;
        if (accidentals.includes('#') || accidentals.includes('♯')) chromaticShift += 1;

        // Calculate the actual note
        const basePc = pcs[idx];
        const shiftedPc = (basePc + chromaticShift + 12) % 12;

        // Convert PC back to note name
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        let rootNote = noteNames[shiftedPc];

        // Try to use enharmonic equivalent that fits better in the key
        const scaleNotes = names.map(n => n.replace(/[#b]/g, ''));
        if (!scaleNotes.includes(rootNote[0])) {
            const enharmonics = {
                'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb',
                'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
            };
            rootNote = enharmonics[rootNote] || rootNote;
        }

        // Determine chord quality and build chord notes
        let chordNotes = [];
        const rootPc = parseNote(rootNote).pc;

        // Default to triad
        chordNotes = [rootNote]; // Root

        // Add third
        let thirdInterval = 4; // Major third by default
        if (quality.includes('°') || quality.includes('ø') || roman.charAt(0) === roman.charAt(0).toLowerCase()) {
            thirdInterval = 3; // Minor third for minor and diminished chords
        }
        const thirdPc = (rootPc + thirdInterval) % 12;
        const thirdNote = noteNames[thirdPc];
        chordNotes.push(thirdNote);

        // Add fifth (check for alterations in extensions)
        let fifthInterval = 7; // Perfect fifth by default
        if (quality.includes('°')) {
            fifthInterval = 6; // Diminished fifth
        } else if (quality.includes('+')) {
            fifthInterval = 8; // Augmented fifth
        } else if (extensions.includes('♭5') || extensions.includes('b5')) {
            fifthInterval = 6; // Diminished fifth from extensions (like in ii7♭5)
            console.log(`Found ♭5 in extensions, using diminished fifth (${fifthInterval} semitones)`);
        } else if (extensions.includes('♯5') || extensions.includes('#5')) {
            fifthInterval = 8; // Augmented fifth from extensions
        }
        const fifthPc = (rootPc + fifthInterval) % 12;
        const fifthNote = noteNames[fifthPc];
        chordNotes.push(fifthNote);

        // Add seventh if specified
        if (extensions && extensions.includes('7')) {
            let seventhInterval = 10; // Minor seventh by default
            if (extensions.includes('maj7') || extensions.includes('M7')) {
                seventhInterval = 11; // Major seventh
            } else if (quality.includes('°')) {
                seventhInterval = 9; // Diminished seventh
            } else if (extensions.includes('♭7') || extensions.includes('b7')) {
                seventhInterval = 9; // Diminished seventh from extensions
            }
            const seventhPc = (rootPc + seventhInterval) % 12;
            const seventhNote = noteNames[seventhPc];
            chordNotes.push(seventhNote);
        }

        // Add sixth if specified (but not seventh)
        if (extensions && extensions.includes('6') && !extensions.includes('7')) {
            const sixthInterval = 9; // Major sixth (9 semitones)
            const sixthPc = (rootPc + sixthInterval) % 12;
            const sixthNote = noteNames[sixthPc];
            chordNotes.push(sixthNote);
        }

        console.log(`Final chord notes for ${rn}: [${chordNotes.join(', ')}]`);
        return chordNotes;
    }

    // Play each chord in sequence
    const chordDuration = 2.0; // Duration of each chord
    const chordGap = 0.1; // Small gap between chords

    rnArray.forEach((rn, index) => {
        const chordNotes = getCadenceChordNotes(rn);
        if (chordNotes.length > 0) {
            const delay = index * (chordDuration + chordGap);

            // Play chord with slight delay
            setTimeout(() => {
                console.log(`Playing chord ${index + 1}/${rnArray.length}: ${rn} (${chordNotes.join('-')})`);
                HarmonyAudio.playChord(chordNotes, 4, chordDuration, false);
            }, delay * 200);
        }
    });
}

// DOM elements - using safe selection
function safeGetElement(id) {
    return document.getElementById(id);
}

const noteSelect = safeGetElement('noteSelect');
const modeSel = safeGetElement('mode');
const accButtons = document.querySelectorAll('.acc-btn');
const scaleTitle = safeGetElement('scale-title');
const scaleNotes = safeGetElement('scale-notes');
const keyInfo = safeGetElement('key-info');
const chordsBody = safeGetElement('chords-body');
const related = safeGetElement('related');
const cadencesBox = safeGetElement('cadences');

// New form elements
const tonicValue = safeGetElement('tonicValue');
const familyValue = safeGetElement('familyValue');
const formulaValue = safeGetElement('formulaValue');
const degreesValue = safeGetElement('degreesValue');
const scaleNotesDisplay = safeGetElement('scale-notes-display');
const playScaleBtn = safeGetElement('playScaleBtn');

// Get current tonic based on note and accidental
function getCurrentTonic() {
    const note = noteSelect.value;
    const activeAcc = document.querySelector('.acc-btn.active');
    const accidental = activeAcc ? activeAcc.dataset.acc : 'natural';

    if (accidental === 'sharp') {
        return note + '#';
    } else if (accidental === 'flat') {
        return note + 'b';
    }
    return note;
}

// LocalStorage functions for saving/loading harmony navigator state
const HARMONY_STORAGE_KEY = 'harmony_navigator_state_v1';

function saveHarmonyState() {
    try {
        const state = {
            note: noteSelect ? noteSelect.value : 'C',
            accidental: getActiveAccidental(),
            mode: modeSel ? modeSel.value : 'ionian'
        };
        localStorage.setItem(HARMONY_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn('[HarmonyNavigator] Could not save state to localStorage:', e);
    }
}

function loadHarmonyState() {
    try {
        const saved = localStorage.getItem(HARMONY_STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.warn('[HarmonyNavigator] Could not load state from localStorage:', e);
    }

    // Return default state
    return {
        note: 'C',
        accidental: 'natural',
        mode: 'ionian'
    };
}

function getActiveAccidental() {
    const activeAcc = document.querySelector('.acc-btn.active');
    return activeAcc ? activeAcc.dataset.acc : 'natural';
}

function setAccidental(accidental) {
    // Remove active class from all buttons
    const accButtons = document.querySelectorAll('.acc-btn');
    accButtons.forEach(btn => btn.classList.remove('active'));

    // Set active class to the correct button
    const targetBtn = document.querySelector(`.acc-btn[data-acc="${accidental}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    } else {
        // Fallback to natural if accidental not found
        const naturalBtn = document.querySelector('.acc-btn[data-acc="natural"]');
        if (naturalBtn) {
            naturalBtn.classList.add('active');
        }
    }
}

function restoreHarmonyState() {
    const state = loadHarmonyState();

    // Restore note selection
    if (noteSelect && state.note) {
        noteSelect.value = state.note;
    }

    // Restore accidental selection
    if (state.accidental) {
        setAccidental(state.accidental);
    }

    // Restore mode selection (with validation)
    if (modeSel && state.mode) {
        const modeOption = modeSel.querySelector(`option[value="${state.mode}"]`);
        if (modeOption) {
            modeSel.value = state.mode;
        } else {
            // If saved mode doesn't exist, use ionian
            const ionianOption = modeSel.querySelector('option[value="ionian"]');
            if (ionianOption) {
                modeSel.value = 'ionian';
            }
        }
    }

    console.log('[HarmonyNavigator] Restored state:', state);
}

// Initialize controls
function initControls() {
    // Fill mode selector with scales from common-data.js
    modeSel.innerHTML = '';

    // Group scales by family for better organization
    // Only include families suitable for harmonic analysis and chord progressions
    // Excludes pentatonic, blues, symmetric, bebop, and world scales
    const allowedFamilies = ['diatonic', 'harmonic', 'melodic'];
    const scaleGroups = {
        diatonic: [],
        harmonic: [],
        melodic: []
    };

    Object.entries(window.COMMON_SCALES || {}).forEach(([key, scale]) => {
        // Only include scales from families suitable for harmonic analysis
        if (allowedFamilies.includes(scale.family)) {
            const group = scaleGroups[scale.family];
            if (group) {
                group.push({ key, scale });
            }
        }
    });

    // Add scales to selector by groups
    Object.entries(scaleGroups).forEach(([groupName, scales]) => {
        if (scales.length > 0) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = groupName.charAt(0).toUpperCase() + groupName.slice(1);

            scales.forEach(({ key, scale }) => {
                const o = document.createElement('option');
                o.value = key;
                o.textContent = LANG === 'ru' ? scale.name_ru : scale.name_en;
                optgroup.appendChild(o);
            });

            modeSel.appendChild(optgroup);
        }
    });

    // Set up accidental button handlers with safety checks
    if (accButtons && accButtons.length > 0) {
        // Set natural as default active
        const naturalBtn = document.querySelector('.acc-btn[data-acc="natural"]');
        if (naturalBtn) {
            naturalBtn.classList.add('active');
        }

        accButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                accButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                // Save state and re-render
                saveHarmonyState();
                renderAll();
            });
        });
    }

    // Restore saved state after controls are initialized
    restoreHarmonyState();
}

function renderAll() {
    if (!modeSel) return; // Safety check

    const tonic = getCurrentTonic();
    const mode = modeSel.value || 'ionian'; // Default to ionian if empty

    if (!mode) {
        console.warn('No mode selected, using ionian as default');
        modeSel.value = 'ionian';
    }

    const scale = deriveScale(tonic, mode);
    const chords = buildChords(scale);
    const rels = relatedKeys(tonic, mode);
    const cads = cadences(scale);

    // Update scale information panel safely
    const scaleData = window.COMMON_SCALES[mode];
    const modeLabel = scaleData ? (LANG === 'ru' ? scaleData.name_ru : scaleData.name_en) : mode;

    if (tonicValue) tonicValue.textContent = scale.notes[0].note;
    if (familyValue) familyValue.textContent = scale.mode.family === 'major' ? t('majorFamily') : t('minorFamily');
    if (formulaValue) formulaValue.textContent = calculateScaleFormula(mode);
    if (degreesValue && scaleData) {
        degreesValue.textContent = LANG === 'ru' ? scaleData.degrees_ru : scaleData.degrees_en;
    } else if (degreesValue) {
        // Fallback: show basic major scale degrees if no data available
        degreesValue.textContent = '1 2 3 4 5 6 7';
    }

    // Update scale notes display safely
    if (scaleNotesDisplay) {
        scaleNotesDisplay.innerHTML = '';
        scale.notes.forEach((n, i) => {
            const s = document.createElement('span');
            s.className = 'chip';
            s.textContent = (i + 1) + '. ' + n.note;
            scaleNotesDisplay.appendChild(s);
        });
    }

    // Legacy scale info (for compatibility)
    const fromText = t('fromText');
    if (scaleTitle) {
        scaleTitle.textContent = modeLabel + fromText + scale.notes[0].note;
    }

    if (scaleNotes) {
        scaleNotes.innerHTML = '';
        scale.notes.forEach((n, i) => {
            const s = document.createElement('span');
            s.className = 'chip';
            s.textContent = (i + 1) + '. ' + n.note;
            scaleNotes.appendChild(s);
        });
    }

    // Legacy key info (if exists)
    if (keyInfo) {
        keyInfo.innerHTML = '';
        const tonicLabel = t('tonicLabel');
        const familyLabel = t('familyLabel');
        const familyValue = scale.mode.family === 'major' ? t('majorFamily') : t('minorFamily');
        const formulaLabel = t('formulaLabel');

        keyInfo.insertAdjacentHTML('beforeend', `<li><b>${tonicLabel}:</b> ${scale.notes[0].note}</li>`);
        keyInfo.insertAdjacentHTML('beforeend', `<li><b>${familyLabel}:</b> ${familyValue}</li>`);
        keyInfo.insertAdjacentHTML('beforeend', `<li><b>${formulaLabel}:</b> ${scale.mode.intervals.join('–')}</li>`);
    }

    // Chords table safely
    if (chordsBody) {
        chordsBody.innerHTML = '';
        chords.forEach((ch, index) => {
            const tr = document.createElement('tr');
            tr.style.background = 'var(--panel-2)';
            tr.innerHTML = `
            <td style="border-top-left-radius:12px; border-bottom-left-radius:12px; text-align:center; width:36px; font-weight:600; padding:10px 8px;">${ch.degree}</td>
            <td style="padding:10px 8px; font-weight:600;">${ch.rn}</td>
            <td style="padding:10px 8px;">${ch.functionRus}</td>
            <td style="padding:10px 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span>${ch.symbolTriad}</span>
                    <button class="play-chord-btn" data-chord-index="${index}" 
                            style="background:var(--primary); color:white; border:none; border-radius:4px; padding:4px 6px; cursor:pointer; font-size:11px; display:inline-flex; align-items:center; gap:2px;"
                            title="${t('playTriadTooltip') || 'Play triad'}">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="5,3 19,12 5,21"></polygon>
                        </svg>
                    </button>
                </div>
                <span class="small muted">${ch.triadLabel}</span>
            </td>
            <td style="padding:10px 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span>${ch.symbolSeventh}</span>
                    <button class="play-seventh-btn" data-chord-index="${index}" 
                            style="background:var(--secondary); color:white; border:none; border-radius:4px; padding:4px 6px; cursor:pointer; font-size:11px; display:inline-flex; align-items:center; gap:2px;"
                            title="${t('playSeventhTooltip') || 'Play seventh chord'}">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="5,3 19,12 5,21"></polygon>
                        </svg>
                    </button>
                </div>
                <span class="small muted">${ch.seventhLabel}</span>
            </td>
            <td style="border-top-right-radius:12px; border-bottom-right-radius:12px; padding:10px 8px;">
                ${ch.tensions.map((tension, tensionIndex) => `
                    <button class="pill play-tension-btn" data-chord-index="${index}" data-tension-index="${tensionIndex}"
                            style="background:var(--accent); color:white; border:none; border-radius:12px; padding:4px 8px; cursor:pointer; font-size:11px; margin-right:4px; margin-bottom:2px; transition: background-color 0.2s;"
                            title="${tension.n === '9' ? (t('playNinthTooltip') || 'Play 9th chord (5 notes)') :
                    tension.n === '11' ? (t('playEleventhTooltip') || 'Play 11th chord (6 notes)') :
                        (t('playThirteenthTooltip') || 'Play 13th chord (7 notes)')}">
                        ${tension.n}: ${tension.label}
                    </button>
                `).join('')}
            </td>
        `;

            // Add event listeners for chord play buttons
            const playTriadBtn = tr.querySelector('.play-chord-btn');
            const playSeventhBtn = tr.querySelector('.play-seventh-btn');
            const playTensionBtns = tr.querySelectorAll('.play-tension-btn');

            if (playTriadBtn) {
                playTriadBtn.addEventListener('click', () => {
                    // Play triad (3 notes)
                    const chordNotes = ch.triad;
                    console.log(`Playing triad ${ch.symbolTriad}:`, chordNotes);
                    HarmonyAudio.playChord(chordNotes, 4, 2.0, true);
                });
            }

            if (playSeventhBtn) {
                playSeventhBtn.addEventListener('click', () => {
                    // Play seventh chord (4 notes)
                    const chordNotes = ch.seventh;
                    console.log(`Playing seventh ${ch.symbolSeventh}:`, chordNotes);
                    HarmonyAudio.playChord(chordNotes, 4, 2.0, true);
                });
            }

            // Add event listeners for tension chord buttons
            playTensionBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const tensionIndex = parseInt(btn.dataset.tensionIndex);
                    const tension = ch.tensions[tensionIndex];
                    const chordNotes = tension.notes;
                    const tensionName = tension.n;

                    console.log(`Playing ${tensionName}th chord ${ch.symbolTriad}${tensionName}:`, chordNotes);
                    HarmonyAudio.playChord(chordNotes, 4, 2.5, true);
                });
            });

            chordsBody.appendChild(tr);
        });
    }

    // Related keys safely
    if (related) {
        related.innerHTML = '';

        // Add header with count
        if (rels.length > 0) {
            const header = document.createElement('div');
            header.style.cssText = 'margin-bottom:16px; padding:8px 12px; background:var(--panel-1); border-radius:8px; border:1px solid var(--fret);';
            header.innerHTML = `
                <div class="small muted">
                    ${LANG === 'ru'
                    ? `Найдено ${rels.length} модуляций для текущего лада`
                    : `Found ${rels.length} modulations for current mode`}
                </div>
            `;
            related.appendChild(header);
        }

        rels.forEach((r, index) => {
            const details = document.createElement('details');

            // Style based on strength (same as cadences)
            const strengthColors = {
                strong: 'var(--primary)',
                medium: 'var(--secondary)',
                weak: 'var(--accent)'
            };
            const strengthColor = strengthColors[r.strength] || 'var(--fret)';

            details.style.cssText = `border:1px solid var(--fret); border-left:4px solid ${strengthColor}; border-radius:12px; padding:12px 14px; background:var(--panel-2); margin-bottom:12px;`;

            const summary = document.createElement('summary');
            summary.style.cssText = 'display:flex; align-items:center; justify-content:space-between; cursor:pointer; list-style:none;';
            summary.innerHTML = `
            <div style="flex: 1;">
                <strong style="font-size:16px; font-weight:600; display:block; margin-bottom: 4px;">${r.title}</strong>
                <div style="display: flex; gap: 6px; margin-bottom: 4px;">
                    <span class="pill" style="background: ${strengthColor}; color: white; padding: 2px 6px; font-size: 10px; border-radius: 6px;">${getStrengthLabel(r.strength)}</span>
                    <span class="pill" style="background: var(--muted); color: white; padding: 2px 6px; font-size: 10px; border-radius: 6px;">${getCategoryLabel(r.category)}</span>
                </div>
                <span class="small muted">${r.relation}</span>
            </div>
            <span class="arrow" style="transition: transform .2s ease; color:var(--muted); margin-left: 8px;">▼</span>
        `;

            const content = document.createElement('div');
            content.style.marginTop = '12px';
            content.innerHTML = `
            <p class="small"><strong>${t('modulation')}:</strong> ${r.how}</p>
            <div class="small modulation-progression" style="margin: 8px 0;">
                <div style="margin-bottom: 4px;">
                    <strong>${t('romanNumerals')}:</strong> 
                    <span style="word-break: break-all;">${r.modulationRN}</span>
                </div>
                <div style="margin-bottom: 4px;">
                    <strong>${t('example')}:</strong> 
                    <span style="word-break: break-all;">${r.modulationChordNames}</span>
                </div>
                <button class="play-modulation-btn" data-modulation-type="to" data-modulation-index="${index}"
                        style="background:var(--primary); color:white; border:none; border-radius:6px; padding:6px 10px; cursor:pointer; font-size:11px; display:inline-flex; align-items:center; gap:4px; margin-top:4px; transition: background-color 0.2s;"
                        title="${t('playCadenceTooltip') || 'Play modulation'}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5,3 19,12 5,21"></polygon>
                    </svg>
                    ${t('playCadenceBtn') || 'Play'}
                </button>
            </div>
            <p class="small"><strong>${t('returnText')}:</strong> ${r.back}</p>
            <div class="small modulation-progression" style="margin: 8px 0;">
                <div style="margin-bottom: 4px;">
                    <strong>${t('romanNumerals')}:</strong> 
                    <span style="word-break: break-all;">${r.returnRN}</span>
                </div>
                <div style="margin-bottom: 4px;">
                    <strong>${t('example')}:</strong> 
                    <span style="word-break: break-all;">${r.returnChordNames}</span>
                </div>
                <button class="play-modulation-btn" data-modulation-type="back" data-modulation-index="${index}"
                        style="background:var(--secondary); color:white; border:none; border-radius:6px; padding:6px 10px; cursor:pointer; font-size:11px; display:inline-flex; align-items:center; gap:4px; margin-top:4px; transition: background-color 0.2s;"
                        title="${t('playCadenceTooltip') || 'Play return'}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5,3 19,12 5,21"></polygon>
                    </svg>
                    ${t('playCadenceBtn') || 'Play'}
                </button>
            </div>
        `;

            details.appendChild(summary);
            details.appendChild(content);
            related.appendChild(details);

            // Handle arrow rotation
            details.addEventListener('toggle', () => {
                const arrow = details.querySelector('.arrow');
                if (details.open) {
                    arrow.style.transform = 'rotate(180deg)';
                } else {
                    arrow.style.transform = 'rotate(0deg)';
                }
            });
        });
    }

    // Cadences safely
    if (cadencesBox) {
        cadencesBox.innerHTML = '';

        // Add header with count
        if (cads.length > 0) {
            const header = document.createElement('div');
            header.style.cssText = 'margin-bottom:16px; padding:8px 12px; background:var(--panel-1); border-radius:8px; border:1px solid var(--fret);';
            header.innerHTML = `
                <div class="small muted">
                    ${LANG === 'ru'
                    ? `Найдено ${cads.length} каденций для текущего лада`
                    : `Found ${cads.length} cadences for current mode`}
                </div>
            `;
            cadencesBox.appendChild(header);
        }

        cads.forEach((c, cadenceIndex) => {
            const div = document.createElement('div');

            // Style based on strength
            const strengthColors = {
                strong: 'var(--primary)',
                medium: 'var(--secondary)',
                weak: 'var(--accent)'
            };

            const strengthColor = strengthColors[c.strength] || 'var(--fret)';

            div.style.cssText = `background:var(--panel-2); border:1px solid var(--fret); border-left:4px solid ${strengthColor}; border-radius:12px; padding:16px; margin-bottom:12px;`;

            // Category translation
            const categoryNames = {
                en: {
                    authentic: 'Authentic',
                    plagal: 'Plagal',
                    half: 'Half Cadence',
                    deceptive: 'Deceptive',
                    jazz: 'Jazz',
                    modal: 'Modal',
                    classical: 'Classical',
                    blues: 'Blues',
                    contemporary: 'Contemporary'
                },
                ru: {
                    authentic: 'Автентическая',
                    plagal: 'Плагальная',
                    half: 'Полукаденция',
                    deceptive: 'Обманная',
                    jazz: 'Джазовая',
                    modal: 'Модальная',
                    classical: 'Классическая',
                    blues: 'Блюзовая',
                    contemporary: 'Современная'
                }
            };

            const strengthNames = {
                en: { strong: 'Strong', medium: 'Medium', weak: 'Weak' },
                ru: { strong: 'Сильная', medium: 'Средняя', weak: 'Слабая' }
            };

            const categoryName = categoryNames[LANG][c.category] || c.category;
            const strengthName = strengthNames[LANG][c.strength] || c.strength;

            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <div>
                        <div class="title" style="font-size:16px; font-weight:600; margin:0 0 4px 0;">${c.name}</div>
                        <div style="display: flex; gap: 6px;">
                            <span class="pill" style="background: ${strengthColor}; color: white; padding: 2px 6px; font-size: 10px; border-radius: 6px;">${strengthName}</span>
                            <span class="pill" style="background: var(--muted); color: white; padding: 2px 6px; font-size: 10px; border-radius: 6px;">${categoryName}</span>
                        </div>
                    </div>
                    <button class="play-cadence-btn" data-cadence-index="${cadenceIndex}" 
                            style="background:var(--primary); color:white; border:none; border-radius:6px; padding:6px 10px; cursor:pointer; font-size:11px; display:inline-flex; align-items:center; gap:4px; transition: background-color 0.2s;"
                            title="${t('playCadenceTooltip') || 'Play cadence'}">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="5,3 19,12 5,21"></polygon>
                        </svg>
                        ${t('playCadenceBtn') || 'Play'}
                    </button>
                </div>
                <div class="small cadence-progression" style="margin-bottom: 4px;">
                    <strong>${t('romanNumerals')}:</strong> 
                    <span style="word-break: break-all;">${c.rn}</span>
                </div>
                <div class="small cadence-progression">
                    <strong>${t('example')}:</strong> 
                    <span style="word-break: break-all;">${c.example}</span>
                </div>
            `;

            // Add event listener for cadence play button
            const playCadenceBtn = div.querySelector('.play-cadence-btn');
            if (playCadenceBtn && c.rnArray) {
                playCadenceBtn.addEventListener('click', () => {
                    const originalText = playCadenceBtn.innerHTML;
                    const playingText = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5,3 19,12 5,21"></polygon>
                    </svg>
                    ${t('playCadencePlaying') || 'Playing...'}`;

                    playCadenceBtn.innerHTML = playingText;
                    playCadenceBtn.disabled = true;
                    playCadenceBtn.style.opacity = '0.7';

                    // Play the cadence
                    playCadence(scale, c.rnArray, c.name);

                    // Calculate total duration: (number of chords * chord duration) + gaps + buffer
                    const totalDuration = (c.rnArray.length * 2.1 + 0.5) * 1000;

                    setTimeout(() => {
                        playCadenceBtn.innerHTML = originalText;
                        playCadenceBtn.disabled = false;
                        playCadenceBtn.style.opacity = '1';
                    }, totalDuration);

                    console.log(`Playing cadence: ${c.name} - ${c.rn}`);
                });
            }

            cadencesBox.appendChild(div);
        });
    }

    // Add event listeners for modulation play buttons
    if (related) {
        const modulationBtns = related.querySelectorAll('.play-modulation-btn');
        modulationBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // If already playing, stop it
                if (btn.disabled) {
                    stopCurrentPlayback();
                    if (btn.buttonTimeout) {
                        clearTimeout(btn.buttonTimeout);
                        btn.buttonTimeout = null;
                    }
                    // Restore button immediately
                    btn.innerHTML = btn.originalText || btn.innerHTML;
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    return;
                }

                const modulationType = btn.getAttribute('data-modulation-type');
                const modulationIndex = parseInt(btn.getAttribute('data-modulation-index'));
                const relatedKey = rels[modulationIndex];

                if (!relatedKey) return;

                const originalText = btn.innerHTML;
                btn.originalText = originalText; // Store for restoration
                const playingText = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
                ${t('stop') || 'Stop'}`;

                btn.innerHTML = playingText;
                btn.disabled = true;
                btn.style.opacity = '0.7';

                // Determine which chord sequence to play
                const chordSequence = modulationType === 'to' ? relatedKey.modulationExample : relatedKey.returnExample;
                const sequenceName = modulationType === 'to'
                    ? `${t('modulation')} to ${relatedKey.title}`
                    : `${t('returnText')} from ${relatedKey.title}`;

                if (chordSequence && chordSequence.length > 0) {
                    // Play modulation and get the exact duration
                    const totalDuration = playModulation(scale, chordSequence, sequenceName);

                    // Store timeout reference for potential cancellation
                    const buttonTimeout = setTimeout(() => {
                        btn.innerHTML = btn.originalText || originalText;
                        btn.disabled = false;
                        btn.style.opacity = '1';
                        btn.buttonTimeout = null;
                    }, totalDuration);

                    // Store timeout reference on button for potential cancellation
                    btn.buttonTimeout = buttonTimeout;

                    console.log(`Playing ${sequenceName}: ${chordSequence.join(' - ')}`);
                } else {
                    // Restore button immediately if no chord sequence
                    btn.innerHTML = btn.originalText || originalText;
                    btn.disabled = false;
                    btn.style.opacity = '1';
                }
            });
        });
    }
}

// Use global language switching from common-i18n.js
window.applyLang = function (newLang) {
    LANG = newLang;
    window.DEFAULT_LANG = newLang;
    document.documentElement.lang = newLang;
    updateUITexts();

    // Update function legend with new language
    const functionLegend = document.getElementById('function-legend');
    if (functionLegend) {
        const translations = window.I18N && window.I18N[newLang] ? window.I18N[newLang] : window.I18N.en;
        functionLegend.innerHTML = [
            translations.functionT,
            translations.functionS,
            translations.functionD,
            translations.functionPD
        ].join(' · ');
    }
};

// Event listeners with safety checks
if (noteSelect) noteSelect.addEventListener('change', () => {
    saveHarmonyState();
    renderAll();
});
if (modeSel) modeSel.addEventListener('change', () => {
    saveHarmonyState();
    renderAll();
});

// Play scale button functionality
if (playScaleBtn) playScaleBtn.addEventListener('click', () => {
    const tonic = getCurrentTonic();
    const mode = modeSel.value;
    const scale = deriveScale(tonic, mode);

    // Audio feedback with Karplus-Strong synthesis
    const playBtnText = document.getElementById('playBtnText');
    const originalText = playBtnText.textContent;

    playBtnText.textContent = LANG === 'ru' ? 'Играет...' : 'Playing...';
    playScaleBtn.disabled = true;

    // Extract note names from scale
    const noteNames = scale.notes.map(n => n.note);

    // Play scale using our audio system
    HarmonyAudio.playScale(noteNames, tonic, 4, 0.4);

    // Calculate total duration: (notes + upper tonic) * 2 (for descending) * step interval + buffer
    const totalDuration = ((noteNames.length + 1) * 2 * 0.4 + 1) * 1000;

    setTimeout(() => {
        playBtnText.textContent = originalText;
        playScaleBtn.disabled = false;
    }, totalDuration);

    console.log(`Playing scale: ${noteNames.join(' - ')}`);
});

// Initialize with standard system
document.addEventListener('DOMContentLoaded', () => {
    // Wait for common systems to load
    const checkSystems = () => {
        if (window.I18N && window.DEFAULT_LANG !== undefined) {
            LANG = window.DEFAULT_LANG;
            initControls();
            updateUITexts();
            renderAll();
        } else {
            setTimeout(checkSystems, 10);
        }
    };
    checkSystems();
});