import { Schema, model, Document, Types } from 'mongoose';

interface IAnswer {
  qid: string;
  text?: string;
}

interface IAttempt extends Document {
  userId: Types.ObjectId;
  drillId: Types.ObjectId;
  answers: IAnswer[];
  score?: number;
  createdAt: Date;
}

const AnswerSchema = new Schema<IAnswer>({
  qid: { type: String, required: true },
  text: String
}, { _id: false });

const AttemptSchema = new Schema<IAttempt>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  drillId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Drill', 
    required: true 
  },
  answers: [AnswerSchema],
  score: Number,
  createdAt: { type: Date, default: Date.now }
});

AttemptSchema.index({ userId: 1, createdAt: -1 });

export default model<IAttempt>('Attempt', AttemptSchema);