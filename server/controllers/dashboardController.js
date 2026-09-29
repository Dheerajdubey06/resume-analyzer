const mongoose = require('mongoose');
const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const JobDescription = require('../models/JobDescription');
const memoryStore = require('../services/storageAdapter');

// @desc    Get dashboard metrics, charts data, and recent analyses
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (mongoose.connection.readyState === 1) {
      const [totalResumes, totalJobs, analyses] = await Promise.all([
        Resume.countDocuments({ user: userId }),
        JobDescription.countDocuments({ user: userId }),
        Analysis.find({ user: userId })
          .populate('resume', 'originalName fileType')
          .populate('jobDescription', 'title company')
          .sort({ createdAt: -1 }),
      ]);

      const totalAnalyses = analyses.length;

      let averageAtsScore = 0;
      let bestMatchScore = 0;
      let totalScoreSum = 0;

      const atsHistory = [];
      const skillCounts = {};

      analyses.forEach((item) => {
        totalScoreSum += item.atsScore || 0;
        if ((item.jobMatchScore || 0) > bestMatchScore) {
          bestMatchScore = item.jobMatchScore;
        }

        (item.matchedSkills || []).forEach((skill) => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      });

      if (totalAnalyses > 0) {
        averageAtsScore = Math.round(totalScoreSum / totalAnalyses);
      }

      const reversedAnalyses = [...analyses].reverse();
      reversedAnalyses.slice(-10).forEach((item, idx) => {
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
        .map(([name, value]) => ({ name, count: value }));

      const recentAnalyses = analyses.slice(0, 5).map((item) => ({
        _id: item._id,
        resumeName: item.resume?.originalName || 'Untitled Resume',
        jobTitle: item.jobDescription?.title || 'Unknown Position',
        company: item.jobDescription?.company || 'Company',
        matchScore: item.jobMatchScore,
        atsScore: item.atsScore,
        overallScore: item.overallScore,
        createdAt: item.createdAt,
      }));

      return res.status(200).json({
        success: true,
        stats: {
          totalResumes,
          totalAnalyses,
          totalJobs,
          averageAtsScore,
          bestMatchScore,
        },
        charts: {
          atsHistory,
          topSkills,
        },
        recentAnalyses,
      });
    }

    // In-Memory Fallback
    const metrics = await memoryStore.getDashboardMetrics(userId);
    res.status(200).json({
      success: true,
      ...metrics,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
