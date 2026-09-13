import React, { useState, useEffect } from 'react';
import { poseThemes } from '../../data/poseLevels';
import { playTick, playBuzzer, playFanfare, playClink, playCardFlip } from '../../sound/soundEffects';
import { Activity, Eye, EyeOff, Clock, RotateCcw, Beer, Sparkles, Check, HelpCircle } from 'lucide-react';

export default function PoseLevelGame({ players }) {
  // Game states: 'SETUP' | 'PEEK_LEVEL' | 'COUNTDOWN_3S' | 'HOLD_10S' | 'GUESS_PHASE' | 'RESULT'
  const [gameState, setGameState] = useState('SETUP');
  const [activePlayer, setActivePlayer] = useState('');
  const [theme, setTheme] = useState(poseThemes[0]);
  const [secretLevel, setSecretLevel] = useState(7); // 1 to 10
  const [isPeeking, setIsPeeking] = useState(false);
  const [seconds3, setSeconds3] = useState(3);
  const [seconds10, setSeconds10] = useState(10);
  const [friendsGuess, setFriendsGuess] = useState(null);

  const initRound = () => {
    const chosenPlayer = players.length > 0
      ? players[Math.floor(Math.random() * players.length)]
      : 'คนที่นั่งซ้ายมือ';
    const chosenTheme = poseThemes[Math.floor(Math.random() * poseThemes.length)];
    const chosenLevel = Math.floor(Math.random() * 10) + 1; // 1 to 10

    setActivePlayer(chosenPlayer);
    setTheme(chosenTheme);
    setSecretLevel(chosenLevel);
    setIsPeeking(false);
    setSeconds3(3);
    setSeconds10(10);
    setFriendsGuess(null);
    setGameState('SETUP');
    playCardFlip();
  };

  useEffect(() => {
    initRound();
  }, [players]);

  // 3-second preparation timer
  useEffect(() => {
    let t = null;
    if (gameState === 'COUNTDOWN_3S' && seconds3 > 0) {
      t = setInterval(() => {
        setSeconds3(prev => {
          if (prev <= 1) {
            clearInterval(t);
            setGameState('HOLD_10S');
            setSeconds10(10);
            playTick(true);
            return 0;
          }
          playTick(true);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(t);
  }, [gameState, seconds3]);

  // 10-second pose hold timer
  useEffect(() => {
    let t = null;
    if (gameState === 'HOLD_10S' && seconds10 > 0) {
      t = setInterval(() => {
        setSeconds10(prev => {
          if (prev <= 1) {
            clearInterval(t);
            setGameState('GUESS_PHASE');
            playFanfare();
            return 0;
          }
          playTick(prev <= 3);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(t);
  }, [gameState, seconds10]);

  const startPoseFlow = () => {
    setSeconds3(3);
    setGameState('COUNTDOWN_3S');
    playTick(true);
  };

  const handleFail3s = () => {
    playBuzzer();
    alert("จัดท่าไม่ทันใน 3 วินาที! ดื่มหมดแก้วทันที!");
    initRound();
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Activity className="w-4 h-4 text-amber-400" />
          <span>Pose 10s & Level Guess</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white">ทำท่านี้ 10 วิ ทายระดับ 1-10</h2>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          จัดท่าใน 3 วิ แล้วค้างไว้ 10 วิ! ให้เพื่อนทายว่าระดับที่เราได้คือเลขอะไร (1-10)
        </p>
      </div>

      {/* Main Board */}
      <div className="w-full bg-gradient-to-b from-night-800 via-night-900 to-night-950 border-2 border-amber-500/40 rounded-3xl p-6 md:p-8 text-center shadow-2xl shadow-amber-950/40 relative">
        {/* Active Player Badge */}
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/70 border border-amber-500/40">
          <span className="text-xs text-gray-300">คนแสดงท่า:</span>
          <span className="text-sm font-black text-amber-400">{activePlayer}</span>
        </div>

        {/* STAGE 1: SETUP & PEEK */}
        {gameState === 'SETUP' && (
          <div className="py-2">
            <h3 className="text-xl font-bold text-white mb-2">โจทย์รอบนี้:</h3>
            <div className="p-4 rounded-2xl bg-night-950 border border-amber-500/30 mb-4">
              <h4 className="text-2xl font-black text-amber-300 mb-1">{theme.title}</h4>
              <p className="text-xs text-gray-400">{theme.guide}</p>
            </div>

            {/* Secret Level Peek Card */}
            <div className="p-5 rounded-2xl bg-night-900 border border-white/10 mb-6">
              <span className="text-xs text-gray-400 block mb-2">
                ให้ {activePlayer} แอบดู "ระดับตัวเลขลับ" คนเดียว (ห้ามให้เพื่อนเห็น!)
              </span>

              {!isPeeking ? (
                <button
                  onClick={() => {
                    setIsPeeking(true);
                    playCardFlip();
                  }}
                  className="py-3 px-5 rounded-xl bg-night-800 hover:bg-night-700 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center justify-center gap-1.5 mx-auto"
                >
                  <Eye className="w-4 h-4" />
                  <span>กดแอบดูระดับของคุณ (1 - 10)</span>
                </button>
              ) : (
                <div className="animate-fadeIn">
                  <div className="inline-block py-3 px-8 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 font-mono text-4xl font-black my-2">
                    ระดับ {secretLevel} / 10
                  </div>
                  <p className="text-xs text-amber-200 mt-1">
                    {secretLevel <= 3 ? theme.hint1 : secretLevel <= 7 ? theme.hint2 : theme.hint3}
                  </p>
                  <button
                    onClick={() => setIsPeeking(false)}
                    className="mt-3 text-xs text-gray-400 hover:text-white flex items-center gap-1 mx-auto"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>ซ่อนตัวเลขลับ</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={initRound}
                className="py-3.5 rounded-2xl bg-night-800 hover:bg-night-700 text-gray-300 text-xs font-semibold border border-white/10 flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-4 h-4" />
                <span>เปลี่ยนโจทย์</span>
              </button>
              <button
                onClick={startPoseFlow}
                className="py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-black text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>พร้อมแล้ว เริ่มนับ 3 วิ!</span>
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: 3-SECOND PREP COUNTDOWN */}
        {gameState === 'COUNTDOWN_3S' && (
          <div className="py-6 animate-fadeIn">
            <span className="text-xs font-bold uppercase text-red-400 tracking-widest block mb-2 animate-pulse">
              ⚡ จัดท่าภายใน 3 วินาที! (ถ้าจัดไม่ทัน = หมดแก้ว!)
            </span>
            <div className="w-32 h-32 rounded-full border-4 border-red-500 bg-red-500/20 flex items-center justify-center mx-auto my-4 text-red-400 font-mono text-6xl font-black shadow-2xl shadow-red-500/50 animate-bounce">
              {seconds3}
            </div>
            <p className="text-sm font-bold text-white">โพสท่าให้ตรงกับระดับ {secretLevel} ด่วน!</p>
            <button
              onClick={handleFail3s}
              className="mt-6 text-xs text-red-400 underline hover:text-red-300"
            >
              ยอมแพ้ จัดท่าไม่ทัน (หมดแก้ว)
            </button>
          </div>
        )}

        {/* STAGE 3: 10-SECOND HOLD POSE */}
        {gameState === 'HOLD_10S' && (
          <div className="py-6 animate-fadeIn">
            <span className="text-xs font-bold uppercase text-amber-400 tracking-widest block mb-2">
              📸 ค้างท่านั้นไว้ 10 วินาที! ห้ามขยับ ห้ามหลุดขำ!
            </span>
            <div className="w-32 h-32 rounded-full border-4 border-amber-400 bg-amber-500/20 flex items-center justify-center mx-auto my-4 text-amber-300 font-mono text-5xl font-black shadow-2xl shadow-amber-500/50">
              {seconds10}
            </div>
            <p className="text-sm text-gray-300">
              เพื่อนๆ รอบโต๊ะ ดูท่าของ <strong className="text-white">{activePlayer}</strong> ไว้ให้ดี!
            </p>
          </div>
        )}

        {/* STAGE 4: GUESSING PHASE */}
        {gameState === 'GUESS_PHASE' && (
          <div className="py-2 animate-fadeIn">
            <h3 className="text-xl font-black text-white mb-1">เพื่อนๆ คิดว่าระดับอะไร? (1-10)</h3>
            <p className="text-xs text-gray-400 mb-4">
              โจทย์: "{theme.title}" ให้คนในวงช่วยกันโหวตเลือกคำตอบของโต๊ะ 1 หมายเลข
            </p>

            {/* 1-10 Number Grid */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <button
                  key={num}
                  onClick={() => setFriendsGuess(num)}
                  className={`py-3 rounded-xl font-mono text-lg font-black transition-all ${
                    friendsGuess === num
                      ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/50 scale-105'
                      : 'bg-night-950 text-gray-300 border border-white/10 hover:border-amber-400/40'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            {friendsGuess && (
              <button
                onClick={() => {
                  setGameState('RESULT');
                  if (friendsGuess === secretLevel) {
                    playFanfare();
                  } else {
                    playBuzzer();
                  }
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-base shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-5 h-5" />
                <span>โต๊ะตอบระดับ {friendsGuess} ➔ เฉลยตัวเลขจริง!</span>
              </button>
            )}
          </div>
        )}

        {/* STAGE 5: RESULT & DRINKING PENALTY */}
        {gameState === 'RESULT' && (
          <div className="py-2 animate-fadeIn">
            <span className="text-4xl block mb-2">
              {friendsGuess === secretLevel ? '🎯' : '❌'}
            </span>
            <h3 className="text-xs uppercase font-bold text-gray-400 tracking-widest mb-1">
              ระดับตัวเลขลับที่แท้จริงคือ
            </h3>
            <div className="inline-block py-3 px-8 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 font-mono text-5xl font-black my-2">
              {secretLevel}
            </div>

            <div className="p-4 rounded-2xl bg-night-950 border border-white/10 mb-6 text-sm text-left space-y-2">
              {friendsGuess === secretLevel ? (
                <div className="text-emerald-400 font-bold">
                  🎉 เพื่อนทายถูกต้องเป๊ะ! (ทาย {friendsGuess} ได้ {secretLevel})
                  <p className="text-xs text-gray-300 font-normal mt-1">
                    บทลงโทษ: <strong className="text-amber-400">{activePlayer}</strong> ดื่ม 2 ช็อต หรือ หมดแก้ว!
                  </p>
                </div>
              ) : (
                <div className="text-red-400 font-bold">
                  💥 เพื่อนทายผิด! (โต๊ะทาย {friendsGuess} แต่ระดับจริงคือ {secretLevel})
                  <p className="text-xs text-gray-300 font-normal mt-1">
                    บทลงโทษ: <strong className="text-amber-400">เพื่อนทุกคนรอบโต๊ะดื่มคนละ 1 แก้ว!</strong> (คนทำท่ารอดตัว)
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={initRound}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-base rounded-2xl shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2"
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
