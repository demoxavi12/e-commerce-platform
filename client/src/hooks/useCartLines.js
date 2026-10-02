import { useContext, useMemo } from "react";
import { ShopContext } from "../context/shop-context";

// Flattens { productId: { size: qty } } into display lines joined with product data.
export const useCartLines = () => {
  const { cartItems, products } = useContext(ShopContext);
  return useMemo(() => {
    const lines = [];
    for (const id in cartItems) {
      for (const size in cartItems[id]) {
        const quantity = cartItems[id][size];
        if (quantity > 0) {
          lines.push({ _id: id, size, quantity, details: products.find((p) => p._id === id) });
        }
      }
    }
    return lines;
  }, [cartItems, products]);
};
