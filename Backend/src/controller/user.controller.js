// import mongoose from "mongoose";
// import User from "../models/user.model.js";
// import jwt from "jsonwebtoken";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { ApiError } from "../utils/ApiError.js";

// const start = async (req, res) => {
//   if (req.user) {
//     return res.status(200).json(new ApiResponse(200, req.user, "User Found"));
//   } else {
//     return res.status(404).json(new ApiResponse(404, null, "User Not Found"));
//   }
// };

// const registerUser = async (req, res) => {
//   console.log("Registration Started");
//   const { fullName, email, password } = req.body;

//   if (!fullName || !email || !password) {
//     console.log("Registration Failed data insufficient");
//     return res
//       .status(400)
//       .json(
//         new ApiError(
//           400,
//           "Please provide all required fields: fullName, email, and password."
//         )
//       );
//   }

//   try {
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       console.log("Registration Failed already registered user");
//       return res
//         .status(409)
//         .json(new ApiError(409, "User already registered."));
//     }

//     const newUser = await User.create({
//       fullName,
//       email,
//       password,
//     });

//     console.log("Registration Successful");
//     res.status(201).json(
//       new ApiResponse(
//         201,
//         {
//           user: {
//             id: newUser._id,
//             fullName: newUser.fullName,
//             email: newUser.email,
//           },
//         },
//         "User successfully registered."
//       )
//     );
//   } catch (err) {
//     console.log("Registration Failed due to server error");
//     console.error("Error while creating user:", err);
//     return res
//       .status(500)
//       .json(new ApiError(500, "Internal Server Error.", [], err.stack));
//   }
// };

// const loginUser = async (req, res) => {
//   console.log("Login Started");
//   const { email, password } = req.body;

//   if (!email || !password) {
//     console.log("Login Failed: Missing required fields");
//     return res
//       .status(400)
//       .json(
//         new ApiError(
//           400,
//           "Please provide all required fields: email and password."
//         )
//       );
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       console.log("Login Failed: User not found");
//       return res.status(404).json(new ApiError(404, "User not found."));
//     }

//     const isPasswordCorrect = await user.comparePassword(password);

//     if (!isPasswordCorrect) {
//       console.log("Login Failed: Invalid credentials");
//       return res.status(401).json(new ApiError(401, "Invalid credentials.")); // Use 401 for bad creds
//     }

//     const jwtToken = jwt.sign(
//       { id: user.id },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: process.env.JWT_SECRET_EXPIRES_IN }
//     );
    
//     // **FIXED COOKIE OPTIONS FOR PRODUCTION**
//     const cookieOptions = {
//       httpOnly: true,
//       secure: true, // Must be true for cross-domain cookies
//       sameSite: "none", // Allows the cookie to be sent on requests from different domains
//       path: "/", // Ensure cookie is available on all paths
//       expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day expiration
//     };

//     console.log("Login Successful");
//     console.log("Cookie settings:", cookieOptions);
//     return res
//       .cookie("token", jwtToken, cookieOptions)
//       .status(200)
//       .json(
//         new ApiResponse(
//           200,
//           {
//             user: {
//               id: user._id,
//               email: user.email,
//               fullName: user.fullName,
//             },
//           },
//           "User logged in successfully."
//         )
//       );
//   } catch (err) {
//     console.log("Login Failed: Server error");
//     console.error("Error during login:", err);
//     return res
//       .status(500)
//       .json(new ApiError(500, "Internal Server Error", [], err.stack));
//   }
// };

// // **FIXED LOGOUT FUNCTION**
// const logoutUser = (req, res) => {
//   console.log("Logout attempt");
  
//   // Use the same secure options to clear the cookie
//   const cookieOptions = {
//     httpOnly: true,
//     secure: true,
//     sameSite: 'none',
//     path: "/"
//   };
  
//   return res
//     .clearCookie("token", cookieOptions)
//     .status(200)
//     .json(new ApiResponse(200, null, "User logged out successfully."));
// };

// export { start, loginUser, logoutUser, registerUser };


// import mongoose from "mongoose";
// import User from "../models/user.model.js";
// import jwt from "jsonwebtoken";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { ApiError } from "../utils/ApiError.js";

