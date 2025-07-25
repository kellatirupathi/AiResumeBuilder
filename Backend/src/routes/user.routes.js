// import {
//   start,
//   loginUser,
//   logoutUser,
//   registerUser,
// } from "../controller/user.controller.js";
// import { Router } from "express";
// import { isUserAvailable } from "../middleware/auth.js";

// const router = Router();

// router.get("/", isUserAvailable, start);
// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.get("/logout", isUserAvailable, logoutUser);

// export default router;


import {
  start,
  loginUser,
  logoutUser,
  registerUser,
  forgotPassword,
  changePassword
} from "../controller/user.controller.js";
import { Router } from "express";
import { isUserAvailable } from "../middleware/auth.js";

const router = Router();

router.get("/", isUserAvailable, start);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", isUserAvailable, logoutUser);
router.post("/forgot-password", forgotPassword); // Public route for password reset
router.post("/change-password", isUserAvailable, changePassword); // Protected route for password change

export default router;
