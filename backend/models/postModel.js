import mongoose from "mongoose";

const ticketSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    // Add any other ticket-related fields here
});

const postSchema = mongoose.Schema(
	{
		postedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		text: {
			type: String,
			maxLength: 500,
		},
		img: {
			type: String,
		},
		likes: {
			// array of user ids
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
			default: [],
		},
		replies: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				text: {
					type: String,
					required: true,
				},
				userProfilePic: {
					type: String,
				},
				username: {
					type: String,
				},
			},
		],
		post_type:{
			type: Number,
			required: false,
			default: 0, // 0 for user post 1 for seller adds 2 for events
		},
		order_count:{
			type: Number,
			required: false,
			default: 0,
		},
		quantity:{
			type: Number,
			required: false,
			default: 0,
		},
		unit_price:{
			type: Number,
			required: false,
			default: 0,
		},
		// event
		ticket_count:{
			type: Number,
			required: false,
			default:0
		},
		ticket_price:{
			type:Number,
			required: false,
		},
		event_date:{
			type: Date,
			required: false,
		},
		tickets: [ticketSchema],
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.model("Post", postSchema);

export default Post;
