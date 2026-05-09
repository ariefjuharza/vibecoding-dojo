export interface Challenge {
  id: string;
  title: string;
  abstract_brief: string;
  level: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface UserStats {
  userId: string;
  total_xp: number;
  level: number;
  levelName: string;
  challengeStats: Record<string, { best_score: number; attempts: number }>;
  refactor_sessions_completed: number;
}

export const challenges: Challenge[] = [
  {
    id: 'c1',
    title: 'Easy: Aplikasi To-Do List Anak Kos',
    abstract_brief: 'Bikinkan saya aplikasi untuk mencatat tugas kuliah dan belanja bulanan biar nggak lupa.',
    level: 1,
    difficulty: 'Easy',
  },
  {
    id: 'c2',
    title: 'Medium: Kasir Pintar Warung Kopi',
    abstract_brief: 'Saya mau aplikasi kasir untuk kedai kopi saya. Pegawai bisa input pesanan, dan saya bisa lihat laporan harian dari rumah.',
    level: 2,
    difficulty: 'Medium',
  },
  {
    id: 'c3',
    title: 'Hard: Marketplace Buku Bekas Kampus',
    abstract_brief: 'Buatkan platform di mana mahasiswa bisa jual-beli buku bekas. Harus aman dari penipuan dan gampang cari buku sesuai jurusan.',
    level: 3,
    difficulty: 'Hard',
  }
];

export const getLevelName = (xp: number): string => {
  if (xp < 20) return 'Novice';
  if (xp < 50) return 'Apprentice';
  if (xp < 100) return 'Journeyman';
  if (xp < 200) return 'Adept';
  return 'Sensei';
};

export const getLevelNumber = (xp: number): number => {
  if (xp < 20) return 1;
  if (xp < 50) return 2;
  if (xp < 100) return 3;
  if (xp < 200) return 4;
  return 5;
};

// In-memory store
export const users: Record<string, UserStats> = {
  'demo-user': {
    userId: 'demo-user',
    total_xp: 0,
    level: 1,
    levelName: 'Novice',
    challengeStats: {},
    refactor_sessions_completed: 0,
  }
};
