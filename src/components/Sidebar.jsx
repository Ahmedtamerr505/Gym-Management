import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  LayoutDashboard,
  Users,
  Menu,
  X,
  LogOut,
  Dumbbell,
  CalendarDays,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Members", path: "/dashboard/members", icon: Users },
    { name: "Trainers", path: "/dashboard/trainers", icon: Dumbbell },
    { name: "Classes", path: "/dashboard/classes", icon: CalendarDays },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Navbar */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800/50 h-14 sm:h-16 flex items-center px-4 shadow-md">
        <button
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors duration-200 text-slate-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* Sidebar Wrapper */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800/50 
        transform transition-all duration-300 ease-in-out shadow-2xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:inset-0 lg:shadow-none
      `}
      >
        <div className="flex flex-col h-full pt-14 sm:pt-16 lg:pt-0">
          {/* Header Section */}
          <div className="flex items-center justify-between px-4 py-6 lg:px-6 lg:py-8 border-b border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-600/20">
                <Dumbbell className="text-blue-400" size={20} />
              </div>

              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent truncate">
                GYM MASTER
              </h2>
            </div>
            <button
              className="lg:hidden p-1.5 hover:bg-slate-800/50 rounded-lg transition-colors duration-200"
              onClick={() => setIsOpen(false)}
              aria-label="Close navigation menu"
            >
              <X size={20} className="text-slate-400 hover:text-white" />
            </button>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 px-3 py-6 lg:px-4 lg:py-8 space-y-1.5 overflow-y-auto">
            {links.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={handleNavClick}
                  className={`
                    flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200
                    group relative overflow-hidden
                    ${
                      active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }
                  `}
                >
                  <Icon size={18} className="sm:size-5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base font-medium truncate">
                    {link.name}
                  </span>
                  {active && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full opacity-60" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer Section */}
          <div className="px-3 py-4 lg:px-4 lg:py-6 border-t border-slate-800/50">
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200
                text-red-400 hover:text-red-300 hover:bg-red-500/10
                font-medium text-xs sm:text-sm lg:text-base
              `}
              aria-label="Logout from dashboard"
            >
              <LogOut size={18} className="sm:size-5 flex-shrink-0" />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          role="presentation"
        />
      )}
    </>
  );
};

export default Sidebar;
