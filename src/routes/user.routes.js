import { Router } from "express";
import { changeCurrentPassword, loginUser, logOutUser, refreshAccessToken, registerUser } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middlewares.js"

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken)

// secured routes
router.route("/logout").post(verifyJWT,logOutUser)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)


export default router