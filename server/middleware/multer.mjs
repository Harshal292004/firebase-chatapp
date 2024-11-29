import multer from 'multer';
import { nanoid } from 'nanoid';
import path from 'path';
import fs from 'fs';

// Ensure the temp directory exists
const tempDirectory = './public/temp';
if (!fs.existsSync(tempDirectory)) {
    fs.mkdirSync(tempDirectory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDirectory); // Ensure file goes to the temp folder
    },
    filename: function (req, file, cb) {
        const id = nanoid();
        const ext = path.extname(file.originalname); // Get file extension
        cb(null, file.fieldname + '-' + id + ext);  // Set file name
    }
});

const upload = multer({ storage });

export { upload };
