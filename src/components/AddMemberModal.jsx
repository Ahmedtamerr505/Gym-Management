import React, { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

export default function AddMemberModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    membershipPlanId: '',
  });

  const [membershipPlans, setMembershipPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch membership plans on mount
  useEffect(() => {
    if (isOpen) {
      fetchMembershipPlans();
    }
  }, [isOpen]);

  const fetchMembershipPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/api/MembershipPlans');
      setMembershipPlans(response.data);
    } catch (err) {
      setError('Failed to load membership plans. Please try again.');
      console.error('Error fetching membership plans:', err);
    } finally {
      setLoading(false);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone Number is required';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!formData.membershipPlanId) {
      errors.membershipPlanId = 'Membership Plan is required';
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
        [name]: '',
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
        phoneNumber: formData.phoneNumber.trim(),
        address: formData.address.trim(),
        membershipPlanId: formData.membershipPlanId,
        joinDate: new Date().toISOString(),
        isActive: true,
      };

    //   console.log('Submitting payload:', payload); // Debug log

      // Submit
      const response = await axiosInstance.post('/api/Members', payload);
    //   console.log('Success response:', response); // Debug log

      
      alert('Member added successfully!');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        membershipPlanId: '',
      });

      // Close modal and trigger refresh
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to add member. Please try again.';
      setError(errorMessage);
      console.error('Error adding member:', err);
      console.error('Error details:', err.response?.data); // Debug log
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
            <h2 className="text-lg font-bold text-white">Add New Member</h2>
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
                    ? 'border-red-500/50 focus:border-red-500/50 focus:bg-slate-800'
                    : 'border-slate-700/50 focus:border-blue-500/50 focus:bg-slate-800'
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
                    ? 'border-red-500/50 focus:border-red-500/50 focus:bg-slate-800'
                    : 'border-slate-700/50 focus:border-blue-500/50 focus:bg-slate-800'
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
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className={`w-full px-4 py-2.5 bg-slate-800/50 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none transition-all duration-200 ${
                  validationErrors.phoneNumber
                    ? 'border-red-500/50 focus:border-red-500/50 focus:bg-slate-800'
                    : 'border-slate-700/50 focus:border-blue-500/50 focus:bg-slate-800'
                }`}
              />
              {validationErrors.phoneNumber && (
                <p className="text-xs text-red-400 mt-1">{validationErrors.phoneNumber}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Address <span className="text-red-400">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
                rows="3"
                className={`w-full px-4 py-2.5 bg-slate-800/50 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none transition-all duration-200 resize-none ${
                  validationErrors.address
                    ? 'border-red-500/50 focus:border-red-500/50 focus:bg-slate-800'
                    : 'border-slate-700/50 focus:border-blue-500/50 focus:bg-slate-800'
                }`}
              />
              {validationErrors.address && (
                <p className="text-xs text-red-400 mt-1">{validationErrors.address}</p>
              )}
            </div>

            {/* Membership Plan */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Membership Plan <span className="text-red-400">*</span>
              </label>
              {loading ? (
                <div className="flex items-center justify-center p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                  <Loader size={16} className="text-blue-400 animate-spin" />
                  <span className="ml-2 text-sm text-slate-400">Loading plans...</span>
                </div>
              ) : (
                <select
                  name="membershipPlanId"
                  value={formData.membershipPlanId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-slate-800/50 border rounded-lg text-slate-100 focus:outline-none transition-all duration-200 appearance-none cursor-pointer ${
                    validationErrors.membershipPlanId
                      ? 'border-red-500/50 focus:border-red-500/50 focus:bg-slate-800'
                      : 'border-slate-700/50 focus:border-blue-500/50 focus:bg-slate-800'
                  }`}
                >
                  <option value="">-- Select a plan --</option>
                  {membershipPlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - {plan.price ? `$${plan.price}` : 'N/A'}
                    </option>
                  ))}
                </select>
              )}
              {validationErrors.membershipPlanId && (
                <p className="text-xs text-red-400 mt-1">{validationErrors.membershipPlanId}</p>
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
              disabled={submitting || loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <span>Add Member</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
