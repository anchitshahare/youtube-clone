import { v2 as cloudinary } from "cloudinary";
import fs from 'fs' // nodejs method to read, write, remove, etc. files


// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});

// method to upload file on cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been successfully uploaded
        console.log("File uploaded on cloudinary ", response.url);
        return response 
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload failed
        return null
    }
}

export {uploadOnCloudinary}