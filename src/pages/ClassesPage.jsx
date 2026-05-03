import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import AddWorkoutClassModal from "../components/AddWorkoutClassModal";
import DetailsWorkoutClassModal from "../components/DetailsWorkoutClassModal";
import EditWorkoutClassModal from "../components/EditWorkoutClassModal";
import {
  Dumbbell,
  Search,
  MoreVertical,
  Eye,
  Pen,
  Trash,
  Plus,
} from "lucide-react";

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [open, setOpen] = useState(false);

  const [selectedClass, setSelectedClass] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // ===================== FETCH DATA =====================
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/WorkoutClasses");
      setClasses(res.data);
    } catch (err) {
      setError("Failed to load workout classes");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainers = async () => {
    try {
      const res = await axiosInstance.get("/api/Trainers");
      setTrainers(res.data);
    } catch (err) {
      console.error("Failed to load trainers");
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchTrainers();
  }, []);

  const trainerMap = useMemo(() => {
    const map = {};
    trainers.forEach((t) => {
      map[t.id] = t.fullName;
    });
    return map;
  }, [trainers]);

  const filteredClasses = useMemo(() => {
    return classes.filter((c) =>
      c.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [classes, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    try {
      await axiosInstance.delete(`/api/WorkoutClasses/${id}`);
      setClasses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Failed to delete class");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Workout Classes</h1>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* SEARCH */}
          <div className="relative w-full sm:w-[260px]">
            <Search size={18} className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              className="w-full rounded-xl border border-slate-700/50 bg-slate-900/70 py-2.5 pl-10 pr-4 text-slate-100 placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              placeholder="Search Classes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* ADD BUTTON */}
          <button
            onClick={() => setOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/20 whitespace-nowrap"
          >
            <Plus size={18} />
            <span>Add New Workout Class</span>
          </button>
        </div>
      </div>

      {/* STATES */}
      {loading && <p className="text-slate-400 text-center">Loading classes...</p>}
      {error && <p className="text-red-400 text-center">{error}</p>}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClasses.map((item) => (
          <div
            key={item.id}
            className="relative bg-slate-800/30 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 shadow-lg"
          >
            {/* KEBAB MENU */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <MoreVertical size={18} className="text-slate-400" />
              </button>

              {activeMenu === item.id && (
                <div className="absolute right-0 mt-2 w-36 bg-slate-800 border border-slate-700/50 rounded-lg shadow-xl z-20 overflow-hidden">
                  <button
                    onClick={() => {
                      setSelectedClass(item);
                      setDetailsModalOpen(true);
                      setActiveMenu(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700/50 text-slate-300 hover:text-blue-400 w-full text-sm"
                  >
                    <Eye size={16} /> View
                  </button>
                  <button
                    onClick={() => {
                      setSelectedClass(item);
                      setEditModalOpen(true);
                      setActiveMenu(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700/50 text-slate-300 hover:text-amber-400 w-full text-sm border-t border-slate-700/50"
                  >
                    <Pen size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700/50 text-slate-300 hover:text-red-400 w-full text-sm border-t border-slate-700/50"
                  >
                    <Trash size={16} /> Delete
                  </button>
                </div>
              )}
            </div>

            {/* CARD CONTENT */}
            <div className="mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                <Dumbbell className="text-blue-400" size={24} />
              </div>
            </div>

            <h2 className="text-lg font-bold text-white mb-2">{item.name}</h2>
            
            <div className="space-y-1">
              <p className="text-slate-400 text-sm">
                Trainer: <span className="text-slate-200">{trainerMap[item.trainerId] || "Unassigned"}</span>
              </p>
              <p className="text-slate-400 text-sm">
                Duration: <span className="text-slate-200">{item.durationInMinutes} mins</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <DetailsWorkoutClassModal
        isOpen={detailsModalOpen}
        onClose={() => { setDetailsModalOpen(false); setSelectedClass(null); }}
        classId={selectedClass?.id}
      />
      <EditWorkoutClassModal
        isOpen={editModalOpen}
        onClose={() => { setEditModalOpen(false); setSelectedClass(null); }}
        classId={selectedClass?.id}
        onSuccess={fetchClasses}
      />
      <AddWorkoutClassModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={fetchClasses}
      />
    </div>
  );
};

export default ClassesPage;