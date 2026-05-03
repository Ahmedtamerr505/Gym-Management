import React, { useState, useEffect } from "react";
import { X, Loader } from "lucide-react";
import axiosInstance from "../api/axiosInstance";

export default function EditTrainerModal({ isOpen, onClose, trainer, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    speciality: "",
    bio: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Pre-populate form when trainer prop changes
  useEffect(() => {
    if (isOpen && trainer) {
      setFormData({
        fullName: trainer.fullName || "",
        email: trainer.email || "",
        phone: trainer.phone || "",
        speciality: trainer.speciality || "",
        bio: trainer.bio || "",
      });
      setValidationErrors({});
      setError(null);
    }
  }, [isOpen, trainer]);

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone Number is required";
    }

    if (!formData.speciality.trim()) {
      errors.speciality = "Speciality is required";
    }

    if (!formData.bio.trim()) {
      errors.bio = "Bio is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Prepare payload
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        speciality: formData.speciality.trim(),
        bio: formData.bio.trim(),
        hireDate: trainer.hireDate,
        isActive: trainer.isActive,
      };

    //   console.log("Submitting payload:", payload);

      // Submit
      const response = await axiosInstance.put(
        `/api/Trainers/${trainer.id}`,
        payload
      );
      //   console.log("Success response:", response);

      // Success
      alert("Trainer updated successfully!");

      // Close modal and trigger refresh
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to update trainer. Please try again.";
      setError(errorMessage);
      console.error("Error updating trainer:", err);
      console.error("Error details:", err.response?.data);
    } finally {
      setSubmitting(false);
    }
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
            <h2 className="text-lg font-bold text-white">Edit Trainer</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
              aria-label="Close modal"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Error Alert */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className={`w-full px-4 py-2.5 bg-slate-800/50 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none transition-all duration-200 ${
                  validationErrors.fullName
                    ? "border-red-500/50 focus:border-red-500/50 focus:bg-slate-800"
                    : "border-slate-700/50 focus:border-blue-500/50 focus:bg-slate-800"
                }`}
              />
              {validationErrors.fullName && (
                <p className="text-xs text-red-400 mt-1">{validationErrors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                className={`w-full px-4 py-2.5 bg-slate-800/50 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none transition-all duration-200 ${
                  validationErrors.email
                    ? "border-red-500/50 focus:border-red-500/50 focus:bg-slate-800"
                    : "border-slate-700/50 focus:border-blue-500/50 focus:bg-slate-800"
                }`}
              />
              {validationErrors.email && (
                <p className="text-xs text-red-400 mt-1">{validationErrors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className={`w-full px-4 py-2.5 bg-slate-800/50 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none transition-all duration-200 ${
                  validationErrors.phone
                    ? "border-red-500/50 focus:border-red-500/50 focus:bg-slate-800"
                    : "border-slate-700/50 focus:border-blue-500/50 focus:bg-slate-800"
                }`}
              />
              {validationErrors.phone && (
                <p className="text-xs text-red-400 mt-1">{validationErrors.phone}</p>
              )}
            </div>

            {/* Speciality */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Speciality <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="speciality"
                value={formData.speciality}
                onChange={handleInputChange}
                placeholder="e.g., CrossFit, Yoga, Boxing"
                className={`w-full px-4 py-2.5 bg-slate-800/50 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none transition-all duration-200 ${
                  validationErrors.speciality
                    ? "border-red-500/50 focus:border-red-500/50 focus:bg-slate-800"
                    : "border-slate-700/50 focus:border-blue-500/50 focus:bg-slate-800"
                }`}
              />
              {validationErrors.speciality && (
                <p className="text-xs text-red-400 mt-1">{validationErrors.speciality}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Bio <span className="text-red-400">*</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Enter trainer bio"
                rows="3"
                className={`w-full px-4 py-2.5 bg-slate-800/50 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none transition-all duration-200 resize-none ${
                  validationErrors.bio
                    ? "border-red-500/50 focus:border-red-500/50 focus:bg-slate-800"
                    : "border-slate-700/50 focus:border-blue-500/50 focus:bg-slate-800"
                }`}
              />
              {validationErrors.bio && (
                <p className="text-xs text-red-400 mt-1">{validationErrors.bio}</p>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-800/50 flex gap-3">
            <button
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Trainer</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
