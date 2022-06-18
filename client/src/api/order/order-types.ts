import { Address } from "../address";
import { Product } from "../product";

export interface orderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  items: orderItem[];
  orderId: string;
  orderSummary: {
    productTotal: number;
  };
  status: "Unprocessed" | "Processing" | "Shipping" | "Delivered" | "Cancelled";
  address: Address;
  createdAt: string;
}
