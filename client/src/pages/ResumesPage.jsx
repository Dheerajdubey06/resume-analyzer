import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resumeService } from '../services/resumeService';
import { useToast } from '../context/ToastContext';
import { CardSkeleton } from '../components/Skeleton';
import {
  FileText,
  UploadCloud,
  Sparkles,
  Trash2,
  Download,
  ExternalLink,
  Eye,
  Calendar,
  Layers,
  CheckCircle2,
  X,
  Search,
} from 'lucide-react';

const ResumesPage = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { success, error } = useToast();
  const navigate = useNavigate();

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await resumeService.getResumes();
      setResumes(res.resumes || []);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to fetch resumes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" and all related analyses?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await resumeService.deleteResume(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
      if (selectedResume?._id === id) {
        setSelectedResume(null);
      }
      success('Resume deleted successfully.');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete resume.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredResumes = resumes.filter((r) =>
    r.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            My Uploaded Resumes
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your parsed documents, review extracted entities, and initiate job matches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/resumes/upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Resume</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search resumes by file name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Showing <span className="text-white font-semibold">{filteredResumes.length}</span> resume(s)
        </div>
      </div>

      {/* Resumes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredResumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => {
            const ext = resume.fileType?.toUpperCase() || 'PDF';
            const sizeInKb = Math.round((resume.fileSize || 0) / 1024);

            return (
              <div
                key={resume._id}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                          {ext}
                        </span>
                        <span className="ml-2 text-[11px] text-slate-400">{sizeInKb} KB</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      {resume.analysisCount || 0} analyses
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white truncate title={resume.originalName}">
                    {resume.originalName}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Uploaded {new Date(resume.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Skills Tag Preview */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Extracted Skills ({resume.parsedData?.skills?.length || 0})
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-16 overflow-hidden">
                      {(resume.parsedData?.skills || []).slice(0, 5).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/80"
                        >
                          {skill}
                        </span>
                      ))}
                      {(resume.parsedData?.skills?.length || 0) > 5 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-slate-500">
                          +{resume.parsedData.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedResume(resume)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Inspect Parsed Entities"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {resume.cloudinaryUrl && (
                      <a
                        href={resume.cloudinaryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Download / View Original File"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(resume._id, resume.originalName)}
                      disabled={deletingId === resume._id}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <Link
                    to={`/analysis?resumeId=${resume._id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Analyze</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No resumes uploaded yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Upload your first resume in PDF, DOC, or DOCX format to trigger automated text extraction and skill categorization.
          </p>
          <Link
            to="/resumes/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Resume</span>
          </Link>
        </div>
      )}

      {/* Parsed Details Inspection Modal */}
      {selectedResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedResume.originalName}</h3>
                  <p className="text-xs text-slate-400">Parsed Candidate Entities</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedResume(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Name</span>
                  <span className="font-semibold text-white">{selectedResume.parsedData?.name || 'Not detected'}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Email</span>
                  <span className="font-semibold text-white">{selectedResume.parsedData?.email || 'Not detected'}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Detected Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedResume.parsedData?.skills || []).map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Extracted Summary</h4>
                <p className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 leading-relaxed text-slate-300">
                  {selectedResume.parsedData?.summary || 'No professional summary section parsed.'}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Extracted Text Preview</h4>
                <pre className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {selectedResume.extractedText || 'No text extracted.'}
                </pre>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <button
                onClick={() => setSelectedResume(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Close
              </button>
              <Link
                to={`/analysis?resumeId=${selectedResume._id}`}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Launch Analysis</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumesPage;
