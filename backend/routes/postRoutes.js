import express from "express";
import {
	createPost,
	deletePost,
	getPost,
	likeUnlikePost,
	replyToPost,
	getFeedPosts,
	getUserPosts,
	getSellerPosts,
	createSellerPost,
	updateSellerPost,
	createEvent,
	getEvents,
	buyEventTicket,
	updateEvent
} from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPosts);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost);
router.get("/get-products-cy-seller-id/:sellerId", getSellerPosts);
router.post("/create-seller-post", protectRoute, createSellerPost);
router.put("/update-seller-post/:productId", protectRoute, updateSellerPost);
router.post("/create-event", protectRoute, createEvent);
router.get("/get-events-by-user-id/:userId", protectRoute, getEvents);
router.put("/buy-event-ticket/:eventId/:userId", protectRoute, buyEventTicket);
router.put("/update-event/:eventId", protectRoute, updateEvent);

export default router;
