import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import MobileMenu from "./components/MobileMenu.jsx";
import SearchOverlay from "./components/SearchOverlay.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import FlyToCartLayer from "./components/FlyToCartLayer.jsx";
import SmoothScroll from "./components/motion/SmoothScroll.jsx";
import Cursor from "./components/motion/Cursor.jsx";
import PageTransition from "./components/motion/PageTransition.jsx";
import Home from "./pages/Home.jsx";
import { scrollToTop } from "./lib/lenis";
import { useMediaQuery } from "./hooks/useMedia";

// Home is eager (first paint); everything else is code-split.
const Collection = lazy(() => import("./pages/Collection.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Product = lazy(() => import("./pages/Product.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const PlaceOrder = lazy(() => import("./pages/PlaceOrder.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Verify = lazy(() => import("./pages/Verify.jsx"));

const PageFallback = () => <div className="min-h-[100svh]" aria-busy="true" />;

const App = () => {
  const location = useLocation();
  // Toasts must never cover actions: phones get them at the top (below the
  // floating nav) because the sticky buy bar and drawer CTAs live at the bottom.
  const phone = useMediaQuery("(max-width: 640px)");

  return (
    <>
      <a href="#main" className="sr-only z-[200] bg-ink px-4 py-3 text-bone focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <SmoothScroll />
      <Cursor />
      <ToastContainer position={phone ? "top-center" : "bottom-left"} hideProgressBar theme="dark" />

      <Navbar />
      <MobileMenu />
      <SearchOverlay />
      <CartDrawer />
      <FlyToCartLayer />

      {/* Scroll resets between exit and enter, so the old page never jumps. */}
      <AnimatePresence mode="wait" onExitComplete={() => scrollToTop(true)}>
        <PageTransition key={location.pathname}>
          <Suspense fallback={<PageFallback />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/collection/:slug" element={<Collection />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/:productId" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/place-orders" element={<PlaceOrder />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/verify" element={<Verify />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default App;
