import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import ChallengePage from './pages/Challenge';
import RefactorLab from './pages/RefactorLab';
import './index.css';

type ViewState = 'dashboard' | 'challenge' | 'refactor';

export interface UserStats {
  userId: string;
  total_xp: number;
  level: number;
  levelName: string;
  challengeStats: Record<string, { best_score: number; attempts: number }>;
  refactor_sessions_completed?: number;
}

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  const fetchUserStats = async () => {
    try {
      const res = await fetch('/api/users/demo-user/stats');
      const data = await res.json();
      setUserStats(data);
    } catch (error) {
      console.error('Gagal mengambil stats pengguna:', error);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

  const handleStartChallenge = (id: string) => {
    setActiveChallengeId(id);
    setCurrentView('challenge');
  };

  const handleBackToDashboard = () => {
    setActiveChallengeId(null);
    setCurrentView('dashboard');
    fetchUserStats();
  };

  return (
    <>
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={handleBackToDashboard}>
            <div style={{ fontSize: '1.8rem' }}>🥋</div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', marginRight: '1rem' }}>VibeCoding Dojo</h2>
          </div>
          
          <nav style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => setCurrentView('dashboard')}
              style={{ 
                background: currentView === 'dashboard' || currentView === 'challenge' ? 'var(--accent-primary)' : 'transparent',
                color: currentView === 'dashboard' || currentView === 'challenge' ? 'white' : 'var(--text-secondary)',
                border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
              }}>
              Jurus Prompt
            </button>
            <button 
              onClick={() => setCurrentView('refactor')}
              style={{ 
                background: currentView === 'refactor' ? 'var(--accent-primary)' : 'transparent',
                color: currentView === 'refactor' ? 'white' : 'var(--text-secondary)',
                border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
              }}>
              Tempa Kode
            </button>
          </nav>
        </div>
        
        {userStats && (
          <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{userStats.levelName}</span>
              <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>Level {userStats.level}</span>
            </div>
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem', borderRadius: '50%', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
              {userStats.total_xp} XP
            </div>
          </div>
        )}
      </header>

      <main className="container">
        {currentView === 'dashboard' && (
          <Dashboard 
            onStartChallenge={handleStartChallenge} 
            userStats={userStats}
          />
        )}
        {currentView === 'challenge' && activeChallengeId && (
          <ChallengePage 
            challengeId={activeChallengeId} 
            onBack={handleBackToDashboard}
            onUpdateStats={(newStats) => setUserStats(newStats)}
          />
        )}
        {currentView === 'refactor' && (
          <RefactorLab 
            onUpdateStats={(newStats) => setUserStats(newStats)}
          />
        )}
      </main>
    </>
  );
}

export default App;
