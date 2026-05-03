import React, { useEffect, useState } from "react";
import { X, Loader } from "lucide-react";
import axiosInstance from "../api/axiosInstance";

const EditWorkoutClassModal = ({ isOpen, onClose, classId, onSuccess }) => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingTrainers, setFetchingTrainers] = useState(false);
  const [fetchingClass, setFetchingClass] = useState(false);

  // ================= FORM STATE =================
  const [form, setForm] = useState({
    name: "",
    description: "",
    scheduledAt: "",
    durationInMinutes: "",
    isActive: true,
    trainerId: "",
  });

  const [errors, setErrors] = useState({});

  // ================= FETCH CLASS DETAILS AND TRAINERS =================
  useEffect(() => {
    if (!isOpen || !classId) return;

    const fetchData = async () => {
      try {
        setFetchingClass(true);
        setFetchingTrainers(true);

        // Fetch class details
        const classRes = await axiosInstance.get(
          `/api/WorkoutClasses/${classId}`
        );
        const classData = classRes.data;

        // Format scheduledAt for datetime-local input
        const dateObj = new Date(classData.scheduledAt);
        const formattedDate = dateObj.toISOString().slice(0, 16);

        setForm({
          name: classData.name || "",
          description: classData.description || "",
          scheduledAt: formattedDate || "",
          durationInMinutes: classData.durationInMinutes || "",
          isActive: classData.isActive ?? true,
          trainerId: classData.trainerId || "",
        });

        // Fetch trainers
        const trainersRes = await axiosInstance.get("/api/Trainers");
        setTrainers(trainersRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setErrors({ form: "Failed to load class details" });
      } finally {
        setFetchingClass(false);
        setFetchingTrainers(false);
      }
    };

    fetchData();
  }, [isOpen, classId]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // ================= VALIDATION =================
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.scheduledAt) newErrors.scheduledAt = "Date is required";
    if (!form.durationInMinutes || form.durationInMinutes <= 0)
      newErrors.durationInMinutes = "Duration must be greater than 0";
    if (!form.trainerId) newErrors.trainerId = "Trainer is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        description: form.description?.trim() || "",
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        durationInMinutes: Number(form.durationInMinutes),
        isActive: Boolean(form.isActive),
        trainerId: form.trainerId,
      };

      await axiosInstance.put(`/api/WorkoutClasses/${classId}`, payload);

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      setErrors({
        form: err.response?.data?.message || "Failed to update workout class",
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= CLOSE =================
  if (!isOpen) return null;

  const isInitializing = fetchingClass || fetchingTrainers;

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

        <h2 className="text-2xl font-semibold mb-6">Edit Workout Class</h2>

        {/* LOADING STATE */}
        {isInitializing && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-slate-400">Loading...</p>
            </div>
          </div>
        )}

        {/* FORM */}
        {!isInitializing && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* FORM ERROR */}
            {errors.form && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">{errors.form}</p>
              </div>
            )}

            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Class Name *
              </label>
              <input
                name="name"
                placeholder="Enter class name"
                value={form.name}
                onChange={handleChange}
                className={`w-full bg-slate-900/40 border rounded-lg px-3 py-2 outline-none transition-colors ${
                  errors.name
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-slate-700 focus:border-blue-500"
                }`}
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Enter class description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                className="w-full bg-slate-900/40 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* DATE */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Scheduled Date & Time *
              </label>
              <input
                type="datetime-local"
                name="scheduledAt"
                value={form.scheduledAt}
                onChange={handleChange}
                className={`w-full bg-slate-900/40 border rounded-lg px-3 py-2 outline-none transition-colors ${
                  errors.scheduledAt
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-slate-700 focus:border-blue-500"
                }`}
              />
              {errors.scheduledAt && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.scheduledAt}
                </p>
              )}
            </div>

            {/* DURATION */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                name="durationInMinutes"
                placeholder="Enter duration"
                value={form.durationInMinutes}
                onChange={handleChange}
                min="1"
                className={`w-full bg-slate-900/40 border rounded-lg px-3 py-2 outline-none transition-colors ${
                  errors.durationInMinutes
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-slate-700 focus:border-blue-500"
                }`}
              />
              {errors.durationInMinutes && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.durationInMinutes}
                </p>
              )}
            </div>

            {/* TRAINER */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Trainer *
              </label>
              <select
                name="trainerId"
                value={form.trainerId}
                onChange={handleChange}
                className={`w-full bg-slate-900/40 border rounded-lg px-3 py-2 outline-none transition-colors ${
                  errors.trainerId
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-slate-700 focus:border-blue-500"
                }`}
              >
                <option value="">Select a Trainer</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName}
                  </option>
                ))}
              </select>
              {errors.trainerId && (
                <p className="text-red-400 text-sm mt-1">{errors.trainerId}</p>
              )}
            </div>

            {/* ACTIVE TOGGLE */}
            <div className="bg-slate-900/40 border border-slate-700 rounded-lg p-3 flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="w-4 h-4 cursor-pointer"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-slate-300 cursor-pointer"
              >
                Active
              </label>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-700 hover:bg-slate-600 transition-colors py-2.5 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors py-2.5 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Class"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditWorkoutClassModal;
