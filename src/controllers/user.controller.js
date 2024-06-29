import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    // get user details from the frontend
    
    const {fullname, username, email, password} = req.body
    // console.log("email: ", email)

    // validation - one basic to do is not empty

    // below way can used to validate each and every variable
    /*
    if(fullname === "") {
        throw new ApiError(400, "fullname is required")
    } */
    if (
        [fullname, username, email, password].some((field) => field?.trim() === "") // if any field is empty it will trim the field but if it is still empty then this returns true
    ) {
        throw new ApiError(400, "All fields are required")
    }
    
    // check if user already exists: username or email
    const existedUser = User.findOne({
        $or: [{ username }, { email }] // this is a or operator that means either username or email
    })

    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }
    // check for images, check for avatar (mandatory)
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    // upload them to cloudinary, check if avatar was uploaded
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
    if(!avatar) {
        throw new ApiError(400, "Avatar upload failed")
    }

    // create user object - create entry in database
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", // cover image is not mandatory so if the user is not uploading cover image then assign an empty string
        username: username.toLowerCase(),
        email,
        password
    })

    // remove password and refresh token field from the response
    const createdUser = await User.findById(user._id).select( // here we are checking if the user is found or not
        "-password -refreshToken" // here we are removing password and refresh token
    )
    
    // check for user creation
    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

export {registerUser}