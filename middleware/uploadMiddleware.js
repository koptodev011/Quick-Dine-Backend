// middleware/uploadMiddleware.js
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'uploads';
    const categoryDir = req.body.category || 'misc';
    const fullPath = path.join(uploadDir, categoryDir);
    
    try {
      await fs.mkdir(fullPath, { recursive: true });
      cb(null, fullPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'), false);
  }
};

// Create multer instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to handle file uploads
export const uploadFile = async (file, category = 'misc') => {
  try {
    const uploadDir = 'uploads';
    const categoryDir = category;
    const fullPath = path.join(uploadDir, categoryDir);
    
    await fs.mkdir(fullPath, { recursive: true });
    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    const filePath = path.join(categoryDir, filename);
    
    await fs.rename(file.path, path.join(uploadDir, filePath));
    
    return {
      success: true,
      path: filePath
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
