import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { X } from "lucide-react";

const AddWorkoutClassModal = ({ isOpen, onClose, onSuccess }) => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingTrainers, setFetchingTrainers] = useState(false);

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

  // ================= FETCH TRAINERS =================
  useEffect(() => {
    if (!isOpen) return;

    const fetchTrainers = async () => {
      try {
        setFetchingTrainers(true);
        const res = await axiosInstance.get("/api/Trainers");
        setTrainers(res.data);
      } catch (err) {
        console.error("Failed to fetch trainers");
      } finally {
        setFetchingTrainers(false);
      }
    };

    fetchTrainers();
  }, [isOpen]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let updatedValue = type === "checkbox" ? checked : value;

    // Prevent numbers/symbols in class name
    if (name === "name") {
      updatedValue = value.replace(/[^a-zA-Z\s]/g, "");
    }

    // Allow only numbers in duration
    if (name === "durationInMinutes") {
      updatedValue = value.replace(/\D/g, "");
    }

    setForm((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    // ================= LIVE VALIDATION =================
    let errorMessage = "";

    // Name
    if (name === "name") {
      if (!updatedValue.trim()) {
        errorMessage = "Class Name is required";
      } else if (updatedValue.trim().length < 3) {
        errorMessage = "Class Name must be at least 3 characters";
      }
    }

    // Description
    if (name === "description") {
      if (updatedValue && updatedValue.trim().length < 10) {
        errorMessage = "Description must be at least 10 characters";
      }
    }

    // Scheduled Date
    if (name === "scheduledAt") {
      if (!updatedValue) {
        errorMessage = "Date is required";
      } else {
        const selectedDate = new Date(updatedValue);
        const now = new Date();

        if (selectedDate < now) {
          errorMessage = "Workout class date must be in the future";
        }
      }
    }

    // Duration
    if (name === "durationInMinutes") {
      if (!updatedValue) {
        errorMessage = "Duration is required";
      } else if (Number(updatedValue) < 15) {
        errorMessage = "Duration must be at least 15 minutes";
      } else if (Number(updatedValue) > 120) {
        errorMessage = "Duration cannot exceed 120 minutes";
      }
    }

    // Trainer
    if (name === "trainerId") {
      if (!updatedValue) {
        errorMessage = "Trainer is required";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  // ================= VALIDATION =================
  const validate = () => {
    const newErrors = {};

    // Name
    if (!form.name.trim()) {
      newErrors.name = "Class Name is required";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Class Name must be at least 3 characters";
    }

    // Description
    if (form.description && form.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    // Scheduled Date
    if (!form.scheduledAt) {
      newErrors.scheduledAt = "Date is required";
    } else {
      const selectedDate = new Date(form.scheduledAt);
      const now = new Date();

      if (selectedDate < now) {
        newErrors.scheduledAt = "Workout class date must be in the future";
      }
    }

    // Duration
    if (!form.durationInMinutes) {
      newErrors.durationInMinutes = "Duration is required";
    } else if (Number(form.durationInMinutes) < 15) {
      newErrors.durationInMinutes = "Duration must be at least 15 minutes";
    } else if (Number(form.durationInMinutes) > 120) {
      newErrors.durationInMinutes = "Duration cannot exceed 120 minutes";
    }

    // Trainer
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

      await axiosInstance.post("/api/WorkoutClasses", payload);

      onSuccess?.();
      onClose();
      setForm({
        name: "",
        description: "",
        scheduledAt: "",
        durationInMinutes: "",
        isActive: true,
        trainerId: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create workout class");
    } finally {
      setLoading(false);
    }
  };

  // ================= CLOSE =================
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-xl w-full max-w-lg p-6 text-white relative">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white"
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4">Add Workout Class</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Class Name <span className="text-red-400">*</span>
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter class name"
              value={form.name}
              onChange={handleChange}
              maxLength={50}
              className={`w-full bg-slate-900/40 border rounded-lg px-3 py-2 outline-none text-white placeholder:text-slate-500 transition ${
                errors.name
                  ? "border-red-500 focus:border-red-500"
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
              Description <span className="text-red-400">*</span>
            </label>

            <textarea
              name="description"
              placeholder="Enter class description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              maxLength={300}
              className={`w-full bg-slate-900/40 border rounded-lg px-3 py-2 outline-none text-white placeholder:text-slate-500 resize-none transition ${
                errors.description
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-700 focus:border-blue-500"
              }`}
            />

            <div className="flex items-center justify-between mt-1">
              {errors.description ? (
                <p className="text-red-400 text-sm">{errors.description}</p>
              ) : (
                <div />
              )}

              <p className="text-xs text-slate-500">
                {form.description.length}/300
              </p>
            </div>
          </div>

          {/* DATE */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Scheduled Date & Time <span className="text-red-400">*</span>
            </label>

            <input
              type="datetime-local"
              name="scheduledAt"
              value={form.scheduledAt}
              onChange={handleChange}
              className={`w-full bg-slate-900/40 border rounded-lg px-3 py-2 outline-none text-white transition ${
                errors.scheduledAt
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-700 focus:border-blue-500"
              }`}
            />

            {errors.scheduledAt && (
              <p className="text-red-400 text-sm mt-1">{errors.scheduledAt}</p>
            )}
          </div>

          {/* DURATION */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Duration In Minutes <span className="text-red-400">*</span>
            </label>

            <input
              type="number"
              name="durationInMinutes"
              placeholder="Enter duration"
              value={form.durationInMinutes}
              onChange={handleChange}
              min={15}
              max={120}
              className={`w-full bg-slate-900/40 border rounded-lg px-3 py-2 outline-none text-white placeholder:text-slate-500 transition ${
                errors.durationInMinutes
                  ? "border-red-500 focus:border-red-500"
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
              Trainer <span className="text-red-400">*</span>
            </label>

            <select
              name="trainerId"
              value={form.trainerId}
              onChange={handleChange}
              className={`w-full bg-slate-900/40 border rounded-lg px-3 py-2 outline-none text-white transition ${
                errors.trainerId
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-700 focus:border-blue-500"
              }`}
            >
              <option value="">Select Trainer</option>

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

          {/* ACTIVE */}
          <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/30 px-4 py-3">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="h-4 w-4 accent-blue-500"
            />

            <label className="text-sm text-slate-300">Class is Active</label>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-1/2 bg-slate-700 hover:bg-slate-600 transition py-2.5 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-1/2 bg-blue-500 hover:bg-blue-600 transition py-2.5 rounded-lg disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Workout Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWorkoutClassModal;
