// cloudConfig.js
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { Readable } = require("stream");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Custom Multer storage engine for Cloudinary v2
const storage = multer.memoryStorage(); // store files in memory first

const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    const readable = new Readable();
    readable.push(fileBuffer);
    readable.push(null);
    readable.pipe(stream);
  });
};

module.exports = { cloudinary, storage, uploadToCloudinary };



// import { v2 as cloudinary } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary-v2";

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });

// // Create storage instance for Multer
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "wanderlust_DEV",
//     allowedFormats: ["png", "jpg", "jpeg"],
//   },
// });

// // Export
// module.exports = {
//   cloudinary,
//   storage,
// };
