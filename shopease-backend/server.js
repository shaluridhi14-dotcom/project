const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const registerRoutes = require("./register");
app.use("/", registerRoutes);

const loginroutes = require("./login");
app.use("/", loginroutes);

const authRoutes = require("./auth");
app.use("/", authRoutes);

const userRoutes = require("./upload");
app.use("/uploads", express.static("uploads"));
app.use("/", userRoutes);

const wishlistRoutes = require("./wishlist");
app.use("/wishlist", wishlistRoutes);

const cartRoutes = require("./cart");
app.use("/cart", cartRoutes);

const feedbackRoutes = require("./feedback");
app.use("/", feedbackRoutes);

const ordersRoutes = require("./orders");
app.use("/", ordersRoutes);

const searchRoutes= require("./search");
app.use("/",searchRoutes);

app.listen(3000, () => {
    console.log("server is running on port 3000");
});