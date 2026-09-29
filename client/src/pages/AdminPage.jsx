import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useToast } from '../context/ToastContext';
import { TableSkeleton, CardSkeleton } from '../components/Skeleton';
import {
  ShieldCheck,
  Users,
  FileText,
  Sparkles,
  TrendingUp,
  Trash2,
  Layers,
  Briefcase,
  AlertCircle,
  Calendar,
} from 'lucide-react';

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const { success, error } = useToast();

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        adminService.getAdminStats(),
        adminService.getAllUsers(),
      ]);
      setStats(statsRes);
      setUsers(usersRes.users || []);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to load administrative analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (id, email) => {
    if (!window.confirm(`Permanently remove user "${email}" and all associated documents?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await adminService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      success(`User ${email} removed.`);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <TableSkeleton rows={5} />
      </div>
    );
  }

  const { stats: metrics, commonSkills, topRoles } = stats || {
    stats: {},
    commonSkills: [],
    topRoles: [],
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Administrative Governance Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Platform Analytics & User Moderation
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global metrics, skills intelligence, and account administration.
          </p>
        </div>
      </div>

      {/* Admin KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Users</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-3">{metrics?.totalUsers || 0}</div>
          <span className="text-[11px] text-slate-500">Registered accounts</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Resumes</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-3">{metrics?.totalResumes || 0}</div>
          <span className="text-[11px] text-slate-500">Stored in Cloudinary/DB</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Analyses</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-3">{metrics?.totalAnalyses || 0}</div>
          <span className="text-[11px] text-slate-500">AI Evaluations executed</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase">Platform Avg ATS</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-3">{metrics?.averagePlatformAts || 0}%</div>
          <span className="text-[11px] text-slate-500">Readiness benchmark</span>
        </div>
      </div>

      {/* Global Intelligence Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Frequent Skills Across System */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Most In-Demand Skills (Platform Wide)</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {commonSkills.map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-medium flex items-center gap-2"
              >
                <span>{item.name}</span>
                <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                  {item.count}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Most Analyzed Roles */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <span>Most Analyzed Target Roles</span>
          </h2>
          <ul className="space-y-2 text-xs">
            {topRoles.map((role, idx) => (
              <li
                key={idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
              >
                <span className="font-semibold text-white truncate max-w-xs">{role.name}</span>
                <span className="text-slate-400 font-mono">{role.count} comparison(s)</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Registered Users Table */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-md">
        <h2 className="text-base font-bold text-white mb-4">User Accounts & Resource Footprint</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold text-center">Role</th>
                <th className="pb-3 font-semibold text-center">Resumes</th>
                <th className="pb-3 font-semibold text-center">Analyses</th>
                <th className="pb-3 font-semibold text-right">Joined</th>
                <th className="pb-3 font-semibold text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 font-bold text-white">{u.name}</td>
                  <td className="py-3 text-slate-300 font-mono text-[11px]">{u.email}</td>
                  <td className="py-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-center text-slate-300">{u.resumesCount || 0}</td>
                  <td className="py-3 text-center text-slate-300">{u.analysesCount || 0}</td>
                  <td className="py-3 text-right text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(u._id, u.email)}
                        disabled={deletingId === u._id}
                        className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
