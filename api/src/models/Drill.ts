import { Schema, model } from 'mongoose';

const QuestionSchema = new Schema({
  id: { type: String, required: true },
  prompt: { type: String, required: true },
  keywords: [{ type: String }]
}, { _id: false });

const DrillSchema = new Schema({
  title: String,
  difficulty: { type: String, enum: ['easy','medium','hard'], default: 'easy' },
  tags: [String],
  questions: [QuestionSchema]
});

DrillSchema.index({ tags: 1 });
DrillSchema.index({ difficulty: 1 });

export default model('Drill', DrillSchema);
