import express from 'express';
import Monument from '../models/Monument.js';

const router = express.Router();

// Get all monuments
router.get('/', async (req, res) => {
  try {
    const monuments = await Monument.find();
    res.json(monuments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get monument by ID
router.get('/:id', async (req, res) => {
  try {
    const monument = await Monument.findOne({ id: req.params.id });
    if (!monument) {
      return res.status(404).json({ error: 'Monument not found' });
    }
    res.json(monument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

