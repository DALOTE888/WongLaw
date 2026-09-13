import React, { useState, useEffect } from 'react';
import { rhythmModes } from '../../data/rhythmPrompts';
import { playTick, playBuzzer, playClink, playFanfare } from '../../sound/soundEffects';
import { Music, Zap, RotateCcw, AlertOctagon, Flame, ArrowRight } from 'lucide-react';

export default function RhythmChain({ players }) {
  const [selectedModeIndex, setSelectedModeIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [turnSeconds, setTurnSeconds] = useState(3); // 2s, 3s, 4s
  const [timeLeft, setTimeLeft] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [loserPenalty, setLoserPenalty] = useState(null);
  const [turnCount, setTurnCount] = useState(0);

  const mode = rhythmModes[selectedModeIndex];

  // Pick random starter
  const pickNewStarter = () => {
    const random = mode.starterWords[Math.floor(Math.random() * mode.starterWords.length)];
    setCurrentWord(random);
    setLoserPenalty(null);
    setTurnCount(0);
    setTimeLeft(turnSeconds);
  };

  useEffect(() => {
    pickNewStarter();
  }, [selectedModeIndex]);

  // Turn timer loop
  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsRunning(false);
            playBuzzer();
            setLoserPenalty("⏰ หมดเวลา! คิดไม่ทัน ชะงัก หรือหลุดขำ ➔ ดื่ม 1 แก้วเต็มๆ!");
            return 0;
          }
          playTick(prev <= 2);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    setTimeLeft(turnSeconds);
    setIsRunning(true);
    setLoserPenalty(null);
    playTick(false);
  };

  const handlePass = () => {
    if (!isRunning) return;
    playTick(true);
    setTurnCount(prev => prev + 1);
    setTimeLeft(turnSeconds); // reset turn time for next player
  };

  const handleFail = () => {
    setIsRunning(false);
    playBuzzer();
    setLoserPenalty("💥 หลุดขำ / ชะงัก / ความหมายไม่ไปคนละทิศ ➔ แพ้ดื่ม 1 ช็อต!");
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Music className="w-4 h-4 text-cyan-400" />
          <span>Hell Rhythm Game</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white">ต่อคำ / เพลงจังหวะนรก</h2>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          ร้องเพลงหรือต่อคำที่ความหมายฉีกไปคนละทิศคนละทางให้เร็วที่สุด ใครชะงักหรือหลุดขำ = แพ้ดื่ม!
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 p-1 bg-night-900 border border-white/10 rounded-2xl mb-5 w-full max-w-md overflow-x-auto">
        {rhythmModes.map((m, idx) => (
          <button
            key={m.id}
            onClick={() => {
              setSelectedModeIndex(idx);
              setIsRunning(false);
            }}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              selectedModeIndex === idx
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Speed Selector */}
      <div className="flex items-center gap-3 mb-5 text-xs text-gray-400">
        <span>ความเร็วเทิร์น:</span>
        {[
          { label: 'ชิลๆ (4 วิ)', val: 4 },
          { label: 'ปกติ (3 วิ)', val: 3 },
          { label: 'นรกแตก (2 วิ)', val: 2 }
        ].map(speed => (
          <button
            key={speed.val}
            onClick={() => {
              setTurnSeconds(speed.val);
              setTimeLeft(speed.val);
            }}
            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${
              turnSeconds === speed.val
                ? 'bg-purple-600 border-purple-400 text-white'
                : 'bg-night-800 border-white/10 text-gray-400'
            }`}
          >
            {speed.label}
          </button>
        ))}
      </div>

      {/* Playing Board */}
      <div className="w-full bg-gradient-to-b from-night-800 via-night-900 to-night-950 border-2 border-cyan-500/40 rounded-3xl p-6 md:p-8 text-center shadow-2xl shadow-cyan-950/40 relative">
        <div className="text-xs text-cyan-300 font-semibold mb-2">
          {mode.description}
        </div>

        {/* Starter prompt */}
        <div className="my-4 p-4 rounded-2xl bg-night-950/80 border border-cyan-500/30">
          <span className="text-[11px] text-gray-400 block mb-1 uppercase tracking-wider">โจทย์ตั้งต้น:</span>
          <h3 className="text-2xl md:text-3xl font-black text-transparent bg-gradient-to-r from-cyan-300 via-white to-pink-300 bg-clip-text">
            "{currentWord}"
          </h3>
          <button
            onClick={pickNewStarter}
            className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1 mx-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>สุ่มโจทย์ใหม่</span>
          </button>
        </div>

        {/* Big Timer Circle */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all ${
            isRunning
              ? timeLeft <= 1
                ? 'border-red-500 bg-red-500/20 text-red-400 animate-ping'
                : 'border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-lg shadow-cyan-500/40 scale-105'
              : 'border-gray-700 bg-night-900 text-gray-500'
          }`}>
            <span className="font-mono text-4xl font-black">{timeLeft}</span>
            <span className="text-[10px] uppercase font-bold tracking-widest">วินาที</span>
          </div>
          <span className="text-xs text-gray-400 mt-2 font-mono">
            ส่งต่อสำเร็จ: {turnCount} เทิร์น
          </span>
        </div>

        {/* Penalty Display if failed */}
        {loserPenalty && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-950/60 border border-red-500 text-red-300 text-sm font-bold animate-fadeIn">
            {loserPenalty}
          </div>
        )}

        {/* Action Controls */}
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-base shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>เริ่มเคาะจังหวะนรก!</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePass}
              className="py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-95 text-black font-black text-base shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <span>ผ่าน / ต่อทัน!</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleFail}
              className="py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <AlertOctagon className="w-5 h-5" />
              <span>หลุดขำ / ชะงัก!</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
