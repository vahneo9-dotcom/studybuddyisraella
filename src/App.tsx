import React, { useState, useEffect } from 'react';
import { STARTER_CASES, generateSimilarCase } from './cases';
import { Case, Badge, GameState } from './types';
import DetectiveBarnaby from './components/DetectiveBarnaby';
import DetectiveScratchpad from './components/DetectiveScratchpad';
import BadgeRack from './components/BadgeRack';
import Auth from './components/Auth';
import { playSound } from './utils/audio';
import { supabase } from './lib/supabase';
import { 
  Sparkles, 
  Search, 
  RotateCcw, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Trophy, 
  TrendingUp, 
  ChevronRight, 
  Award,
  Compass,
  ArrowRight,
  BookOpen,
  UserCheck,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-1',
    name: 'Pine Scout Badge 🌲',
    description: 'Joined the Math Forest and started investigating cases!',
    emoji: '🌲',
    requirement: 'Start your journey',
    unlockedAt: new Date().toLocaleDateString()
  },
  {
    id: 'badge-2',
    name: 'Acorn Expert 🌰',
    description: 'Cracked Sammy the Squirrel\'s addition case successfully!',
    emoji: '🌰',
    requirement: 'Solve Sammy\'s Acorn Case'
  },
  {
    id: 'badge-3',
    name: 'Cosmic Navigator 🚀',
    description: 'Saved Mia\'s lost space rocks with subtraction!',
    emoji: '🚀',
    requirement: 'Solve Mia\'s Space Case'
  },
  {
    id: 'badge-4',
    name: 'Chief Pastry Chef 🍪',
    description: 'Mastered the tricky grouping bakery cookies problem!',
    emoji: '🍪',
    requirement: 'Solve Ben\'s Cookie Case'
  },
  {
    id: 'badge-5',
    name: 'Super Sleuth 🔍',
    description: 'Solved 5 cases across the Math Forest!',
    emoji: '🔍',
    requirement: 'Solve 5 cases'
  },
  {
    id: 'badge-6',
    name: 'Chief Math Inspector 👑',
    description: 'Cracked 8 math cases of all shapes and sizes!',
    emoji: '👑',
    requirement: 'Solve 8 cases'
  }
];

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCases, setActiveCases] = useState<Case[]>(STARTER_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('starter-1');
  const [score, setScore] = useState<number>(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [answers, setAnswers] = useState<{ [caseId: string]: string }>({});
  
  // Barnaby dynamic state
  const [barnabyMood, setBarnabyMood] = useState<'welcome' | 'correct' | 'incorrect' | 'clue' | 'idle'>('welcome');
  const [barnabyMessage, setBarnabyMessage] = useState<string>('');

  // Practice cases tracker (when they fail, we replace with similar)
  const [similarAttemptsCount, setSimilarAttemptsCount] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const selectedCase = activeCases.find(c => c.id === selectedCaseId) || activeCases[0];

  // Check for existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Derive Rank
  const getRank = () => {
    const solvedCount = completedIds.length;
    if (solvedCount === 0) return 'Novice Scout 🌲';
    if (solvedCount < 3) return 'Sleuth Scout 🔍';
    if (solvedCount < 5) return 'Magnifying Glass Pro 🕵️‍♂️';
    if (solvedCount < 8) return 'Senior Forest Detective 🦌';
    return 'Chief Math Inspector 👑';
  };

  // Trigger default messages on state changes
  useEffect(() => {
    if (completedIds.length === 0) {
      setBarnabyMood('welcome');
      setBarnabyMessage('');
    } else {
      setBarnabyMood('idle');
      setBarnabyMessage(`You've cracked ${completedIds.length} mystery cases, Detective! Tap on another active case from your folder below to inspect it.`);
    }
  }, [completedIds.length]);

  const handleCaseSelect = (caseId: string) => {
    playSound('click');
    setSelectedCaseId(caseId);
    
    // If completed, show success, otherwise neutral
    if (completedIds.includes(caseId)) {
      const finishedCase = activeCases.find(c => c.id === caseId);
      setBarnabyMood('correct');
      setBarnabyMessage(`Case closed! You successfully solved this case! Remember: ${finishedCase?.explanation}`);
    } else {
      setBarnabyMood('idle');
      setBarnabyMessage(`Let's inspect this case: "${activeCases.find(c => c.id === caseId)?.title}". Click the 'Need a Clue' button or use the interactive counters on your scratchpad if you need a hand!`);
    }
  };

  const handleInputChange = (caseId: string, value: string) => {
    setAnswers({
      ...answers,
      [caseId]: value
    });
  };

  const askForClue = () => {
    playSound('click');
    setBarnabyMood('clue');
    setBarnabyMessage(selectedCase.clue);
  };

  // Unlock badge logic
  const checkBadgeUnlocks = (caseId: string, solvedList: string[]) => {
    let unlockedAny = false;
    const updated = badges.map(badge => {
      if (badge.unlockedAt) return badge;

      let unlock = false;
      if (badge.id === 'badge-2' && caseId.startsWith('starter-1')) {
        unlock = true;
      } else if (badge.id === 'badge-3' && caseId.startsWith('starter-2')) {
        unlock = true;
      } else if (badge.id === 'badge-4' && caseId.startsWith('starter-3')) {
        unlock = true;
      } else if (badge.id === 'badge-5' && solvedList.length >= 5) {
        unlock = true;
      } else if (badge.id === 'badge-6' && solvedList.length >= 8) {
        unlock = true;
      }

      if (unlock) {
        unlockedAny = true;
        playSound('badge');
        return {
          ...badge,
          unlockedAt: new Date().toLocaleDateString()
        };
      }
      return badge;
    });

    if (unlockedAny) {
      setBadges(updated);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 4000);
    }
  };

  // Submit Answer Handlers
  const submitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    const userAnswerStr = answers[selectedCase.id]?.trim();
    if (!userAnswerStr) return;

    const userAnswer = parseInt(userAnswerStr, 10);
    const isCorrect = userAnswer === selectedCase.correctAnswer;

    if (isCorrect) {
      playSound('correct');
      const updatedSolved = [...completedIds, selectedCase.id];
      setCompletedIds(updatedSolved);
      setScore(prev => prev + 10);
      setBarnabyMood('correct');
      setBarnabyMessage(`Fantastic hooting, Detective! 🎉 ${selectedCase.correctAnswer} is absolutely right!\n\n${selectedCase.explanation}`);
      checkBadgeUnlocks(selectedCase.id, updatedSolved);
    } else {
      playSound('incorrect');
      setBarnabyMood('incorrect');
      
      // Personalized correction
      let mathLogic = '';
      if (selectedCase.type === 'addition') {
        mathLogic = `Remember, we are **adding (+)** to put things together! Let's count them up. If we have ${selectedCase.number1} and Sally gives us ${selectedCase.number2}, the number has to get bigger!`;
      } else if (selectedCase.type === 'subtraction') {
        mathLogic = `Remember, we are **subtracting (-)** because some spaceships/space rocks were lost! Start at ${selectedCase.number1} and take away ${selectedCase.number2}. The number has to get smaller!`;
      } else {
        mathLogic = `Let's break this down into small steps. First, we find the groups: ${selectedCase.number1} trays with ${selectedCase.number2} cookies each makes ${selectedCase.number1 * selectedCase.number2} in total. Then, we subtract (-) the ${selectedCase.number3} cookies eaten!`;
      }

      setBarnabyMessage(`Ooh! Your magnifying glass found a tiny footprint detour! 🕵️‍♂️\n\n${mathLogic}\n\nNo worries, partner! Give it another try, or tap **"Try a Similar Challenge"** below to practice with a fresh mystery!`);
    }
  };

  // Try a similar case challenge (Procedural generation)
  const loadSimilarChallenge = () => {
    playSound('click');
    setSimilarAttemptsCount(prev => prev + 1);
    
    // Generate a similar case of the same type
    const newCase = generateSimilarCase(selectedCase.type, similarAttemptsCount);
    
    // Replace the case in the active list
    const updatedCases = activeCases.map(c => c.id === selectedCase.id ? newCase : c);
    setActiveCases(updatedCases);

    // Reset answer
    setAnswers({
      ...answers,
      [newCase.id]: ''
    });

    setBarnabyMood('idle');
    setBarnabyMessage(`A fresh new footprint appears! Here is a brand new case for practice: "${newCase.title}". Let's solve it together!`);
  };

  // Generate more adventure cases when they finish starter ones!
  const loadNextAdventureBatch = () => {
    playSound('levelup');
    
    // Generate 3 completely new random cases
    const case1 = generateSimilarCase('addition', similarAttemptsCount + 1);
    const case2 = generateSimilarCase('subtraction', similarAttemptsCount + 2);
    const case3 = generateSimilarCase(Math.random() > 0.5 ? 'grouping' : 'addition', similarAttemptsCount + 3);

    const newBatch = [
      { ...case1, title: `Case #4: ${case1.title}` },
      { ...case2, title: `Case #5: ${case2.title}` },
      { ...case3, title: `Case #6: ${case3.title}` }
    ];

    setActiveCases(newBatch);
    setSelectedCaseId(newBatch[0].id);
    setAnswers({});
    setBarnabyMood('idle');
    setBarnabyMessage("Hoot-hoot! Excellent! You've unlocked Level 2 Adventure Cases! We have three brand-new mysteries to crack in the Math Forest. Let's inspect them!");
  };

  // Quick reset game to play again
  const resetGame = () => {
    playSound('click');
    setActiveCases(STARTER_CASES);
    setSelectedCaseId('starter-1');
    setScore(0);
    setCompletedIds([]);
    setBadges(INITIAL_BADGES);
    setAnswers({});
    setBarnabyMood('welcome');
    setBarnabyMessage('');
  };

  // Logout handler
  const handleLogout = async () => {
    playSound('click');
    await supabase.auth.signOut();
  };

  const isAllCurrentCasesCompleted = activeCases.every(c => completedIds.includes(c.id));

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50/40 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4 animate-bounce">🦉</span>
          <p className="text-stone-600 font-medium">Loading Math Detective...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not authenticated
  if (!session) {
    return <Auth onAuthSuccess={() => setSession(supabase.auth.getSession().then(({ data: { session } }) => session))} />;
  }

  return (
    <div className="min-h-screen bg-emerald-50/40 text-stone-800 flex flex-col font-sans selection:bg-emerald-200">
      
      {/* Background visual elements */}
      <div className="absolute top-0 left-0 w-full h-[320px] bg-gradient-to-b from-emerald-100/50 to-transparent pointer-events-none -z-10" />

      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-emerald-100 shadow-xs sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl filter drop-shadow-xs">🦉</span>
            <div>
              <h1 className="font-sans font-black text-emerald-900 text-lg leading-tight tracking-tight">
                Math Detective
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600 block">
                Math Forest Academy
              </span>
            </div>
          </div>

          {/* Quick Score Dashboard */}
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
              <div>
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-400 block">
                  Stars Earned
                </span>
                <span className="font-mono font-bold text-stone-800 text-sm">
                  {score} ⭐
                </span>
              </div>
            </div>

            <div className="bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-600" />
              <div>
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-400 block">
                  Detective Rank
                </span>
                <span className="font-sans font-black text-indigo-900 text-xs">
                  {getRank()}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="bg-stone-100 hover:bg-stone-200 text-stone-600 px-3 py-1.5 rounded-xl border border-stone-200 flex items-center gap-2 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs font-bold">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Board Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full flex flex-col gap-6">
        
        {/* Banner Announcement when Unlocking Badge */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 p-4 rounded-2xl shadow-lg border-4 border-amber-300 flex items-center justify-between z-40 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />
              <div className="flex items-center gap-3.5 relative z-10">
                <span className="text-4xl animate-bounce">🏆</span>
                <div>
                  <h3 className="font-sans font-black text-base leading-tight">
                    New Detective Badge Unlocked!
                  </h3>
                  <p className="text-xs font-semibold text-amber-900 mt-0.5">
                    Your sharp-eyed math work earned a sparkling brand new award on your shelf!
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold uppercase bg-amber-950/10 px-3 py-1.5 rounded-full relative z-10 border border-amber-950/20">
                Check Badge Shelf below! 👇
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Coach Barnaby */}
        <DetectiveBarnaby 
          mood={barnabyMood} 
          customMessage={barnabyMessage}
          rank={getRank()}
        />

        {/* Grid Area: Case workspace & Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANEL: Casefiles (7 cols) */}
          <section id="case-workspace" className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Folder Tabs / List of active cases */}
            <div className="bg-white rounded-2xl border-4 border-emerald-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-2">
                <h3 className="font-sans font-black text-stone-800 text-sm flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Your Active Casefiles Folder
                </h3>
                <span className="text-xs font-bold text-stone-500">
                  {completedIds.filter(id => activeCases.some(c => c.id === id)).length} / {activeCases.length} Solved
                </span>
              </div>

              {/* Grid of Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {activeCases.map((c, idx) => {
                  const isCompleted = completedIds.includes(c.id);
                  const isSelected = selectedCaseId === c.id;

                  return (
                    <button
                      id={`case-tab-${c.id}`}
                      key={c.id}
                      onClick={() => handleCaseSelect(c.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border-3 text-left transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500 border-emerald-600 text-white shadow-md'
                          : isCompleted
                          ? 'bg-stone-50 border-emerald-100 hover:bg-emerald-50/40 text-stone-600'
                          : 'bg-white border-stone-200 hover:border-emerald-300 hover:bg-stone-50 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{c.emoji}</span>
                        <div>
                          <span className={`block text-[10px] uppercase font-bold ${isSelected ? 'text-emerald-100' : 'text-stone-400'}`}>
                            Case #{idx + 1}
                          </span>
                          <span className="font-sans font-extrabold text-xs tracking-tight line-clamp-1">
                            {c.title.replace(/Case #\d+:\s+/, '')}
                          </span>
                        </div>
                      </div>
                      
                      {/* Solved Stamp */}
                      {isCompleted && (
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Case Workspace File */}
            <div id="active-casefile" className="bg-amber-50/40 border-4 border-amber-900/10 rounded-3xl p-5 shadow-sm relative overflow-hidden flex flex-col gap-4">
              {/* Retro Paper Aesthetic Folder Tab decoration */}
              <div className="absolute top-0 left-6 h-5 w-24 bg-amber-200/50 rounded-t-lg -mt-5" />
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-200">
                  Topic: {selectedCase.type.toUpperCase()}
                </span>
                <span className="text-xs font-mono font-bold text-amber-800">
                  Status: {completedIds.includes(selectedCase.id) ? '✅ CASE SOLVED' : '🔍 UNDER INVESTIGATION'}
                </span>
              </div>

              {/* Title & Story */}
              <div>
                <h2 className="font-sans font-black text-amber-950 text-xl leading-tight">
                  {selectedCase.title}
                </h2>
                <div className="bg-white/80 border-2 border-dashed border-amber-900/10 rounded-2xl p-4 mt-3">
                  <p className="font-sans font-medium text-stone-700 text-base leading-relaxed">
                    {selectedCase.story}
                  </p>
                </div>
              </div>

              {/* Big Question Highlight Box */}
              <div className="bg-emerald-100/70 border-4 border-emerald-400/20 rounded-2xl p-4 text-emerald-950">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-800 block">
                  The Mystery Question:
                </span>
                <p className="font-sans font-black text-base mt-1">
                  {selectedCase.question}
                </p>
              </div>

              {/* Answer Input Section */}
              <div className="mt-2 bg-white rounded-2xl border-2 border-stone-200 p-4">
                {completedIds.includes(selectedCase.id) ? (
                  /* Answer Already Correct */
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-emerald-800">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <p className="text-xs font-bold leading-normal">
                        Amazing job! You solved this case. Your correct answer was <strong>{selectedCase.correctAnswer}</strong>!
                      </p>
                    </div>
                    {isAllCurrentCasesCompleted && (
                      <button
                        onClick={loadNextAdventureBatch}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                      >
                        More Cases <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ) : (
                  /* Form to input answers */
                  <form onSubmit={submitAnswer} className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="relative w-full sm:w-40 shrink-0">
                        <input
                          id="answer-input"
                          type="number"
                          value={answers[selectedCase.id] || ''}
                          onChange={(e) => handleInputChange(selectedCase.id, e.target.value)}
                          placeholder="Your answer"
                          className="w-full bg-stone-100 border-2 border-stone-200 focus:border-emerald-500 focus:bg-white rounded-xl py-2 px-3 text-center text-lg font-black font-mono transition-all outline-none"
                          required
                          min="0"
                          max="999"
                        />
                      </div>

                      <div className="flex items-center gap-2 w-full">
                        <button
                          id="btn-verify-answer"
                          type="submit"
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-extrabold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                        >
                          <Search className="w-4 h-4" />
                          Verify Answer!
                        </button>

                        <button
                          id="btn-clue"
                          type="button"
                          onClick={askForClue}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-1 border border-indigo-200 transition-all cursor-pointer shrink-0"
                        >
                          <HelpCircle className="w-4 h-4" />
                          Clue
                        </button>
                      </div>
                    </div>

                    {/* Footer buttons for resetting or alternate challenges if stuck */}
                    <div className="flex items-center justify-between border-t border-stone-100 pt-3 text-xs text-stone-500">
                      <span>Stuck or made an error?</span>
                      <button
                        id="btn-similar-challenge"
                        type="button"
                        onClick={loadSimilarChallenge}
                        className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                        title="Generates a fresh new similar mathematical question"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Try a Similar Challenge
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* If all completed, offer next stage */}
            {isAllCurrentCasesCompleted && (
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-5 rounded-3xl shadow-md border-4 border-emerald-400 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
                <div>
                  <h3 className="font-sans font-black text-lg">Hoot-hoot! Level Complete! 🏆</h3>
                  <p className="text-xs font-medium text-emerald-50 mt-1">
                    You solved all cases on this board! Unlock Level 2 cases to earn the remaining badges.
                  </p>
                </div>
                <button
                  onClick={loadNextAdventureBatch}
                  className="bg-white hover:bg-emerald-50 text-emerald-800 font-black text-sm px-5 py-2.5 rounded-xl shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  Solve More Mysteries! 🌲
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>

          {/* RIGHT PANEL: Scratchpad & Badges (5 cols) */}
          <section id="detective-tools" className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Live Interactive Scratchpad */}
            <DetectiveScratchpad category={selectedCase.category} />

            {/* Badge Rack Display Shelf */}
            <BadgeRack badges={badges} />

            {/* Quick Helper reset */}
            <div className="flex justify-end">
              <button
                onClick={resetGame}
                className="text-stone-400 hover:text-stone-600 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Game & Try Again
              </button>
            </div>
          </section>

        </div>

      </main>

      {/* Retro Forest Footer */}
      <footer className="bg-white border-t border-emerald-100 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-stone-400 font-medium">
            🌳 Created with ❤️ for Year Two Math Detectives. Keep up the awesome hooting! 🦉
          </p>
        </div>
      </footer>

    </div>
  );
}
