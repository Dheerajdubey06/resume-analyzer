const os = require('os');
const path = require('path');
const fs = require('fs');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

/**
 * Uploads a resume file to Cloudinary or safely provides a data URI on serverless
 * @param {Buffer} buffer File buffer
 * @param {string} originalName Original file name
 * @param {string} mimeType Mime type
 * @returns {Promise<{ secure_url: string, public_id: string, resource_type: string }>}
 */
const uploadResumeFile = async (buffer, originalName, mimeType) => {
  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'resumeai/resumes',
          resource_type: 'raw',
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

  // Graceful fallback for environments where Cloudinary is not yet configured (e.g. Vercel serverless / dev)
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const safeName = `${Date.now()}_${originalName.replace(/\s+/g, '_')}`;

  if (isServerless) {
    // In serverless, generate a secure Data URI so the document can be viewed/downloaded without disk dependency
    const actualMime = mimeType || (originalName.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');
    const dataUri = `data:${actualMime};base64,${buffer.toString('base64')}`;
    return {
      secure_url: dataUri,
      public_id: `serverless_${safeName}`,
      resource_type: 'data-uri',
    };
  }

  // Local development disk storage fallback
  const uploadsDir = path.join(__dirname, '../uploads');
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const filePath = path.join(uploadsDir, safeName);
    fs.writeFileSync(filePath, buffer);

    const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
    return {
      secure_url: `${serverUrl}/uploads/${safeName}`,
      public_id: `local_${safeName}`,
      resource_type: 'local',
    };
  } catch (err) {
    // If disk write fails for any reason, fall back to Data URI
    const actualMime = mimeType || 'application/pdf';
    return {
      secure_url: `data:${actualMime};base64,${buffer.toString('base64')}`,
      public_id: `fallback_${safeName}`,
      resource_type: 'data-uri',
    };
  }
};

/**
 * Uploads a profile image to Cloudinary or returns data URI
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

  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const safeMime = mimeType || 'image/png';
  const dataUri = `data:${safeMime};base64,${buffer.toString('base64')}`;

  if (isServerless) {
    return {
      secure_url: dataUri,
      public_id: `avatar_${Date.now()}`,
    };
  }

  // Local fallback
  const uploadsDir = path.join(__dirname, '../uploads');
  try {
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
  } catch (e) {
    return {
      secure_url: dataUri,
      public_id: `avatar_${Date.now()}`,
    };
  }
};

/**
 * Deletes file from Cloudinary or local disk
 * @param {string} publicId 
 * @param {string} resourceType 
 */
const deleteFile = async (publicId, resourceType = 'raw') => {
  if (!publicId) return;

  if (publicId.startsWith('data-uri') || publicId.startsWith('serverless_') || publicId.startsWith('avatar_')) {
    return;
  }

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
