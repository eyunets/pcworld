import { Request, Response } from "express";
import User from "../models/user";

export const read = (req: Request, res: Response): void => {
  res.json({ user: req.user });
};

export const update = (req: Request, res: Response): void => {
  if (!req.body.name) {
    res.status(400).json({ error: "Имя отсутсвует" });
    return;
  }
  User.findOneAndUpdate(
    { _id: req.user?.id },
    { name: req.body.name },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
        return;
      }
      res.json(user);
    }
  );
};
