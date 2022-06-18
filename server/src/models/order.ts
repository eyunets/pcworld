import mongoose, { Document, Model } from "mongoose";
import { addressSchema, IAddress } from "./address";

export interface orderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: orderItem[];
  orderId: string;
  orderSummary: {
    productTotal: number;
  };
  status?:
    | "Unprocessed"
    | "Processing"
    | "Shipping"
    | "Delivered"
    | "Cancelled";
  address: IAddress;
}

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    orderId: { type: String, required: true },
    orderSummary: {
      productTotal: { type: Number, required: true },
    },
    status: {
      type: String,
      default: "Unprocessed",
      enum: ["Unprocessed", "Processing", "Shipping", "Delivered", "Cancelled"],
    },
    address: addressSchema,
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.model("Order", orderSchema);

export default Order;
