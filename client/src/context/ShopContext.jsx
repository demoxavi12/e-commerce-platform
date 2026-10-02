import { useEffect, useState } from "react";
import { ShopContext } from "./shop-context";
import { limited as limitedAssets } from '../assets/assets';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const ShopContextProvider = (props) => {

    const currecy = '$';
    const shippingCost = 10.00;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({}); // { productId: quantity }
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    // Restore the session synchronously so the first render already knows the user.
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    const [limitedProduct] = useState(limitedAssets);

    const addToCart = async (itemId, size, quantity = 1) => {

        let cartDate = structuredClone(cartItems);

        if (!size) {
            toast.error("Please select a size");
            return;

        }

        if (cartDate[itemId]) {
            if (cartDate[itemId][size]) {
                cartDate[itemId][size] += quantity;
            }
            else {
                cartDate[itemId][size] = quantity;
            }
        } else {
            cartDate[itemId] = {};
            cartDate[itemId][size] = quantity;
        }
        setCartItems(cartDate);


        if (token) {
            try {
                await axios.post(backendUrl + "/api/cart/add", { itemId, size }, { headers: { Authorization: `Bearer ${token}` } });
                // /cart/add increments by one; sync any extra quantity with /cart/update
                if (quantity > 1) {
                    await axios.post(backendUrl + "/api/cart/update", { itemId, size, quantity: cartDate[itemId][size] }, { headers: { Authorization: `Bearer ${token}` } });
                }
            } catch (error) {
                console.log(error);

            }
        }
    }



    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    console.log(error);


                }
            }
        }
        return totalCount;
    }



    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);

        if (quantity <= 0) {
            delete cartData[itemId][size];

            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        } else {
            cartData[itemId][size] = quantity;
        }

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(
                    backendUrl + "/api/cart/update",
                    { itemId, size, quantity },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong");
            }
        }
    };



    const getCartAmount = () => {
        let totalAmount = 0;

        for (const productId in cartItems) {
            const itemInfo = products.find(
                (product) => product._id === productId
            );

            if (!itemInfo) continue;

            for (const size in cartItems[productId]) {
                const quantity = cartItems[productId][size];
                if (quantity > 0) {
                    totalAmount += quantity * itemInfo.price;
                }
            }
        }

        return totalAmount;
    };



    // Product catalogue (once per backend URL).
    useEffect(() => {
        // Check if backendUrl exists to avoid sending requests to "undefined"
        if (!backendUrl) {
            console.error("VITE_BACKEND_URL is not defined in your .env file");
            return;
        }
        axios.get(`${backendUrl}/api/product/list`)
            .then((response) => {
                if (response.data.success) {
                    setProducts(response.data.products);
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.message);
            });
    }, [backendUrl])

    // Server cart for a restored session (same behaviour as before: on load only).
    useEffect(() => {
        const stored = localStorage.getItem('token');
        if (!stored || !backendUrl) return;
        axios.post(backendUrl + "/api/cart/get", {}, { headers: { Authorization: `Bearer ${stored}` } })
            .then((response) => {
                if (response.data.success) {
                    setCartItems(response.data.cartData);
                }
            })
            .catch((error) => {
                console.log(error);
                toast.error("Something went wrong");
            });
    }, [backendUrl])

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setCartItems({})
        navigate('/login')
    }

    const value = {
        products, currecy, currency: currecy, logout, shippingCost, search, setSearch, showSearch, setShowSearch, cartItems, addToCart, getCartCount, updateQuantity,
        getCartAmount,setCartItems, navigate, backendUrl, limitedProduct, token, setToken,
    }  // add state and functions as needed
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;