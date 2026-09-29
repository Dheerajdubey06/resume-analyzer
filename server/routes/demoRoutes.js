const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { seedSampleDataForUser, sampleResumeContent, sampleJobContent } = require('../utils/sampleSeed');
const memoryStore = require('../services/storageAdapter');

router.post('/seed', protect, async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const data = await seedSampleDataForUser(req.user._id);
      return res.status(201).json({
        success: true,
        message: 'Demo sample resume, job description, and analysis loaded successfully!',
        data: {
          resumeId: data.resume._id,
          jobId: data.job._id,
          analysisId: data.analysis._id,
        },
      });
    }

    // In-Memory Seed
    const resume = await memoryStore.createResume({
      user: req.user._id,
      originalName: 'Alex_Morgan_FullStack_Resume.pdf',
      cloudinaryPublicId: 'demo_alex_morgan_resume',
      cloudinaryUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60',
      fileType: 'pdf',
      fileSize: 142850,
      extractedText: sampleResumeContent,
      parsedData: {
        name: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        phone: '(555) 234-5678',
        summary: 'Results-driven Full-Stack Software Engineer with 4+ years of experience designing and scaling web applications using React, Node.js, Express, and MongoDB.',
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Git', 'REST API', 'Tailwind CSS', 'Redux', 'Jest'],
      },
      analysisCount: 1,
    });

    const job = await memoryStore.createJob({
      user: req.user._id,
      title: 'Senior Full-Stack Software Engineer (MERN / Cloud)',
      company: 'CloudScale Technologies',
      description: sampleJobContent,
      requiredSkills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker', 'Kubernetes', 'AWS', 'REST API'],
      experienceLevel: 'Senior Level',
      analysisCount: 1,
    });

    const analysis = await memoryStore.createAnalysis({
      user: req.user._id,
      resume: resume._id,
      jobDescription: job._id,
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
        'Ensure standard date formats (Month Year - Month Year) for consistent ATS chronological parsing',
        'Keep resume length within 1-2 pages maximum'
      ],
      improvementSuggestions: [
        {
          section: 'Skills',
          original: 'DevOps & Tools: Docker, Git, GitHub Actions, AWS (S3, EC2), Jest, CI/CD',
          improved: 'DevOps & Cloud: Docker, Kubernetes (EKS), AWS (S3, EC2, Lambda), CI/CD (GitHub Actions), Jest, Cypress',
          reason: 'Adds missing high-demand keywords (Kubernetes, Cypress) that recruiters search for.'
        }
      ],
      interviewQuestions: [
        {
          question: 'Can you walk us through how you optimized MongoDB query latency by 42% in your previous role?',
          category: 'Technical',
          suggestedAnswer: 'Explain how you analyzed slow queries using explain("executionStats"), designed compound indexes, eliminated unneeded fields using projection, and implemented Redis caching for hot read paths.',
          reason: 'Validates claims made in the resume with concrete architectural specifics.'
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Demo sample resume, job description, and analysis loaded successfully!',
      data: {
        resumeId: resume._id,
        jobId: job._id,
        analysisId: analysis._id,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
