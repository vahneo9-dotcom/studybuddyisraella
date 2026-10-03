import React from 'react';
import { Sparkles, Compass, Lightbulb, UserCheck, AlertCircle } from 'lucide-react';

interface DetectiveBarnabyProps {
  mood: 'welcome' | 'correct' | 'incorrect' | 'clue' | 'idle';
  customMessage?: string;
  rank?: string;
}

export default function DetectiveBarnaby({ mood, customMessage, rank = "Novice Scout" }: DetectiveBarnabyProps) {
  const getBarnabyEmoji = () => {
    switch (mood) {
      case 'correct': return '🦉🎉';
      case 'incorrect': return '🦉🕵️‍♂️';
      case 'clue': return '🦉💡';
      case 'welcome': return '🦉✨';
      default: return '🦉🌲';
    }
  };

  const getBarnabyAvatarStyle = () => {
    switch (mood) {
      case 'correct':
        return 'border-emerald-400 bg-emerald-50 animate-bounce';
      case 'incorrect':
        return 'border-amber-400 bg-amber-50 animate-pulse';
      case 'clue':
        return 'border-blue-400 bg-blue-50';
      case 'welcome':
        return 'border-indigo-400 bg-indigo-50 animate-pulse';
      default:
        return 'border-emerald-300 bg-emerald-50/60';
    }
  };

  const getDefaultMessage = () => {
    switch (mood) {
      case 'welcome':
        return "Hoot-hoot! Hello there, brave explorer! 🌲 I am Barnaby, the Head Detective of the Math Forest. A bunch of curious mysteries have popped up, and I need a sharp-eyed partner like you! Together, we will solve word problems and earn beautiful Detective Badges. Are you ready? Let's inspect our first cases!";
      case 'correct':
        return "Splendid! Absolutely correct! You've cracked the case with flying colors. Your detective instinct is top-notch! 🌟";
      case 'incorrect':
        return "Aha! A little footprint detour! No worries at all, partner—even the greatest detectives do double-takes. Let's review the clue together and re-count! You can do this! 💪";
      case 'clue':
        return "Psst! Here is a handy clue. Put on your thinking cap and let's count step-by-step! 🔍";
      default:
        return "I'm keeping my eyes peeled for any new mathematical clues in the forest. Select a case below to examine it!";
    }
  };

  return (
    <div id="barnaby-card" className="bg-white rounded-2xl border-4 border-emerald-500 shadow-md p-4 flex flex-col md:flex-row items-center gap-4 transition-all duration-300">
      {/* Avatar Container */}
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-4xl shadow-sm transition-all duration-300 ${getBarnabyAvatarStyle()}`}>
          <span className="select-none">{getBarnabyEmoji()}</span>
        </div>
        <div className="mt-2 text-center">
          <span className="block font-sans font-extrabold text-emerald-900 text-xs">Barnaby</span>
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full mt-0.5">
            <Compass className="w-2.5 h-2.5" />
            {rank}
          </span>
        </div>
      </div>

      {/* Bubble Message */}
      <div className="relative flex-1 bg-emerald-50/60 rounded-xl p-4 border border-emerald-100">
        {/* Triangle Arrow for Chat Bubble (Desktop) */}
        <div className="hidden md:block absolute top-8 -left-2 w-4 h-4 bg-emerald-50 border-l border-b border-emerald-100 transform rotate-45" />

        <div className="prose prose-sm text-stone-700 font-sans leading-relaxed text-sm">
          <p className="font-medium whitespace-pre-wrap">
            {customMessage || getDefaultMessage()}
          </p>
        </div>

        {/* Dynamic Accents based on Mood */}
        {mood === 'correct' && (
          <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center bg-emerald-500 text-white rounded-full p-1 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        )}
        {mood === 'clue' && (
          <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center bg-blue-500 text-white rounded-full p-1">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
        )}
        {mood === 'incorrect' && (
          <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center bg-amber-500 text-white rounded-full p-1">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    </div>
  );
}
