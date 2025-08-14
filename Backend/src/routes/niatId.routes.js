import { Router } from "express";
import { isAdmin } from "../middleware/adminAuth.js";
import { 
    getAllNiatIds,
    addSingleNiatId,
    addBulkNiatIds,
    deleteNiatId
} from "../controller/niatId.controller.js";

const router = Router();

// ALL ROUTES ARE PROTECTED BY ADMIN AUTH
router.use(isAdmin);

router.get("/", getAllNiatIds);
router.post("/add", addSingleNiatId);
router.post("/add-bulk", addBulkNiatIds);
router.delete("/:id", deleteNiatId);

export default router;
