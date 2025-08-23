import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { getDrillById, submitAttempt } from "../services/api";
import type { Drill as DrillType } from "../types";

const Drill = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [drill, setDrill] = useState<DrillType | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (id) loadDrill();
  }, [id]);

  const loadDrill = async () => {
    try {
      const response = await getDrillById(id!);
      setDrill(response.data);
    } catch (error) {
      console.error("Failed to load drill:", error);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!drill) return;
    setLoading(true);

    try {
      const attemptData = {
        drillId: drill._id,
        answers: Object.entries(answers).map(([qid, text]) => ({ qid, text })),
      };

      const response = await submitAttempt(attemptData);
      setScore(response.data.score);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit attempt:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (!drill) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (submitted && score !== null) {
    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div
            className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${
              score >= 80
                ? "bg-green-100"
                : score >= 50
                ? "bg-yellow-100"
                : "bg-red-100"
            }`}
          >
            {score >= 80 ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <XCircle className="w-10 h-10 text-red-600" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Attempt Completed!
          </h2>
          <p className="text-gray-600 mb-6 text-lg font-medium">
            Your score: <span className="font-bold">{score}%</span>
          </p>

          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => navigate("/history")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-xl shadow-sm transition"
            >
              View History
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-xl shadow-sm transition"
            >
              Try Another Drill
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      {/* Drill Card */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {drill.title}
          </h1>
          <div className="flex items-center space-x-4 text-sm">
            <span
              className={`px-3 py-1 rounded-full font-medium capitalize ${getDifficultyColor(
                drill.difficulty
              )}`}
            >
              {drill.difficulty}
            </span>
            <span className="text-gray-500">
              {drill.questions.length} questions
            </span>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {drill.questions.map((question, index) => (
            <div
              key={question.id}
              className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900 mb-3">
                Question {index + 1}:{" "}
                <span className="font-normal">{question.prompt}</span>
              </h3>
              <textarea
                value={answers[question.id] || ""}
                onChange={(e) =>
                  handleAnswerChange(question.id, e.target.value)
                }
                placeholder="Type your answer here..."
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent h-28 resize-none text-gray-800 shadow-sm"
              />
            </div>
          ))}
        </div>

        {/* Submit button */}
        <div className="mt-8">
          <button
            onClick={handleSubmit}
            disabled={
              loading || Object.keys(answers).length !== drill.questions.length
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 
                       rounded-xl shadow-md transition transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Answers"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Drill;
