// routes/userRoutes.js
import express from "express";
import { login, register, getAllUsers } from "../controllers/authController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", upload.single('profilePhoto'), register);
router.get("/getallusers", getAllUsers);

export default router;
