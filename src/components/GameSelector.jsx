import React from 'react';
import { Flame, Music, ShieldAlert, Layers, ShieldX, Activity, Sparkles, Beer, Users } from 'lucide-react';
import { playCardFlip, playClink } from '../sound/soundEffects';

export const GAME_LIST = [
  {
    id: 'never-have-i-ever',
    title: 'เคยหรือไม่',
    subtitle: 'Never Have I Ever 30+ ข้อ',
    desc: 'ผลัดกันพูดเรื่องที่ไม่เคยทำ ใครในวงที่ "เคยทำ" สิ่งนั้นต้องยกแก้วดื่ม! ล้วงวีรกรรมลับๆ',
    icon: Flame,
    color: 'from-pink-500 to-rose-600',
    borderColor: 'border-pink-500/40 hover:border-pink-400',
    shadowColor: 'hover:shadow-pink-500/20',
    badge: '35 คำถาม 18+'
  },
  {
    id: 'rhythm-chain',
    title: 'ต่อคำ / เพลงจังหวะนรก',
    subtitle: 'Hell Rhythm Battle',
    desc: 'ร้องเพลงหรือต่อคำที่ความหมายฉีกไปคนละทิศคนละทางให้เร็วที่สุด ชะงักหรือหลุดขำ = แพ้ดื่ม!',
    icon: Music,
    color: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-500/40 hover:border-cyan-400',
    shadowColor: 'hover:shadow-cyan-500/20',
    badge: 'แข่งความเร็ว'
  },
  {
    id: 'spy-fall',
    title: 'SpyFall วงเหล้า',
    subtitle: '5 ท่าลับสลับกัน',
    desc: 'ทุกคนเห็น 5 ท่าที่ต้องทำตามรอบ แต่ SPY จะไม่เห็น! ใครเมาจำท่าไม่ได้ หรือ Spy โป๊ะแตก = ดื่ม!',
    icon: ShieldAlert,
    color: 'from-purple-600 to-pink-600',
    borderColor: 'border-purple-500/40 hover:border-purple-400',
    shadowColor: 'hover:shadow-purple-500/20',
    badge: 'จับโป๊ะ Spy'
  },
  {
    id: 'spicy-cards',
    title: 'เปิดไพ่สุ่มคำสั่ง ',
    subtitle: 'Wild Dares & Drinking Cards',
    desc: 'สุ่มให้ใครกินใครไม่กิน สั่งทำกิจกรรม ล้วงความลับ หรือตั้งกติกากลางสุดป่วนรอบโต๊ะ',
    icon: Layers,
    color: 'from-fuchsia-600 to-pink-500',
    borderColor: 'border-fuchsia-500/40 hover:border-fuchsia-400',
    shadowColor: 'hover:shadow-fuchsia-500/20',
    badge: '50+ การ์ดแสบ'
  },
  {
    id: 'forbidden-word',
    title: 'คำต้องห้าม 1 นาที',
    subtitle: 'Forbidden Word Heads-Up',
    desc: 'สุ่มคนเอาหน้าจอแปะหน้าผาก เพื่อนๆ ในวงหลอกล่อให้พูดคำนั้น ถ้าพูดหมดแก้ว! ถ้ารอดเพื่อนทุกคนดื่ม!',
    icon: ShieldX,
    color: 'from-rose-500 to-red-600',
    borderColor: 'border-rose-500/40 hover:border-rose-400',
    shadowColor: 'hover:shadow-rose-500/20',
    badge: 'แปะหน้าผาก'
  },
  {
    id: 'pose-level',
    title: 'ทำท่า 10 วิ ทายระดับ 1-10',
    subtitle: '10s Pose Level Guess',
    desc: 'จัดท่าใน 3 วิ แล้วค้างไว้ 10 วิ! เพื่อนทายว่าระดับตัวเลขเราได้เท่าไหร่ (1-10) ทายผิดดื่มยกโต๊ะ!',
    icon: Activity,
    color: 'from-amber-500 to-yellow-600',
    borderColor: 'border-amber-500/40 hover:border-amber-400',
    shadowColor: 'hover:shadow-amber-500/20',
    badge: 'โพสท่าประลอง'
  }
];

export default function GameSelector({ onSelectGame, players, setShowPlayerModal }) {
  const handleSelect = (gameId) => {
    playCardFlip();
    onSelectGame(gameId);
  };

  const handleRandomGame = () => {
    const randomGame = GAME_LIST[Math.floor(Math.random() * GAME_LIST.length)];
    playClink();
    onSelectGame(randomGame.id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>บอร์ดเกมวงเหล้า 18+ ครบเครื่องที่สุด</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 bg-clip-text tracking-wide mb-3">
          เลือกมินิเกมเริ่มชนแก้ว!
        </h1>
        <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto">
          รวมการ์ดเกมสายปาร์ตี้ 18+ สุดแสบ ไม่ว่าจะเป็นเคยหรือไม่, SpyFall ท่าลับ, คำต้องห้าม หรือเกมต่อคำจังหวะนรก
        </p>

        {/* Players Pill banner */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setShowPlayerModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-night-800/80 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-medium transition-all shadow-md"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span>
              {players.length > 0 ? `ผู้เล่นในวง (${players.length} คน): ${players.join(', ')}` : 'ยังไม่ได้ใส่ชื่อเพื่อน (คลิกเพื่อเพิ่ม)'}
            </span>
          </button>

          <button
            onClick={handleRandomGame}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold transition-all shadow-md shadow-pink-600/30 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>สุ่มเกมเล่นเลย!</span>
          </button>
        </div>
      </div>

      {/* Grid of 6 Mini Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {GAME_LIST.map((game) => {
          const Icon = game.icon;
          return (
            <div
              key={game.id}
              onClick={() => handleSelect(game.id)}
              className={`group cursor-pointer rounded-3xl bg-gradient-to-b from-night-800/90 to-night-900/95 border ${game.borderColor} p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${game.shadowColor} flex flex-col justify-between relative overflow-hidden`}
            >
              {/* Subtle background glow on hover */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${game.color} flex items-center justify-center text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-night-950/80 border border-white/10 text-[11px] font-bold text-gray-300">
                    {game.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors mb-1">
                  {game.title}
                </h3>
                <span className="text-xs font-semibold text-gray-400 block mb-2">
                  {game.subtitle}
                </span>

                <p className="text-xs text-gray-300/80 leading-relaxed">
                  {game.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-pink-400 group-hover:text-pink-300">
                <span>เข้าเล่นเกมนี้</span>
                <span className="group-hover:translate-x-1 transition-transform">➔</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
