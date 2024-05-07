import express from "express";
import { checkoutOrder, getOrdersBySellerId, updateOrderStatus } from "../controllers/orderController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/checkout-order/:postId/:customerId", protectRoute, checkoutOrder);
router.get("/get-order-by-seller-id/:sellerId", protectRoute, getOrdersBySellerId);
router.put("/update-order-status/:orderId", protectRoute, updateOrderStatus);

export default router;
