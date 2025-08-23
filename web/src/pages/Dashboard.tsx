import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Clock, Users, ArrowRight } from "lucide-react";
import { getDrills } from "../services/api";
import type { Drill } from "../types";

const Dashboard = () => {
  const navigate = useNavigate();
  const [drills, setDrills] = useState<Drill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  useEffect(() => {
    loadDrills();
  }, []);

  const loadDrills = async () => {
    try {
      const response = await getDrills();
      setDrills(response.data);
    } catch (error) {
      console.error("Failed to load drills:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredDrills =
    selectedDifficulty === "all"
      ? drills
      : drills.filter((drill) => drill.difficulty === selectedDifficulty);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Practice Drills
        </h1>
        <p className="text-gray-600">
          Select a drill to practice your technical interview skills
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">
                Total Drills
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {drills.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">Avg. Time</h3>
              <p className="text-2xl font-bold text-gray-900">5-10 min</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">Questions</h3>
              <p className="text-2xl font-bold text-gray-900">
                {drills.reduce(
                  (total, drill) => total + drill.questions.length,
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-8">
        {["all", "easy", "medium", "hard"].map((level) => {
          const activeColors: Record<string, string> = {
            all: "bg-blue-600 text-white shadow-md hover:bg-blue-700",
            easy: "bg-green-600 text-white shadow-md hover:bg-green-700",
            medium: "bg-yellow-500 text-white shadow-md hover:bg-yellow-600",
            hard: "bg-red-600 text-white shadow-md hover:bg-red-700",
          };

          const inactive =
            "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow";

          return (
            <button
              key={level}
              onClick={() => setSelectedDifficulty(level)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedDifficulty === level ? activeColors[level] : inactive
              }`}
            >
              {level === "all"
                ? "All Drills"
                : level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Drills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrills.map((drill) => (
          <div
            key={drill._id}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition cursor-pointer group"
          >
            <div
              onClick={() => navigate(`/drill/${drill._id}`)}
              className="h-full flex flex-col"
            >
              {/* Badge */}
              <div className="mb-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getDifficultyColor(
                    drill.difficulty
                  )}`}
                >
                  {drill.difficulty}
                </span>
              </div>

              {/* Title and Description */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {drill.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 flex-grow">
                {drill.questions.length} question
                {drill.questions.length !== 1 ? "s" : ""} to test your knowledge
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {drill.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
                {drill.tags.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                    +{drill.tags.length - 3}
                  </span>
                )}
              </div>

              {/* CTA Button */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t">
                <span className="text-sm text-gray-500">
                  {drill.questions.length} Q&apos;s
                </span>
                <button className="flex items-center text-primary-600 hover:text-primary-700 font-semibold transition">
                  Start Drill
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDrills.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No drills found for the selected difficulty.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
