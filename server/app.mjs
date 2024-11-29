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
        // Pass file path to ImageKit upload function
        const fileUrl = await uploadOnImageKit(req.file.path);

        if (fileUrl) {
            res.json({ url: fileUrl });  // Return the uploaded file URL to the client
        } else {
            res.status(500).json({ error: 'Failed to upload image' });
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
