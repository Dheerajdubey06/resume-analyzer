import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { analysisService } from '../services/analysisService';
import {
  Menu,
  Sparkles,
  Database,
  Bell,
  Search,
  ExternalLink,
} from 'lucide-react';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [seedingDemo, setSeedingDemo] = useState(false);
  const { user } = useAuth();
  const { success, error } = useToast();
  const location = useLocation();

  const handleSeedDemo = async () => {
    try {
      setSeedingDemo(true);
      const res = await analysisService.seedDemoData();
      success('Sample resume, job target, and AI analysis loaded!');
      // Reload current page if on dashboard or history
      window.location.reload();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to seed sample demo data.');
    } finally {
      setSeedingDemo(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs font-medium text-slate-400">Workspace / </span>
              <span className="text-xs font-semibold text-slate-200">
                {user?.name ? `${user.name}'s Portal` : 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Seed Button */}
            <button
              onClick={handleSeedDemo}
              disabled={seedingDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/25 text-xs font-semibold transition-all"
              title="Instantly generate a realistic sample resume, job description, and full AI ATS analysis for live evaluation"
            >
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>{seedingDemo ? 'Loading Demo...' : 'Load Sample Data'}</span>
            </button>

            {/* Profile Avatar Quick Link */}
            <Link
              to="/profile"
              className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-xs font-bold text-white border border-indigo-400/30 overflow-hidden shadow-sm hover:scale-105 transition-transform"
            >
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                (user?.name ? user.name[0].toUpperCase() : 'U')
              )}
            </Link>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
