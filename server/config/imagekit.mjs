import fs from 'fs';
import axios from 'axios';

const uploadOnImageKit = async (localFilePath) => {
    
    if (!localFilePath) {
        return { error: 'No file path provided' };
    }

    try {
        
        if (!fs.existsSync(localFilePath)) {
            return { error: 'File not found' };
        }
        const url = 'https://upload.imagekit.io/api/v1/files/upload';
        
        const fileName = localFilePath.split('/').pop(); 
        
        const privateKey = 'private_wHqUi6dEdk0iXg9mlZqsqoU8+FA=';
        
        const credentials = `${privateKey}:`;
        
        const encodedCredentials = Buffer.from(credentials).toString('base64');
        
        const authHeader = `Basic ${encodedCredentials}`;
        
        const formData = new FormData();
        
        formData.append('file', fs.createReadStream(localFilePath));
       
        formData.append('fileName', fileName);

        const response = await axios.post(url, formData, {
            headers: {
                Authorization: authHeader,
            },
        });

        if (response.status >= 200 && response.status < 300) {
            console.log('Image uploaded successfully:', response.data);

            // Delete the local file after a successful upload
            try {
                await fs.promises.unlink(localFilePath);     
                console.log('Temporary file deleted successfully.');
            } catch (unlinkError) {
                console.error('Error deleting local file:', unlinkError);
            }

            return { url: response.data.url };
        } else {
            console.error('Image upload failed:', response.data);
            return { error: 'Upload failed', details: response.data };
        }
    } catch (err) {
        console.error('Error in image upload process:', err);

        // Attempt to delete the file if the upload fails
        try {
            await fs.promises.unlink(localFilePath);
        } catch (unlinkError) {
            console.error('Error deleting local file:', unlinkError);
        }

        return { error: 'Internal error during image upload', details: err.message };
    }
};

export default uploadOnImageKit;