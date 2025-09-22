(function () {
    /* eslint-disable no-unused-vars */
    (function () {
        // Basic DOM helpers
        function byId(id) { return document.getElementById(id); }
        function el(tag, attrs = {}) {
            const svgTags = new Set(['svg', 'g', 'line', 'circle', 'text', 'rect', 'path', 'ellipse']);
            const n = svgTags.has(tag) ? document.createElementNS('http://www.w3.org/2000/svg', tag) : document.createElement(tag);
            for (const [k, v] of Object.entries(attrs)) {
                if (k === 'class') n.setAttribute('class', v); else n.setAttribute(k, v);
            }
            return n;
        }
        function opt(label, value) { const o = document.createElement('option'); o.textContent = label; o.value = value; return o; }

        // i18n wrapper (reuses common-i18n if present)
        let LANG = window.DEFAULT_LANG || 'en';
        function t(k, ...args) {
            const dict = (window.I18N && window.I18N[LANG]) ? window.I18N[LANG] : (window.I18N || {})[LANG] || {};
            const v = dict && dict[k];
            if (typeof v === 'function') return v(...args);
            return (v !== undefined) ? v : k;
        }

        // Live UI text updater used by common-i18n.js when language changes
        function updateUITexts() {
            try {
                if (document.title) document.title = t('title') || document.title;
                const h = byId('title'); if (h) h.textContent = t('title') || h.textContent;
                const sub = byId('subtitle'); if (sub) sub.textContent = t('subtitle') || sub.textContent;
                const langLab = byId('languageLabel'); if (langLab) langLab.textContent = t('language') || t('lang') || langLab.textContent;
                const sec1 = byId('sec1'); if (sec1) sec1.textContent = t('chooseChord') || sec1.textContent;
                const sec2 = byId('sec2'); if (sec2) sec2.textContent = t('chordInfo') || sec2.textContent;
                const labExt = byId('labExt'); if (labExt) labExt.textContent = t('extensions') || labExt.textContent;
                const rootLab = byId('rootLabel'); if (rootLab) rootLab.textContent = t('rootLabel') || t('root') || rootLab.textContent;
                const qualLab = byId('qualityLabel'); if (qualLab) qualLab.textContent = t('qualityLabel') || t('quality') || qualLab.textContent;
                const bassLab = byId('bassLabel'); if (bassLab) bassLab.textContent = t('bassLabel') || t('bass') || bassLab.textContent;
                // localize top tab labels if present
                try {
                    const tabCh = byId('tab-chords'); if (tabCh) tabCh.textContent = t('tabChords') || tabCh.textContent || 'Fingerings';
                    const tabSc = byId('tab-scales'); if (tabSc) tabSc.textContent = t('tabScales') || tabSc.textContent || 'Scales';
                    const tabAr = byId('tab-arpeggios'); if (tabAr) tabAr.textContent = t('tabArpeggios') || tabAr.textContent || 'Arpeggios';
                    const foot = byId('footer'); if (foot) foot.innerHTML = t('footer') || foot.innerHTML;
                } catch (e) { }
            } catch (e) { console.error('updateUITexts error', e); }

            // If panels / form functions are available, rebuild to apply localized labels inside them
            try {
                if (typeof populateTopChordForm === 'function') populateTopChordForm();
                if (typeof buildChordsPanel === 'function') buildChordsPanel();
                if (typeof buildScalesPanel === 'function') buildScalesPanel();
                if (typeof buildArpeggiosPanel === 'function') buildArpeggiosPanel();
                if (typeof window.generate === 'function') window.generate();
            } catch (e) { /* ignore rebuild errors */ }
        }

        // Expose applyLang used by common-i18n.js; keep backward-compatible update hook
        window.applyLang = function (lang) { LANG = lang || LANG; updateUITexts(); };

        // Shared music helpers
        const NOTE_NAMES_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const LETTER_TO_NAT = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
        const mod12 = x => ((x % 12) + 12) % 12;
        const PC_NAMES = {
            0: ['C', 'B#', 'Dbb'], 1: ['C#', 'Db', 'B##'], 2: ['D', 'C##', 'Ebb'], 3: ['D#', 'Eb', 'Fbb'], 4: ['E', 'Fb', 'D##'],
            5: ['F', 'E#', 'Gbb'], 6: ['F#', 'Gb', 'E##'], 7: ['G', 'F##', 'Abb'], 8: ['G#', 'Ab'], 9: ['A', 'G##', 'Bbb'], 10: ['A#', 'Bb', 'Cbb'], 11: ['B', 'Cb', 'A##']
        };

        function noteToIndex(name) {
            const m = String(name).trim().match(/^([A-G])([#b]{0,2})?$/);
            if (!m) return 0;
            const nat = LETTER_TO_NAT[m[1]];
            const acc = m[2] || '';
            const delta = (acc.match(/#/g) || []).length - (acc.match(/b/g) || []).length;
            return mod12(nat + delta);
        }

        function nameForPC(pc, pref = 'sharp') {
            const list = PC_NAMES[pc] || [];
            const categorize = n => { const hashes = (n.match(/#/g) || []).length; const flats = (n.match(/b/g) || []).length; return { n, hashes, flats }; };
            const cats = list.map(categorize);
            const natural = cats.find(c => c.hashes === 0 && c.flats === 0);
            const singleSharp = cats.find(c => c.hashes === 1 && c.flats === 0);
            const singleFlat = cats.find(c => c.flats === 1 && c.hashes === 0);
            if (natural) return natural.n;
            if (pref === 'flat') return (singleFlat && singleFlat.n) || (singleSharp && singleSharp.n) || list[0] || 'C';
            return (singleSharp && singleSharp.n) || (singleFlat && singleFlat.n) || list[0] || 'C';
        }

        function diffWithin2(target, nat) { let d = mod12(target - nat); if (d > 6) d -= 12; while (d > 2) d -= 12; while (d < -2) d += 12; return d; }

        function spellScale(rootName, intervals, degreesStr, strictDiatonic) {
            const rootIdx = noteToIndex(rootName);
            const names = []; const mapRel = {};
            if (!strictDiatonic) {
                const pref = (degreesStr || '').includes('♭') ? 'flat' : (degreesStr || '').includes('#') ? 'sharp' : (rootName.includes('b') ? 'flat' : rootName.includes('#') ? 'sharp' : 'sharp');
                intervals.forEach(iv => { const pc = mod12(rootIdx + iv); const nm = nameForPC(pc, pref); names.push(nm); mapRel[mod12(iv)] = nm; });
                return { notes: names, relMap: mapRel };
            }
            let letterIdx = LETTERS.indexOf(rootName[0]);
            intervals.forEach((iv, k) => { if (k > 0) letterIdx = (letterIdx + 1) % 7; const L = LETTERS[letterIdx]; const target = mod12(rootIdx + iv); const nat = LETTER_TO_NAT[L]; const acc = diffWithin2(target, nat); const accStr = acc === 0 ? '' : acc > 0 ? '#'.repeat(acc) : 'b'.repeat(-acc); const nm = L + accStr; names.push(nm); mapRel[mod12(iv)] = nm; });
            return { notes: names, relMap: mapRel };
        }

        // Use scales from common-data.js
        const SCALES = window.COMMON_SCALES || {};

        // Audio: Karplus-Strong pluck
        const Audio = (() => {
            const ac = new (window.AudioContext || window.webkitAudioContext)();
            let masterGain = null;
            function ensureMasterGain() { if (!masterGain) { masterGain = ac.createGain(); masterGain.gain.value = 0.9; masterGain.connect(ac.destination); } }
            function freqFromMidi(m) { return 440 * Math.pow(2, (m - 69) / 12); }
            function pitchClass(spelled) { const m = spelled.match(/^([A-G])([#b]{0,2})?$/); if (!m) return 0; const nat = LETTER_TO_NAT[m[1]]; const acc = m[2] || ''; const delta = (acc.match(/#/g) || []).length - (acc.match(/b/g) || []).length; return mod12(nat + delta); }
            function midiFromSpelled(name, octave = 4) { return pitchClass(name) + 12 * (octave + 1); }
            function pluck(freq, dur = 0.8, when = 0, gain = 0.72) { try { if (ac.state === 'suspended') ac.resume(); } catch (e) { } ensureMasterGain(); const sampleRate = ac.sampleRate; const len = Math.max(1, Math.floor(dur * sampleRate)); const N = Math.max(2, Math.floor(sampleRate / freq)); const buffer = ac.createBuffer(1, len, sampleRate); const data = buffer.getChannelData(0); for (let i = 0; i < N; i++) data[i] = (Math.random() * 2 - 1) * 0.5; for (let i = N; i < len; i++) data[i] = 0.5 * (data[i - N] + (i - N - 1 >= 0 ? data[i - N - 1] : 0)) * 0.995; const src = ac.createBufferSource(); src.buffer = buffer; const g = ac.createGain(); const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = Math.max(1000, freq * 6); const sustainGain = ac.createGain(); const sustainFilt = ac.createBiquadFilter(); sustainFilt.type = 'lowpass'; sustainFilt.frequency.value = Math.max(600, freq * 4); const t0 = ac.currentTime + when; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain), t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); const susLevel = Math.max(0.02, gain * 0.4); sustainGain.gain.setValueAtTime(0.0001, t0); sustainGain.gain.exponentialRampToValueAtTime(susLevel, t0 + 0.02); sustainGain.gain.exponentialRampToValueAtTime(0.0001, t0 + Math.max(dur, 3.0)); src.connect(lp); lp.connect(g); g.connect(masterGain); src.connect(sustainFilt); sustainFilt.connect(sustainGain); sustainGain.connect(masterGain); src.start(t0); src.stop(t0 + Math.max(dur, 3.2)); src.onended = () => { try { src.disconnect(); lp.disconnect(); g.disconnect(); sustainFilt.disconnect(); sustainGain.disconnect(); } catch (e) { } } }
            function playFreq(f, dur = 0.8, when = 0) { try { if (ac.state === 'suspended') ac.resume(); } catch (e) { } ensureMasterGain(); pluck(f, dur, when, 0.76); }
            function playNoteName(name, octave = 4, dur = 0.8, when = 0) { playFreq(freqFromMidi(midiFromSpelled(name, octave)), dur, when); }
            function playScale(noteNames, baseOct = 4, step = 0.5) {
                console.log('Playing scale with notes:', noteNames);

                // Создаем правильную последовательность с октавами
                const ascending = [];
                let currentOct = baseOct;

                // Добавляем ноты восходящей гаммы
                for (let i = 0; i < noteNames.length; i++) {
                    const noteName = noteNames[i];

                    // Если это не первая нота и текущая нота "меньше" предыдущей по высоте, увеличиваем октаву
                    if (i > 0) {
                        const prevNoteIndex = noteToIndex(noteNames[i - 1]);
                        const currNoteIndex = noteToIndex(noteName);
                        if (currNoteIndex < prevNoteIndex) {
                            currentOct++;
                        }
                    }

                    ascending.push(noteName + currentOct);
                }

                // Добавляем верхнюю тонику - определяем правильную октаву
                const tonicIndex = noteToIndex(noteNames[0]);
                const lastNoteOctave = currentOct;
                const lastNoteIndex = noteToIndex(noteNames[noteNames.length - 1]);

                let upperTonicOct;
                if (tonicIndex <= lastNoteIndex) {
                    // Если тоника <= последней ноты, верхняя тоника в следующей октаве
                    upperTonicOct = lastNoteOctave + 1;
                } else {
                    // Если тоника > последней ноты, верхняя тоника в той же октаве что последняя нота
                    upperTonicOct = lastNoteOctave;
                }

                const upperTonic = noteNames[0] + upperTonicOct;
                ascending.push(upperTonic);

                // Нисходящая - просто обратный порядок восходящей
                const descending = [...ascending].reverse();
                const fullSequence = [...ascending, ...descending.slice(1)]; // убираем дублирование верхней ноты

                console.log('Ascending:', ascending);
                console.log('Descending:', descending);
                console.log('Full sequence:', fullSequence);

                const noteDur = 0.6;

                // Проигрываем все ноты (уже с октавами в названии)
                fullSequence.forEach((noteWithOctave, i) => {
                    const match = noteWithOctave.match(/^([A-G][#b]?)(\d+)$/);
                    if (match) {
                        const [, noteName, octaveStr] = match;
                        const octave = parseInt(octaveStr);
                        const freq = freqFromMidi(midiFromSpelled(noteName, octave));
                        console.log(`${i + 1}. ${noteWithOctave} (${freq.toFixed(1)} Hz) at ${(i * step).toFixed(1)}s`);
                        playFreq(freq, noteDur, i * step);
                    }
                });
            }
            return { playNoteName, playScale, playFreq, freqFromMidi: freqFromMidi, ac };
        })();

        // Fretboard rendering (adapted)
        function renderFretboard(mount, tuningName, scaleRoot, scaleIntervals, tonicName, labelMode = 'notes', degreeMap = null, parentKey = null) {
            const config = { FRETS: 12, STR: 6, H: 240, PADDING_L: 80, CELL_W: 60, PADDING_R: 28, PADDING_T: 24, PADDING_B: 34, get W() { return this.PADDING_L + (this.FRETS + 1) * this.CELL_W + this.PADDING_R } };
            const svg = el('svg', { class: 'fretboard', width: config.W, height: config.H + config.PADDING_T + config.PADDING_B }); mount.innerHTML = ''; mount.appendChild(svg);
            // build relSpell
            const relSpell = spellScale(scaleRoot, scaleIntervals, '', scaleIntervals.length === 7).relMap;
            const rootIdx = noteToIndex(scaleRoot);
            // fret lines
            const y0 = config.PADDING_T, y1 = config.PADDING_T + config.H;
            const nut = el('rect', { x: config.PADDING_L + config.CELL_W - 3, y: y0, width: 6, height: config.H, fill: 'var(--nut)', rx: 2 }); svg.appendChild(nut);
            for (let i = 1; i <= config.FRETS; i++) { const x = config.PADDING_L + i * config.CELL_W; svg.appendChild(el('line', { x1: x, y1: y0, x2: x, y2: y1, stroke: 'var(--fret)', 'stroke-width': 1 })); }
            for (let f = 0; f <= config.FRETS; f++) { const x = config.PADDING_L + (f + 0.5) * config.CELL_W; const t = el('text', { x, y: y1 + 16, class: 'fret-num' }); t.textContent = f; svg.appendChild(t); }
            // strings
            for (let s = 0; s < config.STR; s++) { const y = y0 + (s + 0.5) * (config.H / config.STR); const startX = config.PADDING_L + (config.CELL_W * 0.5 - 12); svg.appendChild(el('line', { x1: startX, y1: y, x2: config.W - config.PADDING_R, y2: y, stroke: 'var(--string)', 'stroke-width': 2 })); }
            // open labels from COMMON_TUNINGS if available. common-data stores strings low->high, reverse to top-first
            let tuning = null;
            try {
                const def = (window.COMMON_TUNINGS && window.COMMON_TUNINGS[tuningName]) ? window.COMMON_TUNINGS[tuningName] : null;
                if (def && Array.isArray(def.strings)) tuning = def.strings.slice().reverse();
                else if (window.TUNINGS && window.TUNINGS[tuningName]) tuning = window.TUNINGS[tuningName];
            } catch (e) { tuning = null; }
            // normalize to top-first array of length STR
            if (!Array.isArray(tuning)) tuning = [];
            // if tuning entries are objects with name/oct or strings, normalize to {name,oct}
            tuning = tuning.map(s => { if (!s) return null; if (typeof s === 'string') return { name: s, oct: 3 }; if (s.name) return s; return null; }).filter(Boolean);
            if (tuning.length > config.STR) tuning = tuning.slice(0, config.STR);
            while (tuning.length < config.STR) tuning.push({ name: 'E', oct: 3 });
            tuning.forEach((st, i) => { const y = y0 + (i + 0.5) * (config.H / config.STR); const t = el('text', { x: config.PADDING_L - 10, y, class: 'open-label' }); t.textContent = `${st.name}${st.oct}`; svg.appendChild(t); });

            // debug: log resolved tuning and relSpell keys to help diagnose missing notes
            try { console.debug('[renderFretboard] tuningName=', tuningName, 'tuning=', tuning.map(s => s.name + s.oct), 'scaleRoot=', scaleRoot, 'intervals=', scaleIntervals); } catch (e) { }
            // note dots
            for (let s = 0; s < config.STR; s++) {
                const st = tuning[s]; const baseIdx = noteToIndex(st.name); for (let f = 0; f <= config.FRETS; f++) {
                    const noteIdx = mod12(baseIdx + f); const rel = mod12(noteIdx - rootIdx); if (relSpell[rel] === undefined) continue; const labelName = relSpell[rel]; const isTonic = rel === 0; // label selection: intervals -> intervalName(rel), degrees -> degreeMap[rel] if present, else note name
                    const labelText = (labelMode === 'intervals') ? intervalName(rel) : ((labelMode === 'degrees' && degreeMap && degreeMap[rel]) ? degreeMap[rel] : labelName);
                    const cx = config.PADDING_L + (f + 0.5) * config.CELL_W; const cy = y0 + (s + 0.5) * (config.H / config.STR); const g = el('g', { class: 'note-dot', 'data-name': labelName, 'data-oct': st.oct + Math.floor((baseIdx + f) / 12), 'data-fret': f }); const circle = el('circle', { cx, cy, r: 12, fill: isTonic ? 'var(--tonic)' : 'var(--note)', opacity: isTonic ? 1 : 0.95 }); if (f === 0) { circle.setAttribute('stroke', '#111827'); circle.setAttribute('stroke-width', '2'); circle.setAttribute('fill', 'var(--open-note-bg)'); } const label = el('text', { x: cx, y: cy, class: f === 0 ? 'note-label-open' : 'note-label' }); label.textContent = labelText; if (f === 0) label.setAttribute('stroke', 'none'); g.appendChild(circle); g.appendChild(label); svg.appendChild(g); g.addEventListener('click', () => { const oct = +g.getAttribute('data-oct'); Audio.playNoteName(labelName, oct); });
                }
            }
        }

        // Interval name helper (small map used in chord diagrams)
        function intervalName(semi) {
            const n = ((semi % 12) + 12) % 12;
            switch (n) {
                case 0: return 'R'; case 1: return 'b2'; case 2: return '2'; case 3: return 'b3'; case 4: return '3'; case 5: return '4';
                case 6: return 'b5'; case 7: return '5'; case 8: return '#5'; case 9: return '6'; case 10: return 'b7'; case 11: return 'maj7';
                default: return String(n);
            }
        }

        // Chord diagram renderer (adapted from chords.js). Returns an SVG element.
        function renderDiagram(voicing, rootPc, tuningPcs, labelMode) {
            const width = 180, height = 220, strings = 6, fretsVisible = 5, margin = 35;
            const innerW = width - margin * 2, innerH = height - margin * 2;
            const dx = innerW / (strings - 1), dy = innerH / (fretsVisible - 1);

            // find fretted notes (excluding open strings) to determine position
            const frettedNotes = voicing.frets.filter(f => typeof f === 'number' && f > 0);

            let start;
            if (frettedNotes.length === 0) {
                // no fretted notes, show from nut
                start = 0;
            } else {
                const minFretted = Math.min(...frettedNotes);
                const maxFretted = Math.max(...frettedNotes);

                // always try to show all fretted notes
                if (maxFretted - minFretted < fretsVisible) {
                    // all notes fit in one view
                    if (minFretted <= 3 && maxFretted <= fretsVisible - 1) {
                        start = 0; // show nut only if all notes are in first 4 frets
                    } else {
                        start = Math.max(1, minFretted - 1); // start one fret before first note
                    }
                } else {
                    // notes span more than visible frets, center on the range
                    start = Math.max(1, minFretted - 1);
                }
            }
            const end = Math.min(start + fretsVisible - 1, 12);


            const stringX = s => margin + s * dx, fretY = f => {
                const baseY = margin + (f - start) * dy;
                // don't offset open strings (fret 0), keep them on the nut
                // for fretted notes, move back by half to center them in the fret space
                return f === 0 ? baseY : baseY - dy / 2;
            };
            const svgNS = 'http://www.w3.org/2000/svg';
            const svg = document.createElementNS(svgNS, 'svg');
            svg.setAttribute('width', width);
            svg.setAttribute('height', height);
            svg.style.background = 'transparent';
            svg.style.borderRadius = '12px';
            svg.style.boxShadow = '0 1px 2px rgba(0,0,0,.04)';
            // horizontal fret lines
            for (let k = 0; k < fretsVisible; k++) {
                const line = document.createElementNS(svgNS, 'line');
                line.setAttribute('x1', margin); line.setAttribute('x2', width - margin);
                line.setAttribute('y1', margin + k * dy); line.setAttribute('y2', margin + k * dy);
                line.setAttribute('stroke', 'var(--fret)'); svg.appendChild(line);
            }
            if (start === 0) {
                const nut = document.createElementNS(svgNS, 'rect');
                nut.setAttribute('x', margin - 3); nut.setAttribute('y', margin - 3);
                nut.setAttribute('width', innerW + 6); nut.setAttribute('height', 6);
                nut.setAttribute('fill', 'var(--nut)'); svg.appendChild(nut);
            }
            // strings
            for (let s = 0; s < strings; s++) {
                const line = document.createElementNS(svgNS, 'line');
                const x = stringX(s);
                line.setAttribute('x1', x); line.setAttribute('x2', x);
                line.setAttribute('y1', margin); line.setAttribute('y2', height - margin);
                line.setAttribute('stroke', 'var(--string)'); svg.appendChild(line);
            }

            // fret numbers on the left
            for (let k = 1; k < fretsVisible; k++) {
                const fretNum = start + k;
                if (fretNum > 12) break; // don't show numbers beyond 12th fret

                const text = document.createElementNS(svgNS, 'text');
                text.setAttribute('x', margin - 20);
                text.setAttribute('y', margin + k * dy - dy / 2 + 4); // center between frets
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('font-size', '10');
                text.setAttribute('fill', 'var(--muted)');
                text.textContent = fretNum;
                svg.appendChild(text);
            }
            // top markers (X / note names/intervals for open strings)
            voicing.frets.forEach((f, i) => {
                const centerY = margin - 12; // common center level for all symbols
                const text = document.createElementNS(svgNS, 'text');
                text.setAttribute('x', stringX(i));
                text.setAttribute('text-anchor', 'middle'); text.setAttribute('font-size', '12');
                text.setAttribute('fill', 'var(--muted)');

                if (f === 'X') {
                    text.setAttribute('y', centerY + 4); // raise × symbol slightly
                    text.textContent = '×';
                } else if (f === 0) {
                    if (start === 0) {
                        // don't show anything above open strings when nut is visible - 
                        // the open string circles on the diagram are sufficient
                        text.textContent = '';
                    } else {
                        // show note/interval name for open string when nut is not visible
                        // create a styled circle like the fretted notes
                        const pc = tuningPcs[i]; // pitch class of open string
                        const isRoot = pc === rootPc;

                        // create a group for circle + text
                        const g = document.createElementNS(svgNS, 'g');

                        // background circle
                        const circle = document.createElementNS(svgNS, 'circle');
                        circle.setAttribute('cx', stringX(i));
                        circle.setAttribute('cy', centerY); // same center level as × symbols
                        circle.setAttribute('r', 9);
                        circle.setAttribute('fill', isRoot ? 'var(--note)' : 'var(--nut)');
                        g.appendChild(circle);

                        // text label
                        const noteText = document.createElementNS(svgNS, 'text');
                        noteText.setAttribute('x', stringX(i));
                        noteText.setAttribute('y', centerY + 4); // +4 for vertical centering
                        noteText.setAttribute('text-anchor', 'middle');
                        noteText.setAttribute('font-size', '10');
                        noteText.setAttribute('fill', '#fff');
                        const label = (labelMode === 'notes') ? nameForPC(pc) : intervalName((pc - rootPc + 12) % 12);
                        noteText.textContent = label;
                        g.appendChild(noteText);

                        svg.appendChild(g);

                        // clear the original text element
                        text.textContent = '';
                    }
                } else {
                    text.textContent = '';
                }
                svg.appendChild(text);
            });
            // note circles and labels
            for (let i = 0; i < voicing.frets.length; i++) {
                const f = voicing.frets[i];

                if (f === 'X') continue;

                // skip drawing circles for open strings when nut is not visible (start > 0)
                if (f === 0 && start > 0) continue;

                // skip notes outside the visible range
                if (typeof f === 'number' && (f < start || f > end)) {
                    continue;
                }
                const x = stringX(i), y = fretY(f);
                const pc = (tuningPcs[i] + f) % 12; const isRoot = pc === rootPc;
                const g = document.createElementNS(svgNS, 'g');
                const c = document.createElementNS(svgNS, 'circle'); c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 9);
                c.setAttribute('fill', isRoot ? 'var(--note)' : 'var(--nut)'); g.appendChild(c);
                const t = document.createElementNS(svgNS, 'text'); t.setAttribute('x', x); t.setAttribute('y', y + 4);
                t.setAttribute('text-anchor', 'middle'); t.setAttribute('font-size', '10'); t.setAttribute('fill', '#fff');
                const label = (labelMode === 'notes') ? nameForPC(pc) : intervalName((pc - rootPc + 12) % 12);
                t.textContent = label; g.appendChild(t);
                svg.appendChild(g);
            }
            return svg;
        }

        // Minimal generator port (adapted from chords.js)
        // We'll use COMMON_QUALITIES and COMMON_TUNINGS when available; else fallback simple values
        const QUALITIES = window.COMMON_QUALITIES || {};

        // Extension -> semitone offset mapping (kept in top-level so other code can reference)
        const EXT_MAP = {
            'maj7': 11,
            '7': 10,
            '6': 9,
            '9': 14,
            'add9': 14,
            '#11': 18,
            '11': 17,
            '13': 21,
            'b9': 13,
            '#9': 15,
            'b13': 20,
            'sus4': 5,
            'sus2': 2,
            'b5': 6,
            '#5': 8
        };

        function buildChordIntervals(rootName, qualityKey, extensions) {
            const q = QUALITIES[qualityKey] || { intervals: [0, 4, 7] };
            let baseIntervals = q.intervals || q.offsets || [];
            let ints = baseIntervals.slice();

            // Обрабатываем расширения с новой логикой
            (extensions || []).forEach(extId => {
                // Ищем расширение в новом формате
                const ext = (window.COMMON_EXTENSIONS || []).find(e => e.id === extId);

                if (ext) {
                    if (ext.replaceBase && ext.intervals) {
                        // Если это расширение заменяет базовый аккорд (например, maj7)
                        ints = ext.intervals.slice();
                    } else if (ext.offsets && ext.offsets.length > 0) {
                        // Множественные тоны (для сложных расширений)
                        ext.offsets.forEach(offset => ints.push(offset));
                    } else if (ext.offset !== undefined) {
                        // Одиночный тон
                        ints.push(ext.offset);
                    }
                } else if (EXT_MAP[extId] !== undefined) {
                    // Фоллбэк на старую карту расширений
                    ints.push(EXT_MAP[extId]);
                }
            });

            const uniq = [...new Map(ints.map(v => [mod12(v), v])).values()].sort((a, b) => a - b);
            return uniq.map(v => mod12(v));
        }

        // essential pitch-classes for a chord (updated for new structure)
        function essentialPcs(rootPc, qualityId, selectedExts, allowOmitRoot, allowOmitFifth) {
            const essentials = new Set();
            if (!allowOmitRoot) essentials.add(rootPc);

            // Получаем качество аккорда
            const quality = QUALITIES[qualityId];
            if (quality && quality.intervals) {
                // Добавляем все интервалы качества как обязательные (кроме корня и квинты, которые обрабатываются отдельно)
                quality.intervals.forEach(interval => {
                    if (interval === 0 && allowOmitRoot) return; // пропускаем корень если разрешено
                    if ((interval === 7 || interval === 6 || interval === 8) && allowOmitFifth) return; // пропускаем квинту если разрешено
                    essentials.add((rootPc + interval) % 12);
                });
            } else {
                // Фоллбэк для старой логики
                if (qualityId === 'maj') essentials.add((rootPc + 4) % 12);
                if (qualityId === 'min') essentials.add((rootPc + 3) % 12);
                if (qualityId === 'sus2') essentials.add((rootPc + 2) % 12);
                if (qualityId === 'sus4') essentials.add((rootPc + 5) % 12);
                if (qualityId === 'dim') essentials.add((rootPc + 3) % 12);
                if (qualityId === 'aug') essentials.add((rootPc + 4) % 12);

                // Квинта для фоллбэка
                if (!allowOmitFifth) {
                    let fifth = (rootPc + 7) % 12; // обычная квинта
                    if (qualityId === 'dim') fifth = (rootPc + 6) % 12; // уменьшенная квинта
                    if (qualityId === 'aug') fifth = (rootPc + 8) % 12; // увеличенная квинта
                    essentials.add(fifth);
                }
            }

            // Обрабатываем расширения (теперь только простые добавления)
            (selectedExts || []).forEach(extId => {
                // Старая логика для совместимости
                if (extId === '7') essentials.add((rootPc + 10) % 12);
                if (extId === 'maj7') essentials.add((rootPc + 11) % 12);
            });

            return essentials;
        }

        // Full generator ported from chords.js
        // playVoicing: Karplus–Strong plucked-string playback (reused from chords.js logic)
        function midiToFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }
        function getVoicingMIDIs(voicing, tuningMidi) { const arr = []; for (let i = 0; i < 6; i++) { const f = voicing.frets[i]; if (typeof f === 'number') { arr.push(tuningMidi[i] + f); } else { arr.push(null); } } return arr; }
        function playVoicing(tuning, voicing) {
            const ctx = Audio.ac || (Audio && Audio.ac) || (new (window.AudioContext || window.webkitAudioContext)());
            try { if (ctx.state === 'suspended') ctx.resume(); } catch (e) { }
            const tuningMidi = tuning.midi || (tuning.midi = (tuning.strings || []).map(s => (s.oct ? (noteToIndex(s.name) + 12 * (s.oct + 1)) : 40)));
            const midis = getVoicingMIDIs(voicing, tuningMidi).filter(m => m !== null).sort((a, b) => a - b);
            const now = (Audio.ac && Audio.ac.currentTime) || (ctx.currentTime || 0);
            const arpStep = 0.22, arpDur = 0.6, chordGap = 0.28, chordDur = 1.0;
            function pluckBuffer(freq, dur, when = 0, gain = 0.72) {
                const sampleRate = ctx.sampleRate;
                const len = Math.max(1, Math.floor(dur * sampleRate));
                const N = Math.max(2, Math.floor(sampleRate / freq));
                const buffer = ctx.createBuffer(1, len, sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < N; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
                for (let i = N; i < len; i++) data[i] = 0.5 * (data[i - N] + (i - N - 1 >= 0 ? data[i - N - 1] : data[i - N])) * 0.995;
                const src = ctx.createBufferSource(); src.buffer = buffer;
                const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, now + when); g.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain), now + when + 0.01);
                g.gain.exponentialRampToValueAtTime(0.0001, now + when + dur);
                const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = Math.max(1200, freq * 6);
                const sustainGain = ctx.createGain(); const sustainFilt = ctx.createBiquadFilter(); sustainFilt.type = 'lowpass'; sustainFilt.frequency.value = Math.max(600, freq * 4);
                const susLevel = Math.max(0.02, gain * 0.4);
                sustainGain.gain.setValueAtTime(0.0001, now + when); sustainGain.gain.exponentialRampToValueAtTime(susLevel, now + when + 0.02);
                sustainGain.gain.exponentialRampToValueAtTime(0.0001, now + when + Math.max(dur, 3.0));
                src.connect(lp); lp.connect(g); g.connect((Audio && Audio.ac && Audio.ac.destination) || ctx.destination);
                src.connect(sustainFilt); sustainFilt.connect(sustainGain); sustainGain.connect((Audio && Audio.ac && Audio.ac.destination) || ctx.destination);
                src.start(now + when); src.stop(now + when + Math.max(dur, 3.2));
                src.onended = () => { try { src.disconnect(); lp.disconnect(); g.disconnect(); sustainFilt.disconnect(); sustainGain.disconnect(); } catch (e) { } };
            }
            midis.forEach((m, idx) => { const f = midiToFreq(m); pluckBuffer(f, arpDur, idx * arpStep, 0.72); });
            const lastArpEnd = now + (midis.length - 1) * arpStep + arpDur; const chordTime = lastArpEnd + chordGap;
            const chordTimeRel = chordTime - now;
            midis.forEach((m, idx) => { const f = midiToFreq(m); pluckBuffer(f, chordDur, chordTimeRel + idx * 0.02, 0.76); });
        }

        // Ported generator and helpers from chords.js
        function fingerCount(frets) { let count = 0; for (let i = 0; i < frets.length; i++) { const f = frets[i]; if (typeof f === 'number' && f > 0) { const prev = frets[i - 1]; if (!(i > 0 && typeof prev === 'number' && prev === f)) count++; } } return count; }

        function assignFingeringStrict(frets) {
            const n = 6; const fingers = new Array(n).fill(''); const notes = [];
            for (let s = 0; s < n; s++) { const f = frets[s]; if (typeof f === 'number' && f > 0) notes.push({ s, f }); }
            if (notes.length === 0) return { fingers, ok: true };
            notes.sort((a, b) => a.f === b.f ? a.s - b.s : a.f - b.f);
            const minF = notes[0].f; const atMin = new Array(n).fill(false);
            for (const { s, f } of notes) if (f === minF) atMin[s] = true;
            const barreRuns = []; let idx = 0;
            while (idx < n) { if (!atMin[idx]) { idx++; continue; } let j = idx + 1; while (j < n && atMin[j]) j++; const len = j - idx; if (len >= 2) barreRuns.push({ start: idx, end: j - 1, fret: minF }); idx = j; }
            const available = ['1', '2', '3', '4'];
            for (const run of barreRuns) { if (available.length === 0) return { fingers: null, ok: false }; const fn = available.shift(); for (let s = run.start; s <= run.end; s++) fingers[s] = fn; }
            for (const { s, f } of notes) { if (fingers[s] !== '') continue; if (available.length === 0) return { fingers: null, ok: false }; const fn = available.shift(); fingers[s] = fn; }
            const posByFinger = {};
            for (let s = 0; s < n; s++) { const fn = fingers[s]; const f = frets[s]; if (fn && typeof f === 'number' && f > 0) { if (!posByFinger[fn]) posByFinger[fn] = { minF: f, minS: s, maxF: f, maxS: s }; else { posByFinger[fn].minF = Math.min(posByFinger[fn].minF, f); posByFinger[fn].maxF = Math.max(posByFinger[fn].maxF, f); posByFinger[fn].minS = Math.min(posByFinger[fn].minS, s); posByFinger[fn].maxS = Math.max(posByFinger[fn].maxS, s); } } }
            function checkPair(a, b, baseMax) { const pa = posByFinger[a], pb = posByFinger[b]; if (!pa || !pb) return true; const fa = pa.minF, fb = pb.minF; const d = Math.abs(fb - fa); const lowerOK = pb.minS < pa.minS; const allowed = baseMax - (lowerOK ? 0 : 1); return d <= allowed; }
            if (!checkPair('1', '2', 3)) return { fingers: null, ok: false };
            if (!checkPair('1', '3', 4)) return { fingers: null, ok: false };
            if (!checkPair('1', '4', 5)) return { fingers: null, ok: false };
            if (!checkPair('2', '3', 2)) return { fingers: null, ok: false };
            if (!checkPair('2', '4', 3)) return { fingers: null, ok: false };
            if (!checkPair('3', '4', 2)) return { fingers: null, ok: false };
            return { fingers, ok: true };
        }

        function enumerateFingerings(frets, maxAlternatives = 8) {
            const n = 6; const notes = []; for (let s = 0; s < n; s++) { const f = frets[s]; if (typeof f === 'number' && f > 0) notes.push({ s, f }); }
            if (notes.length === 0) return [['', '', '', '', '', '']];
            function findBarreRunsAllFrets() {
                const runs = []; const fretsSet = new Set(notes.map(n => n.f)); for (const fret of fretsSet) { const atF = new Array(n).fill(false); for (const { s, f } of notes) if (f === fret) atF[s] = true; let i = 0; while (i < n) { if (!atF[i]) { i++; continue; } let j = i + 1; while (j < n && atF[j]) j++; if (j - i >= 2) runs.push({ start: i, end: j - 1, fret }); i = j; } } runs.sort((a, b) => a.fret === b.fret ? a.start - b.start : a.fret - b.fret); return runs;
            }
            const runs = findBarreRunsAllFrets(); const results = [];
            function backtrack(assignments, usedRuns, usedFingers) {
                if (results.length >= maxAlternatives) return;
                const fingers = new Array(n).fill(''); for (const r of assignments) { const fn = r.fn; for (let s = r.start; s <= r.end; s++) fingers[s] = fn; }
                const remaining = notes.filter(({ s }) => fingers[s] === ''); const avail = ['1', '2', '3', '4'].filter(x => !usedFingers.has(x)); let ok = true; const local = fingers.slice(); let p = 0; for (const { s } of remaining) { if (p >= avail.length) { ok = false; break; } local[s] = avail[p++]; }
                if (ok) {
                    const posByFinger = {};
                    for (let s = 0; s < n; s++) { const fn = local[s]; const f = frets[s]; if (fn && typeof f === 'number' && f > 0) { if (!posByFinger[fn]) posByFinger[fn] = { minF: f, minS: s, maxF: f, maxS: s }; else { posByFinger[fn].minF = Math.min(posByFinger[fn].minF, f); posByFinger[fn].maxF = Math.max(posByFinger[fn].maxF, f); posByFinger[fn].minS = Math.min(posByFinger[fn].minS, s); posByFinger[fn].maxS = Math.max(posByFinger[fn].maxS, s); } } }
                    function checkPair(a, b, baseMax) { const pa = posByFinger[a], pb = posByFinger[b]; if (!pa || !pb) return true; const d = Math.abs(pb.minF - pa.minF); const lowerOK = pb.minS < pa.minS; const allowed = baseMax - (lowerOK ? 0 : 1); return d <= allowed; }
                    const okPairs = checkPair('1', '2', 3) && checkPair('1', '3', 4) && checkPair('1', '4', 5) && checkPair('2', '3', 2) && checkPair('2', '4', 3) && checkPair('3', '4', 2);
                    if (okPairs) results.push(local);
                }
                for (const r of runs) {
                    if (usedRuns.has(r)) continue; let overlap = false; for (const u of assignments) if (!(r.end < u.start || r.start > u.end)) { overlap = true; break; } if (overlap) continue;
                    const taken = new Set(assignments.map(a => a.fn)); const availF = ['1', '2', '3', '4'].find(x => !taken.has(x)); if (!availF) continue;
                    const newUsedRuns = new Set(Array.from(usedRuns)); newUsedRuns.add(r);
                    const newUsedF = new Set(Array.from(usedFingers)); newUsedF.add(availF);
                    backtrack(assignments.concat([{ start: r.start, end: r.end, fret: r.fret, fn: availF }]), newUsedRuns, newUsedF);
                    if (results.length >= maxAlternatives) return;
                }
            }
            backtrack([], new Set(), new Set()); return results;
        }

        function postProcessVoicing(frets, tuningPcs) {
            const played = frets.map((f, i) => ({ i, f })).filter(x => x.f !== 'X');
            const only = played.map(x => x.f);

            // calculate span only from fretted notes (excluding open strings)
            const frettedOnly = only.filter(f => f > 0);
            let span = 0;
            if (frettedOnly.length > 1) {
                const minF = Math.min(...frettedOnly);
                const maxF = Math.max(...frettedOnly);
                span = maxF - minF;
            }

            const minF = only.length > 0 ? Math.min(...only) : 0;
            const intervals = frets.map((f, i) => f === 'X' ? null : (tuningPcs[i] + f) % 12);
            const score = scoreVoicing(frets, span);
            return { frets, span, posStart: Math.max(1, minF), intervals, _score: score };
        }

        function scoreVoicing(frets, span) {
            const fingers = fingerCount(frets); let sc = fingers * 10 + span * 6; const hasOpen = frets.some(f => f === 0); if (!hasOpen) sc += 5; const muted = frets.filter(f => f === 'X').length; sc += muted * 4; for (let s = 0; s < frets.length - 1; s++) { const a = frets[s], b = frets[s + 1]; if (typeof a === 'number' && typeof b === 'number') { const d = Math.abs(a - b); if (d >= 3) sc += (d - 1) * 2; } }
            return sc;
        }

        // Main exhaustive voicing generator adapted
        function generateVoicings({ tuningPcs, chordPcs, essentialSet, maxSpan = 4, minStrings = 3, contiguous = true, allowOpens = true, maxResults = 500, bassPc = null, tuningMidi = null, requiredExtPcs = new Set() }) {
            const N = 6; const results = [];
            function buildValidByString() { return tuningPcs.map(basePc => { const arr = []; for (let f = 0; f <= 12; f++) { const pc = (basePc + f) % 12; if (chordPcs.has(pc) || (bassPc != null && pc === bassPc)) arr.push(f); } return arr; }); }
            const validByString = buildValidByString();
            function canRemainingCover(i, usedPcs) { const missing = [...essentialSet].filter(e => !usedPcs.has(e)); if (missing.length === 0) return true; const possible = new Set(); for (let s = i; s < N; s++) { for (const ff of validByString[s]) possible.add((tuningPcs[s] + ff) % 12); } for (const m of missing) if (!possible.has(m)) return false; return true; }
            function isContiguousPlayed(playedIdxs) { if (!contiguous) return true; if (playedIdxs.length === 0) return false; const s = [...playedIdxs].sort((a, b) => a - b); const set = new Set(s); for (let k = s[0]; k <= s[s.length - 1]; k++) if (!set.has(k)) return false; return true; }
            function passesBassCheck(curFrets) { if (bassPc == null || !tuningMidi) return true; let lowest = Infinity, pcLowest = null; for (let s = 0; s < N; s++) { const f = curFrets[s]; if (typeof f === 'number') { const midi = tuningMidi[s] + f; if (midi < lowest) { lowest = midi; pcLowest = midi % 12; } } } return pcLowest === bassPc; }
            function hasDuplicateExactNotes(curFrets, tuningMidiArr) { const seen = new Set(); for (let s = 0; s < N; s++) { const f = curFrets[s]; if (f === 'X' || f === undefined) continue; if (tuningMidiArr && Array.isArray(tuningMidiArr) && tuningMidiArr.length === N) { const midi = tuningMidiArr[s] + f; if (seen.has(midi)) return true; seen.add(midi); } else { const pc = (tuningPcs[s] + f) % 12; if (seen.has(pc)) return true; seen.add(pc); } } return false; }
            function finalizeCandidate(curFrets, usedPcs, playedIdxs) {
                if (playedIdxs.length < minStrings) return; if (!isContiguousPlayed(playedIdxs)) return; for (const e of essentialSet) if (!usedPcs.has(e)) return; if (requiredExtPcs && requiredExtPcs.size > 0) { for (const r of requiredExtPcs) if (!usedPcs.has(r)) return; } if (fingerCount(curFrets) > 5) return; if (!allowOpens && curFrets.some(f => f === 0)) return; if (!passesBassCheck(curFrets)) return;
                try { const nd = document.getElementById && document.getElementById('noDuplicateNotes'); if (nd && nd.checked) { if (hasDuplicateExactNotes(curFrets, tuningMidi)) return; } } catch (e) { }
                const fingerings = enumerateFingerings(curFrets, 12); if (!fingerings || fingerings.length === 0) return; const v = postProcessVoicing(curFrets, tuningPcs); v._fingers = fingerings[0]; if (fingerings.length > 1) v._altFingerings = fingerings.slice(1); results.push(v);
            }
            function tryNumericOptions(i, curFrets, usedPcs, playedIdxs, minFret, maxFret) { if (results.length >= maxResults) return; for (const f of validByString[i]) { let nMin = minFret, nMax = maxFret; if (nMin === Infinity) nMin = f; if (f > 0) { nMin = Math.min(nMin, f); nMax = Math.max(nMax, f); } else { nMin = (nMin === Infinity) ? f : nMin; nMax = Math.max(nMax, f); } if (f > 0 && nMin > 0 && nMax - nMin > maxSpan) continue; const pc = (tuningPcs[i] + f) % 12; const used = new Set(usedPcs); used.add(pc); dfs(i + 1, curFrets.concat(f), used, playedIdxs.concat(i), nMin, nMax); if (results.length >= maxResults) return; } }
            function tryMutedOption(i, curFrets, usedPcs, playedIdxs, minFret, maxFret) { dfs(i + 1, curFrets.concat('X'), usedPcs, playedIdxs, minFret, maxFret); }
            function dfs(i, curFrets, usedPcs, playedIdxs, minFret, maxFret) { if (results.length >= maxResults) return; if (!canRemainingCover(i, usedPcs)) return; if (i === N) { finalizeCandidate(curFrets, usedPcs, playedIdxs); return; } tryNumericOptions(i, curFrets, usedPcs, playedIdxs, minFret, maxFret); if (results.length >= maxResults) return; tryMutedOption(i, curFrets, usedPcs, playedIdxs, minFret, maxFret); }
            dfs(0, [], new Set(), [], Infinity, -Infinity);
            return results.sort((a, b) => (a._score - b._score) || (a.posStart - b.posStart) || (a.span - b.span) || a.frets.join('').localeCompare(b.frets.join('')));
        }

        // UI wiring: elements from index.html
        const tabChords = byId('tab-chords');
        const tabScales = byId('tab-scales');
        const tabArpeggios = byId('tab-arpeggios');
        const panelChords = byId('panel-chords');
        const panelScales = byId('panel-scales');
        const panelArpeggios = byId('panel-arpeggios');
        const chordsRoot = byId('chordsRoot');
        const scalesRoot = byId('scalesRoot');
        const arpeggiosRoot = byId('arpeggiosRoot');

        function setActive(tabBtn, panel) { document.querySelectorAll('.tab-btn').forEach(b => b.setAttribute('aria-selected', 'false')); document.querySelectorAll('.panel').forEach(p => p.hidden = true); tabBtn.setAttribute('aria-selected', 'true'); panel.hidden = false; }

        // Unified function to populate tuning selector with groups
        function populateTuningSelector(selectElement) {
            if (!window.COMMON_TUNINGS || !window.TUNING_GROUPS) return;

            selectElement.innerHTML = ''; // Clear existing options

            window.TUNING_GROUPS.forEach(group => {
                const optGroup = document.createElement('optgroup');
                optGroup.label = t(group.key) || group.key;

                group.tunings.forEach(tuningKey => {
                    if (window.COMMON_TUNINGS[tuningKey]) {
                        const option = document.createElement('option');
                        option.value = tuningKey;
                        const tuning = window.COMMON_TUNINGS[tuningKey];
                        option.textContent = `${tuningKey} — ${(tuning.strings || []).map(s => s.name + s.oct).join(' ')}`;
                        optGroup.appendChild(option);
                    }
                });

                if (optGroup.children.length > 0) {
                    selectElement.appendChild(optGroup);
                }
            });
        }

        // build chords panel: include tuning selector, constraints, and results area
        function buildChordsPanel() {
            const container = chordsRoot; container.innerHTML = '';
            const card = document.createElement('section'); card.className = 'card';
            // header: mirror the Scales tab structure
            const body = document.createElement('div'); body.className = 'body';
            const h2 = document.createElement('h2');
            h2.textContent = t('found_header') || '3) Найденные аппликатуры';
            body.appendChild(h2);

            // controls-bar: tuning + display controls (reference Scales tab)
            const controlsBar = document.createElement('div'); controlsBar.className = 'controls-bar chips';
            const tuneLabel = document.createElement('label'); tuneLabel.className = 'chip'; tuneLabel.innerHTML = `<span>${t('tuningTitle') || 'Tuning'}:</span>`;
            const sel = document.createElement('select'); sel.id = 'tuningSel'; sel.className = 'chord-tuning-sel'; tuneLabel.appendChild(sel); controlsBar.appendChild(tuneLabel);
            const dispLabel = document.createElement('label'); dispLabel.className = 'chip'; dispLabel.innerHTML = `<span>${t('displayMode') || 'Display'}:</span>`;
            const dispSel = document.createElement('select'); dispSel.id = 'labelMode'; dispSel.appendChild(opt(t('notes') || 'Notes', 'notes'));
            dispSel.appendChild(opt(t('intervals') || 'Intervals', 'intervals'));
            dispLabel.appendChild(dispSel); controlsBar.appendChild(dispLabel);
            body.appendChild(controlsBar);

            // constraints (placed below controls)
            const h22 = document.createElement('h2'); h22.textContent = t('constraintsTitle') || 'Constraints'; body.appendChild(h22);
            const chips = document.createElement('div'); chips.className = 'chips wrap';
            const omitRoot = document.createElement('label'); omitRoot.className = 'chip'; omitRoot.innerHTML = `<input type="checkbox" id="omitRoot" checked><span>${t('omitRootLbl') || 'allow omit root'}</span>`; chips.appendChild(omitRoot);
            const omitFifth = document.createElement('label'); omitFifth.className = 'chip'; omitFifth.innerHTML = `<input type="checkbox" id="omitFifth" checked><span>${t('omitFifthLbl') || 'allow omit fifth'}</span>`; chips.appendChild(omitFifth);
            const allowOpens = document.createElement('label'); allowOpens.className = 'chip'; allowOpens.innerHTML = `<input type="checkbox" id="allowOpens" checked><span>${t('allowOpensLbl') || 'allow open strings'}</span>`; chips.appendChild(allowOpens);
            const contiguous = document.createElement('label'); contiguous.className = 'chip'; contiguous.innerHTML = `<input type="checkbox" id="contiguous" checked><span>${t('contiguousLbl') || 'contiguous strings'}</span>`; chips.appendChild(contiguous);
            const dup = document.createElement('label'); dup.className = 'chip'; dup.innerHTML = `<input type="checkbox" id="noDuplicateNotes" checked><span>${t('noDuplicateNotesLbl') || 'filter duplicate notes'}</span>`; chips.appendChild(dup);
            // include the display select inside controls-bar already; keep 'chips' for other toggles
            body.appendChild(chips);

            // results (place inside the same card so settings + results form a single block)
            const rbody = document.createElement('div'); rbody.className = 'body'; const summary = document.createElement('div'); summary.id = 'summary'; rbody.appendChild(summary); const resultsDiv = document.createElement('section'); resultsDiv.id = 'results'; rbody.appendChild(resultsDiv);
            card.appendChild(body); card.appendChild(rbody); container.appendChild(card);
            // populate tuning options using unified function
            const tuningSel = sel;
            populateTuningSelector(tuningSel);

            // Load saved preferences for tuning and labelMode
            const savedPrefs = (typeof loadUserPrefs === 'function') ? loadUserPrefs() : null;

            // Set tuning from saved prefs or default
            if (savedPrefs && savedPrefs.tuning) {
                tuningSel.value = savedPrefs.tuning;
            } else if (!tuningSel.value) {
                tuningSel.value = Object.keys(window.COMMON_TUNINGS || { 'E Standard': 1 })[0] || 'E Standard';
            }

            // Set labelMode from saved prefs
            const lm = document.getElementById('labelMode');
            if (lm && savedPrefs && savedPrefs.labelMode) {
                lm.value = savedPrefs.labelMode;
            }
            // wire controls to regenerate when changed (debounced)
            const trigger = debounce(() => { try { if (window.generate) window.generate(); } catch (e) { console.error('trigger generate failed', e); } }, 180);
            try {
                tuningSel.addEventListener('change', trigger);
                tuningSel.addEventListener('change', () => { try { saveUserPrefs(); } catch (e) { } });
            } catch (e) { }
            // wire display mode control
            try {
                const lm = document.getElementById('labelMode');
                if (lm) {
                    lm.addEventListener('change', trigger);
                    lm.addEventListener('change', () => { try { saveUserPrefs(); } catch (e) { } });
                }
            } catch (e) { }
            // hook checkboxes by id (they were created above inside chips)
            ['omitRoot', 'omitFifth', 'allowOpens', 'contiguous', 'noDuplicateNotes'].forEach(id => {
                try { const el = document.getElementById(id); if (el) el.addEventListener('change', trigger); } catch (e) { }
            });
            // minStrings control (optional)
            try { const ms = document.getElementById('minStrings'); if (ms) ms.addEventListener('change', trigger); } catch (e) { }
            // wire a simple generate
            function doGenerate() {
                try {
                    console.debug('[generate] start');
                    const root = byId('rootSel') ? byId('rootSel').value : 'C';
                    const qual = byId('qualitySel') ? byId('qualitySel').value : Object.keys(QUALITIES)[0];
                    const exts = byId('extWrap') ? Array.from(byId('extWrap').querySelectorAll('input:checked')).map(i => i.value) : [];
                    const bass = byId('bassSel') ? byId('bassSel').value : '';
                    console.debug('[generate] root,qual,exts', root, qual, exts);
                    const intervals = buildChordIntervals(root, qual, exts);
                    const rootPc = noteToIndex(root);
                    const chordPcs = new Set((intervals || []).map(iv => mod12(rootPc + iv)));
                    console.debug('[generate] chordPcs (absolute)', chordPcs, 'intervals', intervals, 'rootPc', rootPc);
                    const tuningName = tuningSel.value;
                    const tuning = (window.COMMON_TUNINGS && window.COMMON_TUNINGS[tuningName]) ? window.COMMON_TUNINGS[tuningName] : { pcs: [4, 9, 2, 7, 11, 4], midi: [40, 45, 50, 55, 59, 64] };
                    // calculate required extension pitch-classes
                    const requiredExtPcs = new Set((exts || []).map(e => (EXT_MAP[e] !== undefined ? mod12(rootPc + EXT_MAP[e]) : null)).filter(x => x !== null));
                    const requiredBassPc = bass ? mod12(noteToIndex(bass)) : null;
                    const essentials = essentialPcs(noteToIndex(root), qual, exts, !!(byId('omitRoot') && byId('omitRoot').checked), !!(byId('omitFifth') && byId('omitFifth').checked));
                    let voicings = [];
                    try {
                        console.debug('[generate] inputs', { tuningName, tuning, chordPcs: Array.from(chordPcs), essentials: Array.from(essentials), requiredExtPcs: Array.from(requiredExtPcs), requiredBassPc });
                        voicings = generateVoicings({ tuningPcs: tuning.pcs, tuningMidi: tuning.midi, chordPcs, essentialSet: essentials, maxSpan: 4, minStrings: parseInt((byId('minStrings') && byId('minStrings').value) || '3', 10), contiguous: !!(byId('contiguous') && byId('contiguous').checked), allowOpens: !!(byId('allowOpens') && byId('allowOpens').checked), maxResults: 500, bassPc: requiredBassPc, requiredExtPcs });
                        console.debug('[generate] voicings found', voicings.length);
                    } catch (genErr) {
                        console.error('[generate] generateVoicings threw', genErr);
                        // ensure UI still shows something helpful
                        voicings = [];
                    }
                    try { updateChordInfo(root, qual, exts, voicings, tuningName, bass); } catch (e) { console.error('updateChordInfo failed', e); const card = byId('chordInfo'); if (card) card.innerHTML = `<div class="muted">Error rendering chord info: ${String(e)}</div>`; }
                    // render basic results inside a responsive grid
                    resultsDiv.innerHTML = '';
                    if (!voicings.length) {
                        // provide a short debug dump so users can paste it when reporting empty results
                        try {
                            const dbg = document.createElement('pre'); dbg.className = 'muted debug';
                            dbg.textContent = `DEBUG: root=${root}, quality=${qual}, exts=${JSON.stringify(exts)}, intervals=${JSON.stringify(intervals)}, rootPc=${rootPc}, chordPcs=${JSON.stringify(Array.from(chordPcs))}, essentials=${JSON.stringify(Array.from(essentials))}, requiredExtPcs=${JSON.stringify(Array.from(requiredExtPcs))}, bassPc=${requiredBassPc}, tuning=${JSON.stringify({ name: tuningName, pcs: tuning.pcs })}`;
                            resultsDiv.appendChild(dbg);
                        } catch (e) { console.error('failed to render debug dump', e); }
                        const none = document.createElement('div'); none.className = 'muted'; none.textContent = t('nothing') || 'No results'; resultsDiv.appendChild(none);
                        return;
                    }
                    // group voicings by position ranges based on first fretted note
                    const groups = {
                        '1-4': { title: '1–4', items: [] },
                        '5-8': { title: '5–8', items: [] },
                        '9-12': { title: '9–12', items: [] }
                    };
                    function categorize(v) {
                        // find first fretted note (excluding open strings)
                        const frettedNotes = v.frets.filter(f => typeof f === 'number' && f > 0);
                        if (frettedNotes.length === 0) {
                            // if no fretted notes, put in first group
                            return '1-4';
                        }
                        const minF = Math.min(...frettedNotes);
                        if (minF >= 1 && minF <= 4) return '1-4';
                        if (minF >= 5 && minF <= 8) return '5-8';
                        return '9-12';
                    }
                    voicings.slice(0, 200).forEach(v => { const k = categorize(v); if (!groups[k]) groups[k] = { title: k, items: [] }; groups[k].items.push(v); });
                    // render groups with headings and grids
                    Object.keys(groups).forEach(key => {
                        const g = groups[key]; if (!g.items || g.items.length === 0) return;
                        const head = document.createElement('h4'); head.className = 'group-head'; head.textContent = `${g.title} (${g.items.length})`; resultsDiv.appendChild(head);
                        const grid = document.createElement('div'); grid.className = 'cards';
                        g.items.slice(0, 80).forEach(v => {
                            const card = document.createElement('div'); card.className = 'voicing';
                            // diagram
                            try {
                                const svgwrap = document.createElement('div'); svgwrap.className = 'svgwrap';
                                svgwrap.appendChild(renderDiagram(v, rootPc, tuning.pcs, (byId('labelMode') && byId('labelMode').value) || 'notes'));
                                card.appendChild(svgwrap);
                            } catch (e) { console.error('renderDiagram failed', e); }
                            // meta (span + labels + shape) — unified structure
                            const meta = document.createElement('div'); meta.className = 'meta2';
                            // helper to create a meta row
                            function makeMetaRow(labelText, valueContent, isMono) {
                                const row = document.createElement('div'); row.className = 'meta-row';
                                const lab = document.createElement('span'); lab.className = 'meta-label'; lab.textContent = labelText;
                                const val = document.createElement('span'); val.className = 'meta-value' + (isMono ? ' mono' : '');
                                if (typeof valueContent === 'string' || typeof valueContent === 'number') val.textContent = valueContent;
                                else if (valueContent instanceof Node) val.appendChild(valueContent);
                                else val.textContent = String(valueContent || '');
                                row.appendChild(lab); row.appendChild(val); return row;
                            }
                            // span
                            meta.appendChild(makeMetaRow(t('span'), `${v.span} ${t('fretsUnit') || 'fr'}`, true));
                            // labels (notes or intervals)
                            const labelsStr = (v.intervals || []).filter(pc => pc !== null).map(pc => ((byId('labelMode') && byId('labelMode').value) === 'notes' ? nameForPC(pc) : intervalName((pc - rootPc + 12) % 12))).join(' ');
                            meta.appendChild(makeMetaRow(t('labels'), labelsStr, true));
                            // shape (fret numbers)
                            meta.appendChild(makeMetaRow(t('shape') || 'Shape', v.frets.join(' '), false));
                            card.appendChild(meta);
                            const btn = document.createElement('button'); btn.className = 'play-btn'; btn.textContent = t('play') || 'Play';
                            btn.addEventListener('click', () => { try { playVoicing(tuning, v); } catch (e) { console.error('playVoicing failed', e); } });
                            card.appendChild(btn);
                            grid.appendChild(card);
                        });
                        resultsDiv.appendChild(grid);
                    });
                } catch (err) { console.error('[generate] error', err); }
            }
            // expose generate to window for compatibility
            window.generate = doGenerate;
            // initial generate
            doGenerate();
        }

        // update chord info card (right column) — simplified: label, notes line, Play button
        function updateChordInfo(root, quality, exts, voicings, tuningName, bass) {
            const card = byId('chordInfo'); if (!card) return;
            card.innerHTML = '';

            // Full chord label (root + quality + extensions concatenated)
            const compactExt = (exts || []).join('');
            const compactQuality = quality ? quality : '';
            let compactLabel = `${root}${compactQuality}${compactExt}`.trim();
            if (bass) compactLabel = compactLabel + '/' + bass;

            // compute pitch classes and spelling with defensive guards
            let pcs = [];
            let spelled = [];
            try { pcs = buildChordIntervals(root, quality, exts) || []; } catch (e) { console.error('buildChordIntervals failed', e); pcs = []; }
            try { const sp = spellScale(root, pcs, '', false); spelled = (sp && sp.notes) ? sp.notes.slice() : []; } catch (e) { console.error('spellScale failed', e); spelled = []; }
            console.debug('[updateChordInfo] root,quality,exts ->', root, quality, exts, 'pcs->', pcs, 'spelled->', spelled);

            // Title (bold) - use H3 to ensure block layout
            const title = document.createElement('h3'); title.className = 'chord-title chord-title--block'; const strong = document.createElement('strong'); strong.textContent = compactLabel || `${root} ${quality || ''}`; title.appendChild(strong); card.appendChild(title);

            // Notes line (one line) - block with margin
            const tonesLine = document.createElement('div'); tonesLine.className = 'muted chord-notes--block';

            // Add header label for notes
            const notesLabel = document.createElement('span');
            notesLabel.className = 'chord-notes-label';
            notesLabel.textContent = t('chordNotes') + ': ';
            tonesLine.appendChild(notesLabel);

            let toneNames = '';
            if (spelled && spelled.length) toneNames = spelled.join(' · ');
            else if (pcs && pcs.length) toneNames = pcs.map(p => ((PC_NAMES[p] && PC_NAMES[p][0]) || nameForPC(p))).join(' · ');
            else toneNames = t('no_notes') || '—';
            // ensure bass (if any) is shown on the leftmost side
            if (bass) {
                const bassName = bass;
                // remove existing occurrence
                if (toneNames.includes(bassName)) {
                    const parts = toneNames.split(' · ').filter(x => x !== bassName);
                    toneNames = parts.length ? parts.join(' · ') : '';
                }
                toneNames = toneNames ? (bassName + ' · ' + toneNames) : bassName;
            }

            const notesSpan = document.createElement('span');
            notesSpan.textContent = toneNames;
            tonesLine.appendChild(notesSpan);
            card.appendChild(tonesLine);

            // Degrees line (chord structure in degrees) - block with margin
            const degreesLine = document.createElement('div'); degreesLine.className = 'muted chord-degrees--block';
            let degreeNames = '';
            if (pcs && pcs.length) {
                const rootPc = noteToIndex(root);
                let intervals = pcs.map(pc => (pc - rootPc + 12) % 12);
                // ensure bass degree is shown first if bass is present
                if (bass) {
                    const bassPc = noteToIndex(bass);
                    const bassInterval = (bassPc - rootPc + 12) % 12;
                    // remove existing occurrence of bass interval
                    intervals = intervals.filter(iv => iv !== bassInterval);
                    // add bass interval at the beginning
                    intervals = [bassInterval, ...intervals];
                }
                degreeNames = intervals.map(iv => intervalName(iv)).join(' · ');
            } else {
                degreeNames = t('no_notes') || '—';
            }
            const degreesLabel = document.createElement('span');
            degreesLabel.className = 'chord-degrees-label';
            degreesLabel.textContent = (t('chordDegrees') || 'Degrees') + ': ';
            degreesLine.appendChild(degreesLabel);
            const degreesText = document.createElement('span');
            degreesText.textContent = degreeNames;
            degreesLine.appendChild(degreesText);
            card.appendChild(degreesLine);

            // Play button: own block
            const playWrap = document.createElement('div'); playWrap.className = 'chord-play-wrap';
            const playBtn = document.createElement('button'); playBtn.className = 'btn chord-play-btn'; playBtn.textContent = t('play') || 'Play';
            playBtn.addEventListener('click', () => {
                try {
                    // map spelled notes to MIDI numbers in ascending octave order
                    const baseOct = 4; const midiList = []; let prev = -1;
                    const namesToMap = (spelled && spelled.length) ? spelled.slice() : (pcs || []).map(p => (PC_NAMES[p] && PC_NAMES[p][0]) || nameForPC(p));
                    // keep order: bass first (if present), then the rest in original order without duplicates
                    const bassName = bass;
                    const nonBassNames = namesToMap.filter(n => !bassName || n !== bassName);
                    // map non-bass names to midi starting at baseOct
                    const baseOctForNonBass = baseOct;
                    let nonBassMidi = [];
                    let p = -1;
                    nonBassNames.forEach(nm => {
                        let m = noteToIndex(nm) + 12 * (baseOctForNonBass + 1);
                        while (m <= p) m += 12;
                        p = m; nonBassMidi.push(m);
                    });
                    // compute bass midi to be lower than the first non-bass midi (or one octave below base if none)
                    if (bassName) {
                        let bassMidi = noteToIndex(bassName) + 12 * (baseOctForNonBass);
                        const firstNon = nonBassMidi.length ? nonBassMidi[0] : null;
                        while (firstNon !== null && bassMidi >= firstNon) bassMidi -= 12;
                        midiList.push(bassMidi);
                    }
                    if (nonBassMidi.length) midiList.push(...nonBassMidi);
                    const quarter = 0.5; const half = 1.0; const startOffset = 0.05;
                    midiList.forEach((m, i) => { const when = startOffset + i * quarter; const freq = Audio.freqFromMidi ? Audio.freqFromMidi(m) : (440 * Math.pow(2, (m - 69) / 12)); Audio.playFreq(freq, 0.45, when); });
                    const chordWhen = startOffset + midiList.length * quarter + 0.05; midiList.forEach(m => { const freq = Audio.freqFromMidi ? Audio.freqFromMidi(m) : (440 * Math.pow(2, (m - 69) / 12)); Audio.playFreq(freq, half, chordWhen); });
                } catch (e) { console.error('play failed', e); }
            });
            playWrap.appendChild(playBtn);
            card.appendChild(playWrap);
        }

        // build scales panel: show scales list and render fretboard when expanded
        function buildScalesPanel() {
            const container = scalesRoot; container.innerHTML = '';
            const card = document.createElement('section'); card.className = 'card';
            const body = document.createElement('div'); body.className = 'body';
            const h2 = document.createElement('h2'); h2.textContent = t('scales') || 'Suggested scales'; body.appendChild(h2);
            // hint element removed as per UX request
            // mirrored controls: reuse global tuning and labelMode from chords panel (keep in sync)
            const controlsBar = document.createElement('div'); controlsBar.className = 'controls-bar chips';
            const tuneLabel = document.createElement('label'); tuneLabel.className = 'chip'; tuneLabel.innerHTML = `<span>${t('tuningTitle') || 'Tuning'}:</span>`;
            const tuneSel = document.createElement('select'); tuneSel.className = 'scale-tuning-sel';
            // fill options using unified function
            populateTuningSelector(tuneSel);
            // if a global tuningSel exists, sync initial value
            try { const globalT = byId('tuningSel'); if (globalT && globalT.value) tuneSel.value = globalT.value; else if (byId('tuningSel')) tuneSel.value = byId('tuningSel').value; } catch (e) { }
            tuneLabel.appendChild(tuneSel); controlsBar.appendChild(tuneLabel);
            const dispLabel = document.createElement('label'); dispLabel.className = 'chip'; dispLabel.innerHTML = `<span>${t('displayMode') || 'Display'}:</span>`;
            const dispSel = document.createElement('select'); dispSel.className = 'scale-labelmode-sel';
            dispSel.appendChild(opt(t('notes') || 'Notes', 'notes'));
            dispSel.appendChild(opt(t('intervals') || 'Intervals', 'intervals'));
            // sync with global labelMode if present
            try { const globalLM = byId('labelMode'); if (globalLM && globalLM.value) dispSel.value = globalLM.value; } catch (e) { }
            dispLabel.appendChild(dispSel); controlsBar.appendChild(dispLabel);
            body.appendChild(controlsBar);
            const list = document.createElement('div'); list.id = 'scalesList'; list.className = 'scale-list mt'; body.appendChild(list); card.appendChild(body); container.appendChild(card);
            // determine current chord selection so we can mark scales that fit the chord
            const topRoot = (byId('rootSel') && byId('rootSel').value) || 'C';
            const topQual = (byId('qualitySel') && byId('qualitySel').value) || Object.keys(QUALITIES)[0] || 'maj';
            const topExts = (byId('extWrap') && Array.from(byId('extWrap').querySelectorAll('input:checked')).map(i => i.value)) || [];
            const topRootPc = noteToIndex(topRoot);
            const topIntervals = buildChordIntervals(topRoot, topQual, topExts) || [0, 4, 7];
            const chordPcs = new Set((topIntervals || []).map(iv => mod12(topRootPc + iv)));

            // Build a scored list of scales that can support the current chord.
            // Scoring rules: +2 if scale contains the requested bass, +1 for each matching extension tone.
            const mapExt = { '9': 14, 'add9': 14, 'b9': 13, '#9': 15, '11': 17, '#11': 18, '13': 21, 'b13': 20 };
            const extPcs = new Set();
            try {
                if (topRoot != null && Array.isArray(topExts)) {
                    topExts.forEach(e => { if (mapExt[e] !== undefined) extPcs.add(mod12(mapExt[e] + topRootPc)); });
                }
            } catch (e) { }

            const bassPc = (byId('bassSel') && byId('bassSel').value) ? mod12(noteToIndex(byId('bassSel').value)) : null;

            // gather supported scales and score them
            // A scale is considered supported only if, when transposed to the selected chord root
            // (i.e. scale degrees shifted by topRootPc), the set of pitch-classes includes all
            // chord pitch-classes, all required extension PCs and (if present) the requested bass PC.
            const scored = [];
            Object.keys(SCALES).forEach(key => {
                const sc = SCALES[key];
                if (!sc || !Array.isArray(sc.intervals)) return;
                // compute the scale's pitch-classes when rooted at the chosen chord root
                const transposedPcs = new Set(sc.intervals.map(iv => mod12(topRootPc + iv)));
                // must cover every chord pitch-class
                let coversChord = true;
                for (const cp of chordPcs) { if (!transposedPcs.has(cp)) { coversChord = false; break; } }
                if (!coversChord) return; // skip scales that don't fully cover the chord
                // must include required extension tone(s) if any (use extPcs computed earlier)
                if (extPcs && extPcs.size > 0) {
                    let hasAllExt = true;
                    for (const re of extPcs) { if (!transposedPcs.has(re)) { hasAllExt = false; break; } }
                    if (!hasAllExt) return;
                }
                // if a specific bass was requested, require the transposed scale to include it
                if (bassPc != null && !transposedPcs.has(bassPc)) return;

                // compute a simple score: +2 for bass match (redundant here since we required bass),
                // +1 per extension match (should always match due to the requirement above), and
                // prefer scales with fewer extra notes (smaller interval set) when scores tie
                let score = 0;
                if (bassPc != null && transposedPcs.has(bassPc)) score += 2;
                extPcs.forEach(ep => { if (transposedPcs.has(ep)) score += 1; });
                scored.push({ key, score, size: (sc.intervals || []).length });
            });

            // sort by score desc, then by scale size (fewer degrees preferred), then key
            scored.sort((a, b) => { if (b.score !== a.score) return b.score - a.score; if (a.size !== b.size) return a.size - b.size; return a.key.localeCompare(b.key); });

            if (scored.length === 0) {
                const none = document.createElement('div'); none.className = 'muted'; none.textContent = t('nothing') || 'No matching scales'; list.appendChild(none);
            }

            scored.forEach(({ key }) => {
                const sc = SCALES[key];
                const spelled = spellScale(topRoot, sc.intervals, (LANG === 'en' ? (sc.degrees_en || '') : (sc.degrees_ru || '')), sc.intervals.length === 7).notes;
                const item = document.createElement('div'); item.className = 'scale-item card';
                const head = document.createElement('div'); head.className = 'scale-head';
                const titleBox = document.createElement('div');
                const scName = LANG === 'en' ? (sc.name_en || key) : (sc.name_ru || sc.name_en || key);
                const familyName = sc.family ? t(`scaleFamily${sc.family.charAt(0).toUpperCase() + sc.family.slice(1)}`) || sc.family : '';
                const displayName = familyName ? `${scName} (${familyName})` : scName;
                const title = document.createElement('div'); title.className = 'scale-title'; title.textContent = `${topRoot} ${displayName}`;
                const sub = document.createElement('div'); sub.className = 'scale-sub'; sub.textContent = `${spelled.join(' · ')}  •  ${(LANG === 'en' ? sc.degrees_en : sc.degrees_ru) || ''}`;
                titleBox.appendChild(title); titleBox.appendChild(sub);
                const actions = document.createElement('div'); actions.className = 'actions';
                const btnPlay = document.createElement('button'); btnPlay.className = 'btn'; btnPlay.textContent = t('play') || 'Play';
                btnPlay.addEventListener('click', () => Audio.playScale(spelled));
                actions.appendChild(btnPlay);
                head.appendChild(titleBox); head.appendChild(actions);
                const collapse = document.createElement('div'); collapse.className = 'collapse';
                const fbWrap = document.createElement('div'); fbWrap.className = 'fret-wrap'; collapse.appendChild(fbWrap);

                head.addEventListener('click', (e) => {
                    if (e.target === btnPlay) return;
                    collapse.classList.toggle('show');
                    if (collapse.classList.contains('show')) {
                        const scSp = spellScale(topRoot, sc.intervals, (LANG === 'en' ? sc.degrees_en : sc.degrees_ru) || '', sc.intervals.length === 7);
                        const degreeMap = scSp && scSp.relMap ? scSp.relMap : null;
                        const tuningName = (byId('tuningSel') && byId('tuningSel').value) || tuneSel.value || 'E Standard';
                        const labelMode = (byId('labelMode') && byId('labelMode').value) || dispSel.value || 'notes';
                        renderFretboard(fbWrap, tuningName, topRoot, sc.intervals, topRoot, labelMode, degreeMap, sc.parent || null);
                    }
                });

                item.dataset.scaleKey = key;
                item.appendChild(head); item.appendChild(collapse); list.appendChild(item);
            });

            // Keep mirrored controls in sync with the chords panel controls (two-way)
            try {
                const globalT = byId('tuningSel');
                if (globalT) {
                    // when global changes, update mirror and re-render open fretboards
                    globalT.addEventListener('change', () => { try { tuneSel.value = globalT.value; rerenderOpenFretboards(); } catch (e) { } });
                    // when mirror changes, propagate to global
                    tuneSel.addEventListener('change', () => { try { globalT.value = tuneSel.value; globalT.dispatchEvent(new Event('change')); rerenderOpenFretboards(); } catch (e) { } });
                } else {
                    // if no global, mirror acts alone
                    tuneSel.addEventListener('change', () => { rerenderOpenFretboards(); });
                }
            } catch (e) { }
            try {
                const globalLM = byId('labelMode');
                if (globalLM) {
                    globalLM.addEventListener('change', () => { try { dispSel.value = globalLM.value; rerenderOpenFretboards(); } catch (e) { } });
                    dispSel.addEventListener('change', () => { try { globalLM.value = dispSel.value; globalLM.dispatchEvent(new Event('change')); rerenderOpenFretboards(); } catch (e) { } });
                } else {
                    dispSel.addEventListener('change', () => { rerenderOpenFretboards(); });
                }
            } catch (e) { }

            // helper to re-render any currently expanded fretboards
            function rerenderOpenFretboards() {
                const items = list.querySelectorAll('.collapse.show');
                items.forEach(c => {
                    const fb = c.querySelector('.fret-wrap');
                    if (!fb) return;
                    // parent .scale-item holds the scale key
                    const item = c.parentElement;
                    const key = item && item.dataset && item.dataset.scaleKey ? item.dataset.scaleKey : null;
                    if (!key || !SCALES[key]) return;
                    const scIntervals = SCALES[key].intervals;
                    const sc = SCALES[key];
                    const scSp = spellScale((byId('rootSel') && byId('rootSel').value) || 'C', scIntervals, (LANG === 'en' ? sc.degrees_en : sc.degrees_ru) || '', scIntervals.length === 7);
                    const degreeMap = scSp && scSp.relMap ? scSp.relMap : null;
                    const tuningName = (byId('tuningSel') && byId('tuningSel').value) || tuneSel.value || 'E Standard';
                    const labelMode = (byId('labelMode') && byId('labelMode').value) || dispSel.value || 'notes';
                    // debug log to help diagnose missing notes on tuning change
                    try { console.debug('[rerenderOpenFretboards] scale=', key, 'tuningName=', tuningName, 'scaleRoot=', (byId('rootSel') && byId('rootSel').value) || 'C', 'intervals=', scIntervals); } catch (e) { }
                    renderFretboard(fb, tuningName, (byId('rootSel') && byId('rootSel').value) || 'C', scIntervals, (byId('rootSel') && byId('rootSel').value) || 'C', labelMode, degreeMap, sc.parent || null);
                });
            }
        }

        // build arpeggios panel: show chord arpeggios in different positions
        function buildArpeggiosPanel() {
            const container = arpeggiosRoot; container.innerHTML = '';
            const card = document.createElement('section'); card.className = 'card';
            const body = document.createElement('div'); body.className = 'body';
            const h2 = document.createElement('h2'); h2.textContent = t('arpeggios') || 'Chord arpeggios'; body.appendChild(h2);

            // mirrored controls: reuse global tuning and labelMode from chords panel (keep in sync)
            const controlsBar = document.createElement('div'); controlsBar.className = 'controls-bar chips';
            const tuneLabel = document.createElement('label'); tuneLabel.className = 'chip'; tuneLabel.innerHTML = `<span>${t('tuningTitle') || 'Tuning'}:</span>`;
            const tuneSel = document.createElement('select'); tuneSel.className = 'arpeggio-tuning-sel';

            // fill options using unified function
            populateTuningSelector(tuneSel);

            // if a global tuningSel exists, sync initial value
            try { const globalT = byId('tuningSel'); if (globalT && globalT.value) tuneSel.value = globalT.value; else if (byId('tuningSel')) tuneSel.value = byId('tuningSel').value; } catch (e) { }
            tuneLabel.appendChild(tuneSel); controlsBar.appendChild(tuneLabel);

            const dispLabel = document.createElement('label'); dispLabel.className = 'chip'; dispLabel.innerHTML = `<span>${t('displayMode') || 'Display'}:</span>`;
            const dispSel = document.createElement('select'); dispSel.className = 'arpeggio-labelmode-sel';
            dispSel.appendChild(opt(t('notes') || 'Notes', 'notes'));
            dispSel.appendChild(opt(t('intervals') || 'Intervals', 'intervals'));

            // sync with global labelMode if present
            try { const globalLM = byId('labelMode'); if (globalLM && globalLM.value) dispSel.value = globalLM.value; } catch (e) { }
            dispLabel.appendChild(dispSel); controlsBar.appendChild(dispLabel);
            body.appendChild(controlsBar);

            const list = document.createElement('div'); list.id = 'arpeggiosList'; list.className = 'arpeggio-list mt'; body.appendChild(list); card.appendChild(body); container.appendChild(card);

            // determine current chord selection
            const topRoot = (byId('rootSel') && byId('rootSel').value) || 'C';
            const topQual = (byId('qualitySel') && byId('qualitySel').value) || Object.keys(QUALITIES)[0] || 'maj';
            const topExts = (byId('extWrap') && Array.from(byId('extWrap').querySelectorAll('input:checked')).map(i => i.value)) || [];
            const topRootPc = noteToIndex(topRoot);
            const topIntervals = buildChordIntervals(topRoot, topQual, topExts) || [0, 4, 7];

            // Create different arpeggio patterns - different positions on the fretboard
            const arpeggioPatterns = [
                { name: t('posOpen') || 'Open position', minFret: 0, maxFret: 4 },
                { name: 'Position II-V', minFret: 2, maxFret: 6 },
                { name: 'Position V-VII', minFret: 5, maxFret: 9 },
                { name: 'Position VII-X', minFret: 7, maxFret: 11 },
                { name: 'Position X-XII', minFret: 10, maxFret: 14 },
                { name: 'Position XII+', minFret: 12, maxFret: 16 }
            ];

            if (topIntervals.length === 0) {
                const none = document.createElement('div'); none.className = 'muted'; none.textContent = t('nothing') || 'No chord selected'; list.appendChild(none);
                return;
            }

            // Spell the chord notes
            const chordPcs = topIntervals.map(iv => mod12(topRootPc + iv));
            const spelled = chordPcs.map(pc => (PC_NAMES[pc] && PC_NAMES[pc][0]) || nameForPC(pc));

            arpeggioPatterns.forEach(pattern => {
                const item = document.createElement('div'); item.className = 'scale-item card';
                const head = document.createElement('div'); head.className = 'scale-head';
                const titleBox = document.createElement('div');

                const title = document.createElement('div'); title.className = 'scale-title';
                title.textContent = `${topRoot}${(QUALITIES[topQual] && QUALITIES[topQual].name) || topQual} - ${pattern.name}`;

                const sub = document.createElement('div'); sub.className = 'scale-sub';
                sub.textContent = `${spelled.join(' · ')}  •  ${pattern.minFret === 0 ? 'Open' : 'Frets'} ${pattern.minFret}–${pattern.maxFret}`;

                titleBox.appendChild(title); titleBox.appendChild(sub);

                const actions = document.createElement('div'); actions.className = 'actions';
                const btnPlay = document.createElement('button'); btnPlay.className = 'btn'; btnPlay.textContent = t('play') || 'Play';
                actions.appendChild(btnPlay);

                head.appendChild(titleBox); head.appendChild(actions);

                // arpeggio content - show immediately, no collapse
                const fbWrap = document.createElement('div'); fbWrap.className = 'fret-wrap';
                fbWrap.dataset.minFret = pattern.minFret;
                fbWrap.dataset.maxFret = pattern.maxFret;

                // render fretboard with arpeggio pattern immediately
                const tuningName = (byId('tuningSel') && byId('tuningSel').value) || tuneSel.value || 'E Standard';
                const labelMode = (byId('labelMode') && byId('labelMode').value) || dispSel.value || 'notes';
                renderArpeggioFretboard(fbWrap, tuningName, topRoot, topIntervals, topRoot, labelMode, pattern.minFret, pattern.maxFret);

                // Setup play button after rendering
                btnPlay.addEventListener('click', () => playArpeggio(fbWrap));

                item.appendChild(head); item.appendChild(fbWrap); list.appendChild(item);
            });

            // Keep mirrored controls in sync with the chords panel controls
            try {
                const globalT = byId('tuningSel');
                if (globalT) {
                    globalT.addEventListener('change', () => { try { tuneSel.value = globalT.value; rerenderOpenFretboards(); } catch (e) { } });
                    tuneSel.addEventListener('change', () => { try { globalT.value = tuneSel.value; globalT.dispatchEvent(new Event('change')); rerenderOpenFretboards(); } catch (e) { } });
                } else {
                    tuneSel.addEventListener('change', () => { rerenderOpenFretboards(); });
                }
            } catch (e) { }
            try {
                const globalLM = byId('labelMode');
                if (globalLM) {
                    globalLM.addEventListener('change', () => { try { dispSel.value = globalLM.value; rerenderOpenFretboards(); } catch (e) { } });
                    dispSel.addEventListener('change', () => { try { globalLM.value = dispSel.value; globalLM.dispatchEvent(new Event('change')); rerenderOpenFretboards(); } catch (e) { } });
                } else {
                    dispSel.addEventListener('change', () => { rerenderOpenFretboards(); });
                }
            } catch (e) { }

            // helper to re-render all arpeggio fretboards (they are always visible)
            function rerenderOpenFretboards() {
                const items = list.querySelectorAll('.fret-wrap');
                items.forEach(fb => {
                    if (!fb) return;
                    const tuningName = (byId('tuningSel') && byId('tuningSel').value) || tuneSel.value || 'E Standard';
                    const labelMode = (byId('labelMode') && byId('labelMode').value) || dispSel.value || 'notes';
                    const minFret = parseInt(fb.dataset.minFret) || 0;
                    const maxFret = parseInt(fb.dataset.maxFret) || 4;
                    renderArpeggioFretboard(fb, tuningName, topRoot, topIntervals, topRoot, labelMode, minFret, maxFret);
                });
            }
        }

        // render arpeggio fretboard - shows only chord notes within the specified fret range
        function renderArpeggioFretboard(mount, tuningName, scaleRoot, scaleIntervals, tonicName, labelMode = 'notes', minFret = 0, maxFret = 4) {
            if (!mount) return;
            mount.innerHTML = '';

            const tuning = COMMON_TUNINGS[tuningName];
            if (!tuning || !tuning.strings) return;

            const strings = tuning.strings;
            const numStrings = strings.length;

            // Always show 5 frets for consistency
            const displayMinFret = minFret;
            const displayMaxFret = minFret + 4; // Always show 5 frets
            const fretRange = 5;

            // Calculate chord pitch classes
            const rootPc = noteToIndex(scaleRoot);
            const chordPcs = new Set(scaleIntervals.map(iv => mod12(rootPc + iv)));

            // Create SVG with larger dimensions
            const fretWidth = 60;
            const stringHeight = 40;
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', `0 0 ${fretRange * fretWidth + 120} ${(numStrings - 1) * stringHeight + 80}`);
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', 'auto');

            // Draw frets (always 5 frets)
            for (let fret = displayMinFret; fret <= displayMaxFret; fret++) {
                const x = (fret - displayMinFret) * fretWidth + 60;
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x);
                line.setAttribute('y1', 30);
                line.setAttribute('x2', x);
                line.setAttribute('y2', 30 + (numStrings - 1) * stringHeight);
                line.setAttribute('stroke', 'var(--fret)');
                line.setAttribute('stroke-width', (fret === 0 && minFret === 0) ? '4' : '2');
                svg.appendChild(line);
            }

            // Draw right border to "close" the diagram
            const rightBorderX = 60 + fretRange * fretWidth;
            const rightBorder = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            rightBorder.setAttribute('x1', rightBorderX);
            rightBorder.setAttribute('y1', 30);
            rightBorder.setAttribute('x2', rightBorderX);
            rightBorder.setAttribute('y2', 30 + (numStrings - 1) * stringHeight);
            rightBorder.setAttribute('stroke', 'var(--fret)');
            rightBorder.setAttribute('stroke-width', '2');
            svg.appendChild(rightBorder);

            // Draw strings (reversed - low E string at bottom)
            for (let str = 0; str < numStrings; str++) {
                const y = 30 + (numStrings - 1 - str) * stringHeight; // Reverse string order
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', 60);
                line.setAttribute('y1', y);
                line.setAttribute('x2', 60 + fretRange * fretWidth);
                line.setAttribute('y2', y);
                line.setAttribute('stroke', 'var(--string)');
                line.setAttribute('stroke-width', '2');
                svg.appendChild(line);
            }

            // Draw fret numbers
            for (let fret = displayMinFret; fret <= displayMaxFret; fret++) {
                if (fret === 0 && minFret === 0) continue; // Skip open string label for open position

                let x;
                if (minFret === 0) {
                    // For open position, place labels at center of fret spaces (fret 1 = between fret 0 and 1, etc.)
                    x = 60 + fret * fretWidth - (fretWidth / 2);
                } else {
                    // For closed positions, place labels at center of fret spaces
                    x = 60 + (fret - displayMinFret + 0.5) * fretWidth;
                }

                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', x);
                text.setAttribute('y', 30 + (numStrings - 1) * stringHeight + 35);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('font-size', '16');
                text.setAttribute('fill', 'var(--muted)');
                text.textContent = fret;
                svg.appendChild(text);
            }

            // Collect notes for playback
            const notesForPlayback = [];

            // Draw chord notes only within the position range
            for (let str = 0; str < numStrings; str++) {
                const openPc = noteToIndex(strings[str].name);

                for (let fret = minFret; fret <= maxFret; fret++) {
                    const notePc = mod12(openPc + fret);

                    // Only show if it's a chord note
                    if (!chordPcs.has(notePc)) continue;

                    // Position calculation: ноты точно в середине ладов
                    let x;
                    if (fret === 0 && minFret === 0) {
                        // Открытые струны - слева от нулевого лада (только для открытой позиции)
                        x = 30;
                    } else {
                        // Зажатые струны - в середине лада между двумя ладовыми линиями
                        let fretPosition;
                        if (minFret === 0) {
                            // Для открытой позиции: лад 1 = позиция 0 (между 0 и 1 ладом), лад 2 = позиция 1, etc.
                            fretPosition = fret - 1;
                        } else {
                            // Для закрытых позиций: стандартное вычисление
                            fretPosition = fret - displayMinFret;
                        }
                        x = 60 + fretPosition * fretWidth + (fretWidth / 2);
                    }
                    // Reversed Y coordinate (low E string at bottom)
                    const y = 30 + (numStrings - 1 - str) * stringHeight;

                    // Create a group for the note (circle + text + click area)
                    const noteGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    noteGroup.style.cursor = 'pointer';

                    // Calculate note with octave for sound
                    const noteOctave = calculateNoteOctave(strings[str].name, strings[str].oct, fret);
                    const noteForSound = ((PC_NAMES[notePc] && PC_NAMES[notePc][0]) || nameForPC(notePc)) + noteOctave;

                    // Create invisible larger click area
                    const clickArea = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    clickArea.setAttribute('cx', x);
                    clickArea.setAttribute('cy', y);
                    clickArea.setAttribute('r', '20'); // Larger clickable area
                    clickArea.setAttribute('fill', 'transparent');
                    clickArea.style.cursor = 'pointer';

                    // Create visible note circle
                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', x);
                    circle.setAttribute('cy', y);
                    circle.setAttribute('r', '14');

                    // Check if it's the root note
                    const isRoot = notePc === rootPc;
                    circle.setAttribute('fill', isRoot ? 'var(--tonic)' : 'var(--note)');
                    circle.setAttribute('stroke', 'white');
                    circle.setAttribute('stroke-width', '1');

                    // Add click handler to the group
                    noteGroup.addEventListener('click', (e) => {
                        e.stopPropagation();
                        console.log('Clicked note:', noteForSound);
                        if (window.Audio && Audio.playNoteName) {
                            const match = noteForSound.match(/([A-G][#b]?)(\d+)/);
                            if (match) {
                                const noteName = match[1];
                                const octave = parseInt(match[2]);
                                Audio.playNoteName(noteName, octave);
                            }
                        } else if (window.Audio && Audio.playScale) {
                            Audio.playScale([noteForSound]);
                        }
                    });

                    // Add label
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', x);
                    text.setAttribute('y', y + 5);
                    text.setAttribute('text-anchor', 'middle');
                    text.setAttribute('font-size', '14');
                    text.setAttribute('font-weight', '600');
                    text.setAttribute('fill', 'white');
                    text.style.pointerEvents = 'none'; // Prevent text from blocking clicks

                    let noteName;
                    if (labelMode === 'notes') {
                        noteName = (PC_NAMES[notePc] && PC_NAMES[notePc][0]) || nameForPC(notePc);
                        text.textContent = noteName;
                    } else {
                        // Calculate interval from root
                        const interval = mod12(notePc - rootPc);
                        const degreeLabels = ['1', '♭2', '2', '♭3', '3', '4', '♭5', '5', '♭6', '6', '♭7', '7'];
                        text.textContent = degreeLabels[interval] || interval.toString();
                        noteName = (PC_NAMES[notePc] && PC_NAMES[notePc][0]) || nameForPC(notePc);
                    }

                    // Add all elements to the group
                    noteGroup.appendChild(clickArea);
                    noteGroup.appendChild(circle);
                    noteGroup.appendChild(text);

                    // Add the group to SVG
                    svg.appendChild(noteGroup);

                    // Add note for playback (note name + octave)
                    const playbackOctave = calculateNoteOctave(strings[str].name, strings[str].oct, fret);
                    notesForPlayback.push({
                        note: noteName + playbackOctave,
                        fret: fret,
                        string: str,
                        pc: notePc
                    });
                }
            }

            // Store notes for playback in the mount element
            mount.dataset.notes = JSON.stringify(notesForPlayback);

            mount.appendChild(svg);
        }

        // play arpeggio with ascending then descending pattern
        // Convert note name to absolute pitch value for sorting
        function noteToAbsolutePitch(noteName) {
            const match = noteName.match(/^([A-G][#b]?)(\d+)$/);
            if (!match) return 0;

            const [, note, octaveStr] = match;
            const octave = parseInt(octaveStr);
            const noteIndex = noteToIndex(note);

            return octave * 12 + noteIndex;
        }

        // Calculate correct octave for a note on fretboard
        function calculateNoteOctave(openNoteName, openOctave, fret) {
            const openNoteIndex = noteToIndex(openNoteName);
            const totalSemitones = openNoteIndex + fret;
            const octaveOffset = Math.floor(totalSemitones / 12);
            return openOctave + octaveOffset;
        }

        function playArpeggio(fretWrap) {
            try {
                const notesData = JSON.parse(fretWrap.dataset.notes || '[]');
                if (notesData.length === 0) return;

                // Sort notes by absolute pitch (frequency)
                const sortedNotes = notesData.sort((a, b) => {
                    return noteToAbsolutePitch(a.note) - noteToAbsolutePitch(b.note);
                });

                // Remove duplicates - keep only unique notes by pitch
                const uniqueNotes = [];
                const seenPitches = new Set();

                for (const noteData of sortedNotes) {
                    const pitch = noteToAbsolutePitch(noteData.note);
                    if (!seenPitches.has(pitch)) {
                        seenPitches.add(pitch);
                        uniqueNotes.push(noteData.note);
                    }
                }

                console.log('Unique notes for arpeggio:', uniqueNotes);

                // Use playArpeggioSequence for proper sequential playback
                playArpeggioSequence(uniqueNotes);

            } catch (e) {
                console.error('Error playing arpeggio:', e);
            }
        }

        // play notes in sequence (ascending then descending)
        function playArpeggioSequence(noteNames) {
            if (!noteNames || noteNames.length === 0) return;

            try {
                console.log('Playing arpeggio sequence:', noteNames);

                // Create ascending sequence
                const ascending = [...noteNames];
                const descending = [...noteNames].reverse();
                const fullSequence = [...ascending, ...descending];

                console.log('Full arpeggio sequence:', fullSequence);

                // Play each note with timing
                const noteDuration = 0.4; // Duration of each note
                const noteStep = 0.5; // Time between note starts

                fullSequence.forEach((noteWithOctave, i) => {
                    const when = i * noteStep;
                    // Parse note name and octave
                    const match = noteWithOctave.match(/([A-G][#b]?)(\d+)/);
                    if (match) {
                        const noteName = match[1];
                        const octave = parseInt(match[2]);
                        setTimeout(() => {
                            if (window.Audio && Audio.playNoteName) {
                                Audio.playNoteName(noteName, octave, noteDuration);
                            }
                        }, when * 1000);
                    }
                });
            } catch (e) {
                console.error('Error in playArpeggioSequence:', e);
            }
        }

        // debounce helper
        function debounce(fn, wait) { let t = null; return function (...args) { if (t) clearTimeout(t); t = setTimeout(() => { fn.apply(this, args); t = null; }, wait); }; }

        // populate top chord pick form (index.html) and wire changes to auto-generate
        function populateTopChordForm() {
            const rootSel = byId('rootSel');
            const qualitySel = byId('qualitySel');
            const bassSel = byId('bassSel');
            const extWrapEl = byId('extWrap');
            const savedPrefsLocal = typeof loadUserPrefs === 'function' ? loadUserPrefs() : null;
            // roots (no empty option — user must pick a tonic)
            if (rootSel) { rootSel.innerHTML = ''; NOTE_NAMES_SHARP.forEach(n => rootSel.appendChild(opt(n, n))); if (savedPrefsLocal && savedPrefsLocal.root) rootSel.value = savedPrefsLocal.root; else if (!rootSel.value) rootSel.value = 'C'; rootSel.style.width = '100%'; rootSel.style.display = 'block'; }
            // qualities (no empty option — must pick a quality) - grouped by category
            if (qualitySel) {
                qualitySel.innerHTML = '';

                // Группы для optgroup
                const categories = {
                    'triads': t('chordGroupTriads') || 'Triads',
                    'seventh': t('chordGroupSeventh') || 'Seventh Chords',
                    'sus': t('chordGroupSus') || 'Suspended'
                };

                // Создаем группы
                Object.keys(categories).forEach(catKey => {
                    const categoryItems = Object.keys(QUALITIES).filter(k => QUALITIES[k].category === catKey);
                    if (categoryItems.length > 0) {
                        const optGroup = document.createElement('optgroup');
                        optGroup.label = categories[catKey];

                        categoryItems.forEach(k => {
                            const q = QUALITIES[k];
                            const label = (q && q.name_en) ? q.name_en : k;
                            optGroup.appendChild(opt(label, k));
                        });

                        qualitySel.appendChild(optGroup);
                    }
                });

                if (savedPrefsLocal && savedPrefsLocal.quality) qualitySel.value = savedPrefsLocal.quality;
                else if (!qualitySel.value) qualitySel.value = Object.keys(QUALITIES)[0] || 'maj';
                qualitySel.style.width = '100%';
                qualitySel.style.display = 'block';
            }
            // set default to maj if present
            if (qualitySel && qualitySel.querySelector('option[value="maj"]') && !qualitySel.value) qualitySel.value = 'maj';
            // bass
            if (bassSel) { bassSel.innerHTML = ''; bassSel.appendChild(opt('-', '')); NOTE_NAMES_SHARP.forEach(n => bassSel.appendChild(opt(n, n))); if (savedPrefsLocal && savedPrefsLocal.bass) bassSel.value = savedPrefsLocal.bass; bassSel.style.width = '100%'; bassSel.style.display = 'block'; }
            // extensions - grouped and filtered by current chord quality
            if (extWrapEl) {
                const updateExtensions = () => {
                    extWrapEl.innerHTML = '';
                    extWrapEl.classList.add('chips');
                    const prefsExts = (savedPrefsLocal && Array.isArray(savedPrefsLocal.exts)) ? savedPrefsLocal.exts : [];
                    const currentQuality = qualitySel ? qualitySel.value : 'maj';

                    // Группы расширений
                    const extCategories = {
                        'basic': t('extGroupBasic') || 'Basic Extensions',
                        'extended': t('extGroupExtended') || 'Extended Tones'
                    };

                    // Группируем по категориям и фильтруем по применимости
                    Object.keys(extCategories).forEach(catKey => {
                        const categoryExts = (window.COMMON_EXTENSIONS || []).filter(e => {
                            if (e.category !== catKey) return false;
                            if (!e.appliesTo) return true; // если не указано - применимо ко всем
                            return e.appliesTo.includes(currentQuality);
                        });

                        if (categoryExts.length > 0) {
                            // Добавляем заголовок группы
                            const groupHeader = document.createElement('div');
                            groupHeader.className = 'ext-group-header';
                            groupHeader.textContent = extCategories[catKey];
                            extWrapEl.appendChild(groupHeader);

                            // Добавляем расширения группы
                            categoryExts.forEach(e => {
                                const id = e.id;
                                const label = e.name_en || id;
                                const lab = document.createElement('label');
                                lab.className = 'chip';
                                const checkedAttr = prefsExts.includes(id) ? 'checked' : '';
                                lab.innerHTML = `<input type="checkbox" value="${id}" id="ext_${id}" ${checkedAttr}><span title="${label}">${id}</span>`;
                                extWrapEl.appendChild(lab);
                            });
                        }
                    });
                };

                updateExtensions();

                // Обновляем расширения при смене качества аккорда
                if (qualitySel) {
                    qualitySel.addEventListener('change', updateExtensions);
                }
            }

            // wire change events -> debounced generate
            const trigger = debounce(() => { try { if (window.generate) window.generate(); } catch (e) { } }, 250);
            [rootSel, qualitySel, bassSel].forEach(s => { if (s) s.addEventListener('change', trigger); });
            // also refresh scales and arpeggios panels when chord selection changes so supported marks update
            [rootSel, qualitySel, extWrapEl].forEach(s => { if (s) s.addEventListener('change', debounce(() => { try { buildScalesPanel(); buildArpeggiosPanel(); } catch (e) { } }, 300)); });
            // also wire tuning selector (if built) and extension checkboxes
            try { const topTuning = byId('tuningSel'); if (topTuning) topTuning.addEventListener('change', trigger); } catch (e) { }
            if (extWrapEl) extWrapEl.addEventListener('change', trigger);
            // trigger initial generation once defaults are set
            try { trigger(); } catch (e) { }
            if (extWrapEl) extWrapEl.addEventListener('change', trigger);
        }

        // populate the top form early
        populateTopChordForm();

        // --- persistence: save/load user preferences (chord selection, tuning, display mode, extensions)
        var PREF_KEY = 'gt_user_prefs_v1';
        var APPLYING_PREFS = false;
        function loadUserPrefs() {
            try {
                const raw = localStorage.getItem(PREF_KEY);
                if (!raw) return null;
                const obj = JSON.parse(raw);
                console.log('Loaded preferences:', obj);
                return obj;
            } catch (e) { console.error('loadUserPrefs failed', e); return null; }
        }
        function saveUserPrefs() {
            if (APPLYING_PREFS) return;
            try {
                const root = (byId('rootSel') && byId('rootSel').value) || null;
                const quality = (byId('qualitySel') && byId('qualitySel').value) || null;
                const bass = (byId('bassSel') && byId('bassSel').value) || null;
                const tuning = (byId('tuningSel') && byId('tuningSel').value) || null;
                const labelMode = (byId('labelMode') && byId('labelMode').value) || null;
                const exts = (byId('extWrap') && Array.from(byId('extWrap').querySelectorAll('input:checked')).map(i => i.value)) || [];
                const obj = { root, quality, bass, tuning, labelMode, exts };
                console.log('Saving preferences:', obj);
                localStorage.setItem(PREF_KEY, JSON.stringify(obj));
            } catch (e) { console.error('saveUserPrefs failed', e); }
        }

        // apply loaded prefs to UI (call after populateTopChordForm has built elements)
        function applyUserPrefs(p) {
            if (!p) return;
            try {
                if (p.root && byId('rootSel')) byId('rootSel').value = p.root;
                if (p.quality && byId('qualitySel')) byId('qualitySel').value = p.quality;
                if (p.bass && byId('bassSel')) byId('bassSel').value = p.bass;
                if (p.tuning && byId('tuningSel')) byId('tuningSel').value = p.tuning;
                if (p.labelMode && byId('labelMode')) byId('labelMode').value = p.labelMode;
                if (Array.isArray(p.exts) && byId('extWrap')) {
                    const inputs = byId('extWrap').querySelectorAll('input[type="checkbox"]');
                    inputs.forEach(inp => { try { inp.checked = p.exts.includes(inp.value); } catch (e) { } });
                }
            } catch (e) { console.error('applyUserPrefs failed', e); }
        }

        // restore preferences now (after the top form and panels are built)
        try {
            const prefs = loadUserPrefs();
            if (prefs) {
                APPLYING_PREFS = true;
                applyUserPrefs(prefs);
                APPLYING_PREFS = false;
            }
        } catch (e) { }

        // wire save on relevant control changes
        try {
            ['rootSel', 'qualitySel', 'bassSel', 'tuningSel', 'labelMode'].forEach(id => {
                const el = byId(id);
                if (!el) return;
                el.addEventListener('change', () => { try { saveUserPrefs(); } catch (e) { } });
            });
            const extWrapEl = byId('extWrap');
            if (extWrapEl) extWrapEl.addEventListener('change', () => { try { saveUserPrefs(); } catch (e) { } });
        } catch (e) { console.error('wiring prefs failed', e); }

        // tab wiring
        const last = localStorage.getItem('gt_last_tab') || 'chords';
        if (last === 'scales') { setActive(tabScales, panelScales); }
        else if (last === 'arpeggios') { setActive(tabArpeggios, panelArpeggios); }
        else { setActive(tabChords, panelChords); }
        tabChords.addEventListener('click', () => { setActive(tabChords, panelChords); localStorage.setItem('gt_last_tab', 'chords'); });
        tabScales.addEventListener('click', () => { setActive(tabScales, panelScales); localStorage.setItem('gt_last_tab', 'scales'); });
        tabArpeggios.addEventListener('click', () => { setActive(tabArpeggios, panelArpeggios); localStorage.setItem('gt_last_tab', 'arpeggios'); });

        // build UI
        buildChordsPanel(); buildScalesPanel(); buildArpeggiosPanel();
        console.debug('[ui] panels built');

        // apply persisted prefs now that panels and listeners are built
        try {
            const prefsAfter = loadUserPrefs();
            if (prefsAfter) {
                APPLYING_PREFS = true;
                applyUserPrefs(prefsAfter);
                // dispatch change events so existing listeners (generate / rerender) run
                ['rootSel', 'qualitySel', 'bassSel', 'tuningSel', 'labelMode'].forEach(id => {
                    const el = byId(id);
                    if (el) el.dispatchEvent(new Event('change'));
                });
                const extWrapEl2 = byId('extWrap'); if (extWrapEl2) extWrapEl2.dispatchEvent(new Event('change'));
                APPLYING_PREFS = false;
            }
        } catch (e) { console.error('apply prefs after build failed', e); }

        // ensure initial generate runs (in case wiring order prevented it)
        try { if (window.generate) { console.debug('[ui] calling window.generate()'); window.generate(); } } catch (e) { console.error('[ui] generate call failed', e); }

        // expose updateUITexts for external wiring
        window.updateUITexts = updateUITexts;

        // language and theme wiring
        const langSel = byId('langSel'); if (langSel) { langSel.addEventListener('change', () => { const v = langSel.value; try { if (typeof window.applyLang === 'function') window.applyLang(v); else { LANG = v; document.documentElement.lang = v; updateUITexts(); } } catch (e) { console.error('lang change handler', e); } }); }
        const themeSelect = byId('themeSelect'); if (themeSelect) { themeSelect.addEventListener('change', () => { document.documentElement.setAttribute('data-theme', themeSelect.value); }); }

    })();

})();
