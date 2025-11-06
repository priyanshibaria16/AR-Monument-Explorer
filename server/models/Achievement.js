import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  requirement: { type: String, required: true }
});

export default mongoose.model('Achievement', achievementSchema);

