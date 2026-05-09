import { Router } from 'express';
import { challenges, users, getLevelName, getLevelNumber } from '../data/store';
import { evaluatePrompt, analyzeAndRefactorCode } from '../services/ai.service';

const router = Router();

router.get('/challenges', (req, res) => {
  res.json(challenges);
});

router.get('/challenges/:id', (req, res) => {
  const challenge = challenges.find(c => c.id === req.params.id);
  if (challenge) {
    res.json(challenge);
  } else {
    res.status(404).json({ error: 'Tantangan tidak ditemukan' });
  }
});

router.get('/users/:userId/stats', (req, res) => {
  const userId = req.params.userId;
  let user = users[userId];
  if (!user) {
    // Buat jika tidak ada untuk demo
    user = {
      userId,
      total_xp: 0,
      level: 1,
      levelName: 'Novice',
      challengeStats: {},
      refactor_sessions_completed: 0,
    };
    users[userId] = user;
  }
  res.json(user);
});

router.post('/attempts', async (req, res) => {
  try {
    const { userId, challengeId, userPrompt } = req.body;

    if (!userId || !challengeId || !userPrompt) {
      return res.status(400).json({ error: 'Parameter tidak lengkap: userId, challengeId, userPrompt diperlukan.' });
    }

    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Tantangan tidak ditemukan' });
    }

    let user = users[userId];
    if (!user) {
      user = {
        userId,
        total_xp: 0,
        level: 1,
        levelName: 'Novice',
        challengeStats: {},
        refactor_sessions_completed: 0,
      };
      users[userId] = user;
    }

    // Panggil AI Mentor
    const feedback = await evaluatePrompt(challenge.abstract_brief, userPrompt);

    // Hitung XP (Score / 10)
    const xp_awarded = Math.floor(feedback.score / 10);

    // Update Stats
    user.total_xp += xp_awarded;
    user.level = getLevelNumber(user.total_xp);
    user.levelName = getLevelName(user.total_xp);

    if (!user.challengeStats[challengeId]) {
      user.challengeStats[challengeId] = { best_score: 0, attempts: 0 };
    }

    user.challengeStats[challengeId].attempts += 1;
    if (feedback.score > user.challengeStats[challengeId].best_score) {
      user.challengeStats[challengeId].best_score = feedback.score;
    }

    res.json({
      feedback,
      xp_awarded,
      userStats: user
    });

  } catch (error: any) {
    console.error('Error in /attempts:', error.message);
    res.status(500).json({ error: error.message || 'Terjadi kesalahan pada server' });
  }
});

router.post('/refactor', async (req, res) => {
  try {
    const { userId, language, original_code } = req.body;

    if (!userId || !language || !original_code) {
      return res.status(400).json({ error: 'Parameter tidak lengkap: userId, language, original_code diperlukan.' });
    }

    let user = users[userId];
    if (!user) {
      user = {
        userId,
        total_xp: 0,
        level: 1,
        levelName: 'Novice',
        challengeStats: {},
        refactor_sessions_completed: 0,
      };
      users[userId] = user;
    }

    // Panggil AI Mentor untuk Refactor Lab
    const feedback = await analyzeAndRefactorCode(language, original_code);

    // Hitung XP dinamis: min(jumlah_isu * 5, 30)
    const issuesFound = feedback.issues ? feedback.issues.length : 0;
    const xp_awarded = Math.min(issuesFound * 5, 30);

    // Update Stats
    user.total_xp += xp_awarded;
    user.refactor_sessions_completed = (user.refactor_sessions_completed || 0) + 1;
    user.level = getLevelNumber(user.total_xp);
    user.levelName = getLevelName(user.total_xp);

    res.json({
      feedback,
      xp_awarded,
      userStats: user
    });

  } catch (error: any) {
    console.error('Error in /refactor:', error.message);
    res.status(500).json({ error: error.message || 'Terjadi kesalahan pada server' });
  }
});

export default router;
