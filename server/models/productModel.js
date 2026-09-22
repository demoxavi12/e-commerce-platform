import mongoose from "mongoose";

delete mongoose.models.product;

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },

    category: { type: String, required: true },
    subcategory: { type: String, required: true },

    sizes: {
      type: [String],
      default: [],
    },

    bestseller: {
      type: Boolean,
      default: false,
    },

    limitedStocks: {
      type: Boolean,
      default: false,
    },

    date: { type: Number, required: true },
  },
  { strict: true }
);

const productmodel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productmodel;
