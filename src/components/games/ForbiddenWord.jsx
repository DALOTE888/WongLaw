import React, { useState, useEffect } from 'react';
import { forbiddenWordPacks } from '../../data/forbiddenWords';
import { playTick, playBuzzer, playFanfare, playClink } from '../../sound/soundEffects';
import { ShieldX, Clock, Users, Flame, RotateCcw, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ForbiddenWord({ players, setShowPlayerModal }) {
  // Game states: 'IDLE' | 'PLAYING' | 'FAIL' | 'SUCCESS'
  const [gameState, setGameState] = useState('IDLE');
  const [targetPlayer, setTargetPlayer] = useState('');
  const [activeWordObj, setActiveWordObj] = useState(forbiddenWordPacks[0]);
  const [timeLeft, setTimeLeft] = useState(60);

  // Pick random player & random word
  const setupRound = () => {
    const chosenPlayer = players.length > 0
      ? players[Math.floor(Math.random() * players.length)]
      : 'คนที่นั่งทางขวามือ';
    const chosenWord = forbiddenWordPacks[Math.floor(Math.random() * forbiddenWordPacks.length)];

    setTargetPlayer(chosenPlayer);
    setActiveWordObj(chosenWord);
    setTimeLeft(60);
    setGameState('IDLE');
  };

  useEffect(() => {
    setupRound();
  }, [players]);

  // 60-Second Countdown
  useEffect(() => {
    let timer = null;
    if (gameState === 'PLAYING' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameState('SUCCESS');
            playFanfare();
            return 0;
          }
          if (prev <= 10) {
            playTick(true);
          } else {
            playTick(false);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleStartGame = () => {
    setTimeLeft(60);
    setGameState('PLAYING');
    playTick(false);
  };

  const handleVictimSaidWord = () => {
    setGameState('FAIL');
    playBuzzer();
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldX className="w-4 h-4 text-rose-500" />
          <span>Forbidden Word Heads-Up</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white">คำต้องห้าม 1 นาที</h2>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          สุ่มผู้เคราะห์ร้ายเอาหน้าจอแปะหน้าผาก เพื่อนๆ ในวงต้องหลอกล่อให้พูดคำนี้ให้ได้!
        </p>
      </div>

      {/* Main Board */}
      <div className="w-full bg-gradient-to-b from-night-800 via-night-900 to-night-950 border-2 border-rose-500/40 rounded-3xl p-6 md:p-8 text-center shadow-2xl shadow-rose-950/50 relative overflow-hidden">
        {/* Victim Name Badge */}
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/70 border border-rose-500/40">
          <span className="text-xs text-gray-300">ผู้รับเคราะห์:</span>
          <span className="text-sm font-black text-rose-400">{targetPlayer}</span>
        </div>

        {gameState === 'IDLE' && (
          <div className="py-4">
            <div className="p-4 rounded-2xl bg-night-950 border border-white/10 mb-6 text-left text-xs text-gray-300 space-y-2">
              <p className="font-bold text-white text-sm">📱 วิธีการเล่น:</p>
              <p>1. ให้ <strong className="text-rose-400">{targetPlayer}</strong> ถือโทรศัพท์แล้วหันหน้าจอออก แตะไว้ที่หน้าผาก (ห้ามแอบดูคำ!)</p>
              <p>2. เพื่อนๆ รอบโต๊ะจะมีเวลา <strong>1 นาที</strong> ในการชวนคุยหรือหลอกล่อให้พูดคำต้องห้าม</p>
              <p>3. ถ้าเผลอพูด ➔ <strong className="text-red-400">{targetPlayer} หมดแก้ว!</strong></p>
              <p>4. ถ้ารอดจนหมดเวลา ➔ <strong className="text-amber-400">เพื่อนทุกคนรอบโต๊ะดื่มคนละ 1 แก้ว!</strong></p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={setupRound}
                className="py-3 px-4 rounded-2xl bg-night-800 hover:bg-night-700 text-gray-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>สุ่มคน/คำใหม่</span>
              </button>
              <button
                onClick={handleStartGame}
                className="flex-1 py-4 bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:opacity-95 text-white font-black text-base rounded-2xl shadow-xl shadow-rose-500/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Sparkles className="w-5 h-5" />
                <span>เอาขึ้นหัว & เริ่มจับเวลา 1 นาที!</span>
              </button>
            </div>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div className="py-2 animate-fadeIn">
            <p className="text-xs text-rose-400 font-bold uppercase tracking-widest mb-2 animate-pulse">
              เพื่อนรอบโต๊ะมองคำนี้ แล้วหลอกล่อให้ {targetPlayer} พูด!
            </p>

            {/* Giant Forbidden Word Display for Forehead */}
            <div className="my-6 p-6 rounded-3xl bg-black/80 border-4 border-rose-500 shadow-2xl shadow-rose-600/50">
              <span className="text-[11px] text-gray-400 uppercase tracking-widest block mb-1">
                คำต้องห้ามคือ
              </span>
              <h3 className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-rose-400 via-pink-300 to-yellow-300 bg-clip-text">
                "{activeWordObj.word}"
              </h3>
              <p className="text-xs text-rose-300/80 mt-2 font-medium">
                💡 คำใบ้เพื่อน: {activeWordObj.hint}
              </p>
            </div>

            {/* Timer Clock */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className={`flex items-center gap-2 px-5 py-2 rounded-2xl border ${
                timeLeft <= 10
                  ? 'bg-red-950/80 border-red-500 text-red-400 animate-pulse'
                  : 'bg-night-950 border-rose-500/40 text-rose-300'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="font-mono text-3xl font-black">
                  00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </span>
              </div>
            </div>

            {/* Bust Button */}
            <button
              onClick={handleVictimSaidWord}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-base rounded-2xl shadow-xl shadow-red-600/40 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>หลุดพูดคำนี้แล้ว! (โดนจับได้)</span>
            </button>
          </div>
        )}

        {gameState === 'FAIL' && (
          <div className="py-4 animate-fadeIn">
            <span className="text-5xl block mb-2">💥</span>
            <h3 className="text-2xl md:text-3xl font-black text-red-400 mb-2">
              หลุดพูดคำว่า "{activeWordObj.word}" !
            </h3>
            <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500 text-white font-bold text-base mb-6">
              🍺 บทลงโทษ: <span className="text-yellow-300">{targetPlayer}</span> ดื่ม <span className="text-red-400 underline">หมดแก้ว!</span>
            </div>
            <button
              onClick={setupRound}
              className="w-full py-4 bg-night-800 hover:bg-night-700 text-white font-bold rounded-2xl border border-white/10 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>เล่นรอบใหม่ สุ่มคนถัดไป</span>
            </button>
          </div>
        )}

        {gameState === 'SUCCESS' && (
          <div className="py-4 animate-fadeIn">
            <span className="text-5xl block mb-2">🎉</span>
            <h3 className="text-2xl md:text-3xl font-black text-emerald-400 mb-2">
              ครบ 1 นาที! รอดตัวสำเร็จ!
            </h3>
            <p className="text-xs text-gray-400 mb-2">
              คำต้องห้ามคือ: <strong className="text-white">"{activeWordObj.word}"</strong>
            </p>
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-white font-bold text-base mb-6">
              🍻 บทลงโทษ: <span className="text-emerald-300 font-extrabold">เพื่อนทุกคนรอบโต๊ะ</span> ดื่มคนละ <span className="text-amber-300 underline">1 แก้ว!</span>
            </div>
            <button
              onClick={setupRound}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-black rounded-2xl flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>เล่นรอบใหม่ สุ่มคนถัดไป</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
