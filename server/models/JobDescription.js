const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Please provide the company name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide the job description text'],
    },
    requiredSkills: [{ type: String, trim: true }],
    experienceLevel: {
      type: String,
      default: 'Not Specified',
      trim: true,
    },
    analysisCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('JobDescription', jobDescriptionSchema);
