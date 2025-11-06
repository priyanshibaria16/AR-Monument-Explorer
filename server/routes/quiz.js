import express from 'express';
import QuizQuestion from '../models/QuizQuestion.js';

const router = express.Router();

// Get all quiz questions
router.get('/', async (req, res) => {
  try {
    const questions = await QuizQuestion.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get quiz questions by monument ID
router.get('/monument/:monumentId', async (req, res) => {
  try {
    const questions = await QuizQuestion.find({ monumentId: req.params.monumentId });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

