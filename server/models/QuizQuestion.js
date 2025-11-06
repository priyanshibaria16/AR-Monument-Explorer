import mongoose from 'mongoose';

const quizQuestionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  monumentId: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true }
});

export default mongoose.model('QuizQuestion', quizQuestionSchema);

