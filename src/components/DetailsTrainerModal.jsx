import React, { useState, useEffect } from "react";
import { X, ChevronLeft, Loader } from "lucide-react";
import axiosInstance from "../api/axiosInstance";

export default function DetailsTrainerModal({ isOpen, onClose, trainer }) {
  const [trainerData, setTrainerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch trainer details
  useEffect(() => {
    if (isOpen && trainer?.id) {
      fetchTrainerDetails();
    }
  }, [isOpen, trainer?.id]);

  const fetchTrainerDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/api/Trainers/${trainer.id}`);
      setTrainerData(response.data);
    } catch (err) {
      setError("Failed to load trainer details. Please try again.");
      console.error("Error fetching trainer details:", err);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-slate-900/95 border border-slate-700/50 rounded-lg shadow-2xl backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-slate-800/50">
            <h2 className="text-lg font-bold text-white">Trainer Details</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
              aria-label="Close modal"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-slate-400">Loading details...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-96">
              <div className="flex flex-col items-center gap-4">
                <div className="text-4xl">⚠️</div>
                <p className="text-red-400 text-center text-sm">{error}</p>
                <button
                  onClick={fetchTrainerDetails}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : trainerData ? (
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Avatar */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {trainerData.fullName?.charAt(0).toUpperCase() || "T"}
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex justify-center">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    trainerData.isActive
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {trainerData.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Details Grid */}
              <div className="space-y-4">
                {/* Full Name */}
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">Full Name</p>
                  <p className="text-slate-100 font-medium">
                    {trainerData.fullName || "N/A"}
                  </p>
                </div>

                {/* Email */}
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">Email</p>
                  <p className="text-slate-100 font-medium break-all">
                    {trainerData.email || "N/A"}
                  </p>
                </div>

                {/* Phone */}
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">Phone</p>
                  <p className="text-slate-100 font-medium">
                    {trainerData.phone || "N/A"}
                  </p>
                </div>

                {/* Speciality */}
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">Speciality</p>
                  <p className="text-slate-100 font-medium">
                    {trainerData.speciality || "N/A"}
                  </p>
                </div>

                {/* Bio */}
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">Bio</p>
                  <p className="text-slate-100 font-medium text-sm leading-relaxed">
                    {trainerData.bio || "N/A"}
                  </p>
                </div>

                {/* Hire Date */}
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">Hire Date</p>
                  <p className="text-slate-100 font-medium">
                    {formatDate(trainerData.hireDate)}
                  </p>
                </div>

                {/* Trainer ID */}
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">Trainer ID</p>
                  <p className="text-slate-100 font-mono text-sm break-all">
                    {trainerData.id || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-800/50">
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
