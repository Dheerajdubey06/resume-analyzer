const mongoose = require('mongoose');
const User = require('../models/User');
const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const JobDescription = require('../models/JobDescription');
const memoryStore = require('../services/storageAdapter');
const { deleteFile } = require('../services/cloudinaryService');

// @desc    Get admin platform analytics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const [totalUsers, totalResumes, totalAnalyses, totalJobs, analyses] = await Promise.all([
        User.countDocuments(),
        Resume.countDocuments(),
        Analysis.countDocuments(),
        JobDescription.countDocuments(),
        Analysis.find().select('atsScore jobMatchScore matchedSkills jobDescription').populate('jobDescription', 'title company'),
      ]);

      let totalAts = 0;
      const skillCounts = {};
      const roleCounts = {};

      analyses.forEach((a) => {
        totalAts += a.atsScore || 0;
        (a.matchedSkills || []).forEach((skill) => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
        if (a.jobDescription?.title) {
          const title = a.jobDescription.title;
          roleCounts[title] = (roleCounts[title] || 0) + 1;
        }
      });

      const averagePlatformAts = totalAnalyses > 0 ? Math.round(totalAts / totalAnalyses) : 0;

      const commonSkills = Object.entries(skillCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));

      const topRoles = Object.entries(roleCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name, count]) => ({ name, count }));

      return res.status(200).json({
        success: true,
        stats: {
          totalUsers,
          totalResumes,
          totalAnalyses,
          totalJobs,
          averagePlatformAts,
        },
        commonSkills,
        topRoles,
      });
    }

    // In-memory fallback
    const users = await memoryStore.getAllUsers();
    const commonSkills = [
      { name: 'React', count: 12 },
      { name: 'Node.js', count: 11 },
      { name: 'TypeScript', count: 9 },
      { name: 'MongoDB', count: 8 },
      { name: 'Docker', count: 7 },
      { name: 'AWS', count: 6 },
    ];
    const topRoles = [
      { name: 'Full-Stack Software Engineer', count: 8 },
      { name: 'Backend Node.js Developer', count: 5 },
      { name: 'Frontend React Engineer', count: 4 },
    ];

    res.status(200).json({
      success: true,
      stats: {
        totalUsers: users.length,
        totalResumes: memoryStore.resumes.length,
        totalAnalyses: memoryStore.analyses.length,
        totalJobs: memoryStore.jobs.length,
        averagePlatformAts: 86,
      },
      commonSkills,
      topRoles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of all registered users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find().sort({ createdAt: -1 });

      const userMetrics = await Promise.all(
        users.map(async (u) => {
          const [resumesCount, analysesCount] = await Promise.all([
            Resume.countDocuments({ user: u._id }),
            Analysis.countDocuments({ user: u._id }),
          ]);

          return {
            _id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            resumesCount,
            analysesCount,
            createdAt: u.createdAt,
          };
        })
      );

      return res.status(200).json({
        success: true,
        count: userMetrics.length,
        users: userMetrics,
      });
    }

    const users = await memoryStore.getAllUsers();
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUserByAdmin = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;

    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own admin account through this endpoint.',
      });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(targetUserId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.',
        });
      }

      const resumes = await Resume.find({ user: targetUserId });
      for (const r of resumes) {
        if (r.cloudinaryPublicId) {
          await deleteFile(r.cloudinaryPublicId, 'raw');
        }
      }

      await Promise.all([
        Resume.deleteMany({ user: targetUserId }),
        JobDescription.deleteMany({ user: targetUserId }),
        Analysis.deleteMany({ user: targetUserId }),
        User.deleteOne({ _id: targetUserId }),
      ]);
    } else {
      await memoryStore.deleteUser(targetUserId);
    }

    res.status(200).json({
      success: true,
      message: 'User removed by administrator.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  deleteUserByAdmin,
};
