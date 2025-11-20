import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong , while generating refresh and access Token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullName, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, `all fields are required`);
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "user already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverLocalPath = req.files?.coverImage[0]?.path;

  console.log(`code is only reaching till line 27 ,and in user controller`);
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverLocalPath);

  // code isn't able to reach till here

  if (!avatar) {
    throw new ApiError(400, "avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "soomething went wring while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "usr registered successfully"));
});

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

//logic for login User

// req body -> data
// username or email
// find the User
// password Check
// aceces and refresh token
// send cookie

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (
    // [username,email].some((field) => field?.trim() === "")
    !username ||
    !email
  ) {
    throw new ApiError(500, "username and email required");
  }

  if (!password) {
    throw new ApiError(500, "passowrd didn't recived");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(500, " user not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {
        user:loggedInUser,accessToken,refreshToken
    },"user logged in successfully"));
});


const logOutUser = asyncHandler( async(req,res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
      const options = {
    httpOnly: true,
    secure: true,
  };

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"user logged out sucessfully"))
})

const getUserChannelProfile = asyncHandler(async(req,res) => {
  const {username} = req.params
  if (!username?.trim()) {
    throw new ApiError(400,"username is missing")
  }

  const channel = await User.aggregate([
    {
      $match:{
        username: username?.toLowerCase()
      }
    },
    {
      $lookup:{
        from:"subscriptions", // gotta write mdoel for subscriotions
        localField:"_id",
        foreignField:"cahnnel",
        as:"subcribers"
      }
    },
    {
      $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"subscriber",
        as:"subscribedTo"
      }
    },
    {
      $addFields:{
        subcriebersCount:{
          $size: "$subscribers"
        },
        channelsSubscribedToCount: {
          $size:"$subscribedTo"
        }
      }
    }
  ])
})

export { registerUser, loginUser ,logOutUser };
