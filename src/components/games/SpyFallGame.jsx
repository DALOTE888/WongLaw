import React, { useState, useEffect } from 'react';
import { spyFallThemes } from '../../data/spyFallActions';
import { playCardFlip, playBuzzer, playFanfare, playClink } from '../../sound/soundEffects';
import { Eye, EyeOff, ShieldAlert, Users, Play, CheckCircle2, RotateCcw, Flame } from 'lucide-react';

export default function SpyFallGame({ players, setShowPlayerModal }) {
  // Game states: 'SETUP' | 'REVEAL_ROLES' | 'ACTION_SHOWDOWN' | 'VOTE_RESULT'
  const [gameState, setGameState] = useState('SETUP');
  const [activeTheme, setActiveTheme] = useState(spyFallThemes[0]);
  const [spyPlayer, setSpyPlayer] = useState('');
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [isPeeking, setIsPeeking] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Auto pick random theme
  const initGame = () => {
    if (players.length < 3) return;
    const randomSpy = players[Math.floor(Math.random() * players.length)];
    const randomTheme = spyFallThemes[Math.floor(Math.random() * spyFallThemes.length)];
    setSpyPlayer(randomSpy);
    setActiveTheme(randomTheme);
    setCurrentRevealIndex(0);
    setIsPeeking(false);
    setActiveStep(1);
    setGameState('REVEAL_ROLES');
    playCardFlip();
  };

  const currentPlayer = players[currentRevealIndex];
  const isCurrentSpy = currentPlayer === spyPlayer;

  const handleNextReveal = () => {
    setIsPeeking(false);
    playCardFlip();
    if (currentRevealIndex + 1 < players.length) {
      setCurrentRevealIndex(prev => prev + 1);
    } else {
      // Everyone saw their role
      setGameState('ACTION_SHOWDOWN');
      playFanfare();
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldAlert className="w-4 h-4 text-purple-400" />
          <span>SpyFall วงเหล้า</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white">SpyFall: 5 ท่าลับสลับกัน</h2>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          ทุกคนจะเห็น 5 ท่าที่ต้องทำ แต่คนที่เป็น <span className="text-red-400 font-bold">SPY</span> จะไม่เห็น!
          ใครจำท่าไม่ได้หรือเมาแล้วหลุด = <span className="text-pink-400 font-bold">แพ้ดื่ม!</span>
        </p>
      </div>

      {/* SETUP STAGE: Check players */}
      {gameState === 'SETUP' && (
        <div className="w-full bg-night-900 border-2 border-purple-500/30 rounded-3xl p-6 text-center shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center mx-auto mb-4 text-purple-400">
            <Users className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">เตรียมผู้เล่น</h3>
          <p className="text-sm text-gray-400 mb-6">
            เกมนี้ต้องใช้ผู้เล่นอย่างน้อย 3 คนขึ้นไป (ปัจจุบันมี {players.length} คน)
          </p>

          {players.length < 3 ? (
            <div>
              <p className="text-amber-400 text-xs font-semibold mb-4">
                ⚠️ กรุณาเพิ่มรายชื่อเพื่อนให้ครบอย่างน้อย 3 คนก่อนเริ่ม
              </p>
              <button
                onClick={() => setShowPlayerModal(true)}
                className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-2xl text-sm"
              >
                เพิ่มรายชื่อเพื่อนในวง
              </button>
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {players.map(p => (
                  <span key={p} className="px-3 py-1 rounded-xl bg-night-800 border border-white/10 text-xs text-purple-300">
                    {p}
                  </span>
                ))}
              </div>
              <button
                onClick={initGame}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-95 text-white font-black text-base rounded-2xl shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>แจกการ์ดบทบาทลับ!</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* REVEAL ROLES STAGE: Pass-and-play phone */}
      {gameState === 'REVEAL_ROLES' && (
        <div className="w-full bg-night-900 border-2 border-purple-500/40 rounded-3xl p-6 text-center shadow-2xl relative">
          <div className="text-xs text-purple-400 font-semibold mb-1">
            รอบแจกบทบาท ({currentRevealIndex + 1} / {players.length})
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white mb-4">
            ส่งมือถือให้ 👉 <span className="text-pink-400 underline">{currentPlayer}</span>
          </h3>

          {!isPeeking ? (
            <div className="py-8">
              <p className="text-xs text-gray-400 mb-6">
                คนอื่นในวงห้ามแอบดูเด็ดขาด! ให้ "{currentPlayer}" กดปุ่มด้านล่างเพื่อเปิดการ์ดลับ
              </p>
              <button
                onClick={() => {
                  setIsPeeking(true);
                  playCardFlip();
                }}
                className="w-full py-6 rounded-2xl bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-600 hover:to-pink-600 text-white font-black text-lg shadow-xl shadow-purple-900/50 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Eye className="w-6 h-6" />
                <span>กดดูบทบาทของคุณ</span>
              </button>
            </div>
          ) : (
            <div className="py-4 animate-fadeIn">
              {isCurrentSpy ? (
                <div className="p-6 rounded-2xl bg-red-950/80 border-2 border-red-500 text-center shadow-lg shadow-red-500/40">
                  <span className="text-5xl block mb-2">🕵️‍♂️</span>
                  <h4 className="text-3xl font-black text-red-400 tracking-wider mb-2">
                    คุณคือ SPY !
                  </h4>
                  <p className="text-sm text-red-200 leading-relaxed font-medium">
                    คุณจะไม่เห็นท่าลับทั้ง 5 ท่า! <br />
                    หน้าที่ของคุณคือ: <strong className="text-white">เนียนเลียนแบบท่าของเพื่อนในวง</strong> เมื่อเริ่มเล่น อย่าให้ใครจับได้ว่าคุณมั่ว!
                  </p>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-night-950 border border-purple-500/40 text-left">
                  <div className="flex items-center justify-between mb-3 border-b border-purple-500/20 pb-2">
                    <span className="text-xs font-bold text-emerald-400">✅ คุณคือพลเมือง (รู้ท่าลับ)</span>
                    <span className="text-xs text-purple-300 font-semibold">{activeTheme.title}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">จำ 5 ท่านี้ให้ดี แล้วทำตามลำดับเมื่อเริ่มเล่น:</p>
                  <div className="space-y-2">
                    {activeTheme.actions.map(act => (
                      <div key={act.step} className="p-2.5 rounded-xl bg-night-900 border border-white/5 flex items-start gap-2 text-xs">
                        <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-300 font-bold flex items-center justify-center shrink-0">
                          {act.step}
                        </span>
                        <div>
                          <strong className="text-pink-300 block">{act.name}</strong>
                          <span className="text-gray-400 text-[11px]">{act.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleNextReveal}
                className="mt-6 w-full py-3.5 rounded-2xl bg-night-800 hover:bg-night-700 text-white font-bold text-sm border border-white/20 flex items-center justify-center gap-2"
              >
                <EyeOff className="w-4 h-4 text-gray-400" />
                <span>จำได้แล้ว! ปิดหน้าจอแล้วส่งต่อ</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ACTION SHOWDOWN STAGE: Step by step action execution */}
      {gameState === 'ACTION_SHOWDOWN' && (
        <div className="w-full bg-night-900 border-2 border-pink-500/40 rounded-3xl p-6 text-center shadow-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold mb-3">
            <Flame className="w-4 h-4 text-pink-500" />
            <span>รอบเริ่มประลอง 5 ท่า!</span>
          </div>

          <h3 className="text-2xl font-black text-white mb-2">{activeTheme.title}</h3>
          <p className="text-xs text-gray-400 mb-4">
            ทุกคนต้องทำท่าตามรอบ Spy ต้องเนียนเลียนแบบให้ทัน!
          </p>

          {/* Current Step Display */}
          <div className="my-5 p-6 rounded-2xl bg-gradient-to-b from-purple-950/60 to-night-950 border border-pink-500/30">
            <span className="text-xs font-black uppercase text-pink-400 tracking-widest block mb-1">
              กำลังทำท่าที่ {activeStep} / 5
            </span>
            <h4 className="text-xl md:text-2xl font-black text-white mb-2">
              {activeTheme.actions[activeStep - 1].name}
            </h4>
            <p className="text-sm text-purple-200">
              👉 {activeTheme.actions[activeStep - 1].desc}
            </p>
          </div>

          {/* Step navigator */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map(step => (
              <button
                key={step}
                onClick={() => {
                  setActiveStep(step);
                  playCardFlip();
                }}
                className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center transition-all ${
                  activeStep === step
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/40 scale-110'
                    : 'bg-night-800 text-gray-400 border border-white/10'
                }`}
              >
                {step}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setGameState('VOTE_RESULT');
              playFanfare();
            }}
            className="w-full py-4 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 hover:opacity-95 text-white font-black text-base rounded-2xl shadow-xl shadow-red-600/30"
          >
            🔍 ชี้ตัวคนมั่ว & เปิดเผย SPY!
          </button>
        </div>
      )}

      {/* VOTE & RESULT STAGE */}
      {gameState === 'VOTE_RESULT' && (
        <div className="w-full bg-night-900 border-2 border-purple-500/40 rounded-3xl p-6 text-center shadow-2xl animate-fadeIn">
          <span className="text-4xl block mb-2">🎭</span>
          <h3 className="text-xs uppercase font-bold text-gray-400 tracking-widest mb-1">เฉลยตัวจริง</h3>
          <h4 className="text-3xl font-black text-pink-400 mb-4">
            SPY คือ : "{spyPlayer}" !
          </h4>

          <div className="bg-night-950 p-4 rounded-2xl border border-white/10 text-left text-xs space-y-2 mb-6 text-gray-300">
            <p className="font-bold text-white text-sm">🍻 กติกาการคิดบัญชี:</p>
            <p>1. ถ้าทุกคนในโต๊ะโหวตจับ Spy ถูกต้อง ➔ <strong className="text-red-400">Spy ดื่ม 2 ช็อต!</strong></p>
            <p>2. ถ้า Spy เนียนจนรอด และโต๊ะโหวตผิดคน ➔ <strong className="text-red-400">ทุกคนในโต๊ะยกดื่มคนละ 1 อึก!</strong></p>
            <p>3. ถ้าใครเมาแล้ว "จำท่าไม่ได้" ทั้งที่ไม่ได้เป็น Spy ➔ <strong className="text-red-400">คนนั้นดื่มหมดแก้ว!</strong></p>
          </div>

          <button
            onClick={initGame}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-base rounded-2xl shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>เล่นรอบใหม่ทันที</span>
          </button>
        </div>
      )}
    </div>
  );
}
