import React, { useState, createContext, useContext, useEffect, useMemo } from 'react';
import { GameState, Team, GameContextType, ViewMode, GameEvent } from './types';
import { INITIAL_TEAMS, INITIAL_ERAS } from './constants';
import GameMaster from './components/GameMaster';
import TeamView from './components/TeamView';
import { Shield, Users, Clock, Terminal, Smartphone, ArrowLeft, Send } from 'lucide-react';
import { QRCodeSVG } from "qrcode.react";

export const GameContext = createContext<GameContextType | null>(null);

const CRTOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]"></div>
  </div>
);

export default function App() {
  const [gameState, setGameState] = useState<GameState>('LOBBY');
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [currentEraIndex, setCurrentEraIndex] = useState<number>(0); 
  const [lastEvent, setLastEvent] = useState<GameEvent | null>(null);
  
  // Refactored State for Navigation and Identity
  const [viewMode, setViewMode] = useState<ViewMode>('LANDING');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [joinError, setJoinError] = useState('');

  // Sync with URL and LocalStorage on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTeamId = params.get('teamId');
    const storedTeamId = localStorage.getItem('timeWarpTeamId');

    if (urlTeamId && INITIAL_TEAMS.some(t => t.id === urlTeamId)) {
      setSelectedTeamId(urlTeamId);
      localStorage.setItem('timeWarpTeamId', urlTeamId);
      setViewMode('TEAM');
    } else if (storedTeamId && INITIAL_TEAMS.some(t => t.id === storedTeamId)) {
      setSelectedTeamId(storedTeamId);
      setViewMode('TEAM');
    }
  }, []);

  const startGame = () => {
    setGameState('PLAYING');
    const now = Date.now();
    setTeams(prev => prev.map(t => ({...t, lastActivityTimestamp: now})));
  };

  const pauseGame = () => {
    setGameState(prev => prev === 'PAUSED' ? 'PLAYING' : 'PAUSED');
  };

  const resetGame = () => {
    setGameState('LOBBY');
    setTeams(INITIAL_TEAMS);
    setCurrentEraIndex(0);
    setLastEvent(null);
  };

  const updateTeamScore = (teamId: string, points: number) => {
    setTeams(prev => prev.map(t => 
      t.id === teamId ? { ...t, score: t.score + points } : t
    ));
  };

  const collectFragment = (teamId: string, fragmentId: string) => {
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t;
      if (t.fragments.includes(fragmentId)) return t;
      return { 
        ...t, 
        fragments: [...t.fragments, fragmentId],
        lastActivityTimestamp: Date.now() 
      };
    }));

    const era = INITIAL_ERAS.find(e => e.challenges.some(c => c.rewardFragmentId === fragmentId));
    if (era) {
      setLastEvent({
        type: 'ERA_COMPLETE',
        teamId,
        eraName: era.title,
        timestamp: Date.now()
      });
      setTimeout(() => setLastEvent(null), 5000);
    }
  };

  const unlockNextEra = () => setCurrentEraIndex(prev => Math.min(prev + 1, INITIAL_ERAS.length - 1));
  const triggerFinalRound = () => setGameState('FINAL_ROUND');
  const completeGame = () => setGameState('VICTORY');

  const handleAccessCodeJoin = () => {
    const team = teams.find(t => t.accessCode === accessCodeInput.trim());
    if (team) {
      setSelectedTeamId(team.id);
      localStorage.setItem('timeWarpTeamId', team.id);
      setViewMode('TEAM');
      setJoinError('');
    } else {
      setJoinError('INVALID ACCESS CODE');
    }
  };

  const logout = () => {
    localStorage.removeItem('timeWarpTeamId');
    setSelectedTeamId(null);
    setViewMode('LANDING');
  };

  const contextValue = useMemo<GameContextType>(() => ({
    gameState,
    teams,
    currentEraIndex,
    lastEvent,
    setGameState,
    startGame,
    pauseGame,
    resetGame,
    updateTeamScore,
    collectFragment,
    unlockNextEra,
    triggerFinalRound,
    completeGame
  }), [gameState, teams, currentEraIndex, lastEvent]);

  if (viewMode === 'LANDING') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[url('https://picsum.photos/1920/1080?grayscale&blur=2')] bg-cover bg-center text-white relative font-mono overflow-hidden">
        <CRTOverlay />
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="relative z-10 text-center space-y-8 p-8 border border-neon-blue/30 bg-black/60 backdrop-blur-md rounded-xl max-w-2xl w-full mx-4 shadow-[0_0_50px_rgba(0,243,255,0.2)]">
          <div className="flex justify-center">
             <div className="relative">
               <div className="absolute inset-0 bg-neon-blue blur-xl opacity-50 animate-pulse"></div>
               <Clock className="w-20 h-20 text-neon-blue relative z-10" />
             </div>
          </div>
          
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-pink mb-2 glitch-text" data-text="TIME WARP">
              TIME WARP
            </h1>
            <p className="text-xl text-cyan-100 tracking-[0.5em] text-xs md:text-sm uppercase opacity-80">The Race to Repair Reality</p>
          </div>

          <div className="space-y-6 mt-12">
            <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
               <h3 className="text-neon-green font-bold mb-4 flex items-center justify-center gap-2 uppercase tracking-widest">
                 <Terminal size={18} /> Agent Authorization
               </h3>
               <div className="flex flex-col gap-3">
                 <button 
                  onClick={() => setViewMode('TEAM_SELECT')}
                  className="w-full py-4 bg-neon-green/10 hover:bg-neon-green/20 border border-neon-green/50 rounded text-neon-green font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                 >
                   <Users size={20} /> Browse Available Squads
                 </button>
                 
                 <div className="relative flex items-center gap-2 my-2">
                    <div className="h-px bg-gray-700 flex-1"></div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Or Quick Uplink</span>
                    <div className="h-px bg-gray-700 flex-1"></div>
                 </div>

                 <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="PIN" 
                      maxLength={4}
                      value={accessCodeInput}
                      onChange={(e) => setAccessCodeInput(e.target.value.toUpperCase())}
                      className="w-24 bg-black/50 border border-gray-600 rounded p-3 text-center text-xl font-bold tracking-widest focus:border-neon-blue outline-none text-white"
                    />
                    <button 
                      onClick={handleAccessCodeJoin}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded font-bold transition-colors flex items-center justify-center gap-2 uppercase text-xs"
                    >
                      Authenticate <Send size={16} />
                    </button>
                 </div>
                 {joinError && <p className="text-red-500 text-[10px] font-bold animate-pulse uppercase">{joinError}</p>}
               </div>
            </div>

            <button 
              onClick={() => setViewMode('GM')}
              className="text-[10px] text-gray-600 hover:text-neon-blue transition-colors flex items-center justify-center gap-1 mx-auto mt-4 uppercase tracking-[0.2em] font-bold"
            >
              <Shield size={12} /> Console Admin Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'TEAM_SELECT') {
    return (
      <div className="min-h-screen bg-dark-bg p-8 flex flex-col items-center relative overflow-y-auto font-mono">
        <CRTOverlay />
        <h2 className="text-3xl font-bold text-white mb-2 mt-8 tracking-widest uppercase">Select Squadron</h2>
        <p className="text-gray-400 mb-8 text-sm uppercase opacity-60">Initialize link to available time-agents</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl w-full pb-20">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => {
                setSelectedTeamId(team.id);
                setViewMode('TEAM_QR');
              }}
              style={{ borderColor: team.color }}
              className="group p-8 border-2 rounded-xl bg-panel-bg hover:scale-105 transition-all flex flex-col items-center relative overflow-hidden shadow-lg"
            >
              <div 
                className="w-16 h-16 rounded-full mb-4 shadow-[0_0_15px_currentColor] flex items-center justify-center bg-black/40"
                style={{ color: team.color }}
              >
                <Users size={24} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-wider relative z-10" style={{ color: team.color }}>{team.name}</h3>
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => setViewMode('LANDING')}
          className="fixed bottom-8 bg-black/80 backdrop-blur px-8 py-3 rounded-full border border-gray-700 text-gray-400 hover:text-white transition-colors z-20 font-bold text-[10px] uppercase tracking-widest"
        >
          ← Back to Mainframe
        </button>
      </div>
    );
  }

  if (viewMode === 'TEAM_QR' && selectedTeamId) {
    const team = teams.find(t => t.id === selectedTeamId);
    if (!team) return null;
    const joinUrl = `${window.location.origin}${window.location.pathname}?teamId=${team.id}`;

    return (
      <div className="min-h-screen bg-dark-bg p-8 flex flex-col items-center justify-center text-center relative font-mono">
        <CRTOverlay />
        <div className="z-10 animate-in slide-in-from-bottom-8 duration-700 max-w-4xl w-full">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter drop-shadow-lg" style={{ color: team.color }}>
              {team.name}
            </h1>
            <p className="text-xs text-gray-500 mt-2 uppercase tracking-[0.5em]">Awaiting Authorization</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-12">
            <div className="bg-white p-4 rounded-xl shadow-2xl">
                <QRCodeSVG value={joinUrl} size={180} level="M" />
            </div>
            <div className="hidden md:block text-gray-700 font-bold">OR</div>
            <div className="bg-panel-bg border-2 p-8 rounded-xl min-w-[200px]" style={{ borderColor: team.color }}>
                <p className="text-gray-500 text-[10px] mb-2 uppercase tracking-widest font-bold">Manual PIN</p>
                <div className="text-5xl font-black tracking-widest" style={{ color: team.color }}>
                  {team.accessCode}
                </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setViewMode('TEAM_SELECT')} className="px-6 py-3 rounded border border-gray-700 hover:bg-gray-800 text-gray-500 uppercase text-[10px] font-bold transition-all">
                ← Change Squad
              </button>
              <button 
                  onClick={() => {
                    localStorage.setItem('timeWarpTeamId', team.id);
                    setViewMode('TEAM');
                  }}
                  className="px-10 py-3 rounded text-black font-black hover:brightness-110 shadow-lg transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                  style={{ backgroundColor: team.color }}
              >
                  Link Verified <Smartphone size={16} />
              </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GameContext.Provider value={contextValue}>
      <div className="min-h-screen bg-dark-bg text-white font-sans">
        {viewMode === 'GM' && <GameMaster />}
        {viewMode === 'TEAM' && selectedTeamId && (
          <div className="relative">
            <TeamView teamId={selectedTeamId} />
            <button 
              onClick={logout}
              className="fixed bottom-4 left-4 z-[60] bg-black/50 p-2 rounded text-gray-500 hover:text-white text-[10px] uppercase font-bold tracking-widest border border-gray-800 backdrop-blur"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </GameContext.Provider>
  );
}