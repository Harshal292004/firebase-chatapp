import multer from 'multer';
import { nanoid } from 'nanoid';
import path from 'path';
import fs from 'fs';

// Ensure the temp directory exists
const tempDirectory = path.resolve('public', 'temp');

if (!fs.existsSync(tempDirectory)) {
    fs.mkdirSync(tempDirectory, { recursive: true});
}

console.log(`Temporary directory : ${tempDirectory}`);  // Check the full path of tempDirectory


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDirectory); 
    },
    filename: function (req, file, cb) {
        const id = nanoid();
        console.log(`Nanoid:${id}`)
        const ext = path.extname(file.originalname); // Get file extension
        console.log(`Extension: ${ext}`)
        cb(null, file.fieldname + '-' + id + ext);  // Set file name
        console.log(file.fieldname)
        
    }
});

const upload = multer({ storage });

export { upload };
