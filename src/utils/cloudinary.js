import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const cloudinaryUpload = async (filePath) => {
  if (!filePath) return null;

  try {
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    // console.log("File uploaded successfully: ", response.url)
    fs.unlinkSync(filePath)
    return response;
  } catch (error) {
    console.error("Upload failed: ", error);
    
    try {
      fs.unlinkSync(filePath); // Remove the locally saved file if the upload operation fails
    } catch (fsError) {
      console.error("Failed to delete local file: ", fsError);
    }

    return null;
  }
};

export { cloudinaryUpload };
