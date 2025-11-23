import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, RotateCcw, Settings, Trophy, Clock, List, 
  Filter, CheckCircle, XCircle, ChevronRight, History, 
  Trash2, Eye, EyeOff, Pause, Square
} from 'lucide-react';
import { Alg } from "cubing/alg";
import { Stage, AlgorithmCase } from '../data/cfopAlgorithms';
import { UserData, SolveRecord } from '../types';

interface PracticeModeProps {
  allCases: AlgorithmCase[];
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  initialStage?: Stage | null;
}

type PracticeState = 'config' | 'running';
type TimerState = 'idle' | 'holding' | 'running' | 'finished';

const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const remS = s % 60;
    const remMs = Math.floor((ms % 1000) / 10);
    if (m > 0) return `${m}:${remS.toString().padStart(2, '0')}.${remMs.toString().padStart(2, '0')}`;
    return `${remS}.${remMs.toString().padStart(2, '0')}`;
};

const calculateAverage = (times: number[]) => {
    if (times.length === 0) return 0;
    if (times.length < 3) return times.reduce((a, b) => a + b, 0) / times.length;
    
    if (times.length >= 5) {
        const sorted = [...times].sort((a, b) => a - b);
        const trimmed = sorted.slice(1, -1);
        return trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
    }
    return times.reduce((a, b) => a + b, 0) / times.length;
};

