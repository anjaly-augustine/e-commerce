const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// Place a new order
router.post("/", auth, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    const order = new Order({
      userId: req.user.id,
      items,
      totalAmount
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to place order" });
  }
});

// Get orders for logged-in user
router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate(
      "items.productId",
      "name price"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Get all orders (Admin)
router.get("/", auth, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.productId", "name price");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
});

// Update order status (Admin)
router.patch("/:id", auth, admin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order" });
  }
});

module.exports = router;
