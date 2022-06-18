import { NextFunction, Request, Response } from "express";
import { CallbackError } from "mongoose";
import Brand, { IBrand } from "../models/brand";

type Error =
  | (CallbackError & {
      errors?: {
        name: {
          message: string;
        };
      };
    })
  | null;

export const brandById = (
  req: Request,
  res: Response,
  next: NextFunction,
  id: string
): void => {
  Brand.findById(id).exec((err, brand) => {
    if (err || !brand) {
      res.status(400).json({
        error: "Произвоидетель не найден",
      });
      return;
    }
    req.brand = brand;
    next();
  });
};

export const brandBySlug = (
  req: Request,
  res: Response,
  next: NextFunction,
  slug: string
): void => {
  Brand.findOne({ slug }).exec((err, brand) => {
    if (err || !brand) {
      res.status(400).json({
        error: "Произвоидетель не найден",
      });
      return;
    }
    req.brand = brand;
    next();
  });
};

export const create = (req: Request, res: Response): void => {
  const brand = new Brand({ name: req.body.name });
  saveBrand(res, brand);
};

export const read = (req: Request, res: Response): void => {
  res.json(req.brand);
};

export const update = (req: Request, res: Response): void => {
  const brand = req.brand;
  brand.name = req.body.name;
  saveBrand(res, brand);
};

export const remove = (req: Request, res: Response): void => {
  const brand = req.brand;

  brand
    .deleteOne()
    .then((brand: IBrand) => {
      if (brand) {
        res.json({
          error: "Произвоидетель удален",
        });
      } else {
        res.status(400).json({
          error: "Произвоидетель не найден",
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
  Brand.find({ slug: { $ne: "root" } }).exec((err, data) => {
    if (err) {
      res.status(500).json({
        error: err.message,
      });
      return;
    }

    res.json(data);
  });
};

const saveBrand = (res: Response, brand: IBrand): void => {
  brand.save((err: Error, data) => {
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
      res.json({ brand: data });
    }
  });
};
