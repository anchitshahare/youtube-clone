import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from '../middlewares/multer.middleware.js'

const router = Router();

router.route("/register").post(
    upload.fields([ // this is how a middleware is executed by calling the middleware function just before the function before which that function is to be performed
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]), 
    registerUser
)
// http://localhost:8000/api/v1/users/register

export default router