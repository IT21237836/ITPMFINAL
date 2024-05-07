import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
	{
		seller: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			required: true,
		},
		buyer:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
        address:{
            type: String,
            required: true
        },
		contact_number:{
            type: Number,
            required: true,
        },
        status:{
            type: String,
            required: false,
            default: "pending"
        },
        total:{
            type: Number,
            required: true,
        }
	},
	{
		timestamps: true,
	}
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
