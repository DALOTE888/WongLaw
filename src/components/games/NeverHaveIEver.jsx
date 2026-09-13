import React, { useState } from 'react';
import { neverHaveIEverQuestions } from '../../data/neverHaveIEver';
import { playCardFlip, playClink } from '../../sound/soundEffects';
import { Beer, Shuffle, ChevronRight, ChevronLeft, Flame, Sparkles } from 'lucide-react';

export default function NeverHaveIEver() {
  const [questions, setQuestions] = useState(neverHaveIEverQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentQ = questions[currentIndex];

  const handleNext = () => {
    playCardFlip();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % questions.length);
  };

  const handlePrev = () => {
    playCardFlip();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + questions.length) % questions.length);
  };

  const handleShuffle = () => {
    playCardFlip();
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
  };

  const handleDrinkClick = () => {
    playClink();
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Flame className="w-4 h-4 text-pink-500" />
          <span>Never Have I Ever 18+</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white">เคยหรือไม่?</h2>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          ผลัดกันอ่าน ใครในวงที่ "เคยทำ" สิ่งนี้... <span className="text-pink-400 font-bold">ต้องยกแก้วดื่ม!</span>
        </p>
      </div>

      {/* Progress & Controls */}
      <div className="w-full flex items-center justify-between text-xs text-gray-400 mb-3 px-2">
        <span className="font-semibold text-pink-400">
          คำถามที่ {currentIndex + 1} / {questions.length}
        </span>
        <button
          onClick={handleShuffle}
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>สลับคำถาม</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="w-full relative group">
        <div className="w-full min-h-[320px] bg-gradient-to-b from-night-800 via-night-900 to-night-950 border-2 border-pink-500/40 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl shadow-pink-950/50 relative overflow-hidden transition-all duration-300">
          {/* Neon corner accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/10 blur-2xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/10 blur-2xl rounded-full pointer-events-none" />

          {/* Top category badge */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-pink-950/60 border border-pink-500/30 text-pink-300 text-xs font-semibold">
              หมวด: {currentQ.category}
            </span>
            <span className="flex items-center gap-1 text-amber-400 text-xs font-bold">
              <Beer className="w-3.5 h-3.5" />
              {currentQ.sip} ช็อต
            </span>
          </div>

          {/* Question Text */}
          <div className="my-6 text-center">
            <span className="text-pink-400/80 font-bold text-sm block mb-2">
              " ฉันไม่เคย... "
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-white leading-snug">
              {currentQ.text}
            </h3>
          </div>

          {/* Drink Call to Action */}
          <button
            onClick={handleDrinkClick}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition-transform active:scale-95"
          >
            <Beer className="w-5 h-5" />
            <span>ใคร "เคยทำ" ยกแก้วดื่มเลย! 🍻</span>
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between w-full mt-6 gap-4">
        <button
          onClick={handlePrev}
          className="flex-1 py-3 px-4 rounded-2xl bg-night-800 hover:bg-night-700 text-gray-300 hover:text-white border border-white/10 font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>ก่อนหน้า</span>
        </button>

        <button
          onClick={handleNext}
          className="flex-1 py-3 px-4 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition-all active:scale-95"
        >
          <span>คำถามถัดไป</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
