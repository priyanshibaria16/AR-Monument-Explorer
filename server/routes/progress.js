import express from 'express';
import UserProgress from '../models/UserProgress.js';

const router = express.Router();

// Get user progress
router.get('/:userId?', async (req, res) => {
  try {
    // Get userId from token if authenticated, otherwise use default
    let userId = req.params.userId || 'default';
    
    // If user is authenticated, use their userId from token
    if (req.user && req.user.userId) {
      userId = req.user.userId;
    }
    
    let progress = await UserProgress.findOne({ userId });
    
    if (!progress) {
      // Create default progress if it doesn't exist
      progress = new UserProgress({ userId });
      await progress.save();
    }
    
    // Convert Map to object for JSON response
    const progressObj = progress.toObject();
    if (progress.quizScores instanceof Map) {
      progressObj.quizScores = Object.fromEntries(progress.quizScores);
    } else {
      progressObj.quizScores = progress.quizScores || {};
    }
    
    res.json(progressObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user progress
router.put('/:userId?', async (req, res) => {
  try {
    let userId = req.params.userId || 'default';
    if (req.user && req.user.userId) {
      userId = req.user.userId;
    }
    const updateData = req.body;
    
    // Handle quizScores if it's an object
    if (updateData.quizScores && !(updateData.quizScores instanceof Map)) {
      updateData.quizScores = new Map(Object.entries(updateData.quizScores));
    }
    
    const progress = await UserProgress.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );
    
    // Convert Map to object for JSON response
    const progressObj = progress.toObject();
    if (progress.quizScores instanceof Map) {
      progressObj.quizScores = Object.fromEntries(progress.quizScores);
    } else {
      progressObj.quizScores = progress.quizScores || {};
    }
    
    res.json(progressObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add visited monument
router.post('/visited/:userId?', async (req, res) => {
  try {
    let userId = req.params.userId || 'default';
    if (req.user && req.user.userId) {
      userId = req.user.userId;
    }
    const { monumentId } = req.body;
    
    const progress = await UserProgress.findOneAndUpdate(
      { userId },
      { $addToSet: { visitedMonuments: monumentId } },
      { new: true, upsert: true }
    );
    
    // Convert Map to object for JSON response
    const progressObj = progress.toObject();
    if (progress.quizScores instanceof Map) {
      progressObj.quizScores = Object.fromEntries(progress.quizScores);
    } else {
      progressObj.quizScores = progress.quizScores || {};
    }
    
    res.json(progressObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add AR viewed
router.post('/ar/:userId?', async (req, res) => {
  try {
    let userId = req.params.userId || 'default';
    if (req.user && req.user.userId) {
      userId = req.user.userId;
    }
    const { monumentId } = req.body;
    
    const progress = await UserProgress.findOneAndUpdate(
      { userId },
      { $addToSet: { arViewed: monumentId } },
      { new: true, upsert: true }
    );
    
    // Convert Map to object for JSON response
    const progressObj = progress.toObject();
    if (progress.quizScores instanceof Map) {
      progressObj.quizScores = Object.fromEntries(progress.quizScores);
    } else {
      progressObj.quizScores = progress.quizScores || {};
    }
    
    res.json(progressObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add narration played
router.post('/narration/:userId?', async (req, res) => {
  try {
    let userId = req.params.userId || 'default';
    if (req.user && req.user.userId) {
      userId = req.user.userId;
    }
    const { monumentId } = req.body;
    
    const progress = await UserProgress.findOneAndUpdate(
      { userId },
      { $addToSet: { narrationPlayed: monumentId } },
      { new: true, upsert: true }
    );
    
    // Convert Map to object for JSON response
    const progressObj = progress.toObject();
    if (progress.quizScores instanceof Map) {
      progressObj.quizScores = Object.fromEntries(progress.quizScores);
    } else {
      progressObj.quizScores = progress.quizScores || {};
    }
    
    res.json(progressObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update quiz score
router.post('/quiz/:userId?', async (req, res) => {
  try {
    let userId = req.params.userId || 'default';
    if (req.user && req.user.userId) {
      userId = req.user.userId;
    }
    const { monumentId, score } = req.body;
    
    let progress = await UserProgress.findOne({ userId });
    if (!progress) {
      progress = new UserProgress({ userId });
    }
    
    if (!progress.quizScores) {
      progress.quizScores = new Map();
    }
    progress.quizScores.set(monumentId, score);
    await progress.save();
    
    // Convert Map to object for JSON response
    const progressObj = progress.toObject();
    progressObj.quizScores = Object.fromEntries(progress.quizScores);
    
    res.json(progressObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle favorite
router.post('/favorite/:userId?', async (req, res) => {
  try {
    let userId = req.params.userId || 'default';
    if (req.user && req.user.userId) {
      userId = req.user.userId;
    }
    const { monumentId } = req.body;
    
    const progress = await UserProgress.findOne({ userId });
    if (!progress) {
      const newProgress = new UserProgress({ userId, favorites: [monumentId] });
      await newProgress.save();
      const progressObj = newProgress.toObject();
      progressObj.quizScores = {};
      return res.json(progressObj);
    }
    
    const isFavorite = progress.favorites.includes(monumentId);
    if (isFavorite) {
      progress.favorites = progress.favorites.filter(id => id !== monumentId);
    } else {
      progress.favorites.push(monumentId);
    }
    
    await progress.save();
    // Convert Map to object for JSON response
    const progressObj = progress.toObject();
    if (progress.quizScores instanceof Map) {
      progressObj.quizScores = Object.fromEntries(progress.quizScores);
    } else {
      progressObj.quizScores = progress.quizScores || {};
    }
    
    res.json(progressObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add achievement
router.post('/achievement/:userId?', async (req, res) => {
  try {
    let userId = req.params.userId || 'default';
    if (req.user && req.user.userId) {
      userId = req.user.userId;
    }
    const { achievementId } = req.body;
    
    const progress = await UserProgress.findOneAndUpdate(
      { userId },
      { $addToSet: { achievements: achievementId } },
      { new: true, upsert: true }
    );
    
    // Convert Map to object for JSON response
    const progressObj = progress.toObject();
    if (progress.quizScores instanceof Map) {
      progressObj.quizScores = Object.fromEntries(progress.quizScores);
    } else {
      progressObj.quizScores = progress.quizScores || {};
    }
    
    res.json(progressObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

