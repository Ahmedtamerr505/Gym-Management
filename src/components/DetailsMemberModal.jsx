// import React from 'react';
import { X } from 'lucide-react';

export default function DetailsMemberModal({ isOpen, onClose, member }) {
  if (!isOpen || !member) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-slate-900/95 border border-slate-700/50 rounded-lg shadow-2xl backdrop-blur-sm overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-slate-800/50">
            <h2 className="text-lg font-bold text-white">Member Details</h2>
            <button onClick={onClose} className="p-1 hover:bg-slate-700/50 rounded-lg transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {member.fullName?.charAt(0).toUpperCase() || 'M'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{member.fullName}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${member.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Email</p>
                <p className="text-white">{member.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400">Phone</p>
                <p className="text-white">{member.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400">Address</p>
                <p className="text-white">{member.address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400">Plan</p>
                <p className="text-white">{member.membershipPlanName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400">Join Date</p>
                <p className="text-white">{formatDate(member.joinDate)}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-800/50 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}