const express = require("express");
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

/**
 * @route   POST /api/products
 * @desc    Add new product (Admin only)
 */
router.post("/", auth, admin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to add product" });
  }
});

/**
 * @route   GET /api/products
 * @desc    Get all products
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get single product
 */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

/**
 * @route   PATCH /api/products/:id
 * @desc    Update product details (Admin only)
 */
router.patch("/:id", auth, admin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product" });
  }
});


/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product (Admin only)
 */
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
});

module.exports = router;
