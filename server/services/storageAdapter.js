const os = require('os');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const STORE_PATH = path.join(os.tmpdir(), 'resumeai_store.json');

/**
 * Resilient In-Memory & File-Backed Storage Engine
 * Preserves state across serverless function invocations when MongoDB Atlas is not yet connected.
 */
class MemoryStorage {
  constructor() {
    this.users = [];
    this.resumes = [];
    this.jobs = [];
    this.analyses = [];

    this._loadFromFile();
    if (this.users.length === 0) {
      this._initDefaultData();
    }
  }

  _loadFromFile() {
    try {
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        this.users = parsed.users || [];
        this.resumes = parsed.resumes || [];
        this.jobs = parsed.jobs || [];
        this.analyses = parsed.analyses || [];
      }
    } catch (err) {
      console.warn('Could not read temporary store:', err.message);
    }
  }

  _saveToFile() {
    try {
      const data = {
        users: this.users,
        resumes: this.resumes,
        jobs: this.jobs,
        analyses: this.analyses,
      };
      fs.writeFileSync(STORE_PATH, JSON.stringify(data), 'utf-8');
    } catch (err) {
      // ignore
    }
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const sampleResume = {
      _id: 'resume_dev_sample_01',
      user: devUser._id,
      originalName: 'Alex_Morgan_FullStack_Resume.pdf',
      cloudinaryPublicId: 'demo_alex_morgan_resume',
      cloudinaryUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60',
      fileType: 'pdf',
      fileSize: 142850,
      extractedText: `Alex Morgan\nalex.morgan@example.com | (555) 234-5678 | San Francisco, CA\nLinkedIn: linkedin.com/in/alexmorgan-dev | GitHub: github.com/alexmorgan\n\nPROFESSIONAL SUMMARY\nResults-driven Full-Stack Software Engineer with 4+ years of experience designing and scaling web applications using React, Node.js, Express, and MongoDB. Proven track record of improving application performance by 35% and building resilient microservices in cloud environments.\n\nCORE SKILLS\n- Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3, Python, SQL\n- Frontend: React.js, Next.js, Redux Toolkit, Tailwind CSS, Webpack\n- Backend: Node.js, Express.js, RESTful APIs, GraphQL, Microservices\n- Databases: MongoDB, PostgreSQL, Redis, Mongoose\n- DevOps & Tools: Docker, Git, GitHub Actions, AWS (S3, EC2), Jest, CI/CD\n\nPROFESSIONAL EXPERIENCE\nSenior Full-Stack Engineer | TechFlow Systems | 2022 - Present\n- Architected and deployed microservices handling 2M+ daily requests using Node.js and MongoDB.\n- Optimized database query indexes and caching layers with Redis, decreasing average response time by 42%.\n- Mentored a squad of 4 junior developers and established code review guidelines reducing bug turnaround time by 30%.\n- Integrated Stripe payment gateway and automated webhook reconciliation.\n\nFull-Stack Developer | CloudNative Labs | 2020 - 2022\n- Developed responsive customer-facing dashboard in React and Tailwind CSS, increasing user engagement by 25%.\n- Built REST APIs in Express with JWT authentication, role-based access control, and rate limiting.\n- Automated CI/CD deployment pipelines using GitHub Actions to AWS EC2.\n\nEDUCATION\nBachelor of Technology in Computer Science & Engineering\nApex Institute of Technology | 2016 - 2020 | GPA: 3.8/4.0\n\nKEY PROJECTS\n- ResumeAI Platform: Developed an end-to-end ATS scanner using React, Node.js, and OpenAI API with PDF parsing.\n- E-Commerce Microservices: Built inventory and checkout service using Express, Kafka, and MongoDB.`,
      parsedData: {
        name: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        phone: '(555) 234-5678',
        summary: 'Results-driven Full-Stack Software Engineer with 4+ years of experience designing and scaling web applications using React, Node.js, Express, and MongoDB.',
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Git', 'REST API', 'Tailwind CSS', 'Redux', 'Jest'],
      },
      analysisCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const sampleJob = {
      _id: 'job_dev_sample_01',
      user: devUser._id,
      title: 'Senior Full-Stack Software Engineer (MERN / Cloud)',
      company: 'CloudScale Technologies',
      description: `Senior Full-Stack Software Engineer (MERN / Cloud)\nCloudScale Technologies — Remote / San Francisco, CA\n\nAbout the Role:\nWe are seeking an experienced Senior Full-Stack Software Engineer with strong command over modern JavaScript/TypeScript, React, Node.js, and cloud ecosystems. You will be building mission-critical SaaS applications and high-throughput APIs.\n\nRequirements:\n- 3+ years of professional full-stack development experience with React and Node.js\n- Proficiency in JavaScript, TypeScript, Express, and MongoDB\n- Experience building and consuming RESTful APIs and GraphQL\n- Hands-on experience with Docker, Kubernetes, and AWS cloud infrastructure\n- Familiarity with CI/CD pipelines, automated testing (Jest/Cypress), and Agile development\n- Strong problem-solving skills and passion for building scalable software`,
      requiredSkills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker', 'Kubernetes', 'AWS', 'REST API'],
      experienceLevel: 'Senior Level',
      analysisCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const sampleAnalysis = {
      _id: 'analysis_dev_sample_01',
      user: devUser._id,
      resume: sampleResume._id,
      jobDescription: sampleJob._id,
      overallScore: 88,
      atsScore: 86,
      jobMatchScore: 90,
      atsBreakdown: {
        keywordRelevance: 88,
        skillsMatch: 92,
        experienceRelevance: 85,
        educationRelevance: 90,
        formatting: 95,
        sectionCompleteness: 94,
      },
      matchBreakdown: {
        overallMatch: 90,
        skillsMatch: 92,
        experienceMatch: 86,
        keywordMatch: 88,
        educationMatch: 90,
      },
      summary: 'Candidate shows exceptional alignment with the Senior Full-Stack role. Demonstrated experience with Node.js microservices, React frontends, and cloud deployments positions this candidate in the top 10% of applicants.',
      strengths: [
        'Strong hands-on mastery of required MERN stack technologies (React, Node.js, MongoDB, Express)',
        'Proven quantification of business impact (e.g. 42% query latency reduction, 2M+ daily requests)',
        'Solid foundational computer science degree with high academic standing',
        'Direct experience with containerization (Docker) and AWS cloud services'
      ],
      weaknesses: [
        'Kubernetes is not explicitly listed in hands-on production experience',
        'No explicit mention of GraphQL in production projects, only in skills overview',
        'Could elaborate more on automated testing strategies with Cypress/Playwright'
      ],
      matchedSkills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker', 'AWS', 'REST API', 'JavaScript', 'Git', 'Tailwind CSS'],
      missingSkills: ['Kubernetes', 'GraphQL', 'Cypress'],
      recommendedSkills: ['Kubernetes', 'System Design Patterns', 'GraphQL Federation', 'Terraform'],
      keywordAnalysis: [
        { keyword: 'React', foundInResume: true, importance: 'High', context: 'Prominently featured in projects and frontend experience' },
        { keyword: 'Node.js', foundInResume: true, importance: 'High', context: 'Demonstrated deep microservices backend work' },
        { keyword: 'MongoDB', foundInResume: true, importance: 'High', context: 'Clear database indexing and scaling examples' },
        { keyword: 'Kubernetes', foundInResume: false, importance: 'High', context: 'Critical container orchestration requirement in JD' },
        { keyword: 'TypeScript', foundInResume: true, importance: 'High', context: 'Listed in core skills and utilized across projects' }
      ],
      experienceAnalysis: 'Candidate exhibits strong senior-level engineering rigor. High-impact bullet points with quantified percentages make the experience section stand out to automated ATS scoring filters.',
      educationAnalysis: 'B.Tech in Computer Science & Engineering directly aligns with prerequisite requirements for Senior Engineering roles.',
      projectAnalysis: 'Featured full-stack platforms showcase end-to-end execution, database design, and real-world system architecture.',
      formattingSuggestions: [
        'Maintain the clean single-column layout currently utilized',
        'Keep bullet lengths under 3 lines for recruiter scannability',
        'Ensure contact hyperlinks are active and verified'
      ],
      improvementSuggestions: [
        {
          section: 'Experience',
          original: 'Built REST APIs in Express with JWT authentication.',
          improved: 'Architected and deployed 15+ high-security RESTful endpoints in Express with JWT authentication, RBAC, and Redis rate limiting, handling 2M+ daily requests with zero security incidents.',
          reason: 'Quantifies scope and adds key security keywords for automated ATS match filters.'
        }
      ],
      interviewQuestions: [
        {
          question: 'How did you achieve a 42% query latency reduction in MongoDB, and what indexing trade-offs did you encounter?',
          category: 'Technical',
          suggestedAnswer: 'Discuss compound indexing on frequent filter/sort query predicates, profiling with explain("executionStats"), and memory utilization versus write performance penalties.',
          reason: 'Verifies the quantified claim from your TechFlow experience section.'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.push(devUser);
    this.resumes.push(sampleResume);
    this.jobs.push(sampleJob);
    this.analyses.push(sampleAnalysis);
    this._saveToFile();
  }

  isMongoConnected() {
    return mongoose.connection.readyState === 1;
  }

  // --- USERS ---
  async findUserByEmail(email, includePassword = false) {
    this._loadFromFile();
    const u = this.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
    if (!u) return null;
    return {
      ...u,
      matchPassword: async (entered) => await bcrypt.compare(entered, u.password),
      save: async () => {
        this._saveToFile();
        return u;
      },
    };
  }

  async findUserById(id) {
    this._loadFromFile();
    const u = this.users.find((user) => user._id.toString() === id.toString());
    if (!u) return null;
    return {
      ...u,
      matchPassword: async (entered) => await bcrypt.compare(entered, u.password),
      save: async () => {
        this._saveToFile();
        return u;
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this._saveToFile();

    return {
      ...newUser,
      matchPassword: async (entered) => await bcrypt.compare(entered, hashedPassword),
      save: async () => newUser,
    };
  }

  async getAllUsers() {
    this._loadFromFile();
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
    this._saveToFile();
  }

  // --- RESUMES ---
  async createResume(data) {
    this._loadFromFile();
    const newResume = {
      _id: 'res_' + Date.now() + Math.random().toString(36).substring(2, 7),
      analysisCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
    this.resumes.push(newResume);
    this._saveToFile();
    return newResume;
  }

  async getResumesByUser(userId) {
    this._loadFromFile();
    return this.resumes
      .filter((r) => r.user.toString() === userId.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getResumeById(id, userId) {
    this._loadFromFile();
    return (
      this.resumes.find(
        (r) => r._id.toString() === id.toString() && (!userId || r.user.toString() === userId.toString())
      ) || null
    );
  }

  async deleteResume(id) {
    this.resumes = this.resumes.filter((r) => r._id.toString() !== id.toString());
    this.analyses = this.analyses.filter((a) => a.resume?.toString() !== id.toString());
    this._saveToFile();
  }

  // --- JOBS ---
  async createJob(data) {
    this._loadFromFile();
    const newJob = {
      _id: 'job_' + Date.now() + Math.random().toString(36).substring(2, 7),
      analysisCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
    this.jobs.push(newJob);
    this._saveToFile();
    return newJob;
  }

  async getJobsByUser(userId) {
    this._loadFromFile();
    return this.jobs
      .filter((j) => j.user.toString() === userId.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getJobById(id, userId) {
    this._loadFromFile();
    return (
      this.jobs.find(
        (j) => j._id.toString() === id.toString() && (!userId || j.user.toString() === userId.toString())
      ) || null
    );
  }

  async deleteJob(id) {
    this.jobs = this.jobs.filter((j) => j._id.toString() !== id.toString());
    this.analyses = this.analyses.filter((a) => a.jobDescription?.toString() !== id.toString());
    this._saveToFile();
  }

  // --- ANALYSES ---
  async createAnalysis(data) {
    this._loadFromFile();
    const newAnalysis = {
      _id: 'ana_' + Date.now() + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
    this.analyses.push(newAnalysis);

    const r = this.resumes.find((item) => item._id.toString() === data.resume?.toString());
    if (r) r.analysisCount = (r.analysisCount || 0) + 1;

    const j = this.jobs.find((item) => item._id.toString() === data.jobDescription?.toString());
    if (j) j.analysisCount = (j.analysisCount || 0) + 1;

    this._saveToFile();
    return this.getPopulatedAnalysis(newAnalysis);
  }

  getPopulatedAnalysis(analysis) {
    if (!analysis) return null;
    this._loadFromFile();
    const r = this.resumes.find((item) => item._id.toString() === analysis.resume?.toString()) || null;
    const j = this.jobs.find((item) => item._id.toString() === analysis.jobDescription?.toString()) || null;

    return {
      ...analysis,
      resume: r
        ? {
            _id: r._id,
            originalName: r.originalName,
            fileType: r.fileType,
            cloudinaryUrl: r.cloudinaryUrl,
            extractedText: r.extractedText,
            parsedData: r.parsedData,
          }
        : null,
      jobDescription: j
        ? {
            _id: j._id,
            title: j.title,
            company: j.company,
            description: j.description,
            requiredSkills: j.requiredSkills,
          }
        : null,
    };
  }

  async getAnalysesByUser(userId) {
    this._loadFromFile();
    return this.analyses
      .filter((a) => a.user.toString() === userId.toString())
      .map((a) => this.getPopulatedAnalysis(a))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getAnalysisById(id, userId) {
    this._loadFromFile();
    const raw = this.analyses.find(
      (a) => a._id.toString() === id.toString() && (!userId || a.user.toString() === userId.toString())
    );
    return this.getPopulatedAnalysis(raw);
  }

  async deleteAnalysis(id) {
    this.analyses = this.analyses.filter((a) => a._id.toString() !== id.toString());
    this._saveToFile();
  }

  // --- STATS ---
  async getDashboardMetrics(userId) {
    this._loadFromFile();
    const userResumes = this.resumes.filter((r) => r.user.toString() === userId.toString());
    const userJobs = this.jobs.filter((j) => j.user.toString() === userId.toString());
    const userAnalyses = await this.getAnalysesByUser(userId);

    let totalAts = 0;
    let bestMatchScore = 0;
    const skillCounts = {};
    const atsHistory = [];

    userAnalyses.forEach((a) => {
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
