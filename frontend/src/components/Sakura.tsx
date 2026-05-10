import { useEffect, useState } from 'react';

const Sakura = () => {
  const [petals, setPetals] = useState<{ id: number; left: number; animationDuration: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    // Generate 35 sakura petals with random positions, sizes, and fall speeds
    const newPetals = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 10 + Math.random() * 20, // 10-30s fall duration
      delay: Math.random() * -20, // Negative delay to start immediately at random vertical positions
      size: 8 + Math.random() * 12, // 8-20px size
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {petals.map(p => (
        <div
          key={p.id}
          className="sakura"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.7}px`,
            animationDuration: `${p.animationDuration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Sakura;
