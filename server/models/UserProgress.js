import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, default: 'default', index: true },
  visitedMonuments: { type: [String], default: [] },
  arViewed: { type: [String], default: [] },
  narrationPlayed: { type: [String], default: [] },
  quizScores: { type: Map, of: Number, default: new Map() },
  achievements: { type: [String], default: [] },
  favorites: { type: [String], default: [] },
  tourProgress: { type: Number, default: 0 },
  comparedMonuments: { type: [[String]], default: [] }
}, { timestamps: true });

export default mongoose.model('UserProgress', userProgressSchema);

