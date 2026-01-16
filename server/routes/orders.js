const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Cart = require("../models/Cart");

const router = express.Router();

// Place a new order
router.post("/checkout", auth, async (req, res) => {
  try {
    // 1. Find the user's cart and populate product details to get current prices
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // 2. Calculate total amount and verify stock
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.productId;

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      totalAmount += product.price * item.quantity;

      orderItems.push({
        productId: product._id,
        quantity: item.quantity
      });
    }

    // 3. Update Product Stock (Decrement)
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // 4. Create the Order
    const order = new Order({
      userId: req.user.id,
      items: orderItems,
      totalAmount: totalAmount,
      status: "pending"
    });

    await order.save();

    // 5. CLEAR THE CART after successful order
    await Cart.findOneAndDelete({ userId: req.user.id });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to process checkout" });
  }
});



// Get orders for logged-in user
router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate(
      "items.productId",
      "name price images"
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
