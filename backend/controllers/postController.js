import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
	try {
		const { postedBy, text } = req.body;
		let { img } = req.body;

		if (!postedBy || !text) {
			return res.status(400).json({ error: "Postedby and text fields are required" });
		}

		const user = await User.findById(postedBy);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (user._id.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to create post" });
		}

		const maxLength = 500;
		if (text.length > maxLength) {
			return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newPost = new Post({ postedBy, text, img });
		await newPost.save();

		res.status(201).json(newPost);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log(err);
	}
};

const getPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}
		console.log("Getting post ======================");
		console.log(post);
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to delete post" });
		}

		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const likeUnlikePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Post unliked successfully" });
		} else {
			// Like post
			post.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Post liked successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const replyToPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const reply = { userId, text, userProfilePic, username };

		post.replies.push(reply);
		await post.save();

		res.status(200).json(reply);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getFeedPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({
            $or: [
                { postedBy: { $in: following } },
                { post_type: 0 },
				{ post_type: 1 },
				{ post_type: 2 }
            ]
        }).sort({ createdAt: -1 });

		// const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

		res.status(200).json(feedPosts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const createSellerPost = async (req, res) => {
	try {
		const { postedBy, text, quantity, unit_price } = req.body;
		let { img } = req.body;
		const post_type = 1;

		if (!postedBy || !text) {
			return res.status(400).json({ error: "Postedby and text fields are required" });
		}

		const user = await User.findById(postedBy);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newSellerPost = new Post({ postedBy, text, img, quantity, unit_price, post_type });
		await newSellerPost.save();

		console.log("post published");
		console.log(newSellerPost);

		res.status(201).json(newSellerPost);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log(err);
	}
};

const updateSellerPost = async (req, res) => {
	try {
		const { text, quantity, unit_price, imgChanged } = req.body;
		const {productId} = req.params
		let { img } = req.body;

		if (!productId ) {
			return res.status(400).json({ error: "productId and text fields are required" });
		}

		const product = await Post.findById(productId);
		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		if (imgChanged && img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		product.text = text;
		product.img = img;
		product.quantity = quantity;
		product.unit_price =  unit_price;

		await product.save();

		res.status(201).json(product);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log(err);
	}
};

const getSellerPosts = async (req, res) => {
	const { sellerId } = req.params;
	console.log(sellerId);
	try {
		const user = await User.findById(sellerId);
		if (!user) {
			return res.status(404).json({ error: "Seller not found" });
		}

		const posts = await Post.find({ post_type: 1, postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const createEvent = async (req, res) => {
	try {
		const { postedBy, text, ticket_count, ticket_price, event_date } = req.body;
		let { img } = req.body;
		const post_type = 2;

		if (!postedBy || !text) {
			return res.status(400).json({ error: "Postedby and text fields are required" });
		}

		const user = await User.findById(postedBy);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newEvent = new Post({ postedBy, text, img, ticket_count, ticket_price, event_date, post_type });
		await newEvent.save();

		console.log(newEvent);

		res.status(201).json(newEvent);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log(err);
	}
};

const getEvents = async (req, res) => {
	const { userId } = req.params;
	console.log(userId);
	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const events = await Post.find({ post_type: 2, postedBy: user._id }).sort({ createdAt: -1 }).populate('tickets.userId');

		res.status(200).json(events);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const buyEventTicket = async (req, res) => {
    const { eventId, userId } = req.params;
    const { quantity } = req.body;

    try {
        const post = await Post.findById(eventId);

        if (!post) {
            return res.status(404).json({ error: "Event not found" });
        }

        const newTicket = {
            userId: userId,
            quantity: quantity,
        };

        post.tickets.push(newTicket);

        post.ticket_count -= parseInt(quantity);

        const updatedPost = await post.save();

        res.status(200).json({ success: true, post: updatedPost });
    } catch (error) {
        console.error("Error buying ticket:", error);
        res.status(500).json({ error: "Error while buying ticket" });
    }
};

const updateEvent = async (req, res) => {
	try {
		const { text, ticket_count, ticket_price, event_date, imgChanged } = req.body;
		const {eventId} = req.params
		let { img } = req.body;

		if (!eventId ) {
			return res.status(400).json({ error: "Event Id and text fields are required" });
		}

		const event = await Post.findById(eventId);
		if (!event) {
			return res.status(404).json({ error: "Event not found" });
		}

		if (imgChanged && img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		event.text = text;
		event.img = img;
		event.ticket_count = ticket_count;
		event.ticket_price =  ticket_price;
		event.event_date =  event_date;

		await event.save();

		res.status(201).json(event);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log(err);
	}
};

export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts, getSellerPosts, createSellerPost, updateSellerPost, createEvent,getEvents,buyEventTicket,updateEvent };
