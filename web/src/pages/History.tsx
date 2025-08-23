import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { getAttempts } from "../services/api";

interface ApiAttempt {
  id: string;
  drill: {
    _id: string;
    title: string;
    difficulty: string;
  };
  score: number;
  createdAt: string;
}

const History = () => {
  const [attempts, setAttempts] = useState<ApiAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttempts();
  }, []);

  const loadAttempts = async () => {
    try {
      const response = await getAttempts(5);
      console.log("API Response:", response.data);
      setAttempts(response.data || []);
    } catch (error) {
      console.error("Failed to load attempts:", error);
      setAttempts([]);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-700 bg-green-100";
    if (score >= 50) return "text-yellow-700 bg-yellow-100";
    return "text-red-700 bg-red-100";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Attempt History</h1>
        <span className="text-sm text-gray-600">
          Last {attempts.length} attempts
        </span>
      </div>

      {/* Empty state */}
      {attempts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-10 text-center">
          <Clock className="w-14 h-14 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No attempts yet
          </h3>
          <p className="text-gray-600 mb-4">
            Complete your first drill to see your history here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {attempts.map((attempt) => (
            <div
              key={attempt.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                {/* Drill details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {attempt.drill.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {format(
                      new Date(attempt.createdAt),
                      "MMM dd, yyyy - HH:mm"
                    )}
                  </p>
                </div>

                {/* Score */}
                <div
                  className={`flex items-center space-x-2 px-4 py-1.5 rounded-full font-medium ${getScoreColor(
                    attempt.score
                  )}`}
                >
                  {getScoreIcon(attempt.score)}
                  <span>{attempt.score}%</span>
                </div>
              </div>

              {/* Difficulty */}
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Difficulty:{" "}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getDifficultyColor(
                      attempt.drill.difficulty
                    )}`}
                  >
                    {attempt.drill.difficulty}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
