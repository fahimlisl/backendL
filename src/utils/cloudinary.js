import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv"

dotenv.config() // but why import dotenv again

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
    });
    console.log("Checking file exists:", fs.existsSync(localFilePath));
    //file has been uploaded successfully
    console.log(
      `file is uploaded on clodinary , url is :  ${response.url} and the log of response is ${response}`
    );

    
    fs.unlinkSync(localFilePath);
    console.log(`finally uploaded to cloudinary and deleted form local machine`);
    return response;
  } catch (error) {
    console.log(`cloudinary upload failed ${error}`);
    // fs.unlinkSync(localFilePath) // remove the locally saved temporay file as the uplaod operation got failed
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log(`Local file deleted after failed upload`);
    }
    return null;
  }
};

export { uploadOnCloudinary };

// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// import path from "path";

// const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null;

//     cloudinary.config({
//       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//       api_key: process.env.CLOUDINARY_API_KEY,
//       api_secret: process.env.CLOUDINARY_API_SECRET,
//     });

//     const absolutePath = path.resolve(localFilePath);

//     const response = await cloudinary.uploader.upload(absolutePath, {
//       resource_type: "auto",
//     });

//     console.log("finally uploaded to cloudinary :", response.url);

//     if (fs.existsSync(absolutePath)) fs.unlinkSync(absolutePath);
//     return response;
//   } catch (error) {
//     console.error("cloudinary upload failed:", error);
//     if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
//     // fs.unlinkSync(localFilePath)
//     return null;
//   }
// };

// export { uploadOnCloudinary };
