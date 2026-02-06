import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../App';
import { INITIAL_TEAMS } from '../constants';
import { Lock, Unlock, ShieldCheck, RefreshCw, TriangleAlert } from 'lucide-react';

interface FinalCoreProps {
  isGM?: boolean;
  teamId?: string;
}

export default function FinalCore({ isGM = false, teamId }: FinalCoreProps) {
  const game = useContext(GameContext);
  // Simulating the 6 fragment slots
  const [activeSlots, setActiveSlots] = useState<boolean[]>(new Array(6).fill(false));
  const [coreStatus, setCoreStatus] = useState<'UNSTABLE' | 'STABILIZING' | 'RESTORED'>('UNSTABLE');

  if (!game) return null;

  const myTeamIndex = game.teams.findIndex(t => t.id === teamId);

  useEffect(() => {
    if (isGM) {
      // GM sees actual progress (checking if teams have fragments)
      const slots = game.teams.map(t => t.fragments.length >= 6); 
      setActiveSlots(slots);
      
      const allActive = slots.every(s => s);
      if (allActive && coreStatus !== 'RESTORED') {
        setTimeout(() => setCoreStatus('STABILIZING'), 1500);
        setTimeout(() => {
           setCoreStatus('RESTORED');
           game.completeGame();
        }, 5000);
      }
    }
  }, [game.teams, isGM, coreStatus, game]);

  const insertKey = () => {
    if (myTeamIndex >= 0) {
      const newSlots = [...activeSlots];
      newSlots[myTeamIndex] = true;
      setActiveSlots(newSlots);
    }
  };

  // Visual classes based on status
  const getStatusColor = () => {
    if (coreStatus === 'UNSTABLE') return 'text-red-500 from-red-600 to-orange-600 shadow-red-500/50';
    if (coreStatus === 'STABILIZING') return 'text-blue-500 from-blue-400 to-cyan-400 shadow-blue-500/50';
    return 'text-green-400 from-green-400 to-emerald-400 shadow-green-500/50';
  };

  const getContainerShake = () => {
    if (coreStatus === 'UNSTABLE') return 'animate-[pulse_0.2s_infinite]';
    if (coreStatus === 'STABILIZING') return 'animate-pulse';
    return '';
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black transition-colors duration-1000 ${coreStatus === 'RESTORED' ? 'bg-emerald-950/20' : 'bg-black'}`}>
      
      {/* Background Grids & Rays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] z-10 pointer-events-none"></div>
      <div className={`absolute inset-0 opacity-20 pointer-events-none transition-all duration-1000 ${coreStatus === 'UNSTABLE' ? 'bg-[url("https://www.transparenttextures.com/patterns/diagmonds-light.png")] animate-[spin_60s_linear_infinite]' : 'bg-[size:40px_40px] bg-[linear-gradient(rgba(0,255,100,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,100,0.1)_1px,transparent_1px)]'}`}></div>

      {coreStatus === 'RESTORED' && (
        <div className="absolute inset-0 bg-emerald-500/10 animate-in fade-in duration-1000 z-0"></div>
      )}

      {/* Main Core Assembly */}
      <div className={`relative z-20 flex flex-col items-center scale-75 md:scale-100`}>
        
        {coreStatus === 'RESTORED' ? (
           <div className="text-center animate-in zoom-in duration-[2s] ease-out">
             <div className="relative mb-8">
                <div className="absolute inset-0 bg-green-400 blur-[100px] opacity-40 animate-pulse"></div>
                <ShieldCheck className="w-48 h-48 text-green-400 mx-auto drop-shadow-[0_0_50px_rgba(74,222,128,1)] relative z-10" />
             </div>
             <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-white to-emerald-400 mb-6 drop-shadow-lg">
               TIMELINE RESTORED
             </h1>
             <p className="text-2xl text-emerald-100 font-mono tracking-[0.5em] uppercase">Reality Stabilized</p>
             <button onClick={game.resetGame} className="mt-16 px-12 py-4 bg-emerald-900/50 border border-emerald-500/50 text-emerald-100 rounded hover:bg-emerald-800 transition-colors tracking-widest font-bold">
               ARCHIVE MISSION
             </button>
           </div>
        ) : (
          <>
            {/* The Reactor Core */}
            <div className={`relative w-[500px] h-[500px] flex items-center justify-center mb-12`}>
              
              {/* Spinning Outer Rings */}
              <div className={`absolute inset-0 rounded-full border border-white/10 ${coreStatus === 'STABILIZING' ? 'animate-[spin_1s_linear_infinite]' : 'animate-[spin_10s_linear_infinite]'}`}></div>
              <div className={`absolute inset-8 rounded-full border-2 border-dashed ${coreStatus === 'UNSTABLE' ? 'border-red-500/30 animate-[spin_20s_linear_infinite_reverse]' : 'border-blue-500/30 animate-[spin_2s_linear_infinite_reverse]'}`}></div>
              <div className={`absolute inset-16 rounded-full border-t-4 ${coreStatus === 'UNSTABLE' ? 'border-orange-500 animate-[spin_3s_linear_infinite]' : 'border-cyan-400 animate-[spin_0.5s_linear_infinite]'}`}></div>

              {/* Central Orb */}
              <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${getStatusColor()} flex items-center justify-center shadow-[0_0_100px_currentColor] z-20 relative ${getContainerShake()}`}>
                 <div className="absolute inset-0 bg-white opacity-20 animate-pulse rounded-full"></div>
                 {coreStatus === 'STABILIZING' ? (
                    <RefreshCw className="w-16 h-16 text-white animate-spin" />
                 ) : (
                    <TriangleAlert className="w-16 h-16 text-white animate-pulse" />
                 )}
              </div>

              {/* Connection Beams (Pipes to Teams) */}
              {activeSlots.map((isActive, i) => {
                const angle = (i * 60) - 90; // Start top
                const team = game.teams[i] || INITIAL_TEAMS[i];
                
                return (
                  <div 
                    key={i}
                    className="absolute top-1/2 left-1/2 w-full h-[2px] origin-left z-0"
                    style={{ 
                      transform: `rotate(${angle}deg)`,
                      width: '240px'
                    }}
                  >
                     {/* The Pipe */}
                     <div className={`w-full h-full bg-gray-800 relative overflow-hidden group`}>
                        {/* Energy Flow Animation in pipe */}
                        {isActive && (
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 w-1/2 animate-[shimmer_1s_infinite] shadow-[0_0_10px_white]"></div>
                        )}
                        <div className="w-full h-full opacity-30" style={{ backgroundColor: team.color }}></div>
                     </div>

                     {/* The Node at the end (Team Slot) */}
                     <div 
                        className={`absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-lg border-2 flex items-center justify-center transform transition-all duration-500 ${isActive ? 'scale-110 shadow-[0_0_20px_currentColor]' : 'scale-90 bg-black/80'}`}
                        style={{ 
                          transform: `translate(50%, -50%) rotate(${-angle}deg)`, // Keep text upright
                          borderColor: team.color,
                          backgroundColor: isActive ? team.color : 'black',
                          color: isActive ? 'white' : team.color,
                          boxShadow: isActive ? `0 0 30px ${team.color}` : 'none'
                        }}
                     >
                        {isActive ? <Unlock size={24} /> : <span className="font-bold font-mono">{i + 1}</span>}
                     </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center max-w-2xl px-4 relative z-30">
              <h2 className={`text-4xl font-black mb-2 tracking-widest uppercase ${coreStatus === 'UNSTABLE' ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
                {coreStatus === 'UNSTABLE' ? 'CRITICAL INSTABILITY' : 'RECALIBRATING PHYSICS...'}
              </h2>
              <p className="text-gray-400 mb-12 font-mono text-lg">
                {isGM 
                  ? "SYSTEM WAITING FOR MULTI-VECTOR SYNCHRONIZATION..." 
                  : "INSERT OUROBOROS KEYS SIMULTANEOUSLY TO STABILIZE."}
              </p>

              {!isGM && (
                 <button 
                   onClick={insertKey}
                   disabled={activeSlots[myTeamIndex] || coreStatus !== 'UNSTABLE'}
                   className={`
                     relative overflow-hidden px-10 py-5 font-black text-xl rounded-sm transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed group
                     ${activeSlots[myTeamIndex] 
                       ? 'bg-gray-800 text-gray-400 border border-gray-600' 
                       : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_40px_rgba(220,38,38,0.6)] hover:scale-105 border-2 border-red-400'}
                   `}
                 >
                   <span className="relative z-10 flex items-center gap-2">
                      {activeSlots[myTeamIndex] ? <Lock size={20} /> : <Unlock size={20} />}
                      {activeSlots[myTeamIndex] ? "KEY ENGAGED" : "INSERT FRAGMENT"}
                   </span>
                 </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}