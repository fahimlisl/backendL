// import { v2 as cloudinary } from 'cloudinary';
// import fs from "fs"



// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// })

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null
//         // upload file on cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath , {
//             resource_type: "auto"
//         }) 
//         //file has been uploaded successfully
//         console.log(`file is uploaded on clodinary , url is :  ${response.url} and the log of response is ${response}`);
//         return response
//     } catch (error) {
//         fs.unlinkSync(localFilePath) // remove the locally saved temporay file as the uplaod operation got failed         
//         return null;
//     }
// }


// export {uploadOnCloudinary}



import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})


const uploadOnCloudinary = async function(localFilePath){
    try {
        if(!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type:"auto"
        })
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
    }

}