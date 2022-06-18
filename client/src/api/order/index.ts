import axios, { AxiosResponse, CancelToken } from "axios";
import { API } from "../../config";
import { Order } from "./order-types";
export type { Order } from "./order-types";

export const getOrders = (
  cancelToken?: CancelToken
): Promise<AxiosResponse<Order[]>> =>
  axios.get<Order[]>(`${API}/orders`, { withCredentials: true, cancelToken });

export const searchOrder = (
  search: string,
  cancelToken?: CancelToken
): Promise<AxiosResponse<Order[]>> =>
  axios.get<Order[]>(`${API}/orders/${search}`, {
    withCredentials: true,
    cancelToken,
  });

export const processPayment = (
  cancelToken?: CancelToken
): Promise<AxiosResponse<{ orderId: string }>> =>
  axios.post<{ orderId: string }>(`${API}/orders/payment`, null, {
    withCredentials: true,
    cancelToken,
  });
