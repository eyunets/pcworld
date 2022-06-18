import express from "express";
import "dotenv-safe/config";
import cors from "cors";
import mongoose, { CallbackError } from "mongoose";
import passport from "passport";
import session from "express-session";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import categoryRoutes from "./routes/category";
import brandRoutes from "./routes/brand";
import productRoutes from "./routes/product";
import cartRoutes from "./routes/cart";
import addressRoute from "./routes/address";
import orderRouter from "./routes/orders";
import reviewRouter from "./routes/review";
import wishlistRouter from "./routes/wishlist";
import postRouter from "./routes/post";
import User, { IUser } from "./models/user";
import { mongooseConfig } from "./helpers";
import morgan from "morgan";
import MongoStore from "connect-mongo";

const app = express();

// middlewares
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_BASE_URL,
  })
);
app.use(morgan("dev"));

app.use(
  session({ 
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 60 * 30,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// db
mongoose
  .connect(process.env.MONGO_URI, mongooseConfig)
  .then(() => console.log("DB Connected"));

mongoose.connection.on("error", (err) => {
  console.log(`DB connection error: ${err.message}`);
});

// passport config
passport.use(User.createStrategy());

passport.serializeUser((user: IUser, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err: CallbackError, user: IUser) => {
    done(err, user);
  });
});

// route middleware
app.use("/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", brandRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", addressRoute);
app.use("/api", orderRouter);
app.use("/api", reviewRouter);
app.use("/api", wishlistRouter);
app.use("/api", postRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
