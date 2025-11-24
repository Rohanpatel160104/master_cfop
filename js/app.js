import { CFOP_ALGORITHMS } from './data.js';
import { Store } from './store.js';
import { GeminiService } from './gemini.js';
import "cubing/twisty";
import { Alg } from "cubing/alg";

// --- Global State ---
let store, gemini, appRoot;
let state = {
    view: 'library', // library, focus, practice
    library: {
        stage: 'F2L',
        search: ''
    },
    focus: {
        case: null,
        algIndex: 0,
        tab: 'practice', // practice, coach
        coachTab: 'analyze',
        analysis: null,
        isLive: false,
        liveStatus: 'disconnected'
    },
    practice: {
        config: true,
        selectedStages: ['OLL', 'PLL'],
        source: 'learned', // learned, all, custom
        customIds: [],
        session: {
            running: false,
            timerState: 'idle', // idle, holding, running, finished
            time: 0,
            scramble: '',
            case: null,
            history: []
        }
    }
};

// --- Initialization ---
async function init() {
    try {
        appRoot = document.getElementById('app');
        if (!appRoot) throw new Error("Root element #app not found");
        
        store = new Store();
        
        // Initialize Gemini Service safely
        try {
            gemini = new GeminiService();
        } catch (e) {
            console.error("Gemini Service Init Failed:", e);
        }

        renderIcons();
        updateApp();
    } catch (e) {
        console.error("Initialization Error:", e);
        if (window.showError) window.showError("Init Failed: " + e.message);
    }
}

// --- Utils ---
function formatTime(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const remS = s % 60;
    const remMs = Math.floor((ms % 1000) / 10);
    if (m > 0) return `${m}:${remS.toString().padStart(2, '0')}.${remMs.toString().padStart(2, '0')}`;
    return `${remS}.${remMs.toString().padStart(2, '0')}`;
}

function getSetupAlg(algStr) {
    try {
        if (!algStr) return "";
        const alg = new Alg(algStr);
        return 'x2 ' + alg.invert().toString();
    } catch { return ""; }
}

// --- Render Functions ---

function renderIcons() {
    if (window.lucide && window.lucide.createIcons) {
        window.lucide.createIcons();
    }
}

function updateApp() {
    if (!appRoot) return;
    appRoot.innerHTML = '';
    
    // Sidebar
    const nav = document.createElement('nav');
    nav.className = "w-20 bg-gray-900 border-r border-white/5 flex flex-col items-center py-6 z-20 shrink-0";
    nav.innerHTML = `
        <div class="mb-8 text-indigo-500"><i data-lucide="box" width="32" height="32"></i></div>
        <div class="flex flex-col w-full gap-2 px-2">
            <button id="nav-lib" class="flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 group ${state.view !== 'practice' ? 'bg-gray-800 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'}">
                <i data-lucide="box" width="20"></i><span class="text-[10px] font-bold mt-1">Learn</span>
            </button>
            <button id="nav-prac" class="flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 group ${state.view === 'practice' ? 'bg-gray-800 text-indigo-400 shadow-lg' : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'}">
                <i data-lucide="timer" width="20"></i><span class="text-[10px] font-bold mt-1">Train</span>
            </button>
        </div>
        ${state.view !== 'practice' ? `
        <div class="flex flex-col w-full gap-4 px-2 mt-8 border-t border-gray-800 pt-8">
            ${['F2L', 'OLL', 'PLL'].map(s => `
                <button data-stage="${s}" class="stage-btn flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 group ${state.library.stage === s ? 'bg-indigo-600 text-white shadow-lg translate-x-1' : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'}">
                    <span class="text-[10px] font-bold tracking-widest mb-1 ${state.library.stage === s ? 'text-indigo-200' : 'text-gray-600'}">STAGE</span>
                    <span class="font-black text-sm">${s}</span>
                </button>
            `).join('')}
        </div>` : ''}
    `;
    appRoot.appendChild(nav);

    const main = document.createElement('main');
    main.className = "flex-1 flex flex-col relative overflow-hidden min-w-0";
    appRoot.appendChild(main);

    if (state.view === 'library') renderLibrary(main);
    else if (state.view === 'focus') renderFocus(main);
    else if (state.view === 'practice') renderPractice(main);

    // Event Listeners for Nav
    nav.querySelector('#nav-lib').onclick = () => { state.view = 'library'; updateApp(); };
    nav.querySelector('#nav-prac').onclick = () => { state.view = 'practice'; updateApp(); };
    nav.querySelectorAll('.stage-btn').forEach(btn => {
        btn.onclick = () => { state.library.stage = btn.dataset.stage; state.view = 'library'; updateApp(); };
    });

    renderIcons();
}

