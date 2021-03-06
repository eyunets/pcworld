import { ICategory } from "../../src/models/category";
import { IProduct } from "../../src/models/product";
import { IUser } from "../../src/models/user";
import { IPost } from "../../src/models/post";
import { IBrand } from "../../src/models/brand";

declare global {
  namespace Express {
    interface User extends IUser {
      id: string;
    }
    interface Request {
      product: IProduct;
      category: ICategory;
      brand: IBrand;
      post: IPost;
    }
  }
}
