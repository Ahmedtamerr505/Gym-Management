import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 w-full relative">
        <div className="p-3 sm:p-4 lg:p-8 pt-16 sm:pt-20 lg:pt-8">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;