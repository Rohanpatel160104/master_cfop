import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GeminiAnalysis } from './components/GeminiAnalysis';
import { PracticeMode } from './components/PracticeMode';
import { 
  Copy, Check, RotateCcw, Settings, Search, 
  Box, BrainCircuit, ChevronLeft, Grid3X3,
  Layers, ArrowRight, Zap, Star, Plus, Trash2, Save, X,
  Eye, EyeOff, Shuffle, HelpCircle, GraduationCap, Trophy, Mic,
  Timer
} from 'lucide-react';
import "cubing/twisty";
import { Alg } from "cubing/alg";
import { CFOP_ALGORITHMS, Stage, AlgorithmCase } from './data/cfopAlgorithms';
import { UserData, SolveRecord } from './types';

type ViewMode = 'grid' | 'focus';
type Tab = 'practice' | 'coach';
type AppMode = 'library' | 'practice';

// --- Components ---

const ProgressCard: React.FC<{
    stage: Stage;
    total: number;
    learned: number;
    onClick: () => void;
}> = ({ stage, total, learned, onClick }) => {
    const percentage = Math.round((learned / total) * 100) || 0;
    // Radius reduced to 26 to fit inside the 64x64 container with a 6px stroke
    const radius = 26;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Color mapping
    const colors = {
        'F2L': 'text-blue-500',
        'OLL': 'text-yellow-500',
        'PLL': 'text-red-500'
    };

    return (
        <button 
            onClick={onClick}
            className="w-full text-left bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4 relative overflow-hidden group hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all cursor-pointer"
        >
            <div className="relative w-16 h-16 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
                    <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        className="text-gray-800"
                    />
                    <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className={`transition-all duration-1000 ease-out ${colors[stage]}`}
                        strokeLinecap="round"
                    />
                </svg>
                <span className="absolute text-xs font-bold text-white">{percentage}%</span>
            </div>
            <div className="flex flex-col z-10">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider group-hover:text-indigo-400 transition-colors">Practice</span>
                <span className="text-lg font-bold text-gray-200 group-hover:text-white transition-colors">{stage}</span>
                <span className="text-xs text-gray-400">{learned} / {total} learned</span>
            </div>
            
            <div className={`absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-${colors[stage].replace('text-', '')} to-transparent opacity-20`} />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={16} className="text-indigo-500" />
            </div>
        </button>
    );
}

const CaseCard: React.FC<{ 
  data: AlgorithmCase; 
  onClick: (c: AlgorithmCase) => void;
  favoriteAlg?: string;
  isLearned: boolean;
}> = ({ 
  data, 
  onClick,
  favoriteAlg,
  isLearned
}) => {
  // Calculate setup alg (inverse) for the thumbnail.
  const setupAlg = useMemo(() => {
    try {
      let setup = "";
      const rotation = 'x2 ';
      const algString = favoriteAlg || (data.algs.length > 0 ? data.algs[0] : "");
      if (algString) {
        setup = new Alg(algString).invert().toString();
      }
      return rotation + setup;
    } catch (e) {
      return "";
    }
  }, [data.algs, favoriteAlg]);

  const vizType = data.stage === 'F2L' ? '3D' : '2D';

  return (
    <button 
      onClick={() => onClick(data)}
      className={`group flex flex-col bg-gray-900 border hover:border-indigo-500/50 rounded-xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 text-left h-full relative ${isLearned ? 'border-green-500/30' : 'border-gray-800'}`}
    >
      {isLearned && (
        <div className="absolute top-3 left-3 z-10 bg-green-500 text-white p-1 rounded-full shadow-lg shadow-green-900/50">
            <Check size={10} strokeWidth={4} />
        </div>
      )}
      
      {favoriteAlg && (
        <div className="absolute top-3 right-3 z-10 bg-gray-950/80 text-yellow-400 p-1.5 rounded-full backdrop-blur-sm shadow-sm border border-yellow-500/20">
            <Star size={12} fill="currentColor" />
        </div>
      )}

      <div className="w-full bg-gray-950/30 relative p-6 flex items-center justify-center border-b border-gray-800/50 min-h-[12rem]">
        <div className="w-32 h-32">
            <twisty-player
            experimental-setup-alg={setupAlg}
            visualization={vizType}
            background="none"
            control-panel="none"
            className="w-full h-full pointer-events-none"
            ></twisty-player>
        </div>
        <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors" />
      </div>

      <div className="px-5 py-4 bg-gray-900 flex-1 flex flex-col gap-1">
        <div className="flex justify-between items-center w-full">
            <span className={`font-mono text-[11px] font-bold uppercase ${isLearned ? 'text-green-400' : 'text-indigo-400'}`}>{data.id}</span>
            <span className="text-[10px] font-bold text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">{data.stage}</span>
        </div>
        <h3 className="text-sm font-semibold text-gray-200 group-hover:text-white truncate w-full" title={data.name}>
            {data.name}
        </h3>
        
        {favoriteAlg && (
            <div className="mt-3 pt-3 border-t border-gray-800/80 w-full">
                 <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1">
                    <Star size={10} className="text-yellow-500 fill-yellow-500" /> Saved Algorithm
                </p>
                <p className="font-mono text-[11px] leading-normal text-yellow-100/90 break-words">
                    {favoriteAlg}
                </p>
            </div>
        )}
      </div>
    </button>
  );
};

