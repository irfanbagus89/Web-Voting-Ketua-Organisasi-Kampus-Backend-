const { generateToken } = require("../configs/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDBid = require("../utils/validateMongoDBid");
const { generateRefreshToken } = require("../configs/refreshToken");
const jwt = require("jsonwebtoken");

// Create User
const createUser = asyncHandler(async (req, res) => {
  const nbi = req.body.nbi;
  const email = req.body.email;
  const findNbi = await User.findOne({ nbi: nbi });
  const findEmail = await User.findOne({ email: email });
  if (!findNbi || !findEmail) {
    if (findNbi) {
      throw new Error("NBI Sudah Terdaftar");
    } else if (findEmail) {
      throw new Error("Email Sudah Terdaftar");
    } else{
        //Create new user
        const newUser = await User.create(req.body);
        res.json(newUser);      
    }
  } else {
    throw new Error("User Sudah Terdaftar");
  }
});

// Login User
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { nbi, password } = req.body;
  const findUser = await User.findOne({ nbi });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 24 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      name: findUser?.name,
      nbi: findUser?.email,
      prodi: findUser?.prodi,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// Handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error("No Refresh Token in Cookies");
  } else {
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      throw new Error("No Refresh Token present in db or not matched");
    } else {
      jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
          throw new Error("There is something wrong with refresh token");
        } else {
          const accessToken = generateToken(User?._id);
          res.json({ accessToken });
        }
      });
    }
  }
});

// Logout User
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error("No Refresh Token in Cookies");
  } else {
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      res.sendStatus(204); //forbiden
    } else {
      await User.findOneAndUpdate({
        refreshToken: "",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      res.sendStatus(204); //forbiden
    }
  }
});

// Get All User
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUser = await User.find();
    res.json(getUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Get One User
const getAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBid(id);
  try {
    const getUser = await User.findById(id);
    res.json(getUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Update User
const updateAUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDBid(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        name: req?.body?.name,
      },
      {
        new: true,
      }
      
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete User
const deleteAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBid(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json(deleteUser);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUserCtrl,
  getAllUser,
  getAUser,
  deleteAUser,
  updateAUser,
  handleRefreshToken,
  logout,
};
