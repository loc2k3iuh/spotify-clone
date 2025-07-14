import { Router } from "express";
import { Song } from "../model/song.model.js";
import { Album } from "../model/album.model.js";
import { User } from "../model/user.model.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { getStats } from "../controller/stat.controller.js";

const router = Router();

router.get("/", protectRoute, requireAdmin, getStats);

export default router;
