// verify if the user exists or not
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // get the token either from the cookies or the header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // check if we found the token
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // verify the token with access token secret
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    // if we are able to find the user then we can add the user to the req object, now this is avaliable everywhere in the code
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invlaid access token");
  }
});
