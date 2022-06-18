import { NextFunction, Request, Response } from "express";
import Post, { IPost } from "../models/post";

export const postBySlug = (
  req: Request,
  res: Response,
  next: NextFunction,
  slug: string
): void => {
  Post.findOne({ slug }).exec((err, post) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!post) {
      res.status(400).json({ error: "Такой новости не существует" });
      return;
    }
    req.post = post;
    next();
  });
};

export const create = (req: Request, res: Response): void => {
  const post = new Post({ postedBy: req.user?.name, ...req.body });
  post.save((err, post) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(post);
  });
};

export const remove = (req: Request, res: Response): void => {
  const post = req.post;
  if ((req.user?.name as string) !== post.postedBy) {
    res.status(400).json({ error: "Новость не принадлежит такому пользователю" });
    return;
  }
  post
    .deleteOne()
    .then((post: IPost) => {
      if (post) {
        res.json({
          message: "Ваша новость удалена",
        });
      } else {
        res.status(400).json({
          error: "Новость не найдена",
        });
      }
    })
    .catch((err: Error) => {
      res.status(500).json({
        error: err.message,
      });
    });
};

export const read = (req: Request, res: Response): void => {
  res.json(req.post);
};

export const list = async (req: Request, res: Response): Promise<void> => {
  const limit = req.query.limit ? Number(req.query.limit) : 500;
  const skip = req.query.skip ? Number(req.query.skip) : 0;

  let count: number | null = null;

  if (skip === 0) {
    count = await Post.count();
  }

  Post.find()
    .sort({ createdAt: "desc" })
    .skip(skip)
    .limit(limit)
    .exec((err, posts) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ posts, count });
    });
};

export const listSeller = (req: Request, res: Response): void => {
  Post.find({ postedBy: req.user?.name })
    .sort({ createdAt: "desc" })
    .exec((err, posts) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      return res.json(posts);
    });
};
