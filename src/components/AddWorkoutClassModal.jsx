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

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ================= VALIDATION =================
  const validate = () => {
    const newErrors = {};

    if (!form.name) newErrors.name = "Name is required";
    if (!form.scheduledAt) newErrors.scheduledAt = "Date is required";
    if (!form.durationInMinutes)
      newErrors.durationInMinutes = "Duration is required";
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
            <input
              name="name"
              placeholder="Class Name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-slate-900/40 border border-slate-700 rounded-lg px-3 py-2 outline-none"
            />
            {errors.name && (
              <p className="text-red-400 text-sm">{errors.name}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full bg-slate-900/40 border border-slate-700 rounded-lg px-3 py-2 outline-none"
          />

          {/* DATE */}
          <div>
            <input
              type="datetime-local"
              name="scheduledAt"
              value={form.scheduledAt}
              onChange={handleChange}
              className="w-full bg-slate-900/40 border border-slate-700 rounded-lg px-3 py-2 outline-none"
            />
            {errors.scheduledAt && (
              <p className="text-red-400 text-sm">{errors.scheduledAt}</p>
            )}
          </div>

          {/* DURATION */}
          <div>
            <input
              type="number"
              name="durationInMinutes"
              placeholder="Duration (minutes)"
              value={form.durationInMinutes}
              onChange={handleChange}
              className="w-full bg-slate-900/40 border border-slate-700 rounded-lg px-3 py-2 outline-none"
            />
            {errors.durationInMinutes && (
              <p className="text-red-400 text-sm">{errors.durationInMinutes}</p>
            )}
          </div>

          {/* TRAINER */}
          <div>
            <select
              name="trainerId"
              value={form.trainerId}
              onChange={handleChange}
              className="w-full bg-slate-900/40 border border-slate-700 rounded-lg px-3 py-2 outline-none"
            >
              <option value="">Select Trainer</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.fullName}
                </option>
              ))}
            </select>
            {errors.trainerId && (
              <p className="text-red-400 text-sm">{errors.trainerId}</p>
            )}
          </div>

          {/* ACTIVE TOGGLE */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            <label>Active</label>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 transition py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Workout Class"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddWorkoutClassModal;