// --- Library View ---

function renderLibrary(container) {
    const { stage, search } = state.library;
    const cases = CFOP_ALGORITHMS.filter(c => c.stage === stage && (c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase())));

    container.innerHTML = `
        <header class="h-16 bg-gray-900/50 border-b border-white/5 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0">
             <div class="flex items-center gap-4 text-sm text-gray-500">
                <span class="text-gray-400 font-medium">${stage}</span>
             </div>
             <div class="relative w-64">
                <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"></i>
                <input type="text" id="search-input" placeholder="Search..." value="${search}" class="w-full bg-gray-950 border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50">
             </div>
        </header>
        <div class="flex-1 overflow-y-auto custom-scrollbar p-8">
            <div class="max-w-[1600px] mx-auto">
                <div class="flex items-center gap-3 mb-6">
                    <i data-lucide="grid-3x3" class="text-indigo-500"></i>
                    <h2 class="text-2xl font-bold text-white">${stage} Cases <span class="ml-3 text-sm font-normal text-gray-500 bg-gray-900 px-2 py-1 rounded-md border border-white/5">${cases.length} Algorithms</span></h2>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                    ${cases.map(c => {
                        const isLearned = store.userData.learned.includes(c.id);
                        const favAlg = store.userData.favorites[c.id];
                        const dispAlg = favAlg || c.algs[0];
                        const setup = getSetupAlg(dispAlg);
                        return `
                        <button class="case-card group flex flex-col bg-gray-900 border ${isLearned ? 'border-green-500/30' : 'border-gray-800'} hover:border-indigo-500/50 rounded-xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 text-left h-full relative" data-id="${c.id}">
                             ${isLearned ? '<div class="absolute top-3 left-3 z-10 bg-green-500 text-white p-1 rounded-full shadow-lg"><i data-lucide="check" width="10" height="10"></i></div>' : ''}
                             ${favAlg ? '<div class="absolute top-3 right-3 z-10 bg-gray-950/80 text-yellow-400 p-1.5 rounded-full"><i data-lucide="star" width="12" height="12" fill="currentColor"></i></div>' : ''}
                             <div class="w-full bg-gray-950/30 relative p-6 flex items-center justify-center border-b border-gray-800/50 min-h-[12rem]">
                                <twisty-player experimental-setup-alg="${setup}" visualization="${stage==='F2L'?'3D':'2D'}" background="none" control-panel="none" class="w-32 h-32 pointer-events-none"></twisty-player>
                             </div>
                             <div class="px-5 py-4 bg-gray-900 flex-1 flex flex-col gap-1">
                                <div class="flex justify-between items-center w-full">
                                    <span class="font-mono text-[11px] font-bold uppercase ${isLearned ? 'text-green-400' : 'text-indigo-400'}">${c.id}</span>
                                </div>
                                <h3 class="text-sm font-semibold text-gray-200 truncate">${c.name}</h3>
                             </div>
                        </button>
                        `
                    }).join('')}
                </div>
            </div>
        </div>
    `;

    // Events
    const sInput = container.querySelector('#search-input');
    if (sInput) {
        // Debounce search focus preservation
        sInput.selectionStart = sInput.selectionEnd = sInput.value.length;
        sInput.focus();
        sInput.oninput = (e) => { 
            state.library.search = e.target.value; 
            updateApp(); 
            // restore focus
            setTimeout(() => {
               const el = document.getElementById('search-input');
               if(el) el.focus();
            }, 0);
        };
    }

    container.querySelectorAll('.case-card').forEach(card => {
        card.onclick = () => {
            const c = CFOP_ALGORITHMS.find(x => x.id === card.dataset.id);
            state.focus.case = c;
            const fav = store.userData.favorites[c.id];
            const allAlgs = [...c.algs, ...(store.userData.customAlgs[c.id] || [])];
            if (fav && !allAlgs.includes(fav)) allAlgs.push(fav);
            state.focus.algIndex = fav ? allAlgs.indexOf(fav) : 0;
            if(state.focus.algIndex === -1) state.focus.algIndex = 0;
            
            state.view = 'focus';
            updateApp();
        }
    });
}

// --- Focus View ---

