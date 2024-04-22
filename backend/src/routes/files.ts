import express from 'express';
import multer from 'multer';
import path from 'path';
import { Request, Response } from 'express';
import config from '../config';
import cors from 'cors'

const upload = multer({ 
  dest: "uploads/",
  fileFilter: (req, file, callback) => {
    // Allow all document types
    if (!file.originalname.match(/\.(doc|docx|pdf|txt|png|jpg|jpeg)$/)) {
      return callback(new Error('Only document files (doc, docx, pdf, txt) are allowed'));
    }
    callback(null, true);
  },
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'uploads/');
    },
    filename: (req, file, callback) => {
      // Use the original filename with the appropriate extension
      const extension = file.originalname.split('.').pop();
      const filename = `${file.fieldname}-${Date.now()}.${extension}`;
      callback(null, filename);
    }
  })
});


const router = express.Router();

// Middleware to serve uploaded files statically
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));


router.use(cors())
function uploadFiles(req: Request, res: Response) {
  // Check if files were uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  // Access the uploaded files
  const uploadedFiles = req.files as Express.Multer.File[]
  res.json({ data: `${config.backendUri}uploads/${uploadedFiles[0].filename}`, code: 200 });
}

router.post('/upload', upload.array("files"), uploadFiles);

export default router;
