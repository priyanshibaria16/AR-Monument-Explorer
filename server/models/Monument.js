import mongoose from 'mongoose';

const monumentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  coordinates: { type: [Number], required: true },
  description: { type: String, required: true },
  history: { type: String, required: true },
  modelUrl: { type: String, required: true },
  image: { type: String, required: true },
  yearBuilt: { type: String, required: true },
  architect: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['temple', 'fort', 'palace', 'monument', 'tomb'],
    required: true 
  },
  era: { 
    type: String, 
    enum: ['ancient', 'medieval', 'modern'],
    required: true 
  },
  region: { 
    type: String, 
    enum: ['north', 'south', 'east', 'west', 'central'],
    required: true 
  },
  funFacts: { type: [String], required: true }
});

export default mongoose.model('Monument', monumentSchema);

