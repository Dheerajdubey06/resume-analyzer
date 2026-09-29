import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { resumeService } from '../services/resumeService';
import { useToast } from '../context/ToastContext';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  X,
  FileCheck2,
  Sparkles,
  Shield,
} from 'lucide-react';

const ResumeUploadPage = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef(null);
  const { success, error } = useToast();
  const navigate = useNavigate();

  const allowedExtensions = ['pdf', 'doc', 'docx'];
  const maxSizeBytes = 10 * 1024 * 1024; // 10MB

  const validateAndSetFile = (selectedFile) => {
    setErrorMsg('');
    if (!selectedFile) return;

    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setErrorMsg('Invalid file format. Please upload a PDF, DOC, or DOCX document.');
      return;
    }

    if (selectedFile.size > maxSizeBytes) {
      setErrorMsg('File exceeds 10MB limit. Please upload a smaller file.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setProgress(10);

      const res = await resumeService.uploadResume(file, (percent) => {
        setProgress(Math.max(10, Math.min(percent, 95)));
      });

      setProgress(100);
      setUploadedResume(res.resume);
      success('Resume uploaded, stored in Cloudinary, and parsed successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to upload and parse resume.';
      setErrorMsg(msg);
      error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Upload Candidate Resume
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload your resume file. We'll store it securely and automatically extract skills, experience, and contact details.
        </p>
      </div>

      {/* Main Upload Card */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl">
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-xs font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!uploadedResume ? (
          <div>
            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
                  : 'border-slate-700/80 bg-slate-950/50 hover:border-slate-600 hover:bg-slate-950/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>

              <p className="text-sm font-bold text-white mb-1">
                Drag and drop your resume file here
              </p>
              <p className="text-xs text-slate-400 mb-4">
                or <span className="text-indigo-400 font-semibold underline">browse from your computer</span>
              </p>

              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono">PDF</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono">DOC</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono">DOCX</span>
                <span>• Max 10MB</span>
              </div>
            </div>

            {/* Selected File Details */}
            {file && (
              <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                      {file.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {Math.round(file.size / 1024)} KB • Ready for extraction
                    </div>
                  </div>
                </div>

                {!uploading && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Progress bar */}
            {uploading && (
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Uploading to Cloudinary & parsing text...</span>
                  <span className="font-semibold text-indigo-400">{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Upload Action */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <Link
                to="/resumes"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </Link>
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Resume...</span>
                  </>
                ) : (
                  <>
                    <span>Upload & Parse Resume</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Upload & Extraction Complete!</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                <strong className="text-slate-200">{uploadedResume.originalName}</strong> was parsed. We identified {uploadedResume.parsedData?.skills?.length || 0} core technical skills.
              </p>
            </div>

            {/* Extracted Skills Preview */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-left">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Parsed Skills Preview
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(uploadedResume.parsedData?.skills || []).map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={`/analysis?resumeId=${uploadedResume._id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Compare Against a Job Description</span>
              </Link>
              <Link
                to="/resumes"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                View in Resumes
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Security Note */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-center gap-3 text-xs text-slate-400">
        <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>
          Files are stored with end-to-end encryption in Cloudinary raw buckets. Your sensitive contact information and documents are never shared publicly.
        </span>
      </div>
    </div>
  );
};

export default ResumeUploadPage;
