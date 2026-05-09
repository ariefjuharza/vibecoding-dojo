import { useState, useEffect } from 'react';
import type { UserStats } from '../App';

interface Challenge {
  id: string;
  title: string;
  abstract_brief: string;
  level: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface DashboardProps {
  onStartChallenge: (id: string) => void;
  userStats: UserStats | null;
}

export default function Dashboard({ onStartChallenge, userStats }: DashboardProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/challenges')
      .then(res => res.json())
      .then(data => {
        setChallenges(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getDifficultyColor = (diff: string) => {
    if (diff === 'Easy') return 'var(--success)';
    if (diff === 'Medium') return 'var(--warning)';
    return 'var(--danger)';
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Memuat tantangan...</div>;
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Latihan Jurus Prompt 🥋</h1>
        <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          Dunia luar sangat kejam, Kohai. Klien sering datang membawa ide yang kabur bagaikan kabut.
          Tugasmu di sini <strong>bukan untuk langsung menulis kode</strong>, melainkan memfokuskan pikiran dan melatih caramu memberi instruksi yang tajam kepada AI.
          <br/><br/>
          Pilih salah satu ujian di bawah ini. Buktikan bahwa kau bisa membedah ide mereka menjadi 3-5 jurus fitur inti (<em>core features</em>)!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
        {challenges.map((challenge, index) => {
          const stats = userStats?.challengeStats[challenge.id];
          
          return (
            <div 
              key={challenge.id} 
              className={`glass-card animate-fade-in delay-${(index % 3) + 1}`}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  color: getDifficultyColor(challenge.difficulty)
                }}>
                  {challenge.difficulty}
                </span>
                {stats && stats.best_score > 0 && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Skor Terbaik: <strong style={{ color: 'var(--success)' }}>{stats.best_score}/100</strong>
                  </span>
                )}
              </div>
              
              <h3 style={{ marginBottom: '0.5rem', flexGrow: 0 }}>{challenge.title}</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                "{challenge.abstract_brief}"
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Level Min: {challenge.level}
                </span>
                <button 
                  className="btn btn-primary"
                  onClick={() => onStartChallenge(challenge.id)}
                >
                  Mulai Latihan
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
