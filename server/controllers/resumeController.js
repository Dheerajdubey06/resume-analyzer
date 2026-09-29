const path = require('path');
const mongoose = require('mongoose');
const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const memoryStore = require('../services/storageAdapter');
const { uploadResumeFile, deleteFile } = require('../services/cloudinaryService');
const { extractTextFromFile, parseResumeStructured } = require('../services/resumeParserService');

// @desc    Upload and parse resume file
// @route   POST /api/resumes/upload
// @access  Private
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a resume file to upload (PDF, DOC, or DOCX).',
      });
    }

    const file = req.file;
    const originalName = file.originalname;
    const ext = path.extname(originalName).replace('.', '').toLowerCase();
    const fileSize = file.size;

    // 1. Upload to Cloudinary (or local fallback)
    const uploadResult = await uploadResumeFile(file.buffer, originalName, file.mimetype);

    // 2. Extract text from the resume file buffer
    let extractedText = '';
    try {
      extractedText = await extractTextFromFile(file.buffer, ext);
    } catch (parseError) {
      console.warn('Text extraction warning:', parseError.message);
      extractedText = `Extracted from ${originalName}. Resume content preview.`;
    }

    // 3. Extract structured entities
    const parsedData = parseResumeStructured(extractedText);

    // 4. Save
    let resume;
    const resumeData = {
      user: req.user._id,
      originalName,
      cloudinaryPublicId: uploadResult.public_id,
      cloudinaryUrl: uploadResult.secure_url,
      fileType: ext,
      fileSize,
      extractedText,
      parsedData,
    };

    if (mongoose.connection.readyState === 1) {
      resume = await Resume.create(resumeData);
    } else {
      resume = await memoryStore.createResume(resumeData);
    }

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and parsed successfully!',
      resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all resumes for logged-in user
// @route   GET /api/resumes
// @access  Private
const getResumes = async (req, res, next) => {
  try {
    let resumes;
    if (mongoose.connection.readyState === 1) {
      resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
    } else {
      resumes = await memoryStore.getResumesByUser(req.user._id);
    }

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
// @access  Private
const getResumeById = async (req, res, next) => {
  try {
    let resume;
    if (mongoose.connection.readyState === 1) {
      resume = await Resume.findOne({
        _id: req.params.id,
        user: req.user._id,
      });
    } else {
      resume = await memoryStore.getResumeById(req.params.id, req.user._id);
    }

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found.',
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume and related analyses
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = async (req, res, next) => {
  try {
    let resume;
    if (mongoose.connection.readyState === 1) {
      resume = await Resume.findOne({
        _id: req.params.id,
        user: req.user._id,
      });
    } else {
      resume = await memoryStore.getResumeById(req.params.id, req.user._id);
    }

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found.',
      });
    }

    if (resume.cloudinaryPublicId) {
      await deleteFile(resume.cloudinaryPublicId, 'raw');
    }

    if (mongoose.connection.readyState === 1) {
      await Analysis.deleteMany({ resume: resume._id });
      await Resume.deleteOne({ _id: resume._id });
    } else {
      await memoryStore.deleteResume(resume._id);
    }

    res.status(200).json({
      success: true,
      message: 'Resume and associated analyses deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
};
