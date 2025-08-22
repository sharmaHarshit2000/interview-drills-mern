import { Schema, model } from 'mongoose';

const AnswerSchema = new Schema({
  qid: String,
  text: String
}, { _id: false });

const AttemptSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  drillId: { type: Schema.Types.ObjectId, ref: 'Drill', required: true },
  answers: [AnswerSchema],
  score: Number,
  createdAt: { type: Date, default: Date.now }
});

AttemptSchema.index({ userId: 1, createdAt: -1 });

export default model('Attempt', AttemptSchema);
