import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analysisService } from '../services/analysisService';
import { CardSkeleton, TableSkeleton } from '../components/Skeleton';
import {
  FileText,
  Sparkles,
  TrendingUp,
  Award,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  Database,
  Briefcase,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await analysisService.getDashboardStats();
        setData(res);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <TableSkeleton rows={4} />
        </div>
      </div>
    );
  }

  const { stats, charts, recentAnalyses } = data || {
    stats: { totalResumes: 0, totalAnalyses: 0, averageAtsScore: 0, bestMatchScore: 0 },
    charts: { atsHistory: [], topSkills: [] },
    recentAnalyses: [],
  };

  const statCards = [
    {
      title: 'Total Resumes',
      value: stats.totalResumes || 0,
      subtext: 'Parsed & secured',
      icon: FileText,
      gradient: 'from-indigo-600 to-indigo-800',
      iconColor: 'text-indigo-400',
      link: '/resumes',
    },
    {
      title: 'Total Analyses',
      value: stats.totalAnalyses || 0,
      subtext: 'Evaluated with AI',
      icon: Sparkles,
      gradient: 'from-cyan-600 to-cyan-800',
      iconColor: 'text-cyan-400',
      link: '/history',
    },
    {
      title: 'Average ATS Score',
      value: stats.averageAtsScore ? `${stats.averageAtsScore}%` : 'N/A',
      subtext: stats.averageAtsScore >= 75 ? 'Optimal benchmark' : 'Requires improvement',
      icon: TrendingUp,
      gradient: 'from-emerald-600 to-emerald-800',
      iconColor: 'text-emerald-400',
      link: '/analysis',
    },
    {
      title: 'Best Match Score',
      value: stats.bestMatchScore ? `${stats.bestMatchScore}%` : 'N/A',
      subtext: 'Highest alignment role',
      icon: Award,
      gradient: 'from-amber-600 to-amber-800',
      iconColor: 'text-amber-400',
      link: '/jobs',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-cyan-950/60 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>AI Career Intelligence Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Optimize Your Engineering Resumes
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Target high-impact roles, identify missing tech stacks, and verify ATS compatibility before submitting your job applications.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/analysis"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>New AI Analysis</span>
            </Link>
            <Link
              to="/resumes/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
            >
              <PlusCircle className="w-4 h-4 text-slate-400" />
              <span>Upload New Resume</span>
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-850/80 transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl bg-slate-800/80 ${card.iconColor} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold text-white tracking-tight">
                  {card.value}
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                  <span>{card.subtext}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ATS Score Trend Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white">ATS Score Progression</h2>
              <p className="text-xs text-slate-400 mt-0.5">Chronological score history across recent applications</p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
              Trend
            </span>
          </div>

          <div className="h-64 w-full">
            {charts.atsHistory && charts.atsHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.atsHistory}>
                  <defs>
                    <linearGradient id="colorAts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorMatch" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="atsScore"
                    name="ATS Score"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorAts)"
                  />
                  <Area
                    type="monotone"
                    dataKey="matchScore"
                    name="Job Match"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorMatch)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs gap-2">
                <BarChart3 className="w-8 h-8 text-slate-700" />
                <p>Run your first analysis to see historical score trends.</p>
              </div>
            )}
          </div>
        </div>

        {/* Most Frequent Matched Skills */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white">Top Matched Skills</h2>
              <p className="text-xs text-slate-400 mt-0.5">Most recognized competencies across job descriptions</p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              Skills
            </span>
          </div>

          <div className="h-64 w-full">
            {charts.topSkills && charts.topSkills.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.topSkills}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" name="Frequency" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs gap-2">
                <Layers className="w-8 h-8 text-slate-700" />
                <p>Skill distribution will populate after analyzing resumes.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Analyses Table */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-white">Recent Analyses</h2>
            <p className="text-xs text-slate-400 mt-0.5">Your latest resume and target role evaluations</p>
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentAnalyses && recentAnalyses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="pb-3 font-semibold">Resume</th>
                  <th className="pb-3 font-semibold">Target Position</th>
                  <th className="pb-3 font-semibold">Company</th>
                  <th className="pb-3 font-semibold text-center">ATS Score</th>
                  <th className="pb-3 font-semibold text-center">Match Score</th>
                  <th className="pb-3 font-semibold text-right">Date</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentAnalyses.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 font-medium text-white flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      <span className="truncate max-w-[160px]">{item.resumeName}</span>
                    </td>
                    <td className="py-3.5 text-slate-300 font-medium truncate max-w-[180px]">
                      {item.jobTitle}
                    </td>
                    <td className="py-3.5 text-slate-400">{item.company}</td>
                    <td className="py-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          item.atsScore >= 75
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : item.atsScore >= 50
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {item.atsScore}%
                      </span>
                    </td>
                    <td className="py-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          item.matchScore >= 75
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                            : item.matchScore >= 50
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.matchScore}%
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        to={`/analysis/${item._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/25 font-semibold text-xs transition-colors"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white">No analyses yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Upload a resume and job description to generate your first AI ATS report, or click "Load Sample Data" above to preview instantly.
            </p>
            <Link
              to="/analysis"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-md"
            >
              <span>Run First Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
