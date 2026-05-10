import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { UserStats } from '../App';

interface ChallengeData {
  id: string;
  title: string;
  abstract_brief: string;
  level: number;
  difficulty: string;
}

interface FeedbackResult {
  score: number;
  strengths: string[];
  improvements: string[];
  example_better_prompt: string;
}

interface ChallengePageProps {
  challengeId: string;
  onBack: () => void;
  onUpdateStats: (stats: UserStats) => void;
}

export default function ChallengePage({ challengeId, onBack, onUpdateStats }: ChallengePageProps) {
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [xpGained, setXpGained] = useState(0);

  useEffect(() => {
    fetch(`/api/challenges/${challengeId}`)
      .then(res => res.json())
      .then(data => setChallenge(data))
      .catch(err => console.error(err));
  }, [challengeId]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsSubmitting(true);
    setFeedback(null);
    setXpGained(0);

    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user',
          challengeId,
          userPrompt: prompt
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setFeedback(data.feedback);
        setXpGained(data.xp_awarded);
        onUpdateStats(data.userStats);
        
        if (data.xp_awarded > 0) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat mengirim prompt.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!challenge) {
    return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Memuat tantangan...</div>;
  }

  return (
    <div className="animate-fade-in">
      <button 
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', padding: 0 }}
      >
        ← Kembali ke Pelataran Dojo
      </button>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Kolom Kiri: Brief & Input */}
        <div style={{ flex: '1 1 500px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>{challenge.title}</h2>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-primary)' }}>
              <p style={{ margin: 0, fontStyle: 'italic', fontSize: '1.1rem' }}>
                "{challenge.abstract_brief}"
              </p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <h3 style={{ marginBottom: '1rem' }}>Buktikan Jurus Prompt-mu</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
              Tulis instruksi untuk Sensei agar dapat mengenali 3-5 fitur utama dari brief di atas. Jangan lupa, perkuat kuda-kudamu dengan menyertakan konteks dan alasan!
            </p>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: Bertindaklah sebagai Product Manager. Berdasarkan brief di atas, buatkan 3 fitur utama untuk target pengguna..."
              style={{ minHeight: '200px', marginBottom: '1rem', flexGrow: 1, resize: 'vertical' }}
            />
            <button 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={isSubmitting || !prompt.trim()}
              style={{ alignSelf: 'flex-end' }}
            >
              {isSubmitting ? 'Sensei sedang mengevaluasi...' : 'Hiaa! Kirim Jurus'}
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Feedback */}
        <div style={{ flex: '1 1 400px', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {isSubmitting && (
            <div className="glass-card" style={{ padding: '3rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', animation: 'spin 1s linear infinite', marginBottom: '1rem' }}></div>
              <p>Sensei sedang menilai kedalaman pemahamanmu...</p>
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {!isSubmitting && feedback && (
            <div className="glass-card animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
                <img src="/sensei_avatar.png" alt="Sensei" style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--accent-primary)', boxShadow: '0 0 10px var(--accent-glow)' }} />
                <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Nilai Kedisiplinan</h3>
                <div style={{ 
                  fontSize: '3.5rem', 
                  fontWeight: 'bold', 
                  color: feedback.score >= 80 ? 'var(--success)' : feedback.score >= 50 ? 'var(--warning)' : 'var(--danger)',
                  lineHeight: '1'
                }}>
                  {feedback.score}
                </div>
                {xpGained > 0 && (
                  <div className="animate-fade-in delay-1" style={{ marginTop: '0.5rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                    +{xpGained} XP Diperoleh!
                  </div>
                )}
              </div>

              <div>
                <h4 style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ Kekuatan Kuda-kudamu</h4>
                <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0 0 0' }}>
                  {feedback.strengths.map((s, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{s}</li>)}
                </ul>
              </div>

              <div>
                <h4 style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>⚡ Titik Kelemahanmu</h4>
                <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0 0 0' }}>
                  {feedback.improvements.map((s, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{s}</li>)}
                </ul>
              </div>

              <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0 }}>💡 Jurus Master (Contoh Lebih Baik)</h4>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(feedback.example_better_prompt);
                      alert('Contoh prompt berhasil disalin!');
                    }}
                    style={{ background: 'var(--bg-secondary)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.25rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                    Salin
                  </button>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                  {feedback.example_better_prompt}
                </p>
              </div>
            </div>
          )}

          {!isSubmitting && !feedback && (
             <div className="glass-card" style={{ padding: '3rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5 }}>
               <img src="/sensei_avatar.png" alt="Sensei" style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '1rem', border: '2px solid var(--border-color)' }} />
               <p>Fokuskan pikiranmu, ketik instruksimu, dan tunjukkan pada Sensei apa yang kau bisa!</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