// const start = async (req, res) => {
//   if (req.user) {
//     return res.status(200).json(new ApiResponse(200, req.user, "User Found"));
//   } else {
//     return res.status(404).json(new ApiResponse(404, null, "User Not Found"));
//   }
// };

// const registerUser = async (req, res) => {
//   console.log("Registration Started");
//   const { fullName, email, password, niatId } = req.body;

//   if (!fullName || !email || !password || !niatId) {
//     console.log("Registration Failed data insufficient");
//     return res
//       .status(400)
//       .json(
//         new ApiError(
//           400,
//           "Please provide all required fields: Full Name, NIAT ID, Email, and Password."
//         )
//       );
//   }

//   try {
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       console.log("Registration Failed already registered user");
//       return res
//         .status(409)
//         .json(new ApiError(409, "User with this email already registered."));
//     }

//     const existingNiatId = await User.findOne({ niatId });
//     if (existingNiatId) {
//       console.log("Registration Failed already registered user with this NIAT ID");
//       return res
//         .status(409)
//         .json(new ApiError(409, "User with this NIAT ID already registered."));
//     }


//     const newUser = await User.create({
//       fullName,
//       niatId,
//       email,
//       password,
//     });

//     console.log("Registration Successful");
//     res.status(201).json(
//       new ApiResponse(
//         201,
//         {
//           user: {
//             id: newUser._id,
//             fullName: newUser.fullName,
//             email: newUser.email,
//             niatId: newUser.niatId,
//           },
//         },
//         "User successfully registered."
//       )
//     );
//   } catch (err) {
//     console.log("Registration Failed due to server error");
//     console.error("Error while creating user:", err);
//     return res
//       .status(500)
//       .json(new ApiError(500, "Internal Server Error.", [], err.stack));
//   }
// };

// const loginUser = async (req, res) => {
//   console.log("Login Started");
//   const { email, password } = req.body;

//   if (!email || !password) {
//     console.log("Login Failed: Missing required fields");
//     return res
//       .status(400)
//       .json(
//         new ApiError(
//           400,
//           "Please provide all required fields: email and password."
//         )
//       );
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       console.log("Login Failed: User not found");
//       return res.status(404).json(new ApiError(404, "User not found."));
//     }

//     const isPasswordCorrect = await user.comparePassword(password);

//     if (!isPasswordCorrect) {
//       console.log("Login Failed: Invalid credentials");
//       return res.status(401).json(new ApiError(401, "Invalid credentials.")); // Use 401 for bad creds
//     }

//     const jwtToken = jwt.sign(
//       { id: user.id },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: process.env.JWT_SECRET_EXPIRES_IN }
//     );
    
//     // **FIXED COOKIE OPTIONS FOR PRODUCTION**
//     const cookieOptions = {
//       httpOnly: true,
//       secure: true, // Must be true for cross-domain cookies
//       sameSite: "none", // Allows the cookie to be sent on requests from different domains
//       path: "/", // Ensure cookie is available on all paths
//       expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day expiration
//     };

//     console.log("Login Successful");
//     console.log("Cookie settings:", cookieOptions);
//     return res
//       .cookie("token", jwtToken, cookieOptions)
//       .status(200)
//       .json(
//         new ApiResponse(
//           200,
//           {
//             user: {
//               id: user._id,
//               email: user.email,
//               fullName: user.fullName,
//               niatId: user.niatId,
//             },
//           },
//           "User logged in successfully."
//         )
//       );
//   } catch (err) {
//     console.log("Login Failed: Server error");
//     console.error("Error during login:", err);
//     return res
//       .status(500)
//       .json(new ApiError(500, "Internal Server Error", [], err.stack));
//   }
// };

// // **FIXED LOGOUT FUNCTION**
// const logoutUser = (req, res) => {
//   console.log("Logout attempt");
  
//   // Use the same secure options to clear the cookie
//   const cookieOptions = {
//     httpOnly: true,
//     secure: true,
//     sameSite: 'none',
//     path: "/"
//   };
  
//   return res
//     .clearCookie("token", cookieOptions)
//     .status(200)
//     .json(new ApiResponse(200, null, "User logged out successfully."));
// };

// export { start, loginUser, logoutUser, registerUser };


