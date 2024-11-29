import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

const uploadOnImageKit = async (localFilePath) => {
    if (!localFilePath) {
        console.error("No file path provided.");
        return { error: 'No file path provided' }; // Return a more descriptive error
    }

    try {
        // Check if the file exists before proceeding
        if (!fs.existsSync(localFilePath)) {
            console.error('File does not exist:', localFilePath);
            return { error: 'File not found' }; // Handle missing file scenario
        }

        const formData = new FormData();
        formData.append('file', fs.createReadStream(localFilePath)); // Read the file to upload

        const url = 'https://upload.imagekit.io/api/v1/files/upload';
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Basic ${process.env.IMAGEKIT_API_KEY}`  // Use env variable for security
            },
            body: formData
        };

        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok || data.error) {
            console.error('ImageKit upload failed:', data.error || 'Unknown error');
            return { error: 'ImageKit upload failed', details: data.error || 'Unknown error' }; // Return detailed error info
        }

        // Delete the local file after successful upload
        try {
            await fs.promises.unlink(localFilePath); // Cleanup temporary file
        } catch (unlinkError) {
            console.error('Error deleting local file:', unlinkError);
        }

        return { url: data.url };  // Return the URL of the uploaded image
    } catch (err) {
        console.error('Error in image upload process:', err);

        // Attempt to delete file if the upload fails
        try {
            await fs.promises.unlink(localFilePath);
        } catch (unlinkError) {
            console.error('Error deleting local file:', unlinkError);
        }

        return { error: 'Internal error during image upload', details: err.message }; // Return specific error message
    }
};

export default uploadOnImageKit;
