import React from 'react';
import { Badge } from '../types';
import { Award, Lock } from 'lucide-react';

interface BadgeRackProps {
  badges: Badge[];
}

export default function BadgeRack({ badges }: BadgeRackProps) {
  const unlockedCount = badges.filter(b => b.unlockedAt).length;

  return (
    <div id="badge-rack" className="bg-amber-50/70 border-4 border-amber-800/20 rounded-2xl p-4 shadow-xs relative overflow-hidden">
      {/* Decorative Wooden Background Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-amber-800/10">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-700" />
          <h3 className="font-sans font-extrabold text-amber-900 text-sm">Your Case Badges</h3>
        </div>
        <span className="bg-amber-800/10 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
          {unlockedCount} / {badges.length} Unlocked
        </span>
      </div>

      {/* Wooden Shelf Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 relative z-10">
        {badges.map((badge) => {
          const isUnlocked = !!badge.unlockedAt;
          return (
            <div
              key={badge.id}
              id={`badge-card-${badge.id}`}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 text-center transition-all duration-300 relative ${
                isUnlocked
                  ? 'bg-white border-amber-400 shadow-md scale-100 hover:scale-105'
                  : 'bg-amber-100/40 border-stone-200 opacity-60'
              }`}
            >
              {/* Badge Icon or Lock Icon */}
              <div className="relative">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-xs ${
                    isUnlocked ? 'bg-amber-50 border-2 border-amber-300' : 'bg-stone-200 border-stone-300'
                  }`}
                >
                  <span className={`select-none ${isUnlocked ? 'filter-none' : 'filter grayscale'}`}>
                    {badge.emoji}
                  </span>
                </div>
                {!isUnlocked && (
                  <div className="absolute -bottom-1 -right-1 bg-stone-500 text-white rounded-full p-0.5 border border-white">
                    <Lock className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>

              {/* Badge Text */}
              <div className="mt-2">
                <h4 className="font-sans font-extrabold text-stone-800 text-xs leading-tight">
                  {badge.name}
                </h4>
                <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">
                  {isUnlocked ? badge.description : badge.requirement}
                </p>
              </div>

              {/* Unlocked Confetti effect */}
              {isUnlocked && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              )}
            </div>
          );
        })}
      </div>

      {/* Shelf Bottom Wood Panel */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-amber-800/15" />
    </div>
  );
}
