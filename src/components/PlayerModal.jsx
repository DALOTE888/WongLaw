import React, { useState } from 'react';
import { X, UserPlus, Trash2, Users, Sparkles, Check } from 'lucide-react';
import { playCardFlip, playClink } from '../sound/soundEffects';

export default function PlayerModal({ players, setPlayers, isOpen, onClose }) {
  const [nameInput, setNameInput] = useState('');

  if (!isOpen) return null;

  const handleAddPlayer = (e) => {
    e?.preventDefault();
    const trimmed = nameInput.trim();
    if (trimmed && !players.includes(trimmed)) {
      setPlayers([...players, trimmed]);
      setNameInput('');
      playCardFlip();
    }
  };

  const handleRemove = (name) => {
    setPlayers(players.filter(p => p !== name));
    playCardFlip();
  };

  const handleAddQuickPresets = () => {
    const presets = ["เจมส์", "พราว", "อาร์ต", "เบลล์", "นัท", "แพร"];
    const merged = Array.from(new Set([...players, ...presets]));
    setPlayers(merged);
    playClink();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-night-900 border border-pink-500/40 rounded-3xl p-6 shadow-2xl shadow-pink-900/40 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-night-800 text-gray-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">สมาชิกในวงเหล้า</h2>
            <p className="text-xs text-gray-400">ใส่ชื่อเพื่อนเพื่อใช้สุ่มคำสั่ง, สุ่ม Spy และเควสคู่ 18+</p>
          </div>
        </div>

        {/* Input form */}
        <form onSubmit={handleAddPlayer} className="flex gap-2 mb-4">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="พิมพ์ชื่อเพื่อน เช่น มิว, กอล์ฟ, ปอนด์..."
            maxLength={15}
            className="flex-1 bg-night-800 border border-pink-500/30 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          />
          <button
            type="submit"
            disabled={!nameInput.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-40 text-white text-sm font-semibold rounded-2xl flex items-center gap-1 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>เพิ่ม</span>
          </button>
        </form>

        {/* Quick Presets button */}
        {players.length === 0 && (
          <div className="mb-4">
            <button
              onClick={handleAddQuickPresets}
              className="w-full py-2 px-3 rounded-xl bg-purple-900/30 border border-purple-500/40 text-purple-300 hover:bg-purple-900/50 text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>ใส่ชื่อตัวอย่างอัตโนมัติ (6 คน) เพื่อเริ่มเล่นทันที</span>
            </button>
          </div>
        )}

        {/* Players List */}
        <div className="max-h-52 overflow-y-auto space-y-2 pr-1 mb-6">
          {players.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm border border-dashed border-white/10 rounded-2xl">
              ยังไม่มีรายชื่อเพื่อนในวง <br />
              (แนะนำให้ใส่ตั้งแต่ 3 คนขึ้นไปเพื่อความมันส์!)
            </div>
          ) : (
            players.map((name, idx) => (
              <div
                key={name}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-night-800/80 border border-white/10 group hover:border-pink-500/40 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold flex items-center justify-center border border-pink-500/30">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-200">{name}</span>
                </div>
                <button
                  onClick={() => handleRemove(name)}
                  className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                  title="ลบ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Bottom Done Button */}
        <button
          onClick={() => {
            playClink();
            onClose();
          }}
          className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:opacity-95 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
        >
          <Check className="w-4 h-4" />
          <span>บันทึก & พร้อมลุย ({players.length} คน)</span>
        </button>
      </div>
    </div>
  );
}
