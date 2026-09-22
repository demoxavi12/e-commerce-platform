import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 6;

const List = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const fetchList = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/product/list");
      if (res.data.success) {
        setProducts(res.data.products);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };


  const removeProduct = async (id) => {
    try {
      const res = await axios.post(
        backendUrl + "/api/product/remove",
        { id }, // The body object
        { headers: { token } } // The config object (headers go here)
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setDeleteId(null); // Close the modal
        fetchList();       // Refresh the list
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("DELETE ERROR:", err.response?.data || err.message);
      toast.error("Failed to delete product");
    }
  };


  useEffect(() => {
    fetchList();
  }, []);

  /* ================= FILTERING ================= */
  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || p.category === category;
    return matchSearch && matchCategory;
  });

  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  return (
    <div className="w-full">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold tracking-wide">
          PRODUCT LIST
        </h2>

        <div className="flex gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product..."
            className="px-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-black/20"
          />

          <select
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded-xl text-sm"
          >
            <option value="All">All</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="hidden md:block bg-white border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] px-6 py-4 bg-gray-100 text-sm font-semibold">
          <p>Image</p>
          <p>Name</p>
          <p>Category</p>
          <p>Status</p>
          <p>Price</p>
          <p className="text-center">Actions</p>
        </div>

        {paginated.map((item) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            key={item._id}
            whileHover={{ scale: 1.01 }}
            className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr]
                       px-6 py-4 items-center text-sm
                       border-t hover:bg-gray-100 transition"
          >
            <img
              src={item.images[0]}
              className="w-14 h-16 object-cover rounded-lg border"
            />

            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-gray-500 line-clamp-1">
                {item.description}
              </p>
            </div>

            <p>{item.category}</p>

            {/* Stock Badge */}
            <span
              className={`px-3 py-1 text-xs rounded-full w-fit
                ${item.stock > 0
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"}`}
            >
              {item.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>

            <p className="font-semibold">
              {currency}
              {item.price}
            </p>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <button className="cursor-pointer text-blue-600 hover:underline">
                Edit
              </button>
              <button
                onClick={() => removeProduct(item._id)}
                className="cursor-pointer text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center gap-3 mt-8 mb-4">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`cursor-pointer px-4 py-2 rounded-lg text-sm
              ${page === i + 1
                ? "bg-black text-white"
                : "border"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* ================= DELETE MODAL ================= */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-[90%] max-w-sm"
          >
            <h3 className="font-semibold mb-2">
              Delete Product?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => removeProduct(deleteId)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success("Product deleted (hook backend)");
                  removeProduct(deleteId);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ================= MOBILE VIEW ================= */}
      <div className="md:hidden flex flex-col gap-4">
        {paginated.map((item) => (
          <motion.div
            key={item._id}
            whileTap={{ scale: 0.97 }}
            className="bg-white border rounded-2xl p-4 shadow-sm w-full"
          >
            <div className="flex gap-4">
              <img
                src={item.images[0]}
                className="w-24 h-28 object-cover rounded-xl border"
              />

              <div className="flex-1">
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {item.category}
                  </span>

                  <span
                    className={`text-xs px-2 py-1 rounded-full
                ${item.stock > 0
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"}`}
                  >
                    {item.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <p className="mt-2 font-bold">
                  {currency}
                  {item.price}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between mt-4">
              <button className="text-blue-600 text-sm font-medium">
                Edit
              </button>
              <button
                onClick={() => removeProduct(item._id)}
                className="text-red-500 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default List;
