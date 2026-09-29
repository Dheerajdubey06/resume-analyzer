import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Github, Twitter, Linkedin, Heart, Shield, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Resume<span className="text-indigo-400">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
              Empowering job seekers and tech professionals with next-generation AI resume parsing, ATS scoring, and targeted career intelligence.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-slate-700 transition-colors"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-slate-700 transition-colors"
                aria-label="Twitter Profile"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-slate-700 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/analysis" className="hover:text-white transition-colors">
                  AI Resume Scanner
                </Link>
              </li>
              <li>
                <Link to="/resumes/upload" className="hover:text-white transition-colors">
                  ATS Score Checker
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  Job Matcher
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Career Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Client Portal
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Free Registration
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  Methodology
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Trust */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Privacy Policy</span>
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Terms of Service
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Security Architecture
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Contact Support
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ResumeAI Platform. Built with MERN Stack & OpenAI.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for Engineers & Career Seekers</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
