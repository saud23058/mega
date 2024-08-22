import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // use for file handling buildin in Nodejs
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const cloudinaryUpload = async (filePath) => {
  try {
    if (!filePath) return null;
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    console.log("File uploaded Successfully : ", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(filePath) // remove the locally saved file if the upload operation got failed
    return null;
  }
};


export {cloudinaryUpload}