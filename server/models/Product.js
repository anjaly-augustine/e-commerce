const mongoose = require("mongoose");

// Sub-schema for Reviews
const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true }, // Store name so you don't always have to populate
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    sizes: { type: [Number] },
    colors: { type: [String] },
    images: { type: [String] },
    stock: { type: Number, default: 0 },
    // --- NEW FIELDS ---
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 }, // Average rating
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);