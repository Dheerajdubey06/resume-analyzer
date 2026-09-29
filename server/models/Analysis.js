const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
      index: true,
    },
    jobDescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobDescription',
      required: true,
      index: true,
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    jobMatchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    atsBreakdown: {
      keywordRelevance: { type: Number, default: 0 },
      skillsMatch: { type: Number, default: 0 },
      experienceRelevance: { type: Number, default: 0 },
      educationRelevance: { type: Number, default: 0 },
      formatting: { type: Number, default: 0 },
      sectionCompleteness: { type: Number, default: 0 },
    },
    matchBreakdown: {
      overallMatch: { type: Number, default: 0 },
      skillsMatch: { type: Number, default: 0 },
      experienceMatch: { type: Number, default: 0 },
      keywordMatch: { type: Number, default: 0 },
      educationMatch: { type: Number, default: 0 },
    },
    summary: {
      type: String,
      default: '',
    },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    recommendedSkills: [{ type: String }],
    keywordAnalysis: [
      {
        keyword: String,
        foundInResume: Boolean,
        importance: {
          type: String,
          enum: ['High', 'Medium', 'Low'],
          default: 'Medium',
        },
        context: String,
      },
    ],
    experienceAnalysis: {
      type: String,
      default: '',
    },
    educationAnalysis: {
      type: String,
      default: '',
    },
    projectAnalysis: {
      type: String,
      default: '',
    },
    formattingSuggestions: [{ type: String }],
    improvementSuggestions: [
      {
        section: String,
        original: String,
        improved: String,
        reason: String,
      },
    ],
    interviewQuestions: [
      {
        question: String,
        category: {
          type: String,
          enum: ['Technical', 'HR', 'Project-based', 'Role-specific', 'General'],
          default: 'Technical',
        },
        suggestedAnswer: String,
        reason: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Analysis', analysisSchema);