export const PracticeMode: React.FC<PracticeModeProps> = ({ allCases, userData, setUserData, initialStage }) => {
  const [view, setView] = useState<PracticeState>('config');
  
  // Configuration State
  const [selectedStages, setSelectedStages] = useState<Stage[]>(
      initialStage ? [initialStage] : ['OLL', 'PLL']
  );
  const [sourceMode, setSourceMode] = useState<'learned' | 'all' | 'custom'>('learned');
  const [customSelection, setCustomSelection] = useState<string[]>([]);
  
  // Session State
  const [currentCase, setCurrentCase] = useState<AlgorithmCase | null>(null);
  const [scramble, setScramble] = useState<string>("");
  const [isRevealed, setIsRevealed] = useState(false);
  
  // Timer State
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [time, setTime] = useState(0);
  const [sessionResults, setSessionResults] = useState<SolveRecord[]>([]);
  
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const spaceDownTimeRef = useRef<number>(0);

  // Update selection if initialStage prop changes
  useEffect(() => {
      if (initialStage) {
          setSelectedStages([initialStage]);
          setView('config');
      }
  }, [initialStage]);

  // --- Helpers ---

  const getFilteredCases = () => {
      let cases = allCases.filter(c => selectedStages.includes(c.stage));
      if (sourceMode === 'learned') {
          cases = cases.filter(c => userData.learned.includes(c.id));
      } else if (sourceMode === 'custom') {
          cases = cases.filter(c => customSelection.includes(c.id));
      }
      return cases;
  };

  const generateScramble = (c: AlgorithmCase) => {
      const preferredAlg = userData.favorites[c.id] || c.algs[0];
      try {
          const algObj = new Alg(preferredAlg);
          const inverted = algObj.invert();
          return inverted.toString();
      } catch (e) {
          return "Error generating scramble";
      }
  };

  const nextCase = () => {
      const candidates = getFilteredCases();
      if (candidates.length === 0) return;
      
      const randomCase = candidates[Math.floor(Math.random() * candidates.length)];
      setCurrentCase(randomCase);
      setScramble(generateScramble(randomCase));
      setIsRevealed(false);
      setTimerState('idle');
      setTime(0);
  };

  const startSession = () => {
      const candidates = getFilteredCases();
      if (candidates.length === 0) {
          alert("No algorithms match your criteria! Try selecting 'All' or learning more cases.");
          return;
      }
      setSessionResults([]);
      setView('running');
      nextCase();
  };

  // --- Timer Logic ---

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (view !== 'running') return;
          if (e.code === 'Space') {
              e.preventDefault(); 
              
              if (timerState === 'idle') {
                  setTimerState('holding');
                  spaceDownTimeRef.current = performance.now();
              } else if (timerState === 'running') {
                  stopTimer();
              }
          }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
          if (view !== 'running') return;
          if (e.code === 'Space') {
             if (timerState === 'holding') {
                 startTimer();
             }
          }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
      };
  }, [view, timerState]);

  const startTimer = () => {
      setTimerState('running');
      startTimeRef.current = performance.now();
      timerRef.current = requestAnimationFrame(updateTimer);
  };

  const updateTimer = () => {
      const now = performance.now();
      setTime(now - startTimeRef.current);
      timerRef.current = requestAnimationFrame(updateTimer);
  };

  const stopTimer = () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      const finalTime = performance.now() - startTimeRef.current;
      setTime(finalTime);
      setTimerState('finished');
      saveResult(finalTime);
  };

  const saveResult = (finalTime: number) => {
      if (!currentCase) return;
      
      const newRecord: SolveRecord = {
          id: crypto.randomUUID(),
          caseId: currentCase.id,
          stage: currentCase.stage,
          time: finalTime,
          timestamp: Date.now(),
          scramble: scramble
      };

      setSessionResults(prev => [newRecord, ...prev]);
      setUserData(prev => ({
          ...prev,
          history: [newRecord, ...prev.history]
      }));
  };

  const sessionMean = useMemo(() => calculateAverage(sessionResults.map(r => r.time)), [sessionResults]);
  const bestTime = useMemo(() => sessionResults.length > 0 ? Math.min(...sessionResults.map(r => r.time)) : 0, [sessionResults]);

  if (view === 'config') {
      return (
          <div className="h-full bg-gray-950 p-8 overflow-y-auto custom-scrollbar flex flex-col items-center">
              <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-1 ring-indigo-500/20">
                          <Trophy size={32} className="text-indigo-500" />
                      </div>
                      <h1 className="text-3xl font-bold text-white">Practice Mode</h1>
                      <p className="text-gray-400">Select your stages and challenge yourself.</p>
                  </div>

                  {/* Stage Selection */}
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Stages</h3>
                      <div className="flex gap-3">
                          {(['F2L', 'OLL', 'PLL'] as Stage[]).map(stage => (
                              <button
                                  key={stage}
                                  onClick={() => setSelectedStages(prev => 
                                      prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage]
                                  )}
                                  className={`flex-1 py-4 rounded-xl border-2 text-sm font-bold transition-all ${
                                      selectedStages.includes(stage)
                                      ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                                      : 'border-gray-800 bg-gray-900/50 text-gray-500 hover:border-gray-700'
                                  }`}
                              >
                                  {stage}
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Source Selection */}
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Algorithm Source</h3>
                      <div className="grid grid-cols-3 gap-3">
                          <button
                              onClick={() => setSourceMode('learned')}
                              className={`py-3 px-4 rounded-lg text-sm font-medium border transition-all ${
                                  sourceMode === 'learned'
                                  ? 'bg-green-500/10 border-green-500/50 text-green-400'
                                  : 'bg-gray-800 border-transparent text-gray-400 hover:bg-gray-750'
                              }`}
                          >
                              Learned Only ({allCases.filter(c => userData.learned.includes(c.id)).length})
                          </button>
                          <button
                              onClick={() => setSourceMode('all')}
                              className={`py-3 px-4 rounded-lg text-sm font-medium border transition-all ${
                                  sourceMode === 'all'
                                  ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                                  : 'bg-gray-800 border-transparent text-gray-400 hover:bg-gray-750'
                              }`}
                          >
                              All Cases
                          </button>
                          <button
                              onClick={() => setSourceMode('custom')}
                              className={`py-3 px-4 rounded-lg text-sm font-medium border transition-all ${
                                  sourceMode === 'custom'
                                  ? 'bg-purple-500/10 border-purple-500/50 text-purple-400'
                                  : 'bg-gray-800 border-transparent text-gray-400 hover:bg-gray-750'
                              }`}
                          >
                              Selective
                          </button>
                      </div>

                      {sourceMode === 'custom' && (
                          <div className="mt-4 pt-4 border-t border-gray-800 max-h-60 overflow-y-auto custom-scrollbar">
                              <div className="grid grid-cols-4 gap-2">
                                  {allCases.filter(c => selectedStages.includes(c.stage)).map(c => (
                                      <button
                                          key={c.id}
                                          onClick={() => setCustomSelection(prev => 
                                              prev.includes(c.id) ? prev.filter(id => id !== c.id) : [...prev, c.id]
                                          )}
                                          className={`text-xs p-2 rounded border truncate transition-all ${
                                              customSelection.includes(c.id)
                                              ? 'bg-indigo-600 border-indigo-500 text-white'
                                              : 'bg-gray-950 border-gray-800 text-gray-500 hover:text-gray-300'
                                          }`}
                                      >
                                          {c.id}
                                      </button>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>

                  {/* Start Button */}
                  <button
                      onClick={startSession}
                      disabled={selectedStages.length === 0}
                      className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-lg font-bold rounded-2xl shadow-xl shadow-indigo-900/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                      <Play fill="currentColor" /> Start Session
                  </button>
                  
                  {/* Global History Stats Preview */}
                   <div className="mt-8 pt-8 border-t border-white/5 flex justify-between text-gray-500 text-sm">
                      <div className="flex flex-col items-center">
                          <span className="text-2xl font-bold text-white">{userData.history.length}</span>
                          <span className="text-xs">Total Solves</span>
                      </div>
                      <div className="flex flex-col items-center">
                          <span className="text-2xl font-bold text-white">
                              {userData.history.length > 0 ? formatTime(userData.history.reduce((a, b) => a + b.time, 0) / userData.history.length) : '-'}
                          </span>
                          <span className="text-xs">Global Average</span>
                      </div>
                      <div className="flex flex-col items-center">
                          <span className="text-2xl font-bold text-white">
                              {userData.history.length > 0 ? formatTime(Math.min(...userData.history.map(r => r.time))) : '-'}
                          </span>
                          <span className="text-xs">Best Single</span>
                      </div>
                   </div>

              </div>
          </div>
      );
  }

  // RUNNING VIEW
  return (
      <div className="flex h-full bg-gray-950">
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col relative">
              {/* Header */}
              <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-gray-900/30">
                  <button 
                      onClick={() => setView('config')}
                      className="text-gray-500 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
                  >
                      <Settings size={16} /> Configure
                  </button>
                  <div className="flex gap-6">
                      <div className="flex flex-col items-end">
                          <span className="text-[10px] text-gray-500 uppercase font-bold">Session Mean</span>
                          <span className="font-mono font-bold text-indigo-400">{formatTime(sessionMean)}</span>
                      </div>
                      <div className="flex flex-col items-end">
                          <span className="text-[10px] text-gray-500 uppercase font-bold">Best</span>
                          <span className="font-mono font-bold text-green-400">{formatTime(bestTime)}</span>
                      </div>
                  </div>
              </div>

              {/* Timer Area */}
              <div className="flex-1 flex flex-col items-center justify-center relative p-8">
                  
                  {/* Scramble Display */}
                  <div className={`text-center space-y-4 mb-12 transition-opacity duration-300 ${timerState === 'running' ? 'opacity-0' : 'opacity-100'}`}>
                      <h2 className="text-gray-500 text-sm font-bold tracking-widest uppercase">Scramble (Setup)</h2>
                      <div className="text-2xl md:text-3xl font-mono text-gray-200 bg-gray-900/50 px-8 py-6 rounded-xl border border-white/5 shadow-lg max-w-4xl leading-relaxed">
                          {scramble}
                      </div>
                  </div>

                  {/* Timer Display */}
                  <div className={`relative mb-16 transition-all ${timerState === 'running' ? 'scale-125' : 'scale-100'}`}>
                      <span className={`text-8xl md:text-9xl font-mono font-bold tracking-tight tabular-nums select-none ${
                          timerState === 'running' ? 'text-white' : 
                          timerState === 'holding' ? 'text-green-500' :
                          timerState === 'finished' ? 'text-white' : 'text-gray-200'
                      }`}>
                          {formatTime(time)}
                      </span>
                  </div>

                  {/* Case Info / Controls */}
                  <div className={`absolute bottom-12 w-full px-12 flex items-end justify-between transition-opacity duration-300 ${timerState === 'running' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                      
                      <div className="flex flex-col items-start gap-2">
                           {timerState === 'finished' && (
                               <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                                   <button 
                                      onClick={() => {
                                          const last = sessionResults[0];
                                          if (last) {
                                              setUserData(prev => ({ ...prev, history: prev.history.filter(h => h.id !== last.id) }));
                                              setSessionResults(prev => prev.slice(1));
                                              setTimerState('idle');
                                              setTime(0);
                                          }
                                      }}
                                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                      title="Delete Result"
                                   >
                                       <Trash2 size={20} />
                                   </button>
                                   <div className="h-4 w-px bg-gray-800 mx-2"/>
                                   <span className="text-sm text-gray-400">Space to restart</span>
                               </div>
                           )}

                           <div className="mt-4">
                               <button 
                                  onClick={() => setIsRevealed(!isRevealed)}
                                  className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                               >
                                   {isRevealed ? <EyeOff size={16} /> : <Eye size={16} />} 
                                   {isRevealed ? "Hide Answer" : "Reveal Case"}
                               </button>
                               
                               {isRevealed && currentCase && (
                                   <div className="mt-2 bg-gray-900 p-4 rounded-xl border border-gray-800 animate-in fade-in slide-in-from-bottom-1">
                                       <div className="flex items-center gap-2 mb-1">
                                           <span className="font-bold text-white">{currentCase.name}</span>
                                           <span className="text-xs px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-gray-400">{currentCase.id}</span>
                                       </div>
                                       <p className="font-mono text-sm text-gray-500">{currentCase.algs[0]}</p>
                                   </div>
                               )}
                           </div>
                      </div>

                      <button 
                          onClick={nextCase}
                          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-900/20 transition-transform hover:scale-105"
                      >
                          Next Scramble <ChevronRight size={18} />
                      </button>
                  </div>
              </div>
          </div>

          {/* Right Sidebar: History */}
          <div className="w-64 bg-gray-900 border-l border-white/5 flex flex-col">
              <div className="p-5 border-b border-white/5 flex items-center gap-2 text-gray-400">
                  <History size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Session History</span>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                  {sessionResults.map((result, idx) => (
                      <div key={result.id} className="p-3 rounded-lg bg-gray-950/50 border border-transparent hover:border-gray-800 flex justify-between items-center group animate-in slide-in-from-right-4 fade-in duration-300">
                          <div className="flex flex-col">
                              <span className="text-xs font-mono text-gray-500">{sessionResults.length - idx}.</span>
                              <span className="text-[10px] text-gray-600">{result.caseId}</span>
                          </div>
                          <span className="font-mono font-bold text-gray-300">{formatTime(result.time)}</span>
                      </div>
                  ))}
                  {sessionResults.length === 0 && (
                      <div className="text-center p-8 text-xs text-gray-600 italic">
                          No solves yet.
                      </div>
                  )}
              </div>
          </div>

      </div>
  );
};