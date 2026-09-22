import { approvePost, deletePost, deleteUser, rejectPost } from "../controllers/adminController";
import { protect } from "../middleware/authMiddleware";
import router from "./adminRoutes";

router.patch("/posts/:id/approve", protect, authorizeRole("admin"), approvePost);
router.patch("/posts/:id/reject", protect, authorizeRole("admin"), rejectPost);
router.delete("/posts/:id", protect, authorizeRole("admin"), deletePost);

router.delete("/users/:id", protect, authorizeRole("admin"), deleteUser);

module.exports = router;