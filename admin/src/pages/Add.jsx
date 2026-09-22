import React, { useState } from "react";
import assets from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Men");
  const [subcategory, setSubcategory] = useState("TopWear");
  const [Bestseller, setBestseller] = useState(false);
  const [limitedStocks, setLimitedStocks] = useState(false);

  const [Sizes, setSizes] = useState([]);

  const onSubmitHandeler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subcategory", subcategory);
      formData.append("bestseller", Bestseller);
      formData.append("limitedStocks", limitedStocks);

      formData.append("sizes", JSON.stringify(Sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setLimitedStocks(false);
        setBestseller(false);
        setSizes([]);
      } else {
        toast.error(response.data.message);
        console.log(response.data.message);
      }
    } catch (error) {
      console.log("AXIOS ERROR:", error.response?.data || error.message);
    }
  };

  const sizesList = ["S", "M", "L", "XL", "XXL"];

  return (
    <motion.form
      onSubmit={onSubmitHandeler}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col w-full items-start gap-6"
    >
      {/* ================= IMAGE UPLOADS ================= */}
      <div>
        <p className="mb-3 font-semibold text-gray-700">UPLOAD IMAGES</p>
        <div className="flex flex-row gap-3">
          {[image1, image2, image3, image4].map((img, index) => (
            <label key={index} htmlFor={`image${index + 1}`}>
              <motion.img
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer w-32 h-32 object-cover rounded-xl border border-gray-300"
                src={
                  !img
                    ? assets.upload_area
                    : URL.createObjectURL(img)
                }
                alt={`upload-${index + 1}`}
              />
              <input
                onChange={(e) => {
                  if (index === 0) setImage1(e.target.files[0]);
                  if (index === 1) setImage2(e.target.files[0]);
                  if (index === 2) setImage3(e.target.files[0]);
                  if (index === 3) setImage4(e.target.files[0]);
                }}
                type="file"
                id={`image${index + 1}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      {/* ================= PRODUCT INFO ================= */}
      <InputField
        label="Product Name"
        value={name}
        setValue={setName}
        placeholder="Enter product name"
      />
      <TextareaField
        label="Product Description"
        value={description}
        setValue={setDescription}
        placeholder="Write product description here"
      />

      {/* ================= CATEGORY / SUBCATEGORY / PRICE ================= */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full">
        <SelectField label="Category" value={category} setValue={setCategory} options={["Men", "Women", "Kids"]} />
        <SelectField
          label="Subcategory"
          value={subcategory}
          setValue={setSubcategory}
          options={["TopWear", "BottomWear", "WinterWear"]}
        />
        <InputField
          label="Price"
          value={price}
          setValue={setPrice}
          placeholder="Enter product price"
          type="number"
        />
      </div>

      {/* ================= SIZES ================= */}
      <div>
        <p className="mb-2 font-semibold text-gray-700">Product Sizes</p>
        <div className="flex gap-3 flex-wrap">
          {sizesList.map((size) => (
            <motion.div
              key={size}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
                )
              }
            >
              <p
                className={`px-4 py-1 rounded-lg cursor-pointer border ${Sizes.includes(size)
                  ? "bg-black text-white border-black"
                  : "bg-gray-200 text-gray-700 border-gray-300"
                  }`}
              >
                {size}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================= BESTSELLER ================= */}
      <div className="flex items-center gap-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={Bestseller}
          type="checkbox"
          id="bestseller"
          className="cursor-pointer accent-black w-4 h-4"
        />
        <label htmlFor="bestseller" className="cursor-pointer font-medium">
          Add to Bestseller
        </label>
      </div>


      {/* ================= LIMITED STOCKS ================= */}
      <div className="flex items-center gap-2">
        <input
          onChange={() => setLimitedStocks((prev) => !prev)}
          checked={limitedStocks}
          type="checkbox"
          id="limitedStocks"
          className="cursor-pointer accent-black w-4 h-4"
        />
        <label htmlFor="limitedStocks" className="cursor-pointer font-medium">
          Mark as Limited Stock
        </label>
      </div>


      {/* ================= SUBMIT BUTTON ================= */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        className="w-full sm:w-48 py-3 mt-4 bg-black text-white rounded-xl font-semibold tracking-wide shadow-md hover:bg-gray-900 transition"
      >
        ADD PRODUCT
      </motion.button>
    </motion.form>
  );
};

// =================== reusable fields ===================
const InputField = ({ label, value, setValue, type = "text" }) => (
  <div className="w-full">
    <p className="mb-2 font-semibold text-gray-700">{label}</p>
    <motion.input
      whileFocus={{ scale: 1.01 }}
      type={type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full max-w-[500px] px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-black/20 transition"
      required
    />
  </div>
);

const TextareaField = ({ label, value, setValue }) => (
  <div className="w-full">
    <p className="mb-2 font-semibold text-gray-700">{label}</p>
    <motion.textarea
      whileFocus={{ scale: 1.01 }}
      rows="5"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full max-w-[500px] px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-black/20 resize-none transition"
      required
    />
  </div>
);

const SelectField = ({ label, value, setValue, options }) => (
  <div className="w-full">
    <p className="mb-2 font-semibold text-gray-700">{label}</p>
    <motion.select
      whileFocus={{ scale: 1.01 }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full max-w-[500px] px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-black/20 transition cursor-pointer"
      required
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </motion.select>
  </div>
);



export default Add;
