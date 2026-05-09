import { useState } from 'react';
import confetti from 'canvas-confetti';
import type { UserStats } from '../App';

interface RefactorFeedbackResult {
  explanation: string;
  issues: string[];
  refactored_code: string;
  change_notes: string[];
}

interface RefactorLabProps {
  onUpdateStats: (stats: UserStats) => void;
}

export default function RefactorLab({ onUpdateStats }: RefactorLabProps) {
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<RefactorFeedbackResult | null>(null);
  const [xpGained, setXpGained] = useState(0);

  const handleSubmit = async () => {
    if (!code.trim()) return;
    
    setIsSubmitting(true);
    setFeedback(null);
    setXpGained(0);

    try {
      const res = await fetch('/api/refactor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user',
          language,
          original_code: code
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
      alert('Terjadi kesalahan saat mengirim kode.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const languages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'Kotlin', 'Go', 'C++', 'PHP', 'HTML/CSS'];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Ruang Penempaan Kode (Refactor Lab) 🔨</h1>
        <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          Sekadar membuat kode yang "jalan" itu ibarat pukulan tanpa tenaga, Kohai. Menulis <em>Clean Code</em> adalah seni tingkat tinggi.
          <br/><br/>
          Bawa kodemu ke altar penempaan ini. Sensei akan membedahnya, mencari bau busuk (<em>code smell</em>) dari kemalasan, dan menunjukkan kepadamu jalan ninja penulisan kode yang elegan.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
        {/* Kolom Kiri: Input Kode */}
        <div style={{ flex: '1 1 45%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Kode Mentah</h3>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                  color: 'white', 
                  border: '1px solid var(--border-color)',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  fontFamily: 'inherit'
                }}
              >
                {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
              </select>
            </div>
            
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Letakkan kodemu di sini..."
              style={{ flexGrow: 1, minHeight: '300px', fontFamily: 'monospace', fontSize: '0.9rem', marginBottom: '1rem', whiteSpace: 'pre' }}
              spellCheck={false}
            />
            
            <button 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={isSubmitting || !code.trim()}
              style={{ width: '100%' }}
            >
              {isSubmitting ? 'Sensei sedang membedah kodemu...' : 'Tempa Kodemu Sekarang!'}
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Hasil Analisis AI */}
        <div style={{ flex: '1 1 50%', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {isSubmitting && (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', animation: 'spin 1s linear infinite', marginBottom: '1rem' }}></div>
               <p>Sensei sedang mengamati setiap baris kelemahanmu...</p>
            </div>
          )}

          {!isSubmitting && !feedback && (
             <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5 }}>
               <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🕵️‍♂️</div>
               <p>Jangan ragu. Letakkan kodemu, dan biarkan Sensei membimbingmu menuju jalan kode yang suci.</p>
             </div>
          )}

          {!isSubmitting && feedback && (
            <div className="glass-card animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', overflowY: 'auto' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: 'var(--accent-primary)' }}>Titah Sensei</h3>
                {xpGained > 0 && (
                  <div className="animate-fade-in" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', fontWeight: 'bold', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                    +{xpGained} XP
                  </div>
                )}
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>📖 Membaca Niat Kode</h4>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{feedback.explanation}</p>
              </div>

              {feedback.issues && feedback.issues.length > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--warning)' }}>⚠️ Retakan pada Pedangmu (Isu)</h4>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                    {feedback.issues.map((issue, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{issue}</li>)}
                  </ul>
                </div>
              )}

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, color: 'var(--success)' }}>✨ Pedang yang Telah Ditempa (Refactor)</h4>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(feedback.refactored_code);
                      alert('Kode berhasil disalin ke clipboard!');
                    }}
                    style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '4px', padding: '0.25rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    Salin Kode
                  </button>
                </div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}>
                  <pre style={{ margin: 0 }}>
                    <code style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#e2e8f0' }}>
                      {feedback.refactored_code}
                    </code>
                  </pre>
                </div>
              </div>

              {feedback.change_notes && feedback.change_notes.length > 0 && (
                <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-primary)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>📝 Wejangan Sensei</h4>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                    {feedback.change_notes.map((note, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{note}</li>)}
                  </ul>
                </div>
              )}
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
