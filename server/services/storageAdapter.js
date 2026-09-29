const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * In-Memory Fallback Storage Engine
 * Activated automatically when MongoDB Atlas is not yet connected or offline.
 * Ensures the entire application functions flawlessly out of the box.
 */
class MemoryStorage {
  constructor() {
    this.users = [];
    this.resumes = [];
    this.jobs = [];
    this.analyses = [];

    // Pre-populate with default developer account
    this._initDefaultData();
  }

  async _initDefaultData() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('DemoPass123!', salt);

    const devUser = {
      _id: 'user_dev_6701a9b2c8e1',
      name: 'Alex Morgan',
      email: 'developer@resumeai.local',
      password: hashedPassword,
      role: 'admin',
      profileImage: '',
      phone: '(555) 234-5678',
      linkedin: 'linkedin.com/in/alexmorgan-dev',
      github: 'github.com/alexmorgan',
      portfolio: 'https://alexmorgan.dev',
      bio: 'Full-Stack Software Engineer with 4+ years of experience specializing in React, Node.js, and cloud systems.',
      createdAt: new Date(),
      updatedAt: new Date(),
      async matchPassword(pwd) {
        return await bcrypt.compare(pwd, this.password);
      },
      save() {
        return this;
      }
    };

    this.users.push(devUser);
  }

  isMongoConnected() {
    return mongoose.connection.readyState === 1;
  }

  // --- USERS ---
  async findUserByEmail(email, includePassword = false) {
    const u = this.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
    if (!u) return null;
    return {
      ...u,
      matchPassword: async (entered) => await bcrypt.compare(entered, u.password),
      save: async () => u,
    };
  }

  async findUserById(id) {
    const u = this.users.find((user) => user._id.toString() === id.toString());
    if (!u) return null;
    return {
      ...u,
      matchPassword: async (entered) => await bcrypt.compare(entered, u.password),
      save: async function () {
        return this;
      },
    };
  }

  async createUser({ name, email, password, role = 'user' }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      _id: 'user_' + Date.now() + Math.random().toString(36).substring(2, 7),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      profileImage: '',
      phone: '',
      linkedin: '',
      github: '',
      portfolio: '',
      bio: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      matchPassword: async (entered) => await bcrypt.compare(entered, hashedPassword),
      save: async function () {
        return this;
      },
    };

    this.users.push(newUser);
    return newUser;
  }

  async getAllUsers() {
    return this.users.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      resumesCount: this.resumes.filter((r) => r.user.toString() === u._id.toString()).length,
      analysesCount: this.analyses.filter((a) => a.user.toString() === u._id.toString()).length,
      createdAt: u.createdAt,
    }));
  }

  async deleteUser(id) {
    this.users = this.users.filter((u) => u._id.toString() !== id.toString());
    this.resumes = this.resumes.filter((r) => r.user.toString() !== id.toString());
    this.jobs = this.jobs.filter((j) => j.user.toString() !== id.toString());
    this.analyses = this.analyses.filter((a) => a.user.toString() !== id.toString());
  }

  // --- RESUMES ---
  async createResume(data) {
    const newResume = {
      _id: 'res_' + Date.now() + Math.random().toString(36).substring(2, 7),
      analysisCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    this.resumes.push(newResume);
    return newResume;
  }

  async getResumesByUser(userId) {
    return this.resumes
      .filter((r) => r.user.toString() === userId.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getResumeById(id, userId) {
    return this.resumes.find(
      (r) => r._id.toString() === id.toString() && (!userId || r.user.toString() === userId.toString())
    ) || null;
  }

  async deleteResume(id) {
    this.resumes = this.resumes.filter((r) => r._id.toString() !== id.toString());
    this.analyses = this.analyses.filter((a) => a.resume?.toString() !== id.toString());
  }

  // --- JOBS ---
  async createJob(data) {
    const newJob = {
      _id: 'job_' + Date.now() + Math.random().toString(36).substring(2, 7),
      analysisCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    this.jobs.push(newJob);
    return newJob;
  }

  async getJobsByUser(userId) {
    return this.jobs
      .filter((j) => j.user.toString() === userId.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getJobById(id, userId) {
    return this.jobs.find(
      (j) => j._id.toString() === id.toString() && (!userId || j.user.toString() === userId.toString())
    ) || null;
  }

  async deleteJob(id) {
    this.jobs = this.jobs.filter((j) => j._id.toString() !== id.toString());
    this.analyses = this.analyses.filter((a) => a.jobDescription?.toString() !== id.toString());
  }

  // --- ANALYSES ---
  async createAnalysis(data) {
    const newAnalysis = {
      _id: 'ana_' + Date.now() + Math.random().toString(36).substring(2, 7),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    this.analyses.push(newAnalysis);

    // Increment counts
    const r = this.resumes.find((item) => item._id.toString() === data.resume?.toString());
    if (r) r.analysisCount = (r.analysisCount || 0) + 1;

    const j = this.jobs.find((item) => item._id.toString() === data.jobDescription?.toString());
    if (j) j.analysisCount = (j.analysisCount || 0) + 1;

    return this.getPopulatedAnalysis(newAnalysis);
  }

  getPopulatedAnalysis(analysis) {
    if (!analysis) return null;
    const r = this.resumes.find((item) => item._id.toString() === analysis.resume?.toString()) || null;
    const j = this.jobs.find((item) => item._id.toString() === analysis.jobDescription?.toString()) || null;

    return {
      ...analysis,
      resume: r ? { _id: r._id, originalName: r.originalName, fileType: r.fileType, cloudinaryUrl: r.cloudinaryUrl, extractedText: r.extractedText, parsedData: r.parsedData } : null,
      jobDescription: j ? { _id: j._id, title: j.title, company: j.company, description: j.description, requiredSkills: j.requiredSkills } : null,
    };
  }

  async getAnalysesByUser(userId) {
    return this.analyses
      .filter((a) => a.user.toString() === userId.toString())
      .map((a) => this.getPopulatedAnalysis(a))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getAnalysisById(id, userId) {
    const raw = this.analyses.find(
      (a) => a._id.toString() === id.toString() && (!userId || a.user.toString() === userId.toString())
    );
    return this.getPopulatedAnalysis(raw);
  }

  async deleteAnalysis(id) {
    this.analyses = this.analyses.filter((a) => a._id.toString() !== id.toString());
  }

  // --- STATS ---
  async getDashboardMetrics(userId) {
    const userResumes = this.resumes.filter((r) => r.user.toString() === userId.toString());
    const userJobs = this.jobs.filter((j) => j.user.toString() === userId.toString());
    const userAnalyses = await this.getAnalysesByUser(userId);

    let totalAts = 0;
    let bestMatchScore = 0;
    const skillCounts = {};
    const atsHistory = [];

    userAnalyses.forEach((a, idx) => {
      totalAts += a.atsScore || 0;
      if ((a.jobMatchScore || 0) > bestMatchScore) {
        bestMatchScore = a.jobMatchScore;
      }
      (a.matchedSkills || []).forEach((s) => {
        skillCounts[s] = (skillCounts[s] || 0) + 1;
      });
    });

    const averageAtsScore = userAnalyses.length > 0 ? Math.round(totalAts / userAnalyses.length) : 0;

    [...userAnalyses].reverse().slice(-10).forEach((item, idx) => {
      atsHistory.push({
        name: item.jobDescription?.company || `Analysis ${idx + 1}`,
        atsScore: item.atsScore,
        matchScore: item.jobMatchScore,
        overallScore: item.overallScore,
        date: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      });
    });

    const topSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));

    const recentAnalyses = userAnalyses.slice(0, 5).map((item) => ({
      _id: item._id,
      resumeName: item.resume?.originalName || 'Untitled Resume',
      jobTitle: item.jobDescription?.title || 'Unknown Position',
      company: item.jobDescription?.company || 'Company',
      matchScore: item.jobMatchScore,
      atsScore: item.atsScore,
      overallScore: item.overallScore,
      createdAt: item.createdAt,
    }));

    return {
      stats: {
        totalResumes: userResumes.length,
        totalAnalyses: userAnalyses.length,
        totalJobs: userJobs.length,
        averageAtsScore,
        bestMatchScore,
      },
      charts: {
        atsHistory,
        topSkills,
      },
      recentAnalyses,
    };
  }
}

const memoryStore = new MemoryStorage();

module.exports = memoryStore;
