import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import GameSelector from './components/GameSelector';
import PlayerModal from './components/PlayerModal';
import GlobalAlerts from './components/GlobalAlerts';
import NeverHaveIEver from './components/games/NeverHaveIEver';
import RhythmChain from './components/games/RhythmChain';
import SpyFallGame from './components/games/SpyFallGame';
import SpicyDrawCard from './components/games/SpicyDrawCard';
import ForbiddenWord from './components/games/ForbiddenWord';
import PoseLevelGame from './components/games/PoseLevelGame';
import { setSoundMuted, getSoundMuted } from './sound/soundEffects';
import { coOpChallenges } from './data/randomAlerts';

const STORAGE_PLAYERS_KEY = 'vonglaw_players_v1';
const DEFAULT_PLAYERS = ['เจมส์', 'พราว', 'อาร์ต', 'เบลล์', 'นัท'];

export default function App() {
  // Players state with local storage
  const [players, setPlayers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PLAYERS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PLAYERS;
    } catch {
      return DEFAULT_PLAYERS;
    }
  });

  // Current Mini Game
  const [currentGame, setCurrentGame] = useState(null);

  // Modals
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // 10-Minute "วงเล่า" Global Timer
  const [vonglawSecondsLeft, setVonglawSecondsLeft] = useState(600); // 10 minutes = 600s
  const [vonglawAlertOpen, setVonglawAlertOpen] = useState(false);

  // Random Co-op Challenge Alert
  const [coOpAlertOpen, setCoOpAlertOpen] = useState(false);
  const [coOpData, setCoOpData] = useState(null);

  // Save players to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PLAYERS_KEY, JSON.stringify(players));
    } catch (e) {
      console.error(e);
    }
  }, [players]);

  // Global 10-minute timer loop
  useEffect(() => {
    const interval = setInterval(() => {
      setVonglawSecondsLeft((prev) => {
        if (prev <= 1) {
          setVonglawAlertOpen(true);
          return 600; // Reset for next 10 minutes
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Sound toggle
  const toggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    setSoundMuted(nextState);
  };

  // Trigger Vonglaw 10-min alert manually or upon timer
  const triggerVonglawAlert = () => {
    setVonglawAlertOpen(true);
  };

  const closeVonglawAlert = () => {
    setVonglawAlertOpen(false);
    setVonglawSecondsLeft(600); // restart 10 minutes
  };

  // Trigger Co-Op Sudden Quest
  const triggerCoOpAlert = () => {
    const randomChallenge = coOpChallenges[Math.floor(Math.random() * coOpChallenges.length)];
    const needed = randomChallenge.playerCount || 2;
    
    let selectedNames = [];
    if (players.length >= needed) {
      // Pick unique random players
      const shuffled = [...players].sort(() => Math.random() - 0.5);
      selectedNames = shuffled.slice(0, needed);
    } else if (players.length > 0) {
      selectedNames = [...players];
      while (selectedNames.length < needed) {
        selectedNames.push(`คนที่นั่งถัดไป #${selectedNames.length + 1}`);
      }
    } else {
      selectedNames = needed === 3
        ? ['คนที่นั่งซ้ายมือ', 'คนที่นั่งขวามือ', 'คนที่นั่งตรงข้าม']
        : ['คนที่นั่งซ้ายมือ', 'คนที่นั่งขวามือ'];
    }

    setCoOpData({
      challenge: randomChallenge,
      selectedPlayers: selectedNames
    });
    setCoOpAlertOpen(true);
  };

  const closeCoOpAlert = () => {
    setCoOpAlertOpen(false);
  };

  // Render current active view
  const renderCurrentGame = () => {
    switch (currentGame) {
      case 'never-have-i-ever':
        return <NeverHaveIEver players={players} />;
      case 'rhythm-chain':
        return <RhythmChain players={players} />;
      case 'spy-fall':
        return <SpyFallGame players={players} setShowPlayerModal={setShowPlayerModal} />;
      case 'spicy-cards':
        return <SpicyDrawCard players={players} />;
      case 'forbidden-word':
        return <ForbiddenWord players={players} setShowPlayerModal={setShowPlayerModal} />;
      case 'pose-level':
        return <PoseLevelGame players={players} />;
      default:
        return (
          <GameSelector
            onSelectGame={setCurrentGame}
            players={players}
            setShowPlayerModal={setShowPlayerModal}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#07060d] text-gray-100 flex flex-col selection:bg-pink-500 selection:text-white relative">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation */}
      <Navbar
        currentGame={currentGame}
        setCurrentGame={setCurrentGame}
        players={players}
        setShowPlayerModal={setShowPlayerModal}
        isMuted={isMuted}
        toggleSound={toggleSound}
        vonglawSecondsLeft={vonglawSecondsLeft}
        triggerVonglawAlert={triggerVonglawAlert}
        triggerCoOpAlert={triggerCoOpAlert}
      />

      {/* Main Game Screen */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-2 sm:px-4 py-4">
        {renderCurrentGame()}
      </main>

      {/* Players Management Modal */}
      <PlayerModal
        players={players}
        setPlayers={setPlayers}
        isOpen={showPlayerModal}
        onClose={() => setShowPlayerModal(false)}
      />

      {/* Global Alerts: 10-Minute วงเล่า & 1-Minute Co-Op Challenges */}
      <GlobalAlerts
        vonglawAlertOpen={vonglawAlertOpen}
        closeVonglawAlert={closeVonglawAlert}
        coOpAlertOpen={coOpAlertOpen}
        closeCoOpAlert={closeCoOpAlert}
        coOpData={coOpData}
        players={players}
      />

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-gray-500 border-t border-white/5">
        <p>🍻 VONGLAW 18+ PARTY GAME | ดื่มอย่างมีความรับผิดชอบ เมาไม่ขับเด็ดขาด</p>
      </footer>
    </div>
  );
}
