import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Beer, AlertTriangle, Clock, CheckCircle2, XCircle, Flame, ShieldAlert } from 'lucide-react';
import { playSiren, playClink, playTick, playBuzzer, playFanfare } from '../sound/soundEffects';

export default function GlobalAlerts({
  vonglawAlertOpen,
  closeVonglawAlert,
  coOpAlertOpen,
  closeCoOpAlert,
  coOpData,
  players
}) {
  // Co-Op Timer state
  const [coOpSecondsLeft, setCoOpSecondsLeft] = useState(60);
  const [coOpTimerActive, setCoOpTimerActive] = useState(false);
  const [coOpFailed, setCoOpFailed] = useState(false);
  const [coOpSuccess, setCoOpSuccess] = useState(false);

  // Trigger sound and confetti when Vonglaw Alert opens
  useEffect(() => {
    if (vonglawAlertOpen) {
      playSiren();
      setTimeout(() => playClink(), 600);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }
    }
  }, [vonglawAlertOpen]);

  // Setup Co-op timer when CoOpAlert opens
  useEffect(() => {
    if (coOpAlertOpen) {
      setCoOpSecondsLeft(60);
      setCoOpTimerActive(true);
      setCoOpFailed(false);
      setCoOpSuccess(false);
      playSiren();
    } else {
      setCoOpTimerActive(false);
    }
  }, [coOpAlertOpen]);

  // Co-Op 60-second interval
  useEffect(() => {
    let interval = null;
    if (coOpTimerActive && coOpSecondsLeft > 0) {
      interval = setInterval(() => {
        setCoOpSecondsLeft(prev => {
          if (prev <= 10 && prev > 1) {
            playTick(true);
          } else if (prev > 10) {
            playTick(false);
          }
          if (prev <= 1) {
            clearInterval(interval);
            setCoOpTimerActive(false);
            setCoOpFailed(true);
            playBuzzer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [coOpTimerActive, coOpSecondsLeft]);

  return (
    <>
      {/* 1. วงเล่า Alert Modal (ทุก 10 นาที หมดแก้วทั้งโต๊ะ) */}
      {vonglawAlertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-gradient-to-b from-amber-950 via-night-900 to-black border-2 border-amber-500 rounded-3xl p-6 md:p-8 text-center shadow-2xl shadow-amber-500/50 relative overflow-hidden">
            {/* Ambient flashing aura */}
            <div className="absolute inset-0 bg-amber-500/10 animate-pulse pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mb-4 text-amber-400 shadow-lg shadow-amber-500/30 animate-bounce-slight">
                <Beer className="w-10 h-10" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>แจ้งเตือนกิจกรรมพิเศษ (10 นาที)</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-white tracking-wide mb-2 text-shadow">
                🍻 วงเล่า! 🍻
              </h2>

              <p className="text-xl md:text-2xl font-bold text-amber-300 mb-4">
                ยก "หมดแก้ว" ทั้งโต๊ะ!
              </p>

              <div className="bg-black/50 border border-amber-500/30 rounded-2xl p-4 mb-6 text-sm text-gray-200 text-left space-y-1.5 w-full">
                <p className="font-semibold text-amber-200 flex items-center gap-2">
                  <span>📢</span> กติกาวงเล่า:
                </p>
                <p>• เมื่อหน้าต่างนี้ขึ้น ทุกคนในวงต้องยกแก้วดื่มพร้อมกันจน <strong className="text-amber-400">หมดแก้ว!</strong></p>
                <p>• ห้ามลีลา ห้ามกั๊ก ใครช้าที่สุดเป็นคนสุดท้าย โดนเพิ่มอีก 1 ช็อต!</p>
                <p className="text-xs text-amber-400/80 pt-1">
                  *นาฬิกาจะเริ่มนับรอบถัดไปอัตโนมัติ (10 นาที) ทันทีที่กดปุ่มด้านล่าง
                </p>
              </div>

              <button
                onClick={() => {
                  playClink();
                  closeVonglawAlert();
                }}
                className="w-full py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-black font-black text-lg rounded-2xl shadow-xl shadow-amber-500/40 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Beer className="w-6 h-6" />
                <span>ชนแก้วหมดแล้ว! ลุยเกมต่อ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Co-Op Random Duel Challenge Modal (สุ่ม 2-3 คน ภายใน 1 นาที) */}
      {coOpAlertOpen && coOpData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-gradient-to-b from-purple-950 via-night-900 to-night-950 border-2 border-pink-500 rounded-3xl p-6 md:p-8 text-center shadow-2xl shadow-pink-500/40 relative overflow-hidden">
            {/* Header info */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400 text-pink-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Flame className="w-3.5 h-3.5 text-pink-400" />
              <span>ภารกิจด่วน 18+ (จำกัดเวลา 1 นาที)</span>
            </div>

            {/* Target Players */}
            <div className="bg-night-800/80 border border-pink-500/30 rounded-2xl p-4 mb-4">
              <span className="text-xs text-pink-400 font-semibold block mb-1">
                กำหนดผู้รับบททดสอบ:
              </span>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {coOpData.selectedPlayers.map((name, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-base md:text-lg shadow-md shadow-pink-500/30"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Quest Description */}
            <div className="bg-night-950/80 border border-white/10 rounded-2xl p-5 mb-5 text-left">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-pink-400">⚡</span> {coOpData.challenge.title}
              </h3>
              <p className="text-sm md:text-base text-pink-100 font-medium leading-relaxed mb-3">
                {coOpData.challenge.action}
              </p>
              <p className="text-xs text-purple-300 bg-purple-950/40 p-2 rounded-lg border border-purple-800/40">
                💡 คำแนะนำ: {coOpData.challenge.tip}
              </p>
            </div>

            {/* 1-Minute Countdown Clock */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border ${
                coOpSecondsLeft <= 10
                  ? 'bg-red-950/80 border-red-500 text-red-400 animate-pulse'
                  : 'bg-night-800 border-pink-500/40 text-pink-300'
              }`}>
                <Clock className={`w-5 h-5 ${coOpSecondsLeft <= 10 ? 'animate-spin' : ''}`} />
                <span className="font-mono text-2xl font-black">
                  00:{coOpSecondsLeft < 10 ? `0${coOpSecondsLeft}` : coOpSecondsLeft}
                </span>
                <span className="text-xs font-semibold">วินาที</span>
              </div>
            </div>

            {/* Strict Penalty Warning */}
            <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-3 mb-6 text-xs text-red-200 text-left space-y-1">
              <p className="font-bold text-red-300 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span>บทลงโทษเด็ดขาด:</span>
              </p>
              <p>• ถ้าไม่ทำทั้งคู่/ทั้งสามคน ➔ <strong className="text-red-400">กินหมดแก้วทุกคน!</strong></p>
              <p>• คนนึงทำแต่อีกคนไม่ยอมทำ ➔ <strong className="text-red-400">คนที่ไม่ทำกินหมดแก้ว!</strong></p>
              <p>• ทำไม่ทันภายใน 1 นาที ➔ <strong className="text-red-400">หมดแก้วทุกคน!</strong></p>
            </div>

            {/* Result actions */}
            {coOpFailed ? (
              <div className="space-y-3">
                <div className="p-3 bg-red-900/40 border border-red-500 rounded-xl text-red-300 font-bold text-sm">
                  ⏰ หมดเวลา 1 นาทีแล้ว! ดื่มหมดแก้วทันที!
                </div>
                <button
                  onClick={() => {
                    playClink();
                    closeCoOpAlert();
                  }}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-sm"
                >
                  ยอมรับโทษหมดแก้ว & ปิดหน้าต่าง
                </button>
              </div>
            ) : coOpSuccess ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-900/40 border border-emerald-500 rounded-xl text-emerald-300 font-bold text-sm">
                  🎉 ยอดเยี่ยม! ภารกิจสำเร็จ รอดตัวทั้งคู่!
                </div>
                <button
                  onClick={() => {
                    playClink();
                    closeCoOpAlert();
                  }}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm"
                >
                  ปิดหน้าต่าง & เล่นต่อ
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setCoOpTimerActive(false);
                    setCoOpSuccess(true);
                    playFanfare();
                  }}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ทำสำเร็จ! (รอดตัว)</span>
                </button>
                <button
                  onClick={() => {
                    setCoOpTimerActive(false);
                    setCoOpFailed(true);
                    playBuzzer();
                  }}
                  className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30"
                >
                  <XCircle className="w-4 h-4" />
                  <span>ไม่ทำ / ยอมแพ้</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
