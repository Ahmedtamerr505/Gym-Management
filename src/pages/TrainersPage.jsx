import React, { useState, useEffect, useMemo } from "react";
import { Search, Plus, MoreVertical, Eye, Pen, Trash2 } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import AddTrainerModal from "../components/AddTrainerModal";
import EditTrainerModal from "../components/EditTrainerModal";
import DetailsTrainerModal from "../components/DetailsTrainerModal";

export default function TrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/api/Trainers");
      setTrainers(response.data);
    } catch (err) {
      setError("Failed to fetch trainers.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainers = useMemo(() => {
    return trainers.filter((trainer) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        trainer.fullName?.toLowerCase().includes(searchLower) ||
        trainer.email?.toLowerCase().includes(searchLower)
      );
    });
  }, [trainers, searchQuery]);

  // --- Action Handlers ---
  const handleView = (id) => {
    const trainer = trainers.find((t) => t.id === id);
    setSelectedTrainer(trainer);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (id) => {
    const trainer = trainers.find((t) => t.id === id);
    setSelectedTrainer(trainer);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trainer?",
    );

    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/api/Trainers/${id}`);

      alert("Trainer deleted successfully!");
      fetchTrainers();
    } catch (err) {
      console.error(err);

      // Backend custom message
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to delete trainer.";

      // Handle conflict error (409)
      if (err.response?.status === 409) {
        alert(backendMessage);
        return;
      }

      // Generic errors
      alert(backendMessage);
    }
  };

  // --- Components ---
  const StatusBadge = ({ isActive }) => (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isActive ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );

  const ActionMenu = ({ trainerId }) => (
    <div className="relative">
      <button
        onClick={() =>
          setOpenMenuId(openMenuId === trainerId ? null : trainerId)
        }
        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
      >
        <MoreVertical size={18} className="text-slate-400" />
      </button>

      {openMenuId === trainerId && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700/50 rounded-lg shadow-lg z-50 overflow-hidden backdrop-blur-sm bg-slate-800/80">
          <button
            onClick={() => {
              handleView(trainerId);
              setOpenMenuId(null);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700/50 hover:text-blue-400 transition-colors text-sm"
          >
            <Eye size={16} /> <span>View</span>
          </button>
          <button
            onClick={() => {
              handleEdit(trainerId);
              setOpenMenuId(null);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700/50 hover:text-amber-400 transition-colors text-sm border-t border-slate-700/50"
          >
            <Pen size={16} /> <span>Edit</span>
          </button>
          <button
            onClick={() => {
              handleDelete(trainerId);
              setOpenMenuId(null);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700/50 hover:text-red-400 transition-colors text-sm border-t border-slate-700/50"
          >
            <Trash2 size={16} /> <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header, Search, and Add Button remain the same */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Trainers</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[260px]">
            <Search
              size={18}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search Trainers"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-700/50 bg-slate-900/70 py-2.5 pl-10 pr-4 text-slate-100 placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-blue-500/20 whitespace-nowrap"
          >
            <Plus size={18} /> <span>Add New Trainer</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-lg border border-slate-700/50 overflow-hidden bg-slate-800/30 backdrop-blur-sm shadow-xl">
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full">
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
                    Speciality
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredTrainers.map((trainer) => (
                  <tr
                    key={trainer.id}
                    className="hover:bg-slate-800/30 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {trainer.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-slate-100 font-medium">
                          {trainer.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm hidden sm:table-cell">
                      {trainer.email}
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm hidden md:table-cell">
                      {trainer.phone}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="px-3 py-1 bg-slate-700/50 text-slate-300 text-sm rounded-lg">
                        {trainer.speciality}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge isActive={trainer.isActive} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <ActionMenu trainerId={trainer.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddTrainerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTrainers}
      />
      <EditTrainerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        trainer={selectedTrainer}
        onSuccess={fetchTrainers}
      />
      <DetailsTrainerModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        trainer={selectedTrainer}
      />
    </div>
  );
}
