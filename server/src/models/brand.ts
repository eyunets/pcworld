import mongoose, { Document, Model } from "mongoose";
import { slugify } from "../helpers";

export interface IBrand extends Document {
  name: string;
  slug: string;
  parent: mongoose.Types.ObjectId;
}

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      maxlength: 32,
    },
    slug: {
      type: String,
      index: true,
    },
  },
  { timestamps: true }
);

brandSchema.path("name").validate(async (name: string) => {
  const exists = await mongoose.models.Brand.exists({ name });
  return !exists;
}, "Brand already exists");

brandSchema.pre("save", async function (this: IBrand, next) {
  this.slug = slugify(this.name);
  next();
});

const Brand: Model<IBrand> = mongoose.model("Brand", brandSchema);

export default Brand;
