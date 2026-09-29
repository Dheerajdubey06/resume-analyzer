const path = require('path');
const fs = require('fs');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

/**
 * Uploads a resume file to Cloudinary or falls back to local storage
 * @param {Buffer} buffer File buffer
 * @param {string} originalName Original file name
 * @param {string} mimeType Mime type
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
const uploadResumeFile = async (buffer, originalName, mimeType) => {
  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'resumeai/resumes',
          resource_type: 'raw', // Support raw PDF and DOC/DOCX docs
          public_id: `${Date.now()}_${path.parse(originalName).name.replace(/[^a-zA-Z0-9]/g, '_')}`,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary raw upload error:', error);
            return reject(error);
          }
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            resource_type: result.resource_type,
          });
        }
      );
      uploadStream.end(buffer);
    });
  }

  // Graceful fallback to local uploads directory
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const safeName = `${Date.now()}_${originalName.replace(/\s+/g, '_')}`;
  const filePath = path.join(uploadsDir, safeName);
  fs.writeFileSync(filePath, buffer);

  const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
  const localUrl = `${serverUrl}/uploads/${safeName}`;

  return {
    secure_url: localUrl,
    public_id: `local_${safeName}`,
    resource_type: 'local',
  };
};

/**
 * Uploads a profile image to Cloudinary or local storage
 * @param {Buffer} buffer 
 * @param {string} mimeType 
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
const uploadProfileImage = async (buffer, mimeType) => {
  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'resumeai/profiles',
          resource_type: 'image',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );
      uploadStream.end(buffer);
    });
  }

  // Local fallback
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const safeName = `profile_${Date.now()}.png`;
  const filePath = path.join(uploadsDir, safeName);
  fs.writeFileSync(filePath, buffer);

  const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
  return {
    secure_url: `${serverUrl}/uploads/${safeName}`,
    public_id: `local_${safeName}`,
  };
};

/**
 * Deletes file from Cloudinary or local disk
 * @param {string} publicId 
 * @param {string} resourceType 
 */
const deleteFile = async (publicId, resourceType = 'raw') => {
  if (!publicId) return;

  if (publicId.startsWith('local_')) {
    const filename = publicId.replace('local_', '');
    const filePath = path.join(__dirname, '../uploads', filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Error removing local file:', err.message);
      }
    }
    return;
  }

  if (isCloudinaryConfigured()) {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
      console.warn('Failed to delete file from Cloudinary:', error.message);
    }
  }
};

module.exports = {
  uploadResumeFile,
  uploadProfileImage,
  deleteFile,
};
