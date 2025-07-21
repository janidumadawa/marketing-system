const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const Ad = require('../models/Ad');

// POST /api/ads/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { clientId, date, message } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const fileUrl = req.file.path;
    const publicId = req.file.filename;

    const newAd = await Ad.create({
      clientId,
      fileUrl,
      publicId,
      date: date || null,
      message: message || "",
    });

    res.status(201).json({ success: true, ad: newAd });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
