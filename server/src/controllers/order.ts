import { Request, Response } from "express";
import Product, { IProduct } from "../models/product";
import Order from "../models/order";
import mongoose from "mongoose";
import Cart from "../models/cart";
import Address from "../models/address";
import { v4 as uuidv4 } from "uuid";

export const read = (req: Request, res: Response): void => {
  Order.find({ user: req.user?.id })
    .sort({ createdAt: "desc" })
    .populate("items.product", "-image")
    .exec((err, orders) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(orders);
    });
};

interface FindArgs {
  $or?: {
    orderId?: string;
    "products.name"?: {
      $regex: string;
      $options: "i";
    };
  }[];
}

export const search = (req: Request, res: Response): void => {
  const user = new mongoose.Types.ObjectId(req.user?.id);
  const findArgs: FindArgs = {};

  if (req.params.search) {
    findArgs.$or = [
      { orderId: req.params.search },
      { "products.name": { $regex: req.params.search, $options: "i" } },
    ];
  }

  Order.aggregate()
    .match({ user })
    .lookup({
      from: Product.collection.name,
      localField: "items.product",
      foreignField: "_id",
      as: "products",
    })
    .match(findArgs)
    .sort({ createdAt: "desc" })
    .exec((err, orders) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const mergedOrders = orders
        .map((order) => {
          return {
            ...order,
            items: order.items.map((item: any) => {
              const product = order.products.find((product: any) => {
                return product._id.toString() == item.product.toString();
              });
              if (product) {
                item.product = product;
              }
              return item;
            }),
          };
        })
        .map((order) => {
          delete order.products;
          return order;
        });
      res.json(mergedOrders);
    });
};

export const processPayment = (req: Request, res: Response): void => {
  Cart.findOne({ user: req.user?.id })
    .populate("cartItems.product", "-image")
    .exec((err, cart) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (cart) {
        Address.findOne({ user: req.user?.id }).exec((err, address) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          if (address) {
            const isEnoughQuantity = !cart.cartItems.some(
              (cartItem) =>
                (cartItem.product as IProduct).quantity < cartItem.quantity
            );
            if (isEnoughQuantity) {
              const updates = cart.cartItems.map((cartItem) => ({
                updateOne: {
                  filter: { _id: (cartItem.product as IProduct).id },
                  update: {
                    $inc: {
                      quantity: -cartItem.quantity,
                      sold: cartItem.quantity,
                    },
                  },
                },
              }));
              Product.bulkWrite(updates, { ordered: false })
                .then(() => {
                  cart.deleteOne();
                  const orderId = uuidv4();
                  const order = new Order({
                    user: req.user?.id,
                    items: cart.cartItems.map((cartItem) => {
                      return {
                        product: (cartItem.product as IProduct).id,
                        quantity: cartItem.quantity,
                      };
                    }),
                    orderId: orderId,
                    orderSummary: {
                      productTotal: cart.cartItems.reduce((acc, cartItem) => {
                        acc =
                          acc +
                          (cartItem.product as IProduct).price *
                            cartItem.quantity;
                        return acc;
                      }, 0),
                    },
                    address,
                  });
                  order.save((err) => {
                    if (err) {
                      res.json({ orderId: orderId });
                      return;
                    }
                    res.json({ orderId: orderId });
                  });
                })
                .catch(() => {
                  res.status(500).json({
                    error:
                      "Что-то пошло не так",
                  });
                });
            } else {
              res.status(400).json({
                error:
                  "Похоже что количество продуктов изменилось. Обновите страницу чтобы увидеть изменения",
              });
            }
          } else {
            res.status(400).json({ error: "Нет адреса" });
          }
        });
      } else {
        res.status(400).json({ error: "В корзине пусто" });
      }
    });
};
