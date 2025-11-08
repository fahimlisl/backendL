import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import path from "path"




const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
        // upload file on cloudinary
        console.log("Checking file exists:", fs.existsSync(localFilePath));
        const response = await cloudinary.uploader.upload(localFilePath , {
            resource_type: "auto"
        })
        //file has been uploaded successfully
        console.log(`file is uploaded on clodinary , url is :  ${response.url} and the log of response is ${response}`);
        return response
    } catch (error) {
        console.log(`cloudinary upload failed ${error}`)
        fs.unlinkSync(localFilePath) // remove the locally saved temporay file as the uplaod operation got failed         
        return null;
    }
}


export {uploadOnCloudinary}




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