function renderFocus(container) {
    const c = state.focus.case;
    if (!c) return;

    const custom = store.userData.customAlgs[c.id] || [];
    const baseAlgs = c.algs;
    const fav = store.userData.favorites[c.id];
    let allAlgs = [...baseAlgs, ...custom];
    if (fav && !allAlgs.includes(fav)) allAlgs.push(fav);
    
    if (state.focus.algIndex >= allAlgs.length) state.focus.algIndex = 0;
    const currentAlg = allAlgs[state.focus.algIndex];
    const isFav = fav === currentAlg;
    const isLearned = store.userData.learned.includes(c.id);
    const setup = getSetupAlg(currentAlg);

    container.innerHTML = `
        <header class="h-16 bg-gray-900/50 border-b border-white/5 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0">
            <div class="flex items-center gap-4">
                <button id="back-btn" class="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-2 text-sm font-medium">
                    <i data-lucide="chevron-left"></i> Back
                </button>
                <div class="flex items-center gap-2 text-sm text-gray-500">
                    <span class="text-gray-400 font-medium">${c.stage}</span>
                    <i data-lucide="arrow-right" width="14"></i>
                    <span class="text-indigo-400 font-medium">${c.name}</span>
                </div>
            </div>
        </header>
        <div class="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
             <!-- 3D Stage -->
             <div class="flex-1 bg-gradient-to-b from-gray-900 to-gray-950 relative flex items-center justify-center min-h-[50%]">
                 <twisty-player
                    id="focus-player"
                    alg="${currentAlg}"
                    experimental-setup-alg="${setup}"
                    visualization="3D"
                    background="none"
                    control-panel="bottom-row"
                    camera-latitude="35"
                    camera-longitude="30"
                    camera-distance="5.5"
                    class="w-full h-full max-h-[70vh]"
                 ></twisty-player>
             </div>
             
             <!-- Sidebar -->
             <div class="w-full lg:w-96 bg-gray-900 border-l border-white/5 flex flex-col z-20 shadow-xl h-full">
                 <div class="flex border-b border-white/5 shrink-0">
                     <button id="tab-prac" class="flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${state.focus.tab === 'practice' ? 'border-indigo-500 text-white bg-white/5' : 'border-transparent text-gray-500'}"><i data-lucide="zap" width="16"></i> Practice</button>
                     <button id="tab-coach" class="flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${state.focus.tab === 'coach' ? 'border-purple-500 text-white bg-white/5' : 'border-transparent text-gray-500'}"><i data-lucide="brain-circuit" width="16"></i> AI Coach</button>
                 </div>
                 
                 <div class="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
                     ${state.focus.tab === 'practice' ? `
                         <div class="space-y-6">
                            <div class="flex flex-col gap-3">
                                <div class="flex justify-between items-end">
                                    <label class="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Algorithm</label>
                                    <div class="flex items-center gap-1">
                                         <button id="toggle-learned" class="p-1.5 rounded hover:bg-white/5 ${isLearned ? 'text-green-400 bg-green-500/10' : 'text-gray-600'}"><i data-lucide="graduation-cap" width="18"></i></button>
                                         <button id="toggle-fav" class="p-1.5 rounded hover:bg-white/5 ${isFav ? 'text-yellow-400' : 'text-gray-600'}"><i data-lucide="star" width="16" fill="${isFav ? 'currentColor' : 'none'}"></i></button>
                                    </div>
                                </div>
                                <select id="alg-select" class="w-full bg-gray-800 text-sm text-white rounded-lg px-3 py-2 border border-gray-700 focus:outline-none">
                                    ${allAlgs.map((a, i) => `<option value="${i}" ${i === state.focus.algIndex ? 'selected' : ''}>${i+1}. ${a} ${store.userData.favorites[c.id]===a ? '★' : ''}</option>`).join('')}
                                </select>
                                <textarea readonly class="w-full bg-gray-950/50 border border-gray-800 rounded-xl p-4 font-mono text-lg text-indigo-200 resize-none h-32">${currentAlg}</textarea>
                            </div>
                            <div>
                                <label class="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Setup</label>
                                <div class="bg-gray-950/30 border border-white/5 rounded-lg p-3 font-mono text-xs text-orange-300/80 break-words mt-2">${setup || "No setup"}</div>
                            </div>
                         </div>
                     ` : `
                        <!-- COACH TAB -->
                        <div class="space-y-4">
                            <!-- Live Voice -->
                            <div class="border rounded-xl p-4 flex flex-col gap-3 ${state.focus.isLive ? 'bg-indigo-950/30 border-indigo-500/50' : 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/20'}">
                                <div class="flex justify-between items-center">
                                     <div class="flex items-center gap-2">
                                        <i data-lucide="bot" class="${state.focus.isLive ? 'text-indigo-400' : 'text-indigo-300'}" width="20"></i>
                                        <span class="text-sm font-bold text-indigo-200">Coach Kore (Live)</span>
                                     </div>
                                     ${state.focus.isLive ? '<span class="text-[10px] text-red-300 font-bold uppercase tracking-wider animate-pulse">Live</span>' : ''}
                                </div>
                                <button id="live-btn" class="w-full py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${state.focus.isLive ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-indigo-600 text-white shadow-lg'}">
                                    ${state.focus.liveStatus === 'connecting' ? 'Connecting...' : state.focus.isLive ? 'End Session' : 'Start Live Session'}
                                </button>
                            </div>

                            <!-- Text Analysis -->
                            ${!state.focus.analysis ? `
                                <button id="analyze-btn" class="w-full py-3 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg font-medium flex items-center justify-center gap-2 text-sm">
                                    <i data-lucide="sparkles" width="16"></i> Text Breakdown
                                </button>
                            ` : `
                                <div class="bg-gray-950/50 border border-indigo-500/20 p-5 rounded-xl text-sm leading-relaxed text-gray-300 animate-in fade-in">
                                    ${state.focus.analysis.split('\n').map(l => `<p class="mb-2">${l.replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-300">$1</strong>')}</p>`).join('')}
                                </div>
                            `}
                        </div>
                     `}
                 </div>
             </div>
        </div>
    `;

    // Handlers
    container.querySelector('#back-btn').onclick = () => { state.view = 'library'; updateApp(); };
    container.querySelector('#tab-prac').onclick = () => { state.focus.tab = 'practice'; updateApp(); };
    container.querySelector('#tab-coach').onclick = () => { state.focus.tab = 'coach'; updateApp(); };

    if (state.focus.tab === 'practice') {
        container.querySelector('#toggle-fav').onclick = () => { store.toggleFavorite(c.id, currentAlg); updateApp(); };
        container.querySelector('#toggle-learned').onclick = () => { store.toggleLearned(c.id); updateApp(); };
        container.querySelector('#alg-select').onchange = (e) => { state.focus.algIndex = parseInt(e.target.value); updateApp(); };
    } else {
        const liveBtn = container.querySelector('#live-btn');
        if (liveBtn) {
            liveBtn.onclick = () => {
                if (state.focus.isLive) {
                    gemini.stopLiveSession();
                    state.focus.isLive = false;
                    state.focus.liveStatus = 'disconnected';
                    updateApp();
                } else {
                    state.focus.liveStatus = 'connecting';
                    updateApp();
                    gemini.startLiveSession(c.stage, c.name, currentAlg, (status) => {
                        state.focus.liveStatus = status;
                        state.focus.isLive = status === 'connected';
                        updateApp();
                    });
                    // Hook for animation sync
                    gemini.onPlaybackStart = () => {
                        const p = document.getElementById('focus-player');
                        if (p) { p.timestamp = 0; p.play(); }
                    };
                }
            };
        }
        const analyzeBtn = container.querySelector('#analyze-btn');
        if (analyzeBtn) {
            analyzeBtn.onclick = async () => {
                analyzeBtn.innerText = "Analyzing...";
                try {
                    const res = await gemini.analyze(c.stage, c.name, currentAlg);
                    state.focus.analysis = res;
                } catch(e) {
                    alert("Analysis failed: " + e.message);
                }
                updateApp();
            };
        }
    }
}

// --- Practice View ---

function renderPractice(container) {
    if (state.practice.config) {
        container.innerHTML = `
            <div class="h-full bg-gray-950 p-8 overflow-y-auto custom-scrollbar flex flex-col items-center">
                <div class="w-full max-w-2xl space-y-8 animate-in fade-in">
                    <div class="text-center space-y-2">
                        <div class="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-1 ring-indigo-500/20"><i data-lucide="trophy" class="text-indigo-500" width="32"></i></div>
                        <h1 class="text-3xl font-bold text-white">Practice Mode</h1>
                    </div>
                    <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Stages</h3>
                        <div class="flex gap-3">
                            ${['F2L', 'OLL', 'PLL'].map(s => `
                                <button class="stage-select flex-1 py-4 rounded-xl border-2 text-sm font-bold transition-all ${state.practice.selectedStages.includes(s) ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-gray-800 bg-gray-900/50 text-gray-500'}" data-stage="${s}">${s}</button>
                            `).join('')}
                        </div>
                    </div>
                    <button id="start-session" class="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold rounded-2xl shadow-xl hover:scale-[1.02] transition-all">Start Session</button>
                </div>
            </div>
        `;
        container.querySelectorAll('.stage-select').forEach(b => b.onclick = () => {
            const s = b.dataset.stage;
            if (state.practice.selectedStages.includes(s)) state.practice.selectedStages = state.practice.selectedStages.filter(x => x !== s);
            else state.practice.selectedStages.push(s);
            updateApp();
        });
        container.querySelector('#start-session').onclick = () => {
             startPracticeSession();
        };
    } else {
        // Running
        const { timerState, time, scramble, case: currentCase, history } = state.practice.session;
        container.innerHTML = `
            <div class="flex h-full bg-gray-950">
                <div class="flex-1 flex flex-col relative">
                     <div class="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-gray-900/30 shrink-0">
                        <button id="stop-prac" class="text-gray-500 hover:text-white flex items-center gap-2 text-sm font-medium"><i data-lucide="settings" width="16"></i> Configure</button>
                     </div>
                     <div class="flex-1 flex flex-col items-center justify-center relative p-8">
                         <div class="text-center space-y-4 mb-12 transition-opacity duration-300 ${timerState==='running'?'opacity-0':''}">
                            <h2 class="text-gray-500 text-sm font-bold tracking-widest uppercase">Scramble (Setup)</h2>
                            <div class="text-2xl md:text-3xl font-mono text-gray-200 bg-gray-900/50 px-8 py-6 rounded-xl border border-white/5 shadow-lg max-w-4xl leading-relaxed">${scramble}</div>
                         </div>
                         <div class="relative mb-16 transition-all ${timerState==='running'?'scale-125':''}">
                             <span class="text-8xl md:text-9xl font-mono font-bold tabular-nums select-none ${timerState==='running'?'text-white':timerState==='holding'?'text-green-500':'text-gray-200'}">${formatTime(time)}</span>
                         </div>
                         ${timerState !== 'running' ? `
                         <div class="absolute bottom-12 flex gap-4">
                             <button id="next-scramble" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg">Next Scramble</button>
                         </div>` : ''}
                     </div>
                </div>
                <div class="w-64 bg-gray-900 border-l border-white/5 flex flex-col shrink-0">
                     <div class="p-5 border-b border-white/5 flex items-center gap-2 text-gray-400 font-bold text-xs uppercase">History</div>
                     <div class="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                        ${history.map((h, i) => `
                            <div class="p-3 rounded-lg bg-gray-950/50 border border-transparent flex justify-between items-center">
                                <span class="text-xs font-mono text-gray-500">${history.length - i}.</span>
                                <span class="font-mono font-bold text-gray-300">${formatTime(h.time)}</span>
                            </div>
                        `).join('')}
                     </div>
                </div>
            </div>
        `;
        
        container.querySelector('#stop-prac').onclick = () => { state.practice.config = true; state.practice.session.running = false; updateApp(); };
        const nextBtn = container.querySelector('#next-scramble');
        if (nextBtn) nextBtn.onclick = () => { nextPracticeCase(); updateApp(); };
    }
}

