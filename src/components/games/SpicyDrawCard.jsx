import React, { useState } from 'react';
import { spicyCardsDeck } from '../../data/spicyCards';
import { playCardFlip, playClink } from '../../sound/soundEffects';
import { Sparkles, Shuffle, Beer, Flame, ChevronRight, Layers } from 'lucide-react';

export default function SpicyDrawCard({ players }) {
  const [deck, setDeck] = useState(spicyCardsDeck);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterType, setFilterType] = useState('ALL');

  const filteredDeck = filterType === 'ALL'
    ? deck
    : deck.filter(c => c.type === filterType || (filterType === '18+' && (c.type === 'DARE_18' || c.type === 'TRUTH_18')));

  const activeCard = filteredDeck[currentCardIndex] || deck[0];

  // Helper to replace generic terms with random players
  const formatCardText = (text) => {
    if (!text || players.length === 0) return text;
    // can sprinkle player names
    return text;
  };

  const handleDrawNext = () => {
    playCardFlip();
    setIsFlipped(false);
    setCurrentCardIndex(prev => (prev + 1) % filteredDeck.length);
  };

  const handleShuffle = () => {
    playCardFlip();
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentCardIndex(0);
  };

  // Badge color mapping
  const getTypeColor = (type) => {
    switch (type) {
      case 'DRINK':
      case 'ALL_DRINK':
        return 'bg-amber-500/20 border-amber-400 text-amber-300';
      case 'DARE_18':
        return 'bg-pink-500/20 border-pink-400 text-pink-300';
      case 'TRUTH_18':
        return 'bg-purple-500/20 border-purple-400 text-purple-300';
      case 'RULE':
        return 'bg-cyan-500/20 border-cyan-400 text-cyan-300';
      default:
        return 'bg-emerald-500/20 border-emerald-400 text-emerald-300';
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Layers className="w-4 h-4 text-pink-500" />
          <span>Spicy Party Cards</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white">เปิดไพ่สุ่มคำสั่ง 18+</h2>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          สุ่มไพ่แจกช็อต สั่งทำกิจกรรม 18+ ล้วงความลับ หรือตั้งกติกากลางสุดป่วน!
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-1.5 p-1 bg-night-900 border border-white/10 rounded-2xl mb-4 w-full max-w-md overflow-x-auto">
        {[
          { label: 'ทั้งหมด', val: 'ALL' },
          { label: '🔥 หมวด 18+', val: '18+' },
          { label: '🍻 แจกช็อต', val: 'DRINK' },
          { label: '📜 กติกากลาง', val: 'RULE' }
        ].map(item => (
          <button
            key={item.val}
            onClick={() => {
              setFilterType(item.val);
              setCurrentCardIndex(0);
            }}
            className={`flex-1 py-1.5 px-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              filterType === item.val
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Counter and Shuffle */}
      <div className="w-full flex items-center justify-between text-xs text-gray-400 mb-3 px-2">
        <span className="font-semibold text-pink-400">
          ไพ่ใบที่ {currentCardIndex + 1} / {filteredDeck.length}
        </span>
        <button
          onClick={handleShuffle}
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>สับไพ่ใหม่</span>
        </button>
      </div>

      {/* Big Playing Card */}
      <div className="w-full relative">
        <div className="w-full min-h-[340px] bg-gradient-to-b from-night-800 via-night-900 to-night-950 border-2 border-pink-500/40 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl shadow-pink-950/60 relative overflow-hidden transition-all duration-300">
          {/* Card Top */}
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${getTypeColor(activeCard.type)}`}>
              {activeCard.badge}
            </span>
            <span className="text-xs font-mono text-gray-400">
              ID #{activeCard.id}
            </span>
          </div>

          {/* Card Content */}
          <div className="my-6 text-center">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
              {activeCard.title}
            </h3>
            <p className="text-base md:text-lg text-gray-200 font-medium leading-relaxed">
              {formatCardText(activeCard.description)}
            </p>
          </div>

          {/* Penalty Banner */}
          <div className="p-3 rounded-2xl bg-night-950 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Beer className="w-4 h-4 text-amber-400" />
              <span>บทลงโทษ:</span>
            </div>
            <span className="text-xs md:text-sm font-bold text-amber-300">
              {activeCard.penalty}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full mt-6">
        <button
          onClick={handleDrawNext}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:opacity-95 text-white font-black text-base shadow-xl shadow-pink-500/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Sparkles className="w-5 h-5" />
          <span>จั่วการ์ดใบถัดไป!</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
