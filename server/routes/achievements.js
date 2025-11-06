import express from 'express';
import Achievement from '../models/Achievement.js';

const router = express.Router();

// Get all achievements
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get achievement by ID
router.get('/:id', async (req, res) => {
  try {
    const achievement = await Achievement.findOne({ id: req.params.id });
    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

