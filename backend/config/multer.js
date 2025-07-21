const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ads', // Optional folder name in your Cloudinary
    resource_type: 'video', // Important: MP3 is treated as video
    format: async () => 'mp3', // Optional force file extension
  },
});

const upload = multer({ storage });
module.exports = upload;
