import userModel from "../models/userModel.js"


//add product to cart
const addToCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = user.cartData || {};

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    // STEP 1: Assign the data
    user.cartData = cartData;

    // STEP 2: Explicitly tell Mongoose the Mixed field changed
    user.markModified('cartData'); 

    await user.save();

    res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};




//update cart
const updateCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;
    
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = user.cartData || {};

    if (!cartData[itemId]) {
      return res.json({ success: false, message: "Item not in cart" });
    }

    if (quantity <= 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }

    user.cartData = cartData;
    user.markModified("cartData");
    await user.save();

    res.json({ success: true, message: "Cart updated" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



//get user cart
const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      cartData: user.cartData || {}
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};




export {
    addToCart,
    updateCart,
    getUserCart
}