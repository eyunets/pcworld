import { NextFunction, Request, Response } from "express";
import { CallbackError } from "mongoose";
import Category, { ICategory } from "../models/category";

type Error =
  | (CallbackError & {
      errors?: {
        name: {
          message: string;
        };
      };
    })
  | null;

export const categoryById = (
  req: Request,
  res: Response,
  next: NextFunction,
  id: string
): void => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      res.status(400).json({
        error: "Категория не найдена",
      });
      return;
    }
    req.category = category;
    next();
  });
};

export const categoryBySlug = (
  req: Request,
  res: Response,
  next: NextFunction,
  slug: string
): void => {
  Category.findOne({ slug }).exec((err, category) => {
    if (err || !category) {
      res.status(400).json({
        error: "Категория не найдена",
      });
      return;
    }
    req.category = category;
    next();
  });
};

export const create = (req: Request, res: Response): void => {
  const parent = req.body.parent ? req.body.parent : null;
  const category = new Category({ name: req.body.name, parent });
  saveCategory(res, category);
};

export const read = (req: Request, res: Response): void => {
  res.json(req.category);
};

export const update = (req: Request, res: Response): void => {
  const category = req.category;
  category.name = req.body.name;
  saveCategory(res, category);
};

export const remove = (req: Request, res: Response): void => {
  const category = req.category;

  category
    .deleteOne()
    .then((category: ICategory) => {
      if (category) {
        res.json({
          error: "Категория успешно удалена",
        });
      } else {
        res.status(400).json({
          error: "Категория не найдена",
        });
      }
    })
    .catch((err: Error) => {
      res.status(500).json({
        error: err?.message,
      });
    });
};

export const list = (_req: Request, res: Response): void => {
  Category.find({ slug: { $ne: "root" } })
    .populate("parent")
    .exec((err, data) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
        return;
      }

      res.json(data);
    });
};

const saveCategory = (res: Response, category: ICategory): void => {
  category.save((err: Error, data) => {
    if (err) {
      if (err.errors && err.errors.name) {
        res.status(400).json({
          error: err.errors.name.message,
        });
      } else {
        res.status(500).json({
          error: err.message,
        });
      }
    } else {
      res.json({ category: data });
    }
  });
};
