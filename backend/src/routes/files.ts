import express from 'express';
import multer from 'multer';
import path from 'path';
import { Request, Response } from 'express';
import config from '../config';
import cors from 'cors';

const upload = multer({ 
  dest: "uploads/",
  fileFilter: (req, file, callback) => {
    // Allow all document types
    if (!file.originalname.match(/\.(doc|docx|pdf|txt|png|jpg|jpeg)$/)) {
      return callback(new Error('Only document files (doc, docx, pdf, txt) are allowed'));
    }
    console.log(file.originalname)
    callback(null, true);
  },
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'uploads/');
    },
    filename: (req, file, callback) => {
      const extension = file.originalname.split('.').pop();
      const filename = `${file.originalname}`;
      callback(null, filename);
    }
  })
});

const router = express.Router();

// Middleware to serve uploaded files statically
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

router.use(cors());

function uploadFiles(req: Request, res: Response) {
  // Check if files were uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  // Access the uploaded files
  const uploadedFiles = req.files as Express.Multer.File[];
  const fileUrls: string[] = [];

  // Construct array of URLs for uploaded files
  uploadedFiles.forEach(file => {
    const fileUrl = `${config.backendUri}uploads/${file.filename}`;
    fileUrls.push(fileUrl);
  });

  res.json({ data: fileUrls, code: 200 });
}

router.post('/upload', upload.array("files"), uploadFiles);

export default router;
