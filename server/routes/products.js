const express = require("express");
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// Add new Product
router.post("/", auth, admin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to add product" });
  }
});

// Get all Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// Get Product by ID
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

// Update Product (Admin)
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


// Delete Product (Admin)
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Create a new review
router.post("/:id/reviews", auth, async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 1. Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.userId.toString() === req.user.id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    // 2. Create the review object
    // If your auth middleware doesn't have 'name', use a fallback or 
    // fetch the user: const user = await User.findById(req.user.id);
    const review = {
      userId: req.user.id,
      name: req.user.name || "Anonymous User", // Fallback if name is missing
      rating: Number(rating),
      comment: comment,
    };

    product.reviews.push(review);

    // 3. Update stats
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added successfully" });
    
  } catch (error) {
    console.error(error); // THIS WILL SHOW THE REAL ERROR IN YOUR TERMINAL
    res.status(500).json({ message: error.message || "Failed to add review" });
  }
});

module.exports = router;