import mongoose from "mongoose";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const start = async (req, res) => {
  if (req.user) {
    return res.status(200).json(new ApiResponse(200, req.user, "User Found"));
  } else {
    return res.status(404).json(new ApiResponse(404, null, "User Not Found"));
  }
};

const registerUser = async (req, res) => {
  console.log("Registration Started");
  const { fullName, email, password, niatId } = req.body;

  if (!fullName || !email || !password || !niatId) {
    console.log("Registration Failed data insufficient");
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "Please provide all required fields: Full Name, NIAT ID, Email, and Password."
        )
      );
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("Registration Failed already registered user");
      return res
        .status(409)
        .json(new ApiError(409, "User with this email already registered."));
    }

    const existingNiatId = await User.findOne({ niatId });
    if (existingNiatId) {
      console.log("Registration Failed already registered user with this NIAT ID");
      return res
        .status(409)
        .json(new ApiError(409, "User with this NIAT ID already registered."));
    }


    const newUser = await User.create({
      fullName,
      niatId,
      email,
      password,
    });

    console.log("Registration Successful");
    res.status(201).json(
      new ApiResponse(
        201,
        {
          user: {
            id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            niatId: newUser.niatId,
          },
        },
        "User successfully registered."
      )
    );
  } catch (err) {
    console.log("Registration Failed due to server error");
    console.error("Error while creating user:", err);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error.", [], err.stack));
  }
};

const loginUser = async (req, res) => {
  console.log("Login Started");
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Login Failed: Missing required fields");
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "Please provide all required fields: email and password."
        )
      );
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("Login Failed: User not found");
      return res.status(404).json(new ApiError(404, "User not found."));
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      console.log("Login Failed: Invalid credentials");
      return res.status(401).json(new ApiError(401, "Invalid credentials.")); // Use 401 for bad creds
    }

    const jwtToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_SECRET_EXPIRES_IN }
    );
    
    // **FIXED COOKIE OPTIONS FOR PRODUCTION**
    const cookieOptions = {
      httpOnly: true,
      secure: true, // Must be true for cross-domain cookies
      sameSite: "none", // Allows the cookie to be sent on requests from different domains
      path: "/", // Ensure cookie is available on all paths
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day expiration
    };

    console.log("Login Successful");
    console.log("Cookie settings:", cookieOptions);
    return res
      .cookie("token", jwtToken, cookieOptions)
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            user: {
              id: user._id,
              email: user.email,
              fullName: user.fullName,
              niatId: user.niatId,
            },
          },
          "User logged in successfully."
        )
      );
  } catch (err) {
    console.log("Login Failed: Server error");
    console.error("Error during login:", err);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", [], err.stack));
  }
};

const logoutUser = (req, res) => {
  console.log("Logout attempt");
  
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: "/"
  };
  
  return res
    .clearCookie("token", cookieOptions)
    .status(200)
    .json(new ApiResponse(200, null, "User logged out successfully."));
};

const forgotPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json(new ApiError(400, "All fields are required."));
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json(new ApiError(400, "Passwords do not match."));
  }

  if (newPassword.length < 6) {
    return res.status(400).json(new ApiError(400, "Password must be at least 6 characters long."));
  }
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(new ApiError(404, "User with this email does not exist."));
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await User.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });

    return res.status(200).json(new ApiResponse(200, null, "Password has been reset successfully."));
  } catch (err) {
    console.error("Error during password reset:", err);
    return res.status(500).json(new ApiError(500, "Internal Server Error during password reset.", [], err.stack));
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json(new ApiError(400, "All fields are required."));
  }
  
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json(new ApiError(400, "New passwords do not match."));
  }

  if (newPassword.length < 6) {
    return res.status(400).json(new ApiError(400, "New password must be at least 6 characters long."));
  }
  
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found."));
    }

    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json(new ApiError(401, "Incorrect current password."));
    }

    // This is the same logic as forgotPassword to prevent validation errors.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await User.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });

    return res.status(200).json(new ApiResponse(200, null, "Password changed successfully."));
  } catch (err) {
    console.error("Error changing password:", err);
    return res.status(500).json(new ApiError(500, "Internal Server Error.", [], err.stack));
  }
};

export { start, loginUser, logoutUser, registerUser, forgotPassword, changePassword };
