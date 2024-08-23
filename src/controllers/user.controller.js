import { ApiError } from "../utils/ApiError.js";
import { asynHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefereshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refereshToken = user.generateRefreshToken();
    user.refereshToken = refereshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refereshToken };
  } catch (error) {
    throw new ApiError(404, "Error occured during generaaing the tokens");
  }
};

const registerUser = asynHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;
  if (
    [username, email, fullname, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All field are required");
  }

  const existedUser = await User.findOne({
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
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
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

  const user = await User.create({
    username,
    email,
    password,
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Error occured while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Successfully Registered"));
});

const loginUser = asynHandler(async (req, res) => {
  const { username, password, email } = req.body;

  if (!email || !username) {
    throw new ApiError(404, "username or email are required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "user not foud");
  }
  const validPassword = await user.isCorrectPassword(password);

  if (!validPassword) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { refereshToken, accessToken } = await generateAccessAndRefereshToken(
    user._id
  );

  const loggedInUser = User.findById(user._id).select(
    "-password -refereshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refereshToken", refereshToken, options)
    .json(
      new ApiResponse(200),
      {
        user: accessToken,
        refereshToken,
        loggedInUser,
      },
      "User Logged In Successfully"
    );
});

const logoutUser = asynHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refereshToken: undefined,
    },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refereshToken", options)
    .json(new ApiResponse(200), {}, "Logout Successfully");
});

export { registerUser, loginUser, logoutUser };
