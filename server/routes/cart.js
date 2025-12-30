const express = require("express");
const Cart = require("../models/Cart");
const auth = require("../middleware/auth");
const router = express.Router();

// @route   POST /api/cart
// @desc    Add item to cart (or increment quantity if already exists)
router.post("/", auth, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (cart) {
      // Check if product already exists in cart
      const itemIndex = cart.items.findIndex((p) => p.productId.toString() === productId);

      if (itemIndex > -1) {
        // Product exists, update quantity
        cart.items[itemIndex].quantity += (quantity || 1);
      } else {
        // Product does not exist, push to array
        cart.items.push({ productId, quantity: quantity || 1 });
      }
      cart = await cart.save();
      return res.status(200).json(cart);
    } else {
      // No cart for this user, create a new one
      const newCart = await Cart.create({
        userId: req.user.id,
        items: [{ productId, quantity: quantity || 1 }],
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating cart" });
  }
});

// @route   GET /api/cart
// @desc    Get current user's cart
router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId",
      "name price stock"
    );
    if (!cart) return res.status(200).json({ items: [] });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

// @route   DELETE /api/cart/:productId
// @desc    Remove an item from cart
router.delete("/:productId", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== req.params.productId
      );
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item" });
  }
});

module.exports = router;