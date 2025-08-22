import dotenv from "dotenv";
import connectDB from "./config/db";
import {Drill} from "./models/Drill";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    // clear old drills
    await Drill.deleteMany({});

    // insert sample drills
    await Drill.insertMany([
      {
        title: "JavaScript Basics",
        difficulty: "easy",
        tags: ["javascript", "basics"],
        questions: [
          { id: "q1", prompt: "What is a closure?", keywords: ["closure"] },
          { id: "q2", prompt: "Explain var vs let", keywords: ["var", "let"] },
        ],
      },
      {
        title: "System Design Intro",
        difficulty: "medium",
        tags: ["system-design"],
        questions: [
          { id: "q1", prompt: "What is load balancing?", keywords: ["load balancer"] },
        ],
      },
    ]);

    console.log("Seeded drills");
    process.exit(0);
  } catch (err) {
    console.error("Seeder failed:", err);
    process.exit(1);
  }
};

seed();
