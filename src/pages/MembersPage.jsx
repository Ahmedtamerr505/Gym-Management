import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, MoreVertical, Eye, Pen, Trash2 } from "lucide-react";
import { useMembers, useDeleteMember } from "../hooks/useMembers";
import AddMemberModal from "../components/AddMemberModal";
import EditMemberModal from "../components/EditMemberModal";
import DetailsMemberModal from "../components/DetailsMemberModal";

export default function MembersPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const {
    data: members = [],
    isLoading: loading,
    error,
    refetch,
  } = useMembers();

  const deleteMemberMutation = useDeleteMember();

  // Search functionality
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const searchLower = searchQuery.toLowerCase();

      return (
        member.fullName?.toLowerCase().includes(searchLower) ||
        member.email?.toLowerCase().includes(searchLower)
      );
    });
  }, [members, searchQuery]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Status badge
  const StatusBadge = ({ isActive }) => (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        isActive
          ? "bg-green-500/20 text-green-400 border border-green-500/30"
          : "bg-red-500/20 text-red-400 border border-red-500/30"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );

  // Action menu
  const ActionMenu = ({ memberId }) => (
    <div className="relative">
      <button
        onClick={() => setOpenMenuId(openMenuId === memberId ? null : memberId)}
        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
        aria-label="Member actions"
      >
        <MoreVertical size={18} className="text-slate-400" />
      </button>

      {openMenuId === memberId && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700/50 rounded-lg shadow-lg z-50 overflow-hidden backdrop-blur-sm bg-slate-800/80">
          <button
            onClick={() => {
              handleView(memberId);
              setOpenMenuId(null);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700/50 hover:text-blue-400 transition-colors duration-200 text-sm"
          >
            <Eye size={16} />
            <span>View</span>
          </button>
          <button
            onClick={() => {
              handleEdit(memberId);
              setOpenMenuId(null);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700/50 hover:text-amber-400 transition-colors duration-200 text-sm border-t border-slate-700/50"
          >
            <Pen size={16} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => {
              handleDelete(memberId);
              setOpenMenuId(null);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700/50 hover:text-red-400 transition-colors duration-200 text-sm border-t border-slate-700/50"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );

  // Action handlers
  const handleView = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setIsDetailsModalOpen(true);
    }
  };

  const handleEdit = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = async (memberId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this member?",
    );

    if (!confirmed) return;

    try {
      await deleteMemberMutation.mutateAsync(memberId);

      alert("Member deleted successfully!");
    } catch (err) {
      alert(err.message || "Failed to delete member.");

      console.error(err);
    }
  };

  const handleAddMember = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Members</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative w-full sm:w-[260px]">
            <Search
              size={18}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400 pointer-events-none"
            />

            <input
              type="text"
              placeholder="Search Members"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-700/50 bg-slate-900/70 py-2.5 pl-10 pr-4 text-slate-100 placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            />
          </div>

          {/* Add Member Button */}
          <button
            onClick={handleAddMember}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/20 whitespace-nowrap"
          >
            <Plus size={18} />
            <span>Add New Member</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-lg border border-slate-700/50 overflow-hidden bg-slate-800/30 backdrop-blur-sm shadow-xl">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-slate-400">Loading members...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="text-4xl">⚠️</div>
              <p className="text-red-400 text-center">{error}</p>
              <button
                onClick={refetch}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            {filteredMembers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  {/* Table Header */}
                  <thead className="bg-slate-800/50 border-b border-slate-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 hidden sm:table-cell">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 hidden md:table-cell">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 hidden lg:table-cell">
                        Plan
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Status
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-slate-700/50">
                    {filteredMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="hover:bg-slate-800/30 transition-colors duration-150"
                      >
                        {/* Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                              {member.fullName?.charAt(0).toUpperCase() || "M"}
                            </div>
                            <span className="text-slate-100 font-medium">
                              {member.fullName || "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 text-slate-300 text-sm hidden sm:table-cell">
                          <span className="break-all">
                            {member.email || "N/A"}
                          </span>
                        </td>

                        {/* Phone */}
                        <td className="px-6 py-4 text-slate-300 text-sm hidden md:table-cell">
                          {member.phoneNumber || "N/A"}
                        </td>

                        {/* Plan */}
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span className="px-3 py-1 bg-slate-700/50 text-slate-300 text-sm rounded-lg">
                            {member.membershipPlanName || "N/A"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <StatusBadge isActive={member.isActive} />
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-center">
                          <ActionMenu memberId={member.id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                  <p className="text-slate-400 text-lg">No members found</p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Results Count */}
      {!loading && !error && (
        <p className="text-sm text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-300">
            {filteredMembers.length}
          </span>{" "}
          {filteredMembers.length === 1 ? "member" : "members"}
        </p>
      )}

      {/* Details Member Modal */}
      <DetailsMemberModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
      />

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
      />

      {/* Edit Member Modal */}
      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        onSuccess={refetch}
      />
    </div>
  );
}
