import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Target,
  Zap,
  TrendingUp,
  BarChart3,
  Search,
  Brain,
  ShieldCheck,
  Briefcase,
  Layers,
  ChevronRight,
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Sparkles,
      title: 'AI Resume Analysis',
      description: 'Powered by advanced AI models to dissect every sentence, project, and bullet point with recruiter-grade precision.',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: Target,
      title: 'ATS Score Verification',
      description: 'Simulates Applicant Tracking Systems to calculate realistic pass rates before your resume reaches a human recruiter.',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      icon: Briefcase,
      title: 'Job Requirement Matching',
      description: 'Cross-references your resume against any target job description to compute detailed semantic and technical alignment.',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: Search,
      title: 'Skill Gap Detection',
      description: 'Instantly identifies missing frameworks, tools, and methodologies required by the employer to bridge qualification gaps.',
      color: 'from-violet-500 to-violet-600',
    },
    {
      icon: Zap,
      title: 'AI Bullet Rewriter',
      description: 'Generates quantified, high-impact bullet points using strong action verbs to transform mundane duties into achievements.',
      color: 'from-amber-500 to-amber-600',
    },
    {
      icon: Brain,
      title: 'Custom Interview Prep',
      description: 'Generates tailored technical, behavioral, and project-based interview questions with strategic talking points.',
      color: 'from-rose-500 to-rose-600',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Upload Your Resume',
      description: 'Upload your resume in PDF, DOC, or DOCX format. Our parser extracts skills, education, and work history automatically.',
    },
    {
      number: '02',
      title: 'Paste Job Description',
      description: 'Paste the target job description or upload the requisition document for the position you want to land.',
    },
    {
      number: '03',
      title: 'Run AI Scanner',
      description: 'Our AI and ATS algorithms evaluate keyword density, skills overlap, quantifiable impact, and formatting hygiene.',
    },
    {
      number: '04',
      title: 'Get Insights & PDF Report',
      description: 'Receive an actionable scorecard, rewritten bullet points, interview preparation questions, and downloadable PDF report.',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -top-20 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8 animate-fade-in shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>Next-Generation Career Intelligence & ATS Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          Turn Your Resume Into Your{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
            Career Advantage
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Analyze your resume with AI, compare it against job descriptions, discover missing skills, and boost your ATS score to get noticed by top employers.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={isAuthenticated ? '/analysis' : '/register'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-base shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
          >
            <span>Analyze My Resume</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-base transition-all"
          >
            <span>{isAuthenticated ? 'Open Dashboard' : 'Explore Platform'}</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>98% ATS Format Compatibility</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Cloudinary Secure File Storage</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Instant PDF Executive Report</span>
          </div>
        </div>

        {/* Interactive Dashboard Mockup Preview */}
        <div id="preview" className="mt-16 sm:mt-20 relative max-w-5xl mx-auto">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-100 transition duration-1000 -z-10" />

          <div className="relative rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl p-4 sm:p-6 overflow-hidden text-left">
            {/* Top Mock Window Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] text-slate-400">resumeai.app/analysis/demo</span>
              </div>
              <div className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[10px]">
                ATS Score: 88/100
              </div>
            </div>

            {/* Mock Dashboard Body */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              {/* Score Card */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-center text-center">
                <div className="text-4xl font-extrabold text-indigo-400 mb-1">88%</div>
                <div className="text-xs font-semibold text-slate-200">Overall Match Score</div>
                <div className="text-[11px] text-emerald-400 mt-1">High Recruiter Alignment</div>
              </div>

              {/* Matched Skills */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-xs font-semibold text-slate-200 mb-2.5 flex items-center justify-between">
                  <span>Matched Skills</span>
                  <span className="text-emerald-400 text-[11px]">8 Found</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Docker', 'REST API'].map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-xs font-semibold text-slate-200 mb-2.5 flex items-center justify-between">
                  <span>Missing High Priority</span>
                  <span className="text-rose-400 text-[11px]">Skill Gap</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['Kubernetes', 'GraphQL', 'Terraform'].map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Mock Recommendation Banner */}
            <div className="mt-4 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              <div className="text-xs text-indigo-200">
                <strong className="text-white">AI Suggestion:</strong> Add metrics to your Node.js experience bullet point (e.g. "Decreased API latency by 42%") to push your ATS score into the 95th percentile.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3">
              Engineered for Maximum Impact
            </h2>
            <p className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Every tool you need to land interviews faster
            </p>
            <p className="mt-4 text-slate-400 text-base">
              ResumeAI uses automated semantic matching and natural language processing to bridge the gap between your achievements and recruiter requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-850/80 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3">
            Streamlined 4-Step Process
          </h2>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            How ResumeAI Works
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 relative flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-extrabold text-indigo-500/40 font-mono mb-4 block">
                  {step.number}
                </span>
                <h3 className="text-lg font-bold text-white mb-2.5">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-1.5 text-xs font-medium text-indigo-400">
                <span>Step {idx + 1} of 4</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing / Demo Section */}
      <section id="pricing" className="py-20 bg-slate-900/30 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3">
            Completely Free & Open for Engineers
          </h2>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Zero Barriers. Unlimited Analyses.
          </p>
          <p className="text-slate-400 text-base max-w-xl mx-auto mb-10">
            No credit card required. Upload your resumes, run as many job comparisons as needed, and download professional PDF reports immediately.
          </p>

          <div className="p-8 rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <div className="text-2xl font-bold text-white">Full-Stack Pro Access</div>
                <div className="text-slate-400 text-sm mt-1">Everything you need to optimize your career applications.</div>
                <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-300 font-medium">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited AI Analyses</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cloudinary File Storage</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> PDF Reports</span>
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-end">
                <div className="text-4xl font-extrabold text-white">$0 <span className="text-sm font-normal text-slate-400">/ forever</span></div>
                <Link
                  to={isAuthenticated ? '/analysis' : '/register'}
                  className="mt-4 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Start Analyzing Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Ready to improve your resume?
        </h2>
        <p className="mt-4 text-slate-300 text-base max-w-xl mx-auto">
          Join thousands of developers and professionals who use ResumeAI to beat the ATS and secure top engineering interviews.
        </p>
        <div className="mt-8">
          <Link
            to={isAuthenticated ? '/analysis' : '/register'}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-base shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
          >
            <span>Analyze My Resume</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