export default function App() {
  // -- State --
  const [appMode, setAppMode] = useState<AppMode>('library');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedStage, setSelectedStage] = useState<Stage>('F2L');
  const [searchQuery, setSearchQuery] = useState("");
  
  // New State for Practice Deep Linking
  const [practiceInitialStage, setPracticeInitialStage] = useState<Stage | null>(null);

  // User Data Persistence
  const [userData, setUserData] = useState<UserData>(() => {
      try {
          const stored = localStorage.getItem('algcubing_data');
          const parsed = stored ? JSON.parse(stored) : null;
          
          if (!parsed) return { favorites: {}, customAlgs: {}, learned: [], history: [] };

          // Migration for old data structures
          return {
              favorites: parsed.favorites || {},
              customAlgs: parsed.customAlgs || {},
              learned: parsed.learned || [],
              history: parsed.history || []
          };
      } catch {
          return { favorites: {}, customAlgs: {}, learned: [], history: [] };
      }
  });

  // Focus Mode State
  const [selectedCase, setSelectedCase] = useState<AlgorithmCase | null>(null);
  const [selectedAlgIndex, setSelectedAlgIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('practice');
  const [isAddingAlg, setIsAddingAlg] = useState(false);
  const [newAlgText, setNewAlgText] = useState("");
  
  // Trainer Mode State
  const [isTrainerMode, setIsTrainerMode] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  // Player State
  const [algInput, setAlgInput] = useState("");
  const [setupInput, setSetupInput] = useState("");
  const [tempo, setTempo] = useState(2.5);
  const [isCopied, setIsCopied] = useState(false);
  
  const playerRef = useRef<HTMLElement>(null);

  // -- Effects --

  // Persist User Data
  useEffect(() => {
      localStorage.setItem('algcubing_data', JSON.stringify(userData));
  }, [userData]);

  // Computed list of algs for current case
  const mergedAlgs = useMemo(() => {
      if (!selectedCase) return [];
      const custom = userData.customAlgs[selectedCase.id] || [];
      const base = [...selectedCase.algs, ...custom];
      const fav = userData.favorites[selectedCase.id];
      if (fav && !base.includes(fav)) {
          return [...base, fav];
      }
      return base;
  }, [selectedCase, userData.customAlgs, userData.favorites]);

  // Calculate setup alg when case or selected index changes
  useEffect(() => {
    if (selectedCase && mergedAlgs.length > 0) {
        const safeIndex = Math.min(selectedAlgIndex, mergedAlgs.length - 1);
        if (safeIndex !== selectedAlgIndex && safeIndex >= 0) {
            setSelectedAlgIndex(safeIndex);
            return;
        }

        const currentAlg = mergedAlgs[safeIndex] || mergedAlgs[0];
        setAlgInput(currentAlg);
        setIsRevealed(false);
        
        try {
            const alg = new Alg(currentAlg);
            const inverse = alg.invert();
            const rotation = 'x2 ';
            setSetupInput(rotation + inverse.toString());
            
            if (playerRef.current) {
              (playerRef.current as any).timestamp = 0;
            }
        } catch (e) {
            console.error("Error calculating inverse", e);
        }
    }
  }, [selectedCase, selectedAlgIndex, mergedAlgs]);

  // -- Handlers --

  const handleSelectCase = (c: AlgorithmCase) => {
    setSelectedCase(c);
    
    let allAlgs = [...c.algs, ...(userData.customAlgs[c.id] || [])];
    const fav = userData.favorites[c.id];
    if (fav && !allAlgs.includes(fav)) {
        allAlgs.push(fav);
    }

    const favIndex = fav ? allAlgs.indexOf(fav) : 0;
    setSelectedAlgIndex(favIndex !== -1 ? favIndex : 0);
    setViewMode('focus');
    setIsAddingAlg(false);
    setIsRevealed(false);
  };

  const handleUpdateAlg = (alg: string) => {
    if (!selectedCase) return;
    const index = mergedAlgs.indexOf(alg);
    if (index !== -1) {
      setSelectedAlgIndex(index);
    } else {
      setAlgInput(alg);
    }
  };

  const handleBackToGrid = () => {
    setViewMode('grid');
    setSelectedCase(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(algInput);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleFavorite = () => {
      if (!selectedCase) return;
      const currentAlg = mergedAlgs[selectedAlgIndex];
      setUserData(prev => {
          const isFav = prev.favorites[selectedCase.id] === currentAlg;
          const newFavs = { ...prev.favorites };
          if (isFav) {
              delete newFavs[selectedCase.id];
          } else {
              newFavs[selectedCase.id] = currentAlg;
          }
          return { ...prev, favorites: newFavs };
      });
  };

  const toggleLearned = () => {
      if (!selectedCase) return;
      setUserData(prev => {
          const isLearned = prev.learned.includes(selectedCase.id);
          return {
              ...prev,
              learned: isLearned 
                ? prev.learned.filter(id => id !== selectedCase.id)
                : [...prev.learned, selectedCase.id]
          };
      });
  };

  const saveNewAlg = () => {
      if (!selectedCase || !newAlgText.trim()) return;
      setUserData(prev => ({
          ...prev,
          customAlgs: {
              ...prev.customAlgs,
              [selectedCase.id]: [...(prev.customAlgs[selectedCase.id] || []), newAlgText.trim()]
          }
      }));
      const newLength = mergedAlgs.length + 1; 
      setSelectedAlgIndex(newLength - 1);
      setNewAlgText("");
      setIsAddingAlg(false);
  };

  const deleteCurrentAlg = () => {
      if (!selectedCase) return;
      const currentAlg = mergedAlgs[selectedAlgIndex];
      if (selectedAlgIndex < selectedCase.algs.length) return;
      setUserData(prev => ({
          ...prev,
          customAlgs: {
              ...prev.customAlgs,
              [selectedCase.id]: (prev.customAlgs[selectedCase.id] || []).filter(a => a !== currentAlg)
          },
          favorites: prev.favorites[selectedCase.id] === currentAlg 
            ? (({ [selectedCase.id]: _, ...rest }) => rest)(prev.favorites)
            : prev.favorites
      }));
      setSelectedAlgIndex(0);
  };

  const handleRandomCase = () => {
    const candidates = filteredCases;
    if (candidates.length === 0) return;
    let nextCase = candidates[Math.floor(Math.random() * candidates.length)];
    if (candidates.length > 1 && selectedCase) {
        while (nextCase.id === selectedCase.id) {
            nextCase = candidates[Math.floor(Math.random() * candidates.length)];
        }
    }
    handleSelectCase(nextCase);
  };

  // Playback Control for Voice Integration
  const handleVoicePlayback = () => {
      if (playerRef.current) {
          const player = playerRef.current as any;
          player.timestamp = 0;
          player.tempo = 1.5; // Slower tempo for tutorial
          player.play();
      }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (appMode === 'library' && viewMode === 'focus' && isTrainerMode) {
        if (e.code === 'Space') {
          e.preventDefault(); 
          handleRandomCase();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appMode, viewMode, isTrainerMode, selectedCase]);

  // -- Filtering & Stats --
  const filteredCases = CFOP_ALGORITHMS.filter(c => {
    const matchesStage = c.stage === selectedStage;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const getStageStats = (stage: Stage) => {
      const cases = CFOP_ALGORITHMS.filter(c => c.stage === stage);
      const learnedCount = cases.filter(c => userData.learned.includes(c.id)).length;
      return { total: cases.length, learned: learnedCount };
  };

  const isCurrentFavorite = selectedCase && userData.favorites[selectedCase.id] === mergedAlgs[selectedAlgIndex];
  const isCurrentCustom = selectedCase && selectedAlgIndex >= selectedCase.algs.length;
  const isCurrentLearned = selectedCase && userData.learned.includes(selectedCase.id);

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden selection:bg-indigo-500/30">
      
      {/* --- LEFT NAV (Slim) --- */}
      <nav className="w-20 bg-gray-900 border-r border-white/5 flex flex-col items-center py-6 z-20">
        <div className="mb-8 text-indigo-500">
          <Box size={32} strokeWidth={2} />
        </div>
        
        <div className="flex flex-col w-full gap-2 px-2">
            <button
                onClick={() => setAppMode('library')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 group ${
                    appMode === 'library'
                    ? 'bg-gray-800 text-white shadow-lg' 
                    : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                }`}
                title="Library"
            >
                <Box size={20} />
                <span className="text-[10px] font-bold mt-1">Learn</span>
            </button>

             <button
                onClick={() => {
                    setPracticeInitialStage(null);
                    setAppMode('practice');
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 group ${
                    appMode === 'practice'
                    ? 'bg-gray-800 text-indigo-400 shadow-lg' 
                    : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                }`}
                title="Practice Timer"
            >
                <Timer size={20} />
                <span className="text-[10px] font-bold mt-1">Train</span>
            </button>
        </div>

        {appMode === 'library' && (
            <div className="flex flex-col w-full gap-4 px-2 mt-8 border-t border-gray-800 pt-8">
            {(['F2L', 'OLL', 'PLL'] as Stage[]).map((stage) => (
                <button
                key={stage}
                onClick={() => {
                    setSelectedStage(stage);
                    setViewMode('grid');
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 group ${
                    selectedStage === stage 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 translate-x-1' 
                    : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                }`}
                >
                <div className={`text-[10px] font-bold tracking-widest mb-1 ${selectedStage === stage ? 'text-indigo-200' : 'text-gray-600 group-hover:text-gray-500'}`}>
                    STAGE
                </div>
                <span className="font-black text-sm">{stage}</span>
                </button>
            ))}
            </div>
        )}
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {appMode === 'practice' ? (
             <PracticeMode 
                allCases={CFOP_ALGORITHMS}
                userData={userData}
                setUserData={setUserData}
                initialStage={practiceInitialStage}
             />
        ) : (
            <>
                {/* Top Bar (Library Only) */}
                <header className="h-16 bg-gray-900/50 border-b border-white/5 backdrop-blur-md flex items-center justify-between px-8 z-10">
                <div className="flex items-center gap-4">
                    {viewMode === 'focus' && (
                    <button 
                        onClick={handleBackToGrid}
                        className="p-2 -ml-2 mr-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
                    >
                        <ChevronLeft size={18} />
                        Back to Library
                    </button>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="text-gray-400 font-medium">{selectedStage}</span>
                    {selectedCase && (
                        <>
                        <ArrowRight size={14} />
                        <span className="text-indigo-400 font-medium">{selectedCase.name}</span>
                        </>
                    )}
                    </div>
                </div>
                {viewMode === 'grid' && (
                    <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder={`Search ${selectedStage}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-950 border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50 transition-all"
                    />
                    </div>
                )}
                </header>

                {/* Viewport Content */}
                <div className="flex-1 overflow-hidden relative">
                
                {/* GRID VIEW */}
                {viewMode === 'grid' && (
                    <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-8">
                    <div className="max-w-[1600px] mx-auto space-y-10">
                        
                        {/* Dashboard */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(['F2L', 'OLL', 'PLL'] as Stage[]).map(stage => {
                                const stats = getStageStats(stage);
                                return (
                                    <ProgressCard 
                                        key={stage} 
                                        stage={stage} 
                                        total={stats.total} 
                                        learned={stats.learned} 
                                        onClick={() => {
                                            setPracticeInitialStage(stage);
                                            setAppMode('practice');
                                        }}
                                    />
                                );
                            })}
                        </section>

                        <div>
                            <div className="flex items-center gap-3 mb-6">
                            <Grid3X3 className="text-indigo-500" />
                            <h2 className="text-2xl font-bold text-white">
                                {selectedStage} Cases
                                <span className="ml-3 text-sm font-normal text-gray-500 bg-gray-900 px-2 py-1 rounded-md border border-white/5">
                                {filteredCases.length} Algorithms
                                </span>
                            </h2>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                            {filteredCases.map((c) => (
                                <CaseCard 
                                    key={c.id} 
                                    data={c} 
                                    onClick={handleSelectCase} 
                                    favoriteAlg={userData.favorites[c.id]}
                                    isLearned={userData.learned.includes(c.id)}
                                />
                            ))}
                            </div>
                        </div>
                    </div>
                    </div>
                )}

                {/* FOCUS VIEW */}
                {viewMode === 'focus' && selectedCase && (
                    <div className="absolute inset-0 flex flex-col lg:flex-row">
                    
                    {/* Stage (3D Cube) */}
                    <div className="flex-1 bg-gradient-to-b from-gray-900 to-gray-950 relative flex flex-col items-center justify-center group/stage">
                        <twisty-player
                        ref={playerRef}
                        alg={algInput}
                        experimental-setup-alg={setupInput}
                        visualization="3D"
                        background="none"
                        control-panel="bottom-row"
                        tempo={tempo}
                        camera-latitude={35}
                        camera-longitude={30}
                        camera-distance={5.5}
                        className="w-full h-full max-h-[70vh]"
                        ></twisty-player>

                        {isTrainerMode && (
                            <div className="absolute bottom-8 left-8 flex gap-2 animate-in fade-in slide-in-from-bottom-2">
                                <button 
                                    onClick={handleRandomCase}
                                    className="bg-gray-800/80 backdrop-blur text-white border border-white/10 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 hover:border-indigo-500 transition-all flex items-center gap-2 shadow-xl"
                                >
                                    <Shuffle size={16} />
                                    Next Scramble <span className="text-[10px] opacity-50 bg-black/30 px-1.5 rounded ml-1">SPACE</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Panel (Controls & Coach) */}
                    <div className="w-full lg:w-96 bg-gray-900 border-l border-white/5 flex flex-col z-20 shadow-xl">
                        
                        <div className="flex border-b border-white/5">
                        <button 
                            onClick={() => setActiveTab('practice')}
                            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
                            activeTab === 'practice' 
                            ? 'border-indigo-500 text-white bg-white/5' 
                            : 'border-transparent text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            <Zap size={16} /> Practice
                        </button>
                        <button 
                            onClick={() => setActiveTab('coach')}
                            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
                            activeTab === 'coach' 
                            ? 'border-purple-500 text-white bg-white/5' 
                            : 'border-transparent text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            <BrainCircuit size={16} /> AI Coach
                        </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
                        <div className={activeTab === 'practice' ? 'block space-y-8' : 'hidden'}>
                            <div className="space-y-3">
                                
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Algorithm</label>
                                        
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => setIsTrainerMode(!isTrainerMode)}
                                                className={`p-1.5 rounded mr-2 transition-all flex items-center gap-1 ${
                                                    isTrainerMode 
                                                    ? 'bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/50' 
                                                    : 'hover:bg-white/5 text-gray-500 hover:text-gray-300'
                                                }`}
                                                title="Toggle Trainer Mode"
                                            >
                                                {isTrainerMode ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                            
                                            <div className="w-px h-4 bg-gray-800 mx-1"></div>

                                            <button 
                                                onClick={toggleLearned}
                                                className={`p-1.5 rounded hover:bg-white/5 transition-all ${isCurrentLearned ? 'bg-green-500/20 text-green-400' : 'text-gray-600 hover:text-green-400'}`}
                                                title={isCurrentLearned ? "Unmark Learned" : "Mark as Learned"}
                                            >
                                                <GraduationCap size={18} />
                                            </button>

                                            <button 
                                                onClick={toggleFavorite}
                                                className={`p-1.5 rounded hover:bg-white/5 transition-all ${isCurrentFavorite ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-200'}`}
                                                title="Favorite"
                                            >
                                                <Star size={16} fill={isCurrentFavorite ? "currentColor" : "none"} />
                                            </button>

                                            <button onClick={handleCopy} className="p-1.5 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                                                {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {!isAddingAlg ? (
                                        <div className="flex gap-2">
                                            <select 
                                                value={selectedAlgIndex}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === 'add_new') {
                                                        setIsAddingAlg(true);
                                                    } else {
                                                        setSelectedAlgIndex(Number(val));
                                                    }
                                                }}
                                                className="flex-1 bg-gray-800 text-sm text-white rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
                                            >
                                                {mergedAlgs.map((alg, idx) => (
                                                    <option key={idx} value={idx} title={alg}>
                                                        {idx + 1}. {alg} 
                                                        {idx >= selectedCase.algs.length ? ' (Custom)' : ''}
                                                        {userData.favorites[selectedCase.id] === alg ? ' ★' : ''}
                                                    </option>
                                                ))}
                                                <option disabled>──────────</option>
                                                <option value="add_new">+ Add New Algorithm</option>
                                            </select>
                                            
                                            <button 
                                                onClick={() => setIsAddingAlg(true)}
                                                className="px-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-800/50 p-3 rounded-xl border border-indigo-500/30 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <label className="text-xs text-indigo-300 font-medium">New Custom Algorithm</label>
                                            <textarea 
                                                value={newAlgText}
                                                onChange={(e) => setNewAlgText(e.target.value)}
                                                placeholder="R U R' U'..."
                                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm font-mono focus:outline-none focus:border-indigo-500 h-20 resize-none"
                                                autoFocus
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <button 
                                                    onClick={() => setIsAddingAlg(false)}
                                                    className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-1"
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    onClick={saveNewAlg}
                                                    disabled={!newAlgText.trim()}
                                                    className="px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-1 shadow-lg shadow-indigo-900/20"
                                                >
                                                    <Save size={14} /> Save
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <textarea 
                                    value={algInput}
                                    onChange={(e) => setAlgInput(e.target.value)}
                                    className={`w-full bg-gray-950/50 border border-gray-800 rounded-xl p-4 font-mono text-lg leading-relaxed text-indigo-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none shadow-inner h-32 ${isTrainerMode && !isRevealed ? 'blur-md opacity-20 select-none' : ''}`}
                                    spellCheck={false}
                                    readOnly={!isCurrentCustom && !isAddingAlg}
                                    />
                                    {isTrainerMode && !isRevealed && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <button 
                                                onClick={() => setIsRevealed(true)}
                                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105 flex items-center gap-2"
                                            >
                                                <Eye size={18} /> Reveal Algorithm
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {isCurrentCustom && <p className="text-[10px] text-gray-500 text-right italic">Custom algorithm</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Scramble / Setup</label>
                                    <button 
                                    onClick={() => {
                                        if(playerRef.current) (playerRef.current as any).timestamp = 0;
                                    }} 
                                    className="text-xs flex items-center gap-1 text-gray-500 hover:text-white transition-colors"
                                    >
                                    <RotateCcw size={12} /> Reset
                                    </button>
                                </div>
                                <div className="bg-gray-950/30 border border-white/5 rounded-lg p-3 font-mono text-xs text-orange-300/80 break-words">
                                    {setupInput || "No setup moves"}
                                </div>
                            </div>

                            <div className="bg-gray-800/30 rounded-xl p-4 border border-white/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-400">
                                    <Settings size={14} />
                                    <span className="text-xs font-medium">Speed</span>
                                    </div>
                                    <span className="text-xs font-mono text-indigo-400">{tempo}x</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0.5" 
                                    max="6" 
                                    step="0.1"
                                    value={tempo} 
                                    onChange={(e) => setTempo(Number(e.target.value))}
                                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                            </div>
                        </div>

                        <div className={activeTab === 'coach' ? 'block h-full flex flex-col' : 'hidden'}>
                            <GeminiAnalysis 
                                alg={algInput} 
                                stage={selectedStage}
                                caseName={selectedCase.name}
                                userFavorites={userData.favorites}
                                allCases={CFOP_ALGORITHMS}
                                onSelectCase={handleSelectCase}
                                currentCaseId={selectedCase?.id}
                                onSelectAlg={handleUpdateAlg}
                                onTriggerPlayback={handleVoicePlayback}
                            />
                        </div>
                        </div>

                    </div>
                    </div>
                )}

                </div>
            </>
        )}
      </main>
    </div>
  );
}