const mongoose = require('mongoose');
const Analysis = require('../models/Analysis');
const Resume = require('../models/Resume');
const JobDescription = require('../models/JobDescription');
const memoryStore = require('../services/storageAdapter');
const { analyzeResumeWithAI } = require('../services/aiService');

// @desc    Run AI Analysis between a Resume and a Job Description
// @route   POST /api/analysis
// @access  Private
const createAnalysis = async (req, res, next) => {
  try {
    const { resumeId, jobDescriptionId, jobTitle, company, jobText } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: 'Please select a resume to analyze.',
      });
    }

    // 1. Fetch Resume
    let resume = null;
    if (mongoose.connection.readyState === 1) {
      resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
    } else {
      resume = await memoryStore.getResumeById(resumeId, req.user._id);
    }

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Selected resume not found.',
      });
    }

    // 2. Fetch or Create Job Description
    let job = null;
    if (jobDescriptionId) {
      if (mongoose.connection.readyState === 1) {
        job = await JobDescription.findOne({ _id: jobDescriptionId, user: req.user._id });
      } else {
        job = await memoryStore.getJobById(jobDescriptionId, req.user._id);
      }
    }

    if (!job) {
      if (!jobText || !jobTitle) {
        return res.status(400).json({
          success: false,
          message: 'Please provide either an existing Job ID or enter Job Title and Description.',
        });
      }

      const jobData = {
        user: req.user._id,
        title: jobTitle,
        company: company || 'Target Company',
        description: jobText,
        requiredSkills: [],
      };

      if (mongoose.connection.readyState === 1) {
        job = await JobDescription.create(jobData);
      } else {
        job = await memoryStore.createJob(jobData);
      }
    }

    // 3. Trigger AI Analysis
    const aiResult = await analyzeResumeWithAI(
      resume.extractedText,
      job.description,
      resume.parsedData?.skills || [],
      job.requiredSkills || []
    );

    // 4. Save Analysis
    const analysisData = {
      user: req.user._id,
      resume: resume._id,
      jobDescription: job._id,
      overallScore: aiResult.overallScore,
      atsScore: aiResult.atsScore,
      jobMatchScore: aiResult.jobMatchScore,
      atsBreakdown: aiResult.atsBreakdown,
      matchBreakdown: aiResult.matchBreakdown,
      summary: aiResult.summary,
      strengths: aiResult.strengths,
      weaknesses: aiResult.weaknesses,
      matchedSkills: aiResult.matchedSkills,
      missingSkills: aiResult.missingSkills,
      recommendedSkills: aiResult.recommendedSkills,
      keywordAnalysis: aiResult.keywordAnalysis,
      experienceAnalysis: aiResult.experienceAnalysis,
      educationAnalysis: aiResult.educationAnalysis,
      projectAnalysis: aiResult.projectAnalysis,
      formattingSuggestions: aiResult.formattingSuggestions,
      improvementSuggestions: aiResult.improvementSuggestions,
      interviewQuestions: aiResult.interviewQuestions,
    };

    let populatedAnalysis;
    if (mongoose.connection.readyState === 1) {
      const analysis = await Analysis.create(analysisData);
      await Resume.findByIdAndUpdate(resume._id, { $inc: { analysisCount: 1 } });
      await JobDescription.findByIdAndUpdate(job._id, { $inc: { analysisCount: 1 } });

      populatedAnalysis = await Analysis.findById(analysis._id)
        .populate('resume', 'originalName fileType cloudinaryUrl createdAt')
        .populate('jobDescription', 'title company');
    } else {
      populatedAnalysis = await memoryStore.createAnalysis(analysisData);
    }

    res.status(201).json({
      success: true,
      message: 'Analysis completed successfully.',
      analysis: populatedAnalysis,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's analysis history
// @route   GET /api/analysis
// @access  Private
const getAnalyses = async (req, res, next) => {
  try {
    const { search, minScore, sort = '-createdAt', page = 1, limit = 10 } = req.query;

    let analyses;
    let total;

    if (mongoose.connection.readyState === 1) {
      let query = { user: req.user._id };
      if (minScore) {
        query.overallScore = { $gte: Number(minScore) };
      }

      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const skip = (pageNum - 1) * limitNum;

      [analyses, total] = await Promise.all([
        Analysis.find(query)
          .populate('resume', 'originalName fileType cloudinaryUrl')
          .populate('jobDescription', 'title company')
          .sort(sort)
          .skip(skip)
          .limit(limitNum),
        Analysis.countDocuments(query),
      ]);
    } else {
      let all = await memoryStore.getAnalysesByUser(req.user._id);
      if (minScore) {
        all = all.filter((a) => a.overallScore >= Number(minScore));
      }
      total = all.length;
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const skip = (pageNum - 1) * limitNum;
      analyses = all.slice(skip, skip + limitNum);
    }

    let filteredAnalyses = analyses;
    if (search && search.trim().length > 0) {
      const s = search.toLowerCase();
      filteredAnalyses = analyses.filter((item) => {
        const resumeName = item.resume?.originalName?.toLowerCase() || '';
        const jobTitle = item.jobDescription?.title?.toLowerCase() || '';
        const company = item.jobDescription?.company?.toLowerCase() || '';
        return resumeName.includes(s) || jobTitle.includes(s) || company.includes(s);
      });
    }

    const limitNum = parseInt(limit, 10) || 10;
    const pageNum = parseInt(page, 10) || 1;

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      count: filteredAnalyses.length,
      analyses: filteredAnalyses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single analysis by ID
// @route   GET /api/analysis/:id
// @access  Private
const getAnalysisById = async (req, res, next) => {
  try {
    let analysis;
    if (mongoose.connection.readyState === 1) {
      analysis = await Analysis.findOne({
        _id: req.params.id,
        user: req.user._id,
      })
        .populate('resume', 'originalName fileType cloudinaryUrl extractedText parsedData')
        .populate('jobDescription', 'title company description requiredSkills');
    } else {
      analysis = await memoryStore.getAnalysisById(req.params.id, req.user._id);
    }

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis record not found.',
      });
    }

    res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete analysis record
// @route   DELETE /api/analysis/:id
// @access  Private
const deleteAnalysis = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const analysis = await Analysis.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!analysis) {
        return res.status(404).json({
          success: false,
          message: 'Analysis record not found.',
        });
      }

      await Analysis.deleteOne({ _id: analysis._id });
    } else {
      await memoryStore.deleteAnalysis(req.params.id);
    }

    res.status(200).json({
      success: true,
      message: 'Analysis deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAnalysis,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis,
};
