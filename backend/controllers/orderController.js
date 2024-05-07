import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";

const checkoutOrder = async (req, res) => {

    const { quantity, address, total, contact_number, seller } = req.body;
	const { postId, customerId } = req.params;

	try {
		

		if (!quantity || !address || !total ||!contact_number) {
			return res.status(400).json({ error: "All fields are required"});
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Product not found" });
		}

        const user = await User.findById(customerId)
		if (!user) {
			return res.status(401).json({ error: "Buyer not found" });
		}

        const sellerInfo = await User.findById(seller)
		if (!sellerInfo) {
			return res.status(401).json({ error: "Seller not found" });
		}

		const newOrder = new Order({
            product: postId,
            buyer: customerId,
            quantity,
            address,
            contact_number,
            total,
            seller:sellerInfo._id,
        });

        await newOrder.save();

        post.quantity = parseInt(post.quantity) - parseInt(quantity)
        post.order_count = parseInt(post.order_count) + 1
        await post.save()

		res.status(201).json(newOrder);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log(err);
	}
};

const getOrdersBySellerId = async (req, res) => {
	const { sellerId } = req.params;

	try {

		const seller = await User.findById(sellerId);
		if (!seller) {
			return res.status(404).json({ error: "Seller not found" });
		}

		const orders = await Order.find({ seller: seller._id }).sort({ createdAt: -1 }).populate('buyer').populate('product');

		console.log(orders);
		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const updateOrderStatus = async (req, res) => {
	const {status} = req.body;
	const { orderId } = req.params;

	try {
		
		const order = await Order.findById(orderId);
		if (!order) {
			return res.status(404).json({ error: "Order not found" });
		}

		order.status = status;
		order.save()

		res.status(200).json(order);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export {checkoutOrder, getOrdersBySellerId, updateOrderStatus}