import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analysisService } from '../services/analysisService';
import { useToast } from '../context/ToastContext';
import { TableSkeleton } from '../components/Skeleton';
import {
  History,
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileText,
  Trash2,
  Eye,
  Calendar,
  Building,
} from 'lucide-react';

const HistoryPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [minScore, setMinScore] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [deletingId, setDeletingId] = useState(null);

  const { success, error } = useToast();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await analysisService.getAnalyses({
        page,
        limit: 10,
        search,
        minScore,
        sort,
      });
      setAnalyses(res.analyses || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to load analysis history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, minScore, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this analysis record permanently?')) return;

    try {
      setDeletingId(id);
      await analysisService.deleteAnalysis(id);
      setAnalyses((prev) => prev.filter((a) => a._id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      success('Analysis deleted.');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete record.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Analysis History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, and review historical ATS evaluations and skill comparisons.
          </p>
        </div>

        <Link
          to="/analysis"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>New Analysis</span>
        </Link>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resume, job, company..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 outline-none"
          />
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Min Score filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Min Score:</span>
            <select
              value={minScore}
              onChange={(e) => {
                setMinScore(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
            >
              <option value="">All Scores</option>
              <option value="80">80% and above</option>
              <option value="70">70% and above</option>
              <option value="60">60% and above</option>
              <option value="50">50% and above</option>
            </select>
          </div>

          {/* Sort order */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Sort:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="-atsScore">Highest ATS Score</option>
              <option value="-overallScore">Highest Match Score</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-md">
        {loading ? (
          <TableSkeleton rows={6} />
        ) : analyses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="pb-3 font-semibold">Resume Document</th>
                  <th className="pb-3 font-semibold">Target Position</th>
                  <th className="pb-3 font-semibold">Company</th>
                  <th className="pb-3 font-semibold text-center">ATS Score</th>
                  <th className="pb-3 font-semibold text-center">Match Score</th>
                  <th className="pb-3 font-semibold text-right">Date Analyzed</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {analyses.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 font-semibold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <span className="truncate max-w-[170px]">
                        {item.resume?.originalName || 'Untitled Resume'}
                      </span>
                    </td>
                    <td className="py-4 font-medium text-slate-300 truncate max-w-[180px]">
                      {item.jobDescription?.title || 'Unknown Position'}
                    </td>
                    <td className="py-4 text-slate-400">
                      {item.jobDescription?.company || 'Company'}
                    </td>
                    <td className="py-4 text-center">
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
                    <td className="py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          item.jobMatchScore >= 75
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                            : item.jobMatchScore >= 50
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.jobMatchScore}%
                      </span>
                    </td>
                    <td className="py-4 text-right text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/analysis/${item._id}`}
                          className="p-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 transition-colors"
                          title="View Full Report"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                          className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center">
              <History className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white">No historical analyses found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Run an analysis or try adjusting your search and filter criteria.
            </p>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              Page <span className="font-semibold text-white">{page}</span> of{' '}
              <span className="font-semibold text-white">{totalPages}</span> ({total} total)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
