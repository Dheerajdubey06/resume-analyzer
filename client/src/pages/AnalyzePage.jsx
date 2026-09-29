import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { resumeService } from '../services/resumeService';
import { jobService } from '../services/jobService';
import { analysisService } from '../services/analysisService';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  FileText,
  Briefcase,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Cpu,
  Layers,
  Database,
  Building,
} from 'lucide-react';

const AnalyzePage = () => {
  const [searchParams] = useSearchParams();
  const preSelectedResumeId = searchParams.get('resumeId') || '';
  const preSelectedJobId = searchParams.get('jobId') || '';

  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(preSelectedResumeId);
  const [selectedJobId, setSelectedJobId] = useState(preSelectedJobId);

  // Or manual inputs
  const [jobMode, setJobMode] = useState('existing'); // 'existing' | 'manual'
  const [manualTitle, setManualTitle] = useState('');
  const [manualCompany, setManualCompany] = useState('');
  const [manualDescription, setManualDescription] = useState('');

  // Analysis Loading State
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const { success, error } = useToast();
  const navigate = useNavigate();

  const loadingSteps = [
    'Parsing resume structure and candidate history...',
    'Extracting core competencies and technical skills...',
    'Comparing qualifications against target job requirements...',
    'Evaluating ATS compliance and keyword relevance...',
    'Generating AI bullet improvements and interview questions...',
    'Compiling final career intelligence report...',
  ];

  // Fetch user resumes and jobs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rRes, jRes] = await Promise.all([
          resumeService.getResumes(),
          jobService.getJobs(),
        ]);
        setResumes(rRes.resumes || []);
        setJobs(jRes.jobs || []);

        if (rRes.resumes?.length > 0 && !selectedResumeId) {
          setSelectedResumeId(rRes.resumes[0]._id);
        }
        if (jRes.jobs?.length > 0 && !selectedJobId) {
          setSelectedJobId(jRes.jobs[0]._id);
        } else if (!jRes.jobs?.length) {
          setJobMode('manual');
        }
      } catch (err) {
        console.error('Error loading resources for analysis', err);
      }
    };

    fetchData();
  }, [preSelectedResumeId, preSelectedJobId]);

  // Animated step ticker while analyzing
  useEffect(() => {
    let interval;
    if (analyzing) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 1600);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [analyzing, loadingSteps.length]);

  const handleRunAnalysis = async (e) => {
    e.preventDefault();

    if (!selectedResumeId) {
      error('Please select an uploaded resume to analyze.');
      return;
    }

    if (jobMode === 'existing' && !selectedJobId) {
      error('Please select a target job posting.');
      return;
    }

    if (jobMode === 'manual' && (!manualTitle || !manualDescription)) {
      error('Please provide both Job Title and Description.');
      return;
    }

    try {
      setAnalyzing(true);

      const payload = {
        resumeId: selectedResumeId,
        ...(jobMode === 'existing'
          ? { jobDescriptionId: selectedJobId }
          : {
              jobTitle: manualTitle,
              company: manualCompany || 'Target Employer',
              jobText: manualDescription,
            }),
      };

      const res = await analysisService.createAnalysis(payload);
      success('AI analysis successfully generated!');
      navigate(`/analysis/${res.analysis._id}`);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to complete analysis. Please try again.');
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>Interactive AI Studio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Analyze Resume vs Job Description
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Select a resume, pair it with a target role, and let our AI engine compute ATS scores, skill gaps, and interview prep.
        </p>
      </div>

      {analyzing ? (
        /* Animated High-Tech Loading State */
        <div className="p-12 sm:p-16 rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-cyan-500/10 to-transparent pointer-events-none animate-pulse-slow" />

          {/* Central Rotating Icon */}
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 animate-pulse">
              <Cpu className="w-12 h-12 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div className="absolute -inset-2 border-2 border-indigo-500/30 rounded-3xl animate-ping" />
          </div>

          <div className="space-y-3 max-w-md">
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              AI Evaluation in Progress
            </h3>
            <div className="h-6">
              <p className="text-sm font-medium text-cyan-300 animate-fade-in transition-all">
                {loadingSteps[loadingStep]}
              </p>
            </div>
            <p className="text-xs text-slate-400">
              Examining semantic patterns, keyword saturation, and ATS rule sets. This usually takes just a few seconds.
            </p>
          </div>

          <div className="w-full max-w-xs h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 rounded-full animate-pulse w-full" />
          </div>
        </div>
      ) : (
        /* Analysis Configuration Form */
        <form onSubmit={handleRunAnalysis} className="space-y-6">
          {/* Step 1: Select Resume */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Select Candidate Resume</h2>
                  <p className="text-xs text-slate-400">Choose the document you want evaluated</p>
                </div>
              </div>
              <Link
                to="/resumes/upload"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>Upload New</span>
                <UploadCloud className="w-3.5 h-3.5" />
              </Link>
            </div>

            {resumes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {resumes.map((r) => {
                  const isSelected = selectedResumeId === r._id;
                  return (
                    <div
                      key={r._id}
                      onClick={() => setSelectedResumeId(r._id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">{r.originalName}</div>
                          <div className="text-[10px] text-slate-400">
                            {r.parsedData?.skills?.length || 0} skills detected
                          </div>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-950/50 border border-slate-800 text-center space-y-3">
                <p className="text-xs text-slate-400">No resumes found in your workspace.</p>
                <Link
                  to="/resumes/upload"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Resume First</span>
                </Link>
              </div>
            )}
          </div>

          {/* Step 2: Target Job Description */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Target Job Requisition</h2>
                  <p className="text-xs text-slate-400">Specify requirements to calculate match alignment</p>
                </div>
              </div>

              {/* Mode switch pills */}
              <div className="flex rounded-xl bg-slate-950/80 p-1 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setJobMode('existing')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    jobMode === 'existing'
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Saved Targets ({jobs.length})
                </button>
                <button
                  type="button"
                  onClick={() => setJobMode('manual')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    jobMode === 'manual'
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Paste New Description
                </button>
              </div>
            </div>

            {jobMode === 'existing' ? (
              jobs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {jobs.map((j) => {
                    const isSelected = selectedJobId === j._id;
                    return (
                      <div
                        key={j._id}
                        onClick={() => setSelectedJobId(j._id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-cyan-600/15 border-cyan-500 text-white shadow-md shadow-cyan-600/20'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Briefcase className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                          <div className="min-w-0">
                            <div className="text-xs font-bold truncate">{j.title}</div>
                            <div className="text-[10px] text-slate-400">{j.company}</div>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-950/50 border border-slate-800 text-center space-y-2">
                  <p className="text-xs text-slate-400">No saved jobs. Switch to "Paste New Description".</p>
                  <button
                    type="button"
                    onClick={() => setJobMode('manual')}
                    className="text-xs font-semibold text-cyan-400 underline"
                  >
                    Paste description now
                  </button>
                </div>
              )
            ) : (
              /* Manual paste form */
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={manualTitle}
                      onChange={(e) => setManualTitle(e.target.value)}
                      placeholder="e.g. Senior Frontend Engineer"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white focus:border-cyan-500 outline-none"
                      required={jobMode === 'manual'}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={manualCompany}
                      onChange={(e) => setManualCompany(e.target.value)}
                      placeholder="e.g. Stripe / Meta / Startup"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white focus:border-cyan-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                    Job Description *
                  </label>
                  <textarea
                    rows={6}
                    value={manualDescription}
                    onChange={(e) => setManualDescription(e.target.value)}
                    placeholder="Paste job posting details, qualifications, and requirements here..."
                    className="w-full p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white focus:border-cyan-500 outline-none leading-relaxed"
                    required={jobMode === 'manual'}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Trigger */}
          <div className="flex items-center justify-between p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 to-cyan-950/40 border border-slate-800 shadow-xl">
            <div className="text-xs text-slate-300">
              Ready to cross-evaluate resume text against target competencies.
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Analyze Resume with AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AnalyzePage;
