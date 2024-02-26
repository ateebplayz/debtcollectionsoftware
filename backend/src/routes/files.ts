import express from 'express';
import multer from 'multer';
import path from 'path';
import { Request, Response } from 'express';

const upload = multer({ 
  dest: "uploads/",
  fileFilter: (req, file, callback) => {
    // Only allow PDF files
    if (!file.originalname.match(/\.(pdf)$/)) {
      return callback(new Error('Only PDF files are allowed'));
    }
    callback(null, true);
  },
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'uploads/');
    },
    filename: (req, file, callback) => {
      // Use the original filename with the .pdf extension
      const pdfFilename = file.originalname.replace(/\.[^/.]+$/, "") + '.pdf';
      callback(null, pdfFilename);
    }
  })
});

const router = express.Router();

// Middleware to serve uploaded files statically
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

function uploadFiles(req: Request, res: Response) {
  // Check if files were uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  // Access the uploaded files
  const uploadedFiles = req.files as Express.Multer.File[];

  // Return the file names and paths
  const fileInfos = uploadedFiles.map(file => {
    return {
      originalName: file.originalname,
      url: `http://localhost:8080/uploads/${file.filename}` // Construct URL for accessing the file
    };
  });

  res.json({ message: "Successfully uploaded files", files: fileInfos });
}

router.post('/upload', upload.array("files"), uploadFiles);

export default router;
