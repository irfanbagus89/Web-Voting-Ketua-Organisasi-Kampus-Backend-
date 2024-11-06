const express = require("express");
const {createUser,loginUserCtrl,getAllUser,getAUser,deleteAUser,updateAUser,handleRefreshToken,logout,} = require("../controllers/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/all-users", getAllUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/:id", authMiddleware, isAdmin, getAUser);
router.delete("/:id", deleteAUser);
router.put("/edit-user", authMiddleware, updateAUser);

module.exports = router;
