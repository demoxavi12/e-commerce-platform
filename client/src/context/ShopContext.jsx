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
    // Catalogue request state, so pages can tell "still loading" apart from
    // "the request failed" (previously both looked like an empty array).
    // A missing VITE_BACKEND_URL is a configuration error from the start.
    const [productsStatus, setProductsStatus] = useState(() => (backendUrl ? 'loading' : 'error'));
    const [productsError, setProductsError] = useState(() => (backendUrl ? '' : 'The store is not configured to reach its API (VITE_BACKEND_URL is missing).'));
    const [productsRequest, setProductsRequest] = useState(0);
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



    // Product catalogue (per backend URL, and again on every retry).
    // Always settles to 'ready' or 'error' — the 15s timeout means a hanging
    // API can never leave the storefront in a permanent loading state.
    useEffect(() => {
        // Check if backendUrl exists to avoid sending requests to "undefined"
        if (!backendUrl) {
            console.error("VITE_BACKEND_URL is not defined in your .env file");
            return;
        }
        let cancelled = false;
        axios.get(`${backendUrl}/api/product/list`, { timeout: 15000 })
            .then((response) => {
                if (cancelled) return;
                if (response.data.success && Array.isArray(response.data.products)) {
                    setProducts(response.data.products);
                    setProductsStatus('ready');
                } else {
                    setProductsError(response.data.message || 'The store returned an unexpected response.');
                    setProductsStatus('error');
                    toast.error(response.data.message || 'Could not load products');
                }
            })
            .catch((error) => {
                if (cancelled) return;
                console.log(error);
                // No HTTP response = the API is down or unreachable (a crashed
                // serverless function also has no CORS headers → "Network Error").
                const message = error.response
                    ? `The store API responded with an error (${error.response.status}).`
                    : error.code === 'ECONNABORTED'
                        ? 'The store API took too long to respond.'
                        : 'We couldn’t reach the store API. It may be temporarily unavailable.';
                setProductsError(message);
                setProductsStatus('error');
                toast.error('Could not load products');
            });
        return () => {
            cancelled = true;
        };
    }, [backendUrl, productsRequest])

    const retryProducts = () => {
        if (!backendUrl) return;
        setProductsError('');
        setProductsStatus('loading');
        setProductsRequest((n) => n + 1);
    }

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
        products, productsStatus, productsError, retryProducts, currecy, currency: currecy, logout, shippingCost, search, setSearch, showSearch, setShowSearch, cartItems, addToCart, getCartCount, updateQuantity,
        getCartAmount,setCartItems, navigate, backendUrl, limitedProduct, token, setToken,
    }  // add state and functions as needed
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;