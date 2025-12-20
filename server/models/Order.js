const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        quantity: Number,
        size: Number
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      default: "Pending"
    },
    orderStatus: {
      type: String,
      default: "Processing"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
