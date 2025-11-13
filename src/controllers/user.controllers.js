import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";





// careting method for generatiing access and refresh token sepearetly 
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()

        user.refrehToken = refreshToken
        await user.save({validateBeforeSave : false})

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500,"something went wrong while generating refreh and access token")
    }
}



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

// todo
// get deatils from user = {username , password , email}
// use bcrypt to hash password and comapre 
// check use validation
// access and refresh token
// give access to user 
// send cookie
const loginUser = asyncHandler(async (req,res) => {
    const {username,email,password} = req.body
    if (!username || !email) {
        throw new ApiError(400, "username or email required")
    }

    const user = await User.findOne({
        $or:[{username},{email}]
    })

    if (!user) {
        throw new ApiError(404,"user dones't exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401,"password incorrect")
    }

    // generating refrehs and access token via method
    const {refreshToken, accessToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken") // this is opetinaonl recheck 

    const options = {
        httpOnly :true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken" , accessToken, options)
    .cookie("refreshToken",refreshToken, options)
    .json(
        new ApiError(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "user logged in successfully"
        )
    )
})

const logOutUser = asyncHandler( async(req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            },
        },
        {
            new: true
        }
        
    )
        const options = {
        httpOnly :true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json( new ApiResponse(200,{},"user logged out successfully"))
})
export {
    registerUser,
    loginUser,
    logOutUser
}




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







// import { asyncHandler } from "../utils/asyncHandler.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { User } from "../models/user.models.js";
// import { ApiError } from "../utils/ApiError.js";

// const registerUser = asyncHandler(async (req, res) => {
//   const { username, email, password, fullName } = req.body;

//   // validaton

//   if (
//     [username, email, fullName, password].some((field) => field?.trim() === "")
//   ) {
//     throw new ApiError(500, "require every field to filled on");
//   }

//   const existedUser = await User.findOne({
//     $or: [{ email }, { username }],
//   });

//   if (existedUser) {
//     console.log(`got error user exits already`);

//     throw new ApiError(408, "user already exists");
//   }

//   const avatarLocalPath = req.files?.avatar[0]?.path;
//   const coverIamgeLocalPath = req.files?.coverImage[0]?.path;

//   if (!avatarLocalPath) {
//     throw new ApiError(500, "avatar is required");
//   }

//   const avatar = await uploadOnCloudinary(avatarLocalPath);
//   const coverImage = await uploadOnCloudinary(coverIamgeLocalPath);
//   const user = await User.create({
//     username,
//     fullName,
//     avatar: avatar.url,
//     coverImage: coverImage?.url || "",
//     email,
//     password,
//   });
//   return res
//     .status(201)
//     .json(new ApiResponse(200, user, "user created successsfully "));
// });

// export { registerUser };
