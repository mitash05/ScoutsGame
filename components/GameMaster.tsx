import React, { useContext, useState, useEffect, useRef } from 'react';
import { GameContext } from '../App';
import { INITIAL_ERAS, ERA_STYLES, DASHBOARD_IMAGE_URL } from '../constants';
import { Play, Pause, RotateCcw, Unlock, Zap, Brain, QrCode as QrCodeIcon, X, Terminal, Hourglass, Copy, Check } from 'lucide-react';
import { generateEraIntro } from '../services/geminiService';
import FinalCore from './FinalCore';
import { QRCodeSVG } from "qrcode.react";

export default function GameMaster() {
  const game = useContext(GameContext);
  const [aiMessage, setAiMessage] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [showQrCodes, setShowQrCodes] = useState(false);
  const [showEraWarp, setShowEraWarp] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const prevEraIndexRef = useRef(game?.currentEraIndex || 0);
  
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (game && game.currentEraIndex !== prevEraIndexRef.current) {
        setShowEraWarp(true);
        setTimeout(() => setShowEraWarp(false), 4000);
        prevEraIndexRef.current = game.currentEraIndex;
    }
  }, [game?.currentEraIndex]);

  if (!game) return null;

  const currentEra = INITIAL_ERAS[game.currentEraIndex];
  const { lastEvent } = game;

  const handleGenerateIntro = async () => {
    setLoadingAi(true);
    const text = await generateEraIntro(currentEra.title, currentEra.year);
    setAiMessage(text);
    setLoadingAi(false);
  };

  const copyToClipboard = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDuration = (timestamp: number) => {
    if (!timestamp || game.gameState !== 'PLAYING') return "00:00";
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    const m = Math.floor(diff / 60).toString().padStart(2, '0');
    const s = (diff % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (game.gameState === 'FINAL_ROUND' || game.gameState === 'VICTORY') {
    return <FinalCore isGM={true} />;
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white font-mono relative overflow-x-hidden pb-12">
      {/* Dashboard Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <img src={DASHBOARD_IMAGE_URL} alt="Dashboard" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-bg/80 to-dark-bg"></div>
      </div>

      {showEraWarp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-900 via-black to-black animate-pulse"></div>
           <div className="relative z-10 text-center scale-150 transform transition-transform duration-[3s] ease-in-out">
              <p className="text-blue-400 tracking-[0.5em] text-sm mb-4 animate-bounce uppercase">Initiating Time Jump</p>
              <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-purple-500 mb-2">WARPING</h1>
              <p className="text-white text-3xl font-bold font-mono">DESTINATION: {currentEra.year}</p>
           </div>
        </div>
      )}

      {lastEvent && lastEvent.type === 'ERA_COMPLETE' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
          <div className="bg-black/95 border-2 border-neon-green p-12 rounded-2xl text-center animate-in zoom-in slide-in-from-bottom duration-500 shadow-[0_0_100px_rgba(0,255,157,0.5)] max-w-2xl w-full relative overflow-hidden">
             <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,255,157,0.1)_50%,transparent_100%)] bg-[length:100%_4px] animate-pulse"></div>
             <div className="flex justify-center mb-6 relative z-10">
                <div className="p-4 bg-neon-green/20 rounded-full animate-pulse"><Unlock size={64} className="text-neon-green" /></div>
             </div>
             <h2 className="text-4xl md:text-5xl font-black text-neon-green mb-4 tracking-tighter relative z-10 uppercase">Timeline Sync Detected</h2>
             <div className="space-y-2 relative z-10">
                <p className="text-white text-2xl font-mono uppercase">Agent: <span className="text-neon-blue font-bold">{game.teams.find(t => t.id === lastEvent.teamId)?.name}</span></p>
                <p className="text-gray-400 text-xl uppercase">Secured Era: <span className="text-white font-bold">{lastEvent.eraName}</span></p>
             </div>
          </div>
        </div>
      )}

      {showQrCodes && (
        <div className="fixed inset-0 z-[60] bg-dark-bg/98 backdrop-blur-xl flex flex-col p-6 overflow-y-auto animate-in fade-in duration-300">
          <div className="max-w-[1400px] mx-auto w-full">
            <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-8 sticky top-0 bg-dark-bg/98 z-10 pt-4">
              <div>
                <h2 className="text-4xl font-black text-white tracking-widest flex items-center gap-4 uppercase">
                   <QrCodeIcon className="text-neon-pink" size={44} /> Recruitment Terminal
                </h2>
                <p className="text-gray-500 font-mono mt-1 text-lg uppercase opacity-80">Display this console to agents for direct squad uplink</p>
              </div>
              <button onClick={() => setShowQrCodes(false)} className="p-4 bg-gray-800 hover:bg-gray-700 rounded-full transition-all hover:rotate-90">
                <X size={36} className="text-white" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
               {game.teams.map(team => {
                 const joinUrl = `${window.location.origin}${window.location.pathname}?teamId=${team.id}`;
                 return (
                 <div key={team.id} className="bg-panel-bg p-8 rounded-2xl border-2 flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden group transition-all hover:bg-black/40" style={{ borderColor: team.color }}>
                    <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: team.color }}></div>
                    <h3 className="text-3xl font-black uppercase text-center tracking-tighter group-hover:scale-105 transition-transform" style={{ color: team.color }}>{team.name}</h3>
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                       <QRCodeSVG value={joinUrl} size={180} level="H" />
                    </div>
                    <div className="flex flex-col items-center gap-2 w-full">
                        <div className="text-center bg-black/50 p-3 rounded-lg border border-gray-700 w-full">
                            <p className="text-gray-500 text-[10px] mb-1 uppercase tracking-widest">Pin Access Code</p>
                            <div className="text-4xl font-black text-white font-mono">{team.accessCode}</div>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(team.id, joinUrl)}
                          className="flex items-center gap-2 text-[10px] text-gray-400 hover:text-white transition-colors mt-2 uppercase font-bold tracking-widest bg-gray-800/50 px-4 py-2 rounded border border-gray-700 hover:border-white/50"
                        >
                          {copiedId === team.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                          {copiedId === team.id ? "Link Copied" : "Copy Direct Link"}
                        </button>
                    </div>
                 </div>
               )})}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto p-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center bg-panel-bg/90 backdrop-blur p-8 rounded-xl border border-neon-blue/20 shadow-2xl mb-8">
            <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-white font-mono tracking-widest flex items-center justify-center md:justify-start gap-4 uppercase">
                <Terminal className="text-neon-blue" /> Console Dashboard
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-3 ml-1">
                <span className={`w-3 h-3 rounded-full ${game.gameState === 'PLAYING' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-gray-500 font-mono text-xs tracking-[0.3em] uppercase">{game.gameState} MODE ACTIVE</span>
            </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-8 md:mt-0 justify-center">
            <button 
                onClick={() => setShowQrCodes(true)}
                className="flex items-center gap-2 px-8 py-4 bg-neon-pink/10 hover:bg-neon-pink/20 border border-neon-pink/50 text-neon-pink rounded font-bold transition-all hover:shadow-[0_0_20px_rgba(255,0,255,0.2)] uppercase text-xs tracking-widest"
            >
                <QrCodeIcon size={20} /> Recruitment
            </button>
            <div className="h-12 w-px bg-gray-800 hidden md:block mx-4"></div>
            {game.gameState === 'LOBBY' || game.gameState === 'PAUSED' ? (
                <button onClick={game.startGame} className="flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-500 rounded font-black transition-all shadow-xl uppercase text-xs tracking-widest text-black">
                <Play size={20} /> Initiate Timeline
                </button>
            ) : (
                <button onClick={game.pauseGame} className="flex items-center gap-2 px-8 py-4 bg-yellow-600 hover:bg-yellow-500 rounded font-black transition-all uppercase text-xs tracking-widest text-black">
                <Pause size={20} /> Temporal Stasis
                </button>
            )}
            <button onClick={game.resetGame} className="flex items-center gap-2 px-8 py-4 bg-red-950/20 hover:bg-red-900/40 rounded font-bold border border-red-900/50 text-red-500 transition-all uppercase text-xs tracking-widest">
                <RotateCcw size={20} /> Clear Matrix
            </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
            <div className="bg-panel-bg/90 backdrop-blur p-8 rounded-xl border border-gray-800 shadow-xl">
                <h2 className="text-xl font-bold text-neon-blue mb-8 flex items-center gap-3 border-b border-gray-800 pb-6 uppercase tracking-widest">
                    Real-Time Agent Monitoring
                </h2>
                <div className="grid gap-6">
                {game.teams.map(team => {
                    const teamEraIndex = team.fragments.length;
                    const teamCurrentEra = INITIAL_ERAS[teamEraIndex] || INITIAL_ERAS[INITIAL_ERAS.length - 1];
                    const isFinished = team.fragments.length >= INITIAL_ERAS.length;

                    return (
                    <div key={team.id} className="flex flex-col md:flex-row items-center justify-between bg-black/40 p-6 rounded-lg border-l-4 gap-6 transition-all hover:bg-black/60" style={{ borderLeftColor: team.color }}>
                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-black text-xl flex items-center gap-3 uppercase tracking-tighter">
                                <span className="w-2 h-2 rounded-full bg-current animate-pulse shadow-[0_0_10px_currentColor]" style={{ color: team.color }}></span>
                                {team.name}
                            </h3>
                            <span className="font-mono text-3xl font-black text-white">{team.score} <span className="text-[10px] text-gray-500 uppercase tracking-widest">PTS</span></span>
                        </div>
                        <div className="flex gap-6 text-[10px] font-mono bg-black/50 p-3 rounded items-center mb-4 border border-gray-800">
                            <div className="flex-1">
                                <span className="text-gray-600 block uppercase mb-1">Current Sector</span>
                                <span className="text-white font-bold uppercase">{isFinished ? 'Mission Complete' : teamCurrentEra.title}</span>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <span className="text-gray-600 block uppercase mb-1">Sector Duration</span>
                                <span className={`font-bold ${game.gameState === 'PLAYING' ? 'text-neon-green' : 'text-yellow-600'}`}>
                                    {isFinished ? 'COMPLETED' : formatDuration(team.lastActivityTimestamp)}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-1.5 h-2.5 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                        {INITIAL_ERAS.map((_, idx) => (
                            <div key={idx} className={`flex-1 transition-all duration-700 ${team.fragments.length > idx ? 'bg-neon-green shadow-[0_0_8px_#00ff9d]' : 'bg-gray-800'}`} />
                        ))}
                        </div>
                    </div>
                    </div>
                )})}
                </div>
            </div>
            </div>

            <div className="space-y-6">
            <div className="bg-panel-bg/90 backdrop-blur p-8 rounded-xl border border-gray-800 shadow-xl relative overflow-hidden min-h-[450px]">
                <h2 className="text-xl font-bold text-neon-pink mb-8 border-b border-gray-800 pb-6 uppercase tracking-widest">Temporal Node Control</h2>
                
                {/* Active Era Portal View */}
                <div className={`p-8 rounded-lg mb-8 border transition-all duration-700 ${ERA_STYLES[currentEra.id]?.bgClass || 'bg-black'} border-gray-700 shadow-inner relative overflow-hidden group`}>
                    <img src={currentEra.imageUrl} alt={currentEra.title} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-[10s]" />
                    <div className="relative z-10">
                        <p className="text-[10px] text-gray-200 mb-2 uppercase tracking-[0.4em] font-black drop-shadow-md">Active Synchronization Point</p>
                        <h3 className="text-3xl font-black text-white mb-2 leading-tight uppercase tracking-tighter drop-shadow-lg">{currentEra.title}</h3>
                        <p className="text-neon-blue font-mono text-2xl tracking-widest drop-shadow-md">{currentEra.year}</p>
                    </div>
                </div>

                <div className="space-y-4">
                <button 
                    onClick={handleGenerateIntro}
                    disabled={loadingAi}
                    className="w-full py-4 bg-indigo-900/20 hover:bg-indigo-900/40 border border-indigo-500/30 rounded flex items-center justify-center gap-3 text-indigo-400 transition-all font-black text-[10px] uppercase tracking-widest"
                >
                    <Brain size={18} /> {loadingAi ? "Accessing Matrix..." : "Analyze Temporal Flux"}
                </button>
                {aiMessage && (
                    <div className="p-5 bg-indigo-500/5 border-l-2 border-indigo-500 rounded text-xs italic text-indigo-200 leading-relaxed">
                    <span className="not-italic font-black text-indigo-400 block mb-2 text-[9px] uppercase tracking-widest">AI Uplink:</span>
                    "{aiMessage}"
                    </div>
                )}
                <hr className="border-gray-800 my-6" />
                <div className="flex flex-col gap-3">
                    <button 
                    onClick={game.unlockNextEra}
                    disabled={game.currentEraIndex >= INITIAL_ERAS.length - 1}
                    className="w-full py-4 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 rounded font-black border border-gray-700 transition-all text-[10px] uppercase tracking-widest"
                    >
                    Jump to Next Era
                    </button>
                    <button 
                    onClick={game.triggerFinalRound}
                    className="w-full py-4 bg-neon-pink/10 hover:bg-neon-pink/30 border border-neon-pink/40 text-neon-pink rounded font-black transition-all text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(255,0,255,0.1)]"
                    >
                    Initialize Final Loop
                    </button>
                </div>
                </div>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
}
