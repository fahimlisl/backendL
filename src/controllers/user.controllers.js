import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req,res) => {
    const {username , email , fullName , password} = req.body
    
    if (
        [fullName, email , username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400,`all fields are required`)
    }

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })

    if (existedUser) {
        throw new ApiError(409,"user already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverLocalPath = req.files?.coverImage[0]?.path;

    console.log(`code is only reaching till line 27 ,and in user controller`);
    if (!avatarLocalPath) {
        throw new ApiError(400,"avatar file is required")
        
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverLocalPath)
     

    // code isn't able to reach till here


    if (!avatar) {
        throw new ApiError(400,"avatar file is required")
        
    }


    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })


    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500,"soomething went wring while registering the user")
    }

    return res.status(201).json((
        new ApiResponse(200,createdUser,"usr registered successfully")
    ))

    
    
})

export {registerUser}



// whole procedure of logic backend

// get user details from frontend
// validation - not empty not repetitive
// checke if user already exist : username, email
// cehck for images, cehck for avatar , and  file uploading through multer and cloduinary 
// upload them to cloudinary , avatar
// create user obejct - create entry in db
// remove password and refresh token field from response 
// chec for user creation
// return response back