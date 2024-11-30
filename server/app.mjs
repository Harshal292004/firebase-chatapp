import express from "express";
import cors from "cors";
import { upload } from "./middleware/multer.mjs";  // Ensure you use the correct file path for multer middleware
import uploadOnImageKit from "./config/imagekit.mjs"; // Ensure to import the ImageKit function correctly

const app = express();

// Middleware
app.use(cors());

// Route to handle image upload
app.post("/upload", upload.single("avatar"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }


    try {
        const uploadResult = await uploadOnImageKit(req.file.path);
        if (uploadResult) {
            res.json({ url: uploadResult });  // Explicitly check for url
        } else {
            res.status(500).json({ 
                error: 'Failed to upload image', 
                details: uploadResult
            });
        }
    } catch (error) {
        console.error("Error in upload process:", error);
        res.status(500).json({ error: "Internal server error" });
    }

});

// Set the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
