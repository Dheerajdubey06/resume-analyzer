import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { analysisService } from '../services/analysisService';
import { generatePdfReport } from '../services/reportService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ScoreGauge from '../components/ScoreGauge';
import { CardSkeleton } from '../components/Skeleton';
import {
  Sparkles,
  Download,
  FileText,
  Briefcase,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
  HelpCircle,
  TrendingUp,
  Award,
  Layers,
  Calendar,
  Share2,
  Check,
} from 'lucide-react';

const AnalysisResultPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState(0);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const res = await analysisService.getAnalysisById(id);
        setAnalysis(res.analysis);
      } catch (err) {
        error(err.response?.data?.message || 'Failed to load analysis report.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnalysis();
    }
  }, [id]);

  const handleDownloadPdf = () => {
    if (!analysis) return;
    try {
      setGeneratingPdf(true);
      generatePdfReport(analysis, user);
      success('Professional PDF report generated and downloaded!');
    } catch (err) {
      console.error('PDF export error:', err);
      error('Failed to generate PDF report.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <CardSkeleton />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-white font-bold">Analysis record not found.</p>
        <Link to="/analysis" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
          Run New Analysis
        </Link>
      </div>
    );
  }

  const atsBreakdownItems = [
    { label: 'Keyword Relevance', value: analysis.atsBreakdown?.keywordRelevance || 0 },
    { label: 'Skills Match', value: analysis.atsBreakdown?.skillsMatch || 0 },
    { label: 'Experience Relevance', value: analysis.atsBreakdown?.experienceRelevance || 0 },
    { label: 'Education Relevance', value: analysis.atsBreakdown?.educationRelevance || 0 },
    { label: 'ATS Formatting', value: analysis.atsBreakdown?.formatting || 0 },
    { label: 'Section Completeness', value: analysis.atsBreakdown?.sectionCompleteness || 0 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner & Report Action Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              Verified Analysis
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(analysis.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {analysis.jobDescription?.title || 'Target Job Role'}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Building className="w-3.5 h-3.5 text-indigo-400" />
              <span>{analysis.jobDescription?.company || 'Company'}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>{analysis.resume?.originalName || 'Candidate Resume'}</span>
            </div>
          </div>
        </div>

        {/* Download PDF Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleDownloadPdf}
            disabled={generatingPdf}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{generatingPdf ? 'Generating PDF...' : 'Download PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* Main Scorecards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Match Circular Gauge */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col items-center justify-center text-center shadow-lg">
          <ScoreGauge
            score={analysis.overallScore || 0}
            size={160}
            strokeWidth={12}
            label="Overall Match Index"
            subtitle="Composite AI Alignment"
          />
        </div>

        {/* ATS Readiness Score */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col items-center justify-center text-center shadow-lg">
          <ScoreGauge
            score={analysis.atsScore || 0}
            size={160}
            strokeWidth={12}
            label="ATS Readiness Score"
            subtitle="Parser & Filter Pass Rate"
          />
        </div>

        {/* Job Match Score */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col items-center justify-center text-center shadow-lg">
          <ScoreGauge
            score={analysis.jobMatchScore || 0}
            size={160}
            strokeWidth={12}
            label="Requirement Alignment"
            subtitle="Direct Skill Overlap"
          />
        </div>
      </div>

      {/* Executive Summary */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4" />
          <span>Executive AI Summary</span>
        </div>
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
          {analysis.summary}
        </p>
      </div>

      {/* ATS Detailed Breakdown Bars */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-white">ATS Algorithm Diagnostic Breakdown</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Specific dimensions evaluated by automated Applicant Tracking Systems
            </p>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:block">
            *AI-generated estimation based on standard ATS heuristics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {atsBreakdownItems.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">{item.label}</span>
                <span className="font-bold text-indigo-400">{item.value}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    item.value >= 75
                      ? 'bg-emerald-500'
                      : item.value >= 50
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Gap Analysis: Matched vs Missing vs Recommended */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Matched Skills */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Matched Skills</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {(analysis.matchedSkills || []).length} Verified
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(analysis.matchedSkills || []).map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Missing Critical Skills</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {(analysis.missingSkills || []).length} Missing
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(analysis.missingSkills || []).length > 0 ? (
              (analysis.missingSkills || []).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-400">All required keywords and skills detected!</p>
            )}
          </div>
        </div>

        {/* Recommended Skills */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Recommended Additions</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              High ROI
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(analysis.recommendedSkills || []).map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Key Strengths & Differentiators</span>
          </h3>
          <ul className="space-y-3">
            {(analysis.strengths || []).map((str, idx) => (
              <li
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Identified Vulnerabilities</span>
          </h3>
          <ul className="space-y-3">
            {(analysis.weaknesses || []).map((weak, idx) => (
              <li
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold">!</span>
                </div>
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Improvement Suggestions */}
      {analysis.improvementSuggestions && analysis.improvementSuggestions.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4" />
              <span>AI Resume Bullet Enhancements</span>
            </div>
            <h2 className="text-lg font-bold text-white">Actionable Phrasing & Quantification</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Transform passive duty descriptions into high-performing bullet points that capture recruiter attention.
            </p>
          </div>

          <div className="space-y-4">
            {analysis.improvementSuggestions.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                    Section: {item.section}
                  </span>
                  <span className="text-slate-400 text-[11px] font-medium">Suggestion #{idx + 1}</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Original Phrasing:</span>
                    <p className="italic">"{item.original}"</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200">
                    <span className="text-emerald-400 block text-[10px] uppercase font-bold mb-1">AI-Optimized High-Impact Version:</span>
                    <p className="font-medium">"{item.improved}"</p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 italic">
                  <strong>Why this helps:</strong> {item.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keyword Analysis Table */}
      {analysis.keywordAnalysis && analysis.keywordAnalysis.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div>
            <h2 className="text-base font-bold text-white">Target Keyword Density & Presence</h2>
            <p className="text-xs text-slate-400 mt-0.5">Specific keywords extracted from the requisition and verified in your resume</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="pb-3 font-semibold">Keyword</th>
                  <th className="pb-3 font-semibold text-center">Status</th>
                  <th className="pb-3 font-semibold text-center">Importance</th>
                  <th className="pb-3 font-semibold">Context / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {analysis.keywordAnalysis.map((kw, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 font-bold text-white">{kw.keyword}</td>
                    <td className="py-3 text-center">
                      {kw.foundInResume ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Check className="w-3 h-3" /> Found
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Missing
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                        {kw.importance || 'Medium'}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{kw.context}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interview Preparation Accordion */}
      {analysis.interviewQuestions && analysis.interviewQuestions.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                <HelpCircle className="w-4 h-4" />
                <span>Targeted Interview Questions</span>
              </div>
              <h2 className="text-lg font-bold text-white">Anticipate Recruiter & Technical Screening</h2>
              <p className="text-xs text-slate-400 mt-0.5">Questions tailored specifically to your background and the position requirements.</p>
            </div>
          </div>

          <div className="space-y-3">
            {analysis.interviewQuestions.map((q, idx) => {
              const isExpanded = expandedQuestion === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-950/60 border border-slate-800/80 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 pr-4">
                      <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 mr-2">
                          {q.category || 'Technical'}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-white">
                          {q.question}
                        </span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 space-y-3 text-xs border-t border-slate-800/60 bg-slate-900/30 animate-fade-in">
                      {q.suggestedAnswer && (
                        <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-200">
                          <strong className="block text-indigo-400 text-[10px] uppercase tracking-wider mb-1">
                            Strategic Talking Points & Guidance:
                          </strong>
                          <p className="leading-relaxed">{q.suggestedAnswer}</p>
                        </div>
                      )}
                      {q.reason && (
                        <div className="text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-300">Why recruiters ask this:</span> {q.reason}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResultPage;
