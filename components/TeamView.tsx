import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../App';
import { INITIAL_ERAS, ERA_STYLES } from '../constants';
import { Challenge, ChallengeType } from '../types';
import { CheckCircle, Lock, Cpu, Brain, Zap, Key, Radio, Terminal, ArrowLeft as ArrowLeftIcon, AlertCircle, Check } from 'lucide-react';
import { generateAIHint } from '../services/geminiService';
import FinalCore from './FinalCore';

// --- Typewriter Effect Component ---
const TypewriterText = ({ text, speed = 30 }: { text: string, speed?: number }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span>{displayedText}</span>;
};

interface TeamViewProps {
  teamId: string;
}

export default function TeamView({ teamId }: TeamViewProps) {
  const game = useContext(GameContext);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [answerInput, setAnswerInput] = useState("");
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', msg: string } | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);

  if (!game) return null;

  const team = game.teams.find(t => t.id === teamId);
  const currentEra = INITIAL_ERAS[game.currentEraIndex];
  
  // Get style or fallback to a default (though all eras should have a style)
  const eraStyle = ERA_STYLES[currentEra.id] || ERA_STYLES['era4'];

  if (!team) return <div>Team not found</div>;

  if (game.gameState === 'LOBBY') {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-8 text-center animate-pulse bg-dark-bg text-neon-blue font-mono">
        <div className="w-32 h-32 border-4 border-neon-blue rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,243,255,0.3)]">
           <Cpu className="w-16 h-16" />
        </div>
        <h1 className="text-4xl font-bold mb-4 tracking-widest">SYSTEM STANDBY</h1>
        <p className="text-lg text-cyan-200 opacity-80 max-w-md">
          Uplink active. Awaiting synchronization signal from Game Master.
        </p>
      </div>
    );
  }

  if (game.gameState === 'PAUSED') {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-yellow-900/20 p-8 text-center border-4 border-yellow-600/50 m-4 rounded-xl">
         <Lock className="w-24 h-24 text-yellow-500 mb-6 animate-bounce" />
         <h1 className="text-4xl font-black text-yellow-500 tracking-wider">TIMELINE FROZEN</h1>
         <p className="text-yellow-200 font-mono mt-4">TEMPORAL STASIS FIELD ACTIVE</p>
      </div>
    );
  }

  if (game.gameState === 'FINAL_ROUND' || game.gameState === 'VICTORY') {
    return <FinalCore teamId={teamId} />;
  }

  const activeChallenge = currentEra.challenges.find(c => c.id === activeChallengeId);
  const isEraComplete = team.fragments.includes(`frag_${currentEra.id}`);

  const handleSelectChallenge = (id: string) => {
    if (team.completedChallengeIds.includes(id)) return;
    setActiveChallengeId(id);
    setAnswerInput("");
    setFeedback(null);
    setHint(null);
  };

  const submitAnswer = () => {
    if (!activeChallenge) return;

    const cleanInput = answerInput.trim().toUpperCase();
    const cleanAnswer = activeChallenge.correctAnswer.toUpperCase();

    if (cleanInput === cleanAnswer) {
      setFeedback({ type: 'success', msg: "CORRECT. DATA SYNCHRONIZED." });
      game.updateTeamScore(teamId, activeChallenge.points);
      team.completedChallengeIds.push(activeChallenge.id);

      if (activeChallenge.rewardFragmentId) {
        game.collectFragment(teamId, activeChallenge.rewardFragmentId);
      }
      
      setTimeout(() => setActiveChallengeId(null), 1500);
    } else {
      setFeedback({ type: 'error', msg: "INCORRECT. TEMPORAL ANOMALY DETECTED." });
    }
  };

  const requestHint = async () => {
    if (!activeChallenge) return;
    const HINT_COST = 50;
    const confirmed = window.confirm(`Requesting a hint requires computational power.\n\nThis will deduct ${HINT_COST} POINTS from your team score.\n\nProceed?`);
    if (!confirmed) return;

    game.updateTeamScore(teamId, -HINT_COST);
    setLoadingHint(true);
    if (activeChallenge.type === 'LOGIC' || activeChallenge.type === 'PHYSICAL') {
       const aiHint = await generateAIHint(currentEra.theme, activeChallenge.description, team.name);
       setHint(aiHint);
    } else {
       setHint(activeChallenge.hint);
    }
    setLoadingHint(false);
  };

  return (
    <div className={`min-h-screen pb-20 ${eraStyle.font} ${eraStyle.bgClass} transition-colors duration-1000 relative`}>
      {/* Era Background Portal Image */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <div className={`absolute inset-0 ${eraStyle.overlayClass} opacity-80 z-20`}></div>
          <img 
            src={currentEra.imageUrl} 
            alt={currentEra.title}
            className="w-full h-full object-cover object-center animate-[pulse-slow_8s_infinite] opacity-40 mix-blend-overlay"
          />
      </div>
      
      {/* Top Bar */}
      <div className={`sticky top-0 z-50 backdrop-blur-md border-b p-4 flex justify-between items-center shadow-lg transition-colors duration-500 ${eraStyle.bgClass}/90 ${eraStyle.borderColor}`}>
        <div className="flex items-center gap-3">
           <div className="w-4 h-4 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: team.color, color: team.color }}></div>
           <span className={`font-bold text-lg hidden sm:inline tracking-wide ${eraStyle.textPrimary}`}>{team.name}</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
             <div className={`text-[10px] font-mono tracking-widest ${eraStyle.textSecondary}`}>CURRENT SCORE</div>
             <div className={`font-mono text-2xl font-bold drop-shadow-[0_0_5px_currentColor] ${eraStyle.accentColor}`}>{team.score}</div>
           </div>
        </div>
      </div>

      <div className="p-4 max-w-xl mx-auto space-y-6 relative z-10">
        
        {/* Era Header */}
        {!activeChallenge && (
          <div className="text-center py-8 relative">
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-current to-transparent ${eraStyle.accentColor}`}></div>
            
            {/* Circular Portal Frame View */}
            <div className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-opacity-50 overflow-hidden relative shadow-[0_0_30px_currentColor]" style={{ borderColor: 'currentColor', color: 'inherit' }}>
                <img src={currentEra.imageUrl} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            <p className={`font-mono text-xs tracking-[0.3em] mb-2 animate-pulse ${eraStyle.textSecondary}`}>YEAR: {currentEra.year}</p>
            <h2 className={`text-4xl font-black leading-tight mb-4 uppercase italic ${eraStyle.textPrimary}`}>{currentEra.title}</h2>
            <div className={`text-sm font-mono border-l-2 pl-4 text-left p-4 rounded-r-lg backdrop-blur-md shadow-lg ${eraStyle.borderColor} ${eraStyle.cardBg} ${eraStyle.textPrimary}`}>
               <span className={`font-bold mr-2 ${eraStyle.accentColor}`}>{'>'}</span>
               <TypewriterText text={currentEra.introText} speed={20} />
            </div>
          </div>
        )}

        {/* Challenge List */}
        {!activeChallenge ? (
          <div className="space-y-4">
             {currentEra.challenges.map(challenge => {
               const isCompleted = team.completedChallengeIds.includes(challenge.id);
               return (
                 <button 
                   key={challenge.id}
                   onClick={() => handleSelectChallenge(challenge.id)}
                   disabled={isCompleted}
                   className={`w-full p-5 rounded-xl border-2 flex items-center justify-between transition-all group backdrop-blur-sm ${
                     isCompleted 
                       ? 'bg-black/60 border-gray-800 opacity-60 grayscale' 
                       : `${eraStyle.cardBg} ${eraStyle.borderColor} hover:border-current hover:shadow-[0_0_20px_currentColor] hover:-translate-y-1 ${eraStyle.accentColor}`
                   }`}
                 >
                   <div className="flex items-center gap-4 text-left">
                     <div className={`p-3 rounded-lg transition-colors ${isCompleted ? 'bg-gray-800 text-gray-500' : `${eraStyle.bgClass} ${eraStyle.accentColor} group-hover:bg-white group-hover:text-black`}`}>
                       {getIconForType(challenge.type)}
                     </div>
                     <div>
                       <h3 className={`font-bold text-lg ${isCompleted ? 'text-gray-500 line-through' : eraStyle.textPrimary}`}>
                         {challenge.title}
                       </h3>
                       <div className="flex gap-2 items-center mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded font-mono border ${eraStyle.borderColor} ${eraStyle.textSecondary}`}>
                             {challenge.type}
                          </span>
                          <span className={`text-xs font-mono ${eraStyle.accentColor}`}>{challenge.points} PTS</span>
                       </div>
                     </div>
                   </div>
                   {isCompleted ? <CheckCircle className="text-gray-500" /> : <div className={`w-2 h-2 rounded-full bg-current ${eraStyle.textSecondary} group-hover:${eraStyle.accentColor}`}></div>}
                 </button>
               );
             })}
             
             {isEraComplete && (
               <div className={`mt-8 p-6 border rounded-xl text-center animate-pulse backdrop-blur-md ${eraStyle.cardBg} ${eraStyle.borderColor}`}>
                 <Key className={`mx-auto mb-2 w-10 h-10 ${eraStyle.accentColor}`} />
                 <h3 className={`font-bold text-xl tracking-widest ${eraStyle.textPrimary}`}>FRAGMENT SECURED</h3>
                 <p className={`text-xs font-mono mt-2 ${eraStyle.textSecondary}`}>Awaiting timeline jump sequence...</p>
               </div>
             )}
          </div>
        ) : (
          /* Active Challenge View */
          <div className={`${eraStyle.cardBg} border-2 ${eraStyle.borderColor} rounded-xl p-6 shadow-2xl animate-in slide-in-from-bottom-4 relative overflow-hidden flex flex-col min-h-[60vh] transition-all duration-500 backdrop-blur-xl`}>
            
            {/* Animated Era-Specific Overlay */}
            <div className={`absolute inset-0 ${eraStyle.activeOverlayClass} pointer-events-none z-0`}></div>

            {/* Header */}
            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4 relative z-10">
                <button 
                  onClick={() => setActiveChallengeId(null)}
                  className={`text-sm flex items-center gap-1 font-mono hover:underline transition-colors ${eraStyle.textSecondary} hover:${eraStyle.textPrimary}`}
                >
                  <ArrowLeftIcon size={14} /> ABORT TASK
                </button>
                <div className="flex flex-col items-end">
                    <span className={`text-xs font-mono ${eraStyle.textSecondary}`}>REWARD</span>
                    <span className={`text-xl font-bold ${eraStyle.accentColor}`}>{activeChallenge.points} PTS</span>
                </div>
            </div>
            
            <div className="mb-6 relative z-10">
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border tracking-widest mb-2 ${eraStyle.bgClass} ${eraStyle.accentColor} ${eraStyle.borderColor}`}>
                 {activeChallenge.type}
              </span>
              <h2 className={`text-3xl font-black mb-2 ${eraStyle.textPrimary}`}>{activeChallenge.title}</h2>
              <p className={`leading-relaxed text-sm md:text-base ${eraStyle.textSecondary}`}>{activeChallenge.description}</p>
            </div>

            {/* Question Box */}
            <div className={`flex-1 relative z-10 flex flex-col justify-center`}>
              <div className={`p-6 rounded-lg border-l-4 mb-8 shadow-lg transition-all ${eraStyle.bgClass}/80 ${eraStyle.borderColor}`}>
                 <p className={`font-mono text-lg md:text-xl font-bold ${eraStyle.textPrimary}`}>
                   <TypewriterText text={activeChallenge.question || ''} speed={15} />
                 </p>
              </div>

              {/* Input Area */}
              <div className="mb-8">
                {activeChallenge.options ? (
                   <div className="grid grid-cols-1 gap-3">
                     {activeChallenge.options.map((opt, i) => (
                       <button
                         key={opt}
                         onClick={() => setAnswerInput(opt)}
                         className={`group relative p-4 rounded border-2 text-left transition-all overflow-hidden ${
                           answerInput === opt 
                             ? `${eraStyle.bgClass} ${eraStyle.accentColor} ${eraStyle.borderColor} shadow-[0_0_15px_currentColor]` 
                             : `${eraStyle.bgClass}/40 border-transparent hover:${eraStyle.borderColor} ${eraStyle.textSecondary} hover:${eraStyle.textPrimary}`
                         }`}
                       >
                         <div className={`absolute inset-0 bg-current opacity-0 group-hover:opacity-5 transition-opacity ${eraStyle.accentColor}`}></div>
                         <div className="flex items-center justify-between relative z-10">
                             <div className="flex items-center">
                                 <span className={`font-mono mr-4 text-sm opacity-50 w-6 h-6 flex items-center justify-center rounded border border-white/20`}>
                                     {String.fromCharCode(65 + i)}
                                 </span>
                                 <span className="font-bold">{opt}</span>
                             </div>
                             {answerInput === opt && <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] bg-current animate-pulse`}></div>}
                         </div>
                       </button>
                     ))}
                   </div>
                ) : (
                  <div className={`relative group transition-all duration-300 transform-gpu ${answerInput ? 'scale-[1.01]' : ''}`}>
                     <div className={`absolute -inset-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 group-hover:opacity-50 blur transition duration-500 ${eraStyle.accentColor}`}></div>
                     <div className="relative">
                        <input 
                          type="text"
                          value={answerInput}
                          onChange={(e) => setAnswerInput(e.target.value)}
                          placeholder="ENTER_DATA..."
                          className={`w-full bg-black/80 border-2 p-5 pl-12 rounded text-xl font-mono tracking-widest focus:outline-none transition-colors ${eraStyle.borderColor} ${eraStyle.textPrimary} placeholder-gray-700 focus:border-current ${eraStyle.accentColor}`}
                        />
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${eraStyle.textSecondary}`}>
                          <Terminal size={20} />
                        </div>
                     </div>
                  </div>
                )}
              </div>
            </div>

            {/* Feedback & Actions */}
            <div className="relative z-10 space-y-4">
                {feedback && (
                  <div className={`p-4 border-2 text-center animate-in slide-in-from-bottom-2 fade-in duration-300 flex items-center justify-center gap-4
                    ${feedback.type === 'success' 
                      ? 'border-green-500 bg-green-500/10 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]' 
                      : 'border-red-500 bg-red-500/10 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)] shake-animation'}
                  `}>
                    {feedback.type === 'success' ? <Check size={24} /> : <AlertCircle size={24} />}
                    <div className="text-left">
                        <div className="text-xs font-black uppercase tracking-widest opacity-70">{feedback.type === 'success' ? 'ACCESS GRANTED' : 'ACCESS DENIED'}</div>
                        <div className={`text-sm font-mono font-bold`}>{feedback.msg}</div>
                    </div>
                  </div>
                )}

                {hint && (
                  <div className={`p-4 rounded border-l-4 text-sm italic relative animate-in fade-in slide-in-from-top-2 ${eraStyle.bgClass} ${eraStyle.borderColor}`}>
                    <div className={`flex items-center gap-2 mb-2 font-bold not-italic text-xs ${eraStyle.accentColor}`}>
                       <Radio size={14} className="animate-pulse" /> INCOMING HINT
                    </div>
                    <span className={eraStyle.textPrimary}>{hint}</span>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button 
                     onClick={requestHint}
                     disabled={loadingHint || !!hint}
                     className={`flex-1 py-4 rounded disabled:opacity-50 font-mono text-xs font-bold transition-all border ${eraStyle.buttonSecondary} hover:bg-white/5`}
                  >
                    {loadingHint ? "DECRYPTING..." : "REQUEST HINT (-50)"}
                  </button>
                  <button 
                    onClick={submitAnswer}
                    className={`flex-[2] py-4 font-black text-lg tracking-wider rounded shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 ${eraStyle.buttonPrimary}`}
                  >
                    EXECUTE <ArrowLeftIcon size={16} className="rotate-180" />
                  </button>
                </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function getIconForType(type: ChallengeType) {
  switch (type) {
    case 'QUIZ': return <Brain size={20} />;
    case 'LOGIC': return <Cpu size={20} />;
    case 'QR_SCAN': return <Zap size={20} />;
    case 'PHYSICAL': return <UsersIcon size={20} />; 
  }
}

function UsersIcon({ size = 20 }: { size?: number }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
}
