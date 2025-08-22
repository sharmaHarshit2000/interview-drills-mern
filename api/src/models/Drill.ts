import mongoose, { Schema, Document } from "mongoose";

interface Question {
  id: string;
  prompt: string;
  keywords: string[];
}

export interface DrillDoc extends Document {
  title: string;
  difficulty: string;
  tags: string[];
  questions: Question[];
}

const DrillSchema = new Schema<DrillDoc>({
  title: { type: String, required: true },
  difficulty: { type: String, required: true },
  tags: [{ type: String }],
  questions: [
    {
      id: { type: String, required: true },
      prompt: { type: String, required: true },
      keywords: [{ type: String, required: true }],
    },
  ],
});

export const Drill = mongoose.model<DrillDoc>("Drill", DrillSchema);
