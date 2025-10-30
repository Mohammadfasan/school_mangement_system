// services/imagekitService.js
const imagekit = require('../config/imagekitConfig');

class ImageKitService {
  static async uploadImage(file, folder = 'general') {
    try {
      console.log('📤 Uploading image to ImageKit...');
      
      const result = await imagekit.upload({
        file: file.buffer,
        fileName: `achievement_${Date.now()}_${file.originalname}`,
        folder: `/school_management/${folder}`,
        useUniqueFileName: true,
      });

      console.log('✅ Image uploaded successfully:', result.url);
      return {
        url: result.url,
        fileId: result.fileId
      };
    } catch (error) {
      console.error('❌ ImageKit upload error:', error);
      throw new Error('Image upload failed: ' + error.message);
    }
  }

  static async deleteImage(fileId) {
    try {
      await imagekit.deleteFile(fileId);
      console.log('✅ Image deleted from ImageKit:', fileId);
    } catch (error) {
      console.error('❌ ImageKit delete error:', error);
      // Don't throw error for deletion failures
    }
  }
}

module.exports = ImageKitService;