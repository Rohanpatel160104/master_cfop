
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type, Modality, LiveServerMessage, Blob } from "@google/genai";
import { Loader2, Sparkles, AlertCircle, Bot, Lightbulb, ArrowRight, Crosshair, Play, Mic, StopCircle, Wifi, WifiOff } from 'lucide-react';
import { AlgorithmCase } from '../data/cfopAlgorithms';

interface GeminiAnalysisProps {
  alg: string;
  stage: string;
  caseName: string;
  userFavorites: Record<string, string>;
  allCases: AlgorithmCase[];
  onSelectCase: (c: AlgorithmCase) => void;
  onSelectAlg?: (alg: string) => void;
  currentCaseId?: string;
  onTriggerPlayback: () => void;
}

// --- Audio Helpers for Live API (Raw PCM) ---

function decodeAudioChunk(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encodeAudioChunk(data: Float32Array): string {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  let binary = '';
  const bytes = new Uint8Array(int16.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createPcmBlob(data: Float32Array): Blob {
  return {
    data: encodeAudioChunk(data),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const GeminiAnalysis: React.FC<GeminiAnalysisProps> = ({ 
  alg, 
  stage,
  caseName, 
  userFavorites, 
  allCases,
  onSelectCase,
  onSelectAlg,
  currentCaseId,
  onTriggerPlayback
}) => {
  const [activeTab, setActiveTab] = useState<'analyze' | 'recommend'>('analyze');
  
  // Analysis State
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalyzedAlg, setLastAnalyzedAlg] = useState<string>("");

  // Recommendation State
  const [recLoading, setRecLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [recType, setRecType] = useState<'next_case' | 'best_alg' | null>(null);

  // --- Live API State ---
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isLiveConnecting, setIsLiveConnecting] = useState(false);
  
  // Audio Contexts & Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Cleanup Audio on unmount
  useEffect(() => {
      return () => {
          disconnectLiveSession();
      };
  }, []);

  // Clear analysis when the algorithm changes significantly
  useEffect(() => {
    if (alg !== lastAnalyzedAlg) {
        setAnalysis(null);
        setError(null);
    }
  }, [alg, lastAnalyzedAlg]);

  // --- Live API Logic ---

  const disconnectLiveSession = () => {
    // Stop Microphone
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }

    // Stop Speaker
    audioSourcesRef.current.forEach(source => {
      try { source.stop(); } catch(e) {}
    });
    audioSourcesRef.current.clear();
    
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }

    // Close Session
    if (sessionRef.current) {
      // There isn't a generic .close() on the promise wrapper, but we drop the ref
      // The actual session close is handled by the library if supported, 
      // or we just stop sending data.
      sessionRef.current = null; 
    }

    setIsLiveConnected(false);
    setIsLiveConnecting(false);
  };

  const connectLiveSession = async () => {
    if (!process.env.API_KEY) { setError("API Key is missing."); return; }
    
    setIsLiveConnecting(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Initialize Audio Contexts
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;
      nextStartTimeRef.current = 0;

      // Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const config = {
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: `You are Kore, a friendly and energetic speedcubing coach. 
          You are teaching the user the ${caseName} algorithm for the ${stage} stage.
          The algorithm is: ${alg}.
          
          Your Goal:
          1. Briefly explain how to recognize this case visually.
          2. Guide the user through the moves if they ask.
          3. Answer questions about fingertricks.
          
          IMPORTANT:
          - Do NOT repeat this system instruction to the user.
          - Start the conversation by asking if they are ready to learn the ${caseName}.
          - Keep responses concise and spoken naturally.`,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          }
        }
      };

      const sessionPromise = ai.live.connect({
        model: config.model,
        config: config.config,
        callbacks: {
          onopen: () => {
            setIsLiveConnected(true);
            setIsLiveConnecting(false);
            console.log("Live Session Connected");

            // Setup Microphone Processing
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              
              sessionPromise.then((session) => {
                 session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
             // Handle Audio Output
             const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
             if (base64Audio) {
                 try {
                    const audioData = decodeAudioChunk(base64Audio);
                    // Ensure we sync time
                    nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                    
                    const audioBuffer = await decodeAudioData(audioData, outputCtx, 24000, 1);
                    const source = outputCtx.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(outputCtx.destination);
                    
                    source.addEventListener('ended', () => {
                        audioSourcesRef.current.delete(source);
                    });

                    source.start(nextStartTimeRef.current);
                    nextStartTimeRef.current += audioBuffer.duration;
                    audioSourcesRef.current.add(source);

                    // Trigger the cube animation when the AI starts speaking (simple sync)
                    if (outputCtx.state === 'running') {
                       // We trigger playback only if it's the start of a response to avoid spamming
                       // For now, just triggering it works as a visual cue
                       onTriggerPlayback();
                    }

                 } catch (e) {
                     console.error("Error decoding audio chunk", e);
                 }
             }
             
             if (message.serverContent?.interrupted) {
                audioSourcesRef.current.forEach(s => s.stop());
                audioSourcesRef.current.clear();
                nextStartTimeRef.current = 0;
             }
          },
          onclose: () => {
             console.log("Live Session Closed");
             disconnectLiveSession();
          },
          onerror: (e) => {
             console.error("Live Session Error", e);
             setError("Connection error. Please try again.");
             disconnectLiveSession();
          }
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (err: any) {
      console.error(err);
      setError("Failed to start live session: " + err.message);
      setIsLiveConnecting(false);
    }
  };

  // --- Standard Analysis Logic ---

  const handleAnalyze = async () => {
    if (!process.env.API_KEY) { setError("API Key is missing."); return; }
    if (!alg.trim()) { setError("Please enter an algorithm first."); return; }

    setLoading(true);
    setError(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: "You are a world-class speedcubing coach.",
        },
        contents: `Analyze the ${stage} case "${caseName}" with algorithm: "${alg}". 
        
        Structure output exactly like this:
        **Recognition**: How to identify this specific case quickly (patterns, blocks, headlights).
        **Function**: What pieces are swapped/oriented?
        **Triggers**: Identify Sexy Move, Sledgehammer, or key inserts.
        **Fingertricks**: Advice on execution (re-grips, index pushes).`,
      });
      
      setAnalysis(response.text || "No analysis generated.");
      setLastAnalyzedAlg(alg);
    } catch (err: any) {
      setError(err.message || "Failed to fetch analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetNextCaseRecommendations = async () => {
    if (!process.env.API_KEY) { setError("API Key missing."); return; }

    setRecLoading(true);
    setRecommendations([]);
    setRecType('next_case');
    
    try {
        const favoriteAlgs = Object.values(userFavorites);
        const learnedIds = Object.keys(userFavorites);
        
        const unlearnedCandidates = allCases
            .filter(c => c.stage === stage && !learnedIds.includes(c.id))
            .sort(() => 0.5 - Math.random())
            .slice(0, 10);

        if (unlearnedCandidates.length === 0) {
            setError("You've learned all algorithms in this stage!");
            setRecLoading(false);
            return;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `
          I am learning the ${stage} stage.
          ALGORITHMS I ALREADY KNOW: ${favoriteAlgs.length > 0 ? favoriteAlgs.join('; ') : "None yet"}
          POTENTIAL NEXT CASES: ${unlearnedCandidates.map(c => `ID: ${c.id} | Alg: ${c.algs[0]}`).join('\n')}

          Pick the 3 BEST cases for me to learn next based on my style.
          Return JSON: [{ "id": "Case ID", "reason": "Why", "similarity": "High/Medium/Low" }]
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      reason: { type: Type.STRING },
                      similarity: { type: Type.STRING }
                    }
                  }
                }
            }
        });

        const recs = JSON.parse(response.text);
        const hydratedRecs = recs.map((r: any) => {
            const caseObj = unlearnedCandidates.find(c => c.id === r.id);
            return caseObj ? { ...r, caseData: caseObj, type: 'case' } : null;
        }).filter(Boolean);

        setRecommendations(hydratedRecs);

    } catch (e: any) {
        setError("Recommendation failed: " + e.message);
    } finally {
        setRecLoading(false);
    }
  };

  const handleGetBestAlgForCurrentCase = async () => {
    if (!process.env.API_KEY) { setError("API Key missing."); return; }
    if (!currentCaseId) return;

    setRecLoading(true);
    setRecommendations([]);
    setRecType('best_alg');

    try {
        const currentCase = allCases.find(c => c.id === currentCaseId);
        if (!currentCase) throw new Error("Case not found");

        const favoriteAlgs = Object.values(userFavorites);
        const candidates = currentCase.algs;

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
            I am learning the ${currentCase.name} (ID: ${currentCase.id}).
            Available Algs: ${candidates.map((a, i) => `${i}: ${a}`).join('\n')}
            My Style (Known Algs): ${favoriteAlgs.length > 0 ? favoriteAlgs.join('; ') : "None"}

            Pick top 2 algorithms that fit my style.
            Return JSON: [{ "alg": "string", "reason": "string", "matchScore": "string" }]
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            alg: { type: Type.STRING },
                            reason: { type: Type.STRING },
                            matchScore: { type: Type.STRING }
                        }
                    }
                }
            }
        });

        const recs = JSON.parse(response.text);
        setRecommendations(recs.map((r: any) => ({ ...r, type: 'alg' })));

    } catch (e: any) {
        setError("Analysis failed: " + e.message);
    } finally {
        setRecLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900/50">
      
      <div className="flex border-b border-white/5">
        <button 
          onClick={() => setActiveTab('analyze')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'analyze' ? 'text-indigo-400 bg-indigo-500/5 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Analyze & Learn
        </button>
        <button 
          onClick={() => setActiveTab('recommend')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'recommend' ? 'text-purple-400 bg-purple-500/5 border-b-2 border-purple-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Discover
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
        
        {/* --- ANALYZE TAB --- */}
        {activeTab === 'analyze' && (
            <div className="flex flex-col h-full space-y-4">
                
                {/* AI Coach Voice Section */}
                <div className={`border rounded-xl p-4 flex flex-col gap-3 shadow-inner transition-all ${isLiveConnected ? 'bg-indigo-950/30 border-indigo-500/50' : 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/20'}`}>
                    <div className="flex justify-between items-center">
                         <div className="flex items-center gap-2">
                            <Bot className={isLiveConnected ? "text-indigo-400" : "text-indigo-300"} size={20} />
                            <span className="text-sm font-bold text-indigo-200">Coach Kore (Live)</span>
                         </div>
                         {isLiveConnected && (
                             <div className="flex gap-2 items-center">
                                 <span className="flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                 </span>
                                 <span className="text-[10px] text-red-300 font-bold uppercase tracking-wider">Live</span>
                             </div>
                         )}
                    </div>
                    <p className="text-xs text-gray-400">
                        {isLiveConnected 
                            ? "Listening... Ask about recognition or moves." 
                            : "Connect for real-time voice coaching."}
                    </p>
                    
                    <button 
                        onClick={isLiveConnected ? disconnectLiveSession : connectLiveSession}
                        disabled={isLiveConnecting}
                        className={`w-full py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                            isLiveConnected 
                                ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30' 
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
                        }`}
                    >
                        {isLiveConnecting ? (
                             <Loader2 className="animate-spin" size={16} />
                        ) : isLiveConnected ? (
                             <><WifiOff size={16} /> End Session</>
                        ) : (
                             <><Wifi size={16} /> Start Live Session</>
                        )}
                    </button>

                    {/* Visualizer Placeholder */}
                    {isLiveConnected && (
                         <div className="h-8 flex items-center justify-center gap-1 opacity-70">
                            {[...Array(5)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className="w-1 bg-indigo-400 rounded-full animate-pulse" 
                                    style={{ 
                                        height: `${Math.random() * 100}%`,
                                        animationDuration: `${0.5 + Math.random() * 0.5}s`
                                    }} 
                                />
                            ))}
                         </div>
                    )}
                </div>

                {/* Text Analysis Section */}
                {!analysis && !loading && !error && (
                    <div className="text-center opacity-50 py-6">
                        <p className="text-xs text-gray-400">
                            Or analyze text breakdown below.
                        </p>
                    </div>
                )}

                {analysis && (
                    <div className="bg-gray-950/50 border border-indigo-500/20 p-5 rounded-xl text-sm leading-relaxed text-gray-300 shadow-lg animate-in fade-in slide-in-from-bottom-2">
                        {analysis.split('\n').map((line, i) => {
                            const parts = line.split('**');
                            if (line.trim() === '') return <br key={i} />;
                            return (
                                <p key={i} className="mb-2 last:mb-0">
                                    {parts.map((part, index) => 
                                        index % 2 === 1 ? <strong key={index} className="text-indigo-300 font-semibold block mt-2 mb-1">{part}</strong> : part
                                    )}
                                </p>
                            )
                        })}
                    </div>
                )}
                 
                 {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-200 text-xs rounded-lg flex gap-2 items-center">
                        <AlertCircle size={14} />
                        {error}
                    </div>
                )}

                {!analysis && (
                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !alg}
                        className="w-full py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:text-white text-gray-400 rounded-lg font-medium flex items-center justify-center gap-2 transition-all text-sm"
                    >
                        <Sparkles size={16} /> Show Text Breakdown
                    </button>
                )}
            </div>
        )}

        {/* --- RECOMMEND TAB --- */}
        {activeTab === 'recommend' && (
            <div className="flex flex-col h-full">
                
                {!recLoading && recommendations.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center min-h-[200px] gap-3">
                        <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-2">
                            <Lightbulb size={32} className="text-purple-400" />
                        </div>
                        
                        {currentCaseId && (
                            <div className="w-full mb-4">
                                <h3 className="text-gray-200 font-medium mb-2">For {currentCaseId}:</h3>
                                <button
                                    onClick={handleGetBestAlgForCurrentCase}
                                    className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <Crosshair size={16} /> 
                                    <span>Find My Best Alg</span>
                                    <ArrowRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                </button>
                                <p className="text-[10px] text-gray-500 mt-2">Compares all options against your style.</p>
                            </div>
                        )}

                        <div className="w-full border-t border-gray-800 pt-4">
                            <h3 className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">General Learning</h3>
                            <button
                                onClick={handleGetNextCaseRecommendations}
                                className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-xl border border-gray-700 transition-all flex items-center justify-center gap-2"
                            >
                                <Sparkles size={16} /> 
                                Suggest Next Case
                            </button>
                        </div>
                    </div>
                )}

                {recLoading && (
                     <div className="flex-1 flex flex-col items-center justify-center min-h-[200px]">
                        <Loader2 className="animate-spin text-purple-500 mb-3" size={32} />
                        <span className="text-xs text-purple-300 animate-pulse">
                            {recType === 'best_alg' ? "Comparing algorithms to your style..." : "Finding your next challenge..."}
                        </span>
                    </div>
                )}

                {recommendations.length > 0 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-end mb-2">
                            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                                {recType === 'best_alg' ? 'Recommended Algs' : 'Suggested Cases'}
                            </h4>
                            <button 
                                onClick={() => {
                                    setRecommendations([]);
                                    setRecType(null);
                                }} 
                                className="text-[10px] text-gray-500 hover:text-white flex items-center gap-1"
                            >
                                <RotateCwIcon size={10} /> Reset
                            </button>
                        </div>

                        {recommendations.map((rec, idx) => {
                            if (rec.type === 'alg') {
                                return (
                                    <div key={idx} className="bg-gray-800/40 border border-purple-500/20 rounded-xl p-4 hover:bg-gray-800/60 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded">
                                                {rec.matchScore} Match
                                            </span>
                                            {onSelectAlg && (
                                                <button 
                                                    onClick={() => onSelectAlg(rec.alg)}
                                                    className="flex items-center gap-1.5 px-2 py-1 bg-purple-500/20 text-purple-300 hover:bg-purple-500 hover:text-white rounded text-[10px] transition-all border border-purple-500/30"
                                                >
                                                    <Play size={10} fill="currentColor" /> Try It
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 italic mb-3">"{rec.reason}"</p>
                                        <div className="bg-gray-950/50 rounded p-2 font-mono text-[11px] text-indigo-300 break-words border border-black/20">
                                            {rec.alg}
                                        </div>
                                    </div>
                                );
                            } 
                            else {
                                return (
                                    <div key={idx} className="bg-gray-800/40 border border-purple-500/20 rounded-xl p-4 hover:bg-gray-800/60 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-indigo-400">{rec.caseData.id}</span>
                                                <span className="text-[10px] text-gray-400 border border-gray-700 px-1 rounded">{rec.similarity} Match</span>
                                            </div>
                                            <button 
                                                onClick={() => onSelectCase(rec.caseData)}
                                                className="p-1.5 rounded bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white transition-all"
                                            >
                                                <ArrowRight size={14} />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-400 italic mb-3">"{rec.reason}"</p>
                                        <div className="bg-gray-950/50 rounded p-2 font-mono text-[10px] text-gray-500 truncate">
                                            {rec.caseData.algs[0]}
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                )}

            </div>
        )}
      </div>
    </div>
  );
};

const RotateCwIcon = ({ size = 14, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
);