// --- Practice Logic ---

function startPracticeSession() {
    state.practice.config = false;
    state.practice.session.running = true;
    state.practice.session.history = [];
    nextPracticeCase();
    updateApp();
    
    window.addEventListener('keydown', handleTimerKey);
    window.addEventListener('keyup', handleTimerKeyUp);
}

function nextPracticeCase() {
    const candidates = CFOP_ALGORITHMS.filter(c => state.practice.selectedStages.includes(c.stage));
    if (candidates.length === 0) return;
    const c = candidates[Math.floor(Math.random() * candidates.length)];
    state.practice.session.case = c;
    state.practice.session.scramble = getSetupAlg(c.algs[0]);
    state.practice.session.timerState = 'idle';
    state.practice.session.time = 0;
}

let startTime;

function handleTimerKey(e) {
    if (!state.practice.session.running) return;
    if (e.code === 'Space') {
        e.preventDefault();
        if (state.practice.session.timerState === 'idle') {
            state.practice.session.timerState = 'holding';
            updateApp();
        } else if (state.practice.session.timerState === 'running') {
            stopTimer();
        }
    }
}

function handleTimerKeyUp(e) {
    if (!state.practice.session.running) return;
    if (e.code === 'Space' && state.practice.session.timerState === 'holding') {
        startTimer();
    }
}

function startTimer() {
    state.practice.session.timerState = 'running';
    startTime = performance.now();
    updateApp();
    
    function tick() {
        if (state.practice.session.timerState !== 'running') return;
        state.practice.session.time = performance.now() - startTime;
        const el = document.querySelector('.font-mono.text-9xl, .font-mono.text-8xl');
        if(el) el.innerText = formatTime(state.practice.session.time);
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

function stopTimer() {
    state.practice.session.timerState = 'finished';
    state.practice.session.time = performance.now() - startTime;
    state.practice.session.history.unshift({ time: state.practice.session.time });
    updateApp();
}

// --- Boot ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}