import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { useToast } from '../context/ToastContext';
import { CardSkeleton } from '../components/Skeleton';
import {
  Briefcase,
  PlusCircle,
  Sparkles,
  Trash2,
  Calendar,
  Building,
  Layers,
  ChevronRight,
  Search,
} from 'lucide-react';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const { success, error } = useToast();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobService.getJobs();
      setJobs(res.jobs || []);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to fetch job descriptions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete job description for "${title}"?`)) return;

    try {
      setDeletingId(id);
      await jobService.deleteJob(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      success('Job description removed.');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete job description.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Target Job Descriptions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Store target positions, requisitions, and required skill profiles for matching.
          </p>
        </div>

        <Link
          to="/jobs/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Job Target</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title or company..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
        </div>
        <div className="text-xs text-slate-400">
          Total targets: <span className="font-semibold text-white">{filteredJobs.length}</span>
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    {job.experienceLevel || 'Mid Level'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-1" title={job.title}>
                  {job.title}
                </h3>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  <span>{job.company}</span>
                </div>

                <p className="mt-3 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>

                {/* Required Skills tags */}
                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Key Competencies
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {job.requiredSkills.slice(0, 4).map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                        >
                          {s}
                        </span>
                      ))}
                      {job.requiredSkills.length > 4 && (
                        <span className="text-[10px] text-slate-500 self-center">
                          +{job.requiredSkills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleDelete(job._id, job.title)}
                  disabled={deletingId === job._id}
                  className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Delete Target"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Link
                  to={`/analysis?jobId=${job._id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Match Against Resume</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No target job postings saved</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Add a target role description to calculate semantic overlap, skill gaps, and interview readiness.
          </p>
          <Link
            to="/jobs/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Job Description</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
