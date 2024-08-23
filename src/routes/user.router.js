import { Router } from "express";
import upload from "../middlewares/multer.middleware.js"
import {loginUser, logoutUser, registerUser} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.post("/register",upload.fields([
  {
    name: "avatar",
    maxCount:1,
  },
  {
    name: "coverImage",
    maxCount:1,
  },
]), registerUser);


router.post("/login", loginUser);

router.post("/logout",verifyJWT,logoutUser)


export default router;
