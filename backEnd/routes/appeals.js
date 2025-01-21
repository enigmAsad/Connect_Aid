// backend/routes/appeals.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const Appeal = require('../models/Appeal');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Configure S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Helper function to upload to S3
const uploadToS3 = async (file, folder) => {
  const fileKey = `${folder}/${uuidv4()}-${file.originalname}`;
  
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype
  }));

  return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${fileKey}`;
};

// Create new appeal
router.post('/', 
  authMiddleware,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
  ]),
  async (req, res) => {
    try {
      console.log('Request body:', req.body);
      console.log('Files received:', req.files);
      console.log('User from auth:', req.user);

      const appealData = JSON.parse(req.body.appealData);
      console.log('Parsed appeal data:', appealData);

      const files = req.files;

      if (!files?.image?.[0]) {
        console.log('No image file found');
        return res.status(400).json({ message: 'Image is required' });
      }

      // Upload image
      console.log('Uploading image to S3...');
      const imageUrl = await uploadToS3(files.image[0], 'appeals/images');
      console.log('Image uploaded, URL:', imageUrl);

      // Upload documents if any
      const documentUrls = [];
      if (files.documents) {
        console.log('Uploading documents to S3...');
        for (const doc of files.documents) {
          const docUrl = await uploadToS3(doc, 'appeals/documents');
          documentUrls.push(docUrl);
        }
        console.log('Documents uploaded, URLs:', documentUrls);
      }

      // Create appeal
      console.log('Creating appeal in database...');
      const appeal = new Appeal({
        ...appealData,
        userId: req.user.id,
        imageUrl,
        documentUrls
      });

      console.log('Appeal object before save:', appeal);

      await appeal.save();
      console.log('Appeal saved successfully');
      
      res.status(201).json({ appeal });
    } catch (error) {
      console.error('Error creating appeal:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ 
        message: 'Error creating appeal', 
        error: error.message,
        stack: error.stack 
      });
    }
  }
);

// Get all appeals
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all appeals...');
    const appeals = await Appeal.find({ status: 'active' })
      .sort({ createdAt: -1 });
    console.log('Appeals fetched:', appeals.length);
    res.json({ appeals });
  } catch (error) {
    console.error('Error fetching appeals:', error);
    res.status(500).json({ message: 'Error fetching appeals', error: error.message });
  }
});

module.exports = router;