const express = require("express");
const Cart = require("../models/Cart");
const auth = require("../middleware/auth");
const router = express.Router();

// @route   POST /api/cart
// @desc    Add item to cart (or increment quantity if already exists)
router.post("/", auth, async (req, res) => {
  const { productId, quantity } = req.body;
  const qtyToAdd = Number(quantity) || 1;

  try {
    // 1. Verify Product exists and check stock
    const Product = require("../models/Product"); // Ensure you import your product model
    const targetProduct = await Product.findById(productId);
    
    if (!targetProduct) return res.status(404).json({ message: "Product not found" });
    if (targetProduct.stock < qtyToAdd) {
      return res.status(400).json({ message: `Only ${targetProduct.stock} units available` });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (cart) {
      const itemIndex = cart.items.findIndex((p) => p.productId.toString() === productId);

      if (itemIndex > -1) {
        // 2. Logic: Ensure the TOTAL quantity doesn't exceed stock
        const newTotal = cart.items[itemIndex].quantity + qtyToAdd;
        if (newTotal > targetProduct.stock) {
          return res.status(400).json({ message: "Cannot exceed available stock" });
        }
        cart.items[itemIndex].quantity = newTotal;
      } else {
        cart.items.push({ productId, quantity: qtyToAdd });
      }
      cart = await cart.save();
    } else {
      cart = await Cart.create({
        userId: req.user.id,
        items: [{ productId, quantity: qtyToAdd }],
      });
    }

    // Return populated cart so frontend gets updated details immediately
    const populatedCart = await cart.populate("items.productId", "name price images");
    res.status(200).json(populatedCart);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route   GET /api/cart
// @desc    Get current user's cart
router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId",
      "name price stock images"
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