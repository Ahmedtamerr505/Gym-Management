import React, { useEffect, useState } from "react";
import { X, Loader } from "lucide-react";
import axiosInstance from "../api/axiosInstance";

const DetailsWorkoutClassModal = ({ isOpen, onClose, classId }) => {
  const [workoutClass, setWorkoutClass] = useState(null);
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !classId) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axiosInstance.get(`/api/WorkoutClasses/${classId}`);
        setWorkoutClass(res.data);

        // Fetch trainer details if trainerId exists
        if (res.data.trainerId) {
          try {
            const trainerRes = await axiosInstance.get(
              `/api/Trainers/${res.data.trainerId}`
            );
            setTrainer(trainerRes.data);
          } catch (err) {
            console.error("Failed to fetch trainer details");
          }
        }
      } catch (err) {
        setError("Failed to load workout class details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [isOpen, classId]);

  if (!isOpen) return null;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-xl w-full max-w-lg p-6 text-white relative">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-6">Workout Class Details</h2>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-slate-400">Loading details...</p>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {error && !loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="text-4xl">⚠️</div>
              <p className="text-red-400 text-center">{error}</p>
            </div>
          </div>
        )}

        {/* CONTENT */}
        {!loading && !error && workoutClass && (
          <div className="space-y-4">
            {/* CLASS NAME */}
            <div className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Class Name</p>
              <p className="text-white font-semibold text-lg">
                {workoutClass.name}
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Description</p>
              <p className="text-slate-200 text-sm leading-relaxed">
                {workoutClass.description || "No description provided"}
              </p>
            </div>

            {/* GRID ROW 1 */}
            <div className="grid grid-cols-2 gap-4">
              {/* SCHEDULED DATE */}
              <div className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">Scheduled Date</p>
                <p className="text-white font-medium text-sm">
                  {formatDate(workoutClass.scheduledAt)}
                </p>
              </div>

              {/* DURATION */}
              <div className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">Duration</p>
                <p className="text-white font-medium text-sm">
                  {workoutClass.durationInMinutes} minutes
                </p>
              </div>
            </div>

            {/* GRID ROW 2 */}
            <div className="grid grid-cols-2 gap-4">
              {/* TRAINER */}
              <div className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">Trainer</p>
                <p className="text-white font-medium text-sm">
                  {trainer?.fullName || "Unassigned"}
                </p>
              </div>

              {/* STATUS */}
              <div className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">Status</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    workoutClass.isActive
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {workoutClass.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* CLASS ID */}
            <div className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Class ID</p>
              <p className="text-slate-300 text-xs font-mono break-all">
                {workoutClass.id}
              </p>
            </div>

            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="w-full bg-slate-700 hover:bg-slate-600 transition-colors py-2.5 rounded-lg font-medium mt-6"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsWorkoutClassModal;
