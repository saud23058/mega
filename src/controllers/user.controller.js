import { ApiError } from "../utils/ApiError.js";
import { asynHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";
import {ApiResponse} from '../utils/ApiResponse.js'

const registerUser = asynHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;
  if (
    [username, email, fullname, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All field are required");
  }

  const existedUser =await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username is alreday existed");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
 
  //console.log(avatarLocalPath)

  //const coverImageLocalPath = req.files?.coverImage[0]?.path;
  
  // console.log(coverImageLocalPath)
  
  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage.path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await cloudinaryUpload(avatarLocalPath);
  const coverImage = await cloudinaryUpload(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

 const user= await User.create({
    username,
    email,
    password,
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
 });
  
  
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  )
  if (!createdUser) {
    throw new ApiError(500, "Error occured while registering the user")
  }

  return res.status(201).json(new ApiResponse(200, createdUser, "User Successfully Registered"))
});

export default registerUser;
