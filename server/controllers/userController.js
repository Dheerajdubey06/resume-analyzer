const mongoose = require('mongoose');
const User = require('../models/User');
const Resume = require('../models/Resume');
const JobDescription = require('../models/JobDescription');
const Analysis = require('../models/Analysis');
const memoryStore = require('../services/storageAdapter');
const { uploadProfileImage, deleteFile } = require('../services/cloudinaryService');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(req.user._id);
    } else {
      user = await memoryStore.findUserById(req.user._id);
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & avatar
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(req.user._id);
    } else {
      user = await memoryStore.findUserById(req.user._id);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { name, phone, linkedin, github, portfolio, bio } = req.body;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (github !== undefined) user.github = github;
    if (portfolio !== undefined) user.portfolio = portfolio;
    if (bio !== undefined) user.bio = bio;

    if (req.file) {
      const uploadRes = await uploadProfileImage(req.file.buffer, req.file.mimetype);
      user.profileImage = uploadRes.secure_url;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/settings/password
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(req.user._id).select('+password');
    } else {
      user = await memoryStore.findUserById(req.user._id);
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account and all personal data
// @route   DELETE /api/account
// @access  Private
const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (mongoose.connection.readyState === 1) {
      const resumes = await Resume.find({ user: userId });
      for (const r of resumes) {
        if (r.cloudinaryPublicId) {
          await deleteFile(r.cloudinaryPublicId, 'raw');
        }
      }

      await Promise.all([
        Resume.deleteMany({ user: userId }),
        JobDescription.deleteMany({ user: userId }),
        Analysis.deleteMany({ user: userId }),
        User.deleteOne({ _id: userId }),
      ]);
    } else {
      await memoryStore.deleteUser(userId);
    }

    res.status(200).json({
      success: true,
      message: 'Your account and all associated data have been permanently removed.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount,
};
