import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { useToast } from '../context/ToastContext';
import { Briefcase, Building, Upload, FileText, ArrowRight, Sparkles } from 'lucide-react';

const JobCreatePage = () => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Mid Level');
  const [jobFile, setJobFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setJobFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !company) {
      error('Please provide at least a Job Title and Company name.');
      return;
    }

    if (!description && !jobFile) {
      error('Please either paste the job description or upload a document.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('company', company);
      formData.append('description', description);
      formData.append('experienceLevel', experienceLevel);
      if (skills) {
        formData.append('requiredSkills', skills);
      }
      if (jobFile) {
        formData.append('jobFile', jobFile);
      }

      const res = await jobService.createJob(formData);
      success('Job target saved successfully!');
      navigate(`/analysis?jobId=${res.job._id}`);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save job description.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Create Target Job Description
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Paste the employer requisition or upload the job document to evaluate alignment with your resumes.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Job Title *
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Company Name *
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google / Stripe / Startup"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Seniority Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
              >
                <option value="Entry Level / Intern">Entry Level / Intern</option>
                <option value="Junior Level">Junior Level (1-2 yrs)</option>
                <option value="Mid Level">Mid Level (3-5 yrs)</option>
                <option value="Senior Level">Senior Level (5+ yrs)</option>
                <option value="Staff / Lead / Principal">Staff / Lead / Principal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Key Skills (Optional, comma-separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Node.js, AWS, Docker"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Option 1: Paste text */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Job Description Content *
            </label>
            <textarea
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste the full job posting requirements, responsibilities, and qualifications here..."
              className="w-full p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 outline-none leading-relaxed"
            />
          </div>

          {/* Option 2: Upload document */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Or Upload Job Requisition Document (PDF / DOCX)
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors">
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                <span>Choose Document</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {jobFile && (
                <span className="text-xs text-indigo-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  {jobFile.name}
                </span>
              )}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <Link
              to="/jobs"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                'Processing Job...'
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Save & Proceed to Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobCreatePage;
