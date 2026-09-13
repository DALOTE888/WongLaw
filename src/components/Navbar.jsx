import React from 'react';
import { Volume2, VolumeX, Users, ArrowLeft, Beer, Bell, Zap } from 'lucide-react';
import { playClink } from '../sound/soundEffects';

export default function Navbar({
  currentGame,
  setCurrentGame,
  players,
  setShowPlayerModal,
  isMuted,
  toggleSound,
  vonglawSecondsLeft,
  triggerVonglawAlert,
  triggerCoOpAlert
}) {
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-night-900/90 backdrop-blur-md border-b border-pink-500/20 px-4 py-3 shadow-lg shadow-black/50">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Brand or Back */}
        <div className="flex items-center gap-2">
          {currentGame ? (
            <button
              onClick={() => {
                playClink();
                setCurrentGame(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-night-800 hover:bg-night-700 text-pink-400 border border-pink-500/30 transition-all font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>เมนูเกม</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-pink-500/30">
                <Beer className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-black tracking-wider bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent leading-none">
                  VONGLAW 18+
                </h1>
                <span className="text-[10px] text-pink-400/80 uppercase font-semibold tracking-widest">
                  บอร์ดเกมวงเหล้า
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Center: 10-Minute วงเล่า Countdown Widget */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerVonglawAlert}
            title="กดเพื่อทดสอบ 'วงเล่า' ทันที หรือรอนับถอยหลังครบ 10 นาที"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-night-800/90 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-semibold shadow-inner transition-transform active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <Beer className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">วงเล่า:</span>
            <span className="font-mono text-amber-200">{formatTime(vonglawSecondsLeft)}</span>
          </button>

          {/* Quick trigger co-op challenge */}
          <button
            onClick={triggerCoOpAlert}
            title="สุ่มกิจกรรมคู่หู (1 นาที)"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-night-800/90 border border-purple-500/40 hover:border-purple-400 text-purple-300 text-xs font-medium transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>สุ่มเควสคู่</span>
          </button>
        </div>

        {/* Right: Players & Sound */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPlayerModal(true)}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-night-800 hover:bg-night-700 text-cyan-300 border border-cyan-500/30 transition-all text-xs sm:text-sm font-medium"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span>{players.length} คน</span>
            {players.length === 0 && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
              </span>
            )}
          </button>

          <button
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="p-2 rounded-xl bg-night-800 hover:bg-night-700 text-gray-300 hover:text-white border border-white/10 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-lime-400" />}
          </button>
        </div>
      </div>
    </header>
  );
}
