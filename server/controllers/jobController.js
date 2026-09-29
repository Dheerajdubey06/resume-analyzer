const path = require('path');
const mongoose = require('mongoose');
const JobDescription = require('../models/JobDescription');
const Analysis = require('../models/Analysis');
const memoryStore = require('../services/storageAdapter');
const { extractKeywordsFromJob } = require('../services/atsEngine');
const { extractTextFromFile } = require('../services/resumeParserService');

// @desc    Create new Job Description
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res, next) => {
  try {
    let { title, company, description, requiredSkills, experienceLevel } = req.body;

    if (req.file) {
      const ext = path.extname(req.file.originalname).replace('.', '').toLowerCase();
      try {
        const fileContent = await extractTextFromFile(req.file.buffer, ext);
        if (fileContent && !description) {
          description = fileContent;
        }
      } catch (err) {
        console.warn('Job file text extraction error:', err.message);
      }
    }

    if (!title || !company || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Job Title, Company, and Job Description.',
      });
    }

    let skillsArray = [];
    if (Array.isArray(requiredSkills)) {
      skillsArray = requiredSkills;
    } else if (typeof requiredSkills === 'string' && requiredSkills.trim().length > 0) {
      skillsArray = requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
    } else {
      skillsArray = extractKeywordsFromJob(description).slice(0, 8);
    }

    const jobData = {
      user: req.user._id,
      title,
      company,
      description,
      requiredSkills: skillsArray,
      experienceLevel: experienceLevel || 'Mid Level',
    };

    let job;
    if (mongoose.connection.readyState === 1) {
      job = await JobDescription.create(jobData);
    } else {
      job = await memoryStore.createJob(jobData);
    }

    res.status(201).json({
      success: true,
      message: 'Job description saved successfully.',
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs for logged-in user
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res, next) => {
  try {
    let jobs;
    if (mongoose.connection.readyState === 1) {
      jobs = await JobDescription.find({ user: req.user._id }).sort({ createdAt: -1 });
    } else {
      jobs = await memoryStore.getJobsByUser(req.user._id);
    }

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Private
const getJobById = async (req, res, next) => {
  try {
    let job;
    if (mongoose.connection.readyState === 1) {
      job = await JobDescription.findOne({
        _id: req.params.id,
        user: req.user._id,
      });
    } else {
      job = await memoryStore.getJobById(req.params.id, req.user._id);
    }

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job description not found.',
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job description
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res, next) => {
  try {
    let job;
    if (mongoose.connection.readyState === 1) {
      job = await JobDescription.findOne({
        _id: req.params.id,
        user: req.user._id,
      });
    } else {
      job = await memoryStore.getJobById(req.params.id, req.user._id);
    }

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job description not found.',
      });
    }

    if (mongoose.connection.readyState === 1) {
      await Analysis.deleteMany({ jobDescription: job._id });
      await JobDescription.deleteOne({ _id: job._id });
    } else {
      await memoryStore.deleteJob(job._id);
    }

    res.status(200).json({
      success: true,
      message: 'Job description deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  deleteJob,
};
