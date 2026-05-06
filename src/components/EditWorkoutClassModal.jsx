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
          `/api/WorkoutClasses/${classId}`,
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

    let updatedValue = value;

    // Prevent invalid characters in class name
    if (name === "name") {
      updatedValue = value.replace(/[^a-zA-Z0-9\s&-]/g, "");
    }

    // Allow only numbers for duration
    if (name === "durationInMinutes") {
      updatedValue = value.replace(/\D/g, "");
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : updatedValue,
    }));

    // ================= REAL TIME VALIDATION =================
    setErrors((prev) => {
      const updatedErrors = { ...prev };

      switch (name) {
        case "name":
          if (!updatedValue.trim()) {
            updatedErrors.name = "Class name is required";
          } else if (updatedValue.trim().length < 3) {
            updatedErrors.name = "Class name must be at least 3 characters";
          } else if (updatedValue.trim().length > 50) {
            updatedErrors.name = "Class name must be less than 50 characters";
          } else {
            delete updatedErrors.name;
          }
          break;

        case "description":
          if (updatedValue.trim() && updatedValue.trim().length < 10) {
            updatedErrors.description =
              "Description must be at least 10 characters";
          } else if (updatedValue.trim().length > 300) {
            updatedErrors.description =
              "Description must be less than 300 characters";
          } else {
            delete updatedErrors.description;
          }
          break;

        case "scheduledAt":
          if (!updatedValue) {
            updatedErrors.scheduledAt = "Scheduled date and time is required";
          } else {
            const selectedDate = new Date(updatedValue);
            const now = new Date();

            if (selectedDate < now) {
              updatedErrors.scheduledAt = "Date cannot be in the past";
            } else {
              delete updatedErrors.scheduledAt;
            }
          }
          break;

        case "durationInMinutes":
          if (!updatedValue) {
            updatedErrors.durationInMinutes = "Duration is required";
          } else if (Number(updatedValue) < 15 || Number(updatedValue) > 300) {
            updatedErrors.durationInMinutes =
              "Duration must be between 15 and 300 minutes";
          } else {
            delete updatedErrors.durationInMinutes;
          }
          break;

        case "trainerId":
          if (!updatedValue) {
            updatedErrors.trainerId = "Trainer is required";
          } else {
            delete updatedErrors.trainerId;
          }
          break;

        default:
          break;
      }

      return updatedErrors;
    });
  };

  // ================= VALIDATION =================
  const validate = () => {
    const newErrors = {};

    // NAME
    if (!form.name.trim()) {
      newErrors.name = "Class name is required";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Class name must be at least 3 characters";
    } else if (form.name.trim().length > 50) {
      newErrors.name = "Class name must be less than 50 characters";
    }

    // DESCRIPTION
    if (form.description.trim() && form.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (form.description.trim().length > 300) {
      newErrors.description = "Description must be less than 300 characters";
    }

    // DATE
    if (!form.scheduledAt) {
      newErrors.scheduledAt = "Scheduled date and time is required";
    } else {
      const selectedDate = new Date(form.scheduledAt);
      const now = new Date();

      if (selectedDate < now) {
        newErrors.scheduledAt = "Date cannot be in the past";
      }
    }

    // DURATION
    if (!form.durationInMinutes) {
      newErrors.durationInMinutes = "Duration is required";
    } else if (
      Number(form.durationInMinutes) < 15 ||
      Number(form.durationInMinutes) > 300
    ) {
      newErrors.durationInMinutes =
        "Duration must be between 15 and 300 minutes";
    }

    // TRAINER
    if (!form.trainerId) {
      newErrors.trainerId = "Trainer is required";
    }

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
              
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.description}
                </p>
              )}
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
