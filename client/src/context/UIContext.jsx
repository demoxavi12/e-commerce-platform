import { useCallback, useMemo, useRef, useState } from "react";
import { UIContext } from "./ui-context";

// Presentation-only state (overlays, fly-to-cart). Kept separate from
// ShopContext so opening a drawer never re-renders product data consumers.
const UIContextProvider = ({ children }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [flights, setFlights] = useState([]);
  const [cartPulse, setCartPulse] = useState(0);
  const cartIconRef = useRef(null);

  // Launch a product thumbnail from `fromEl` toward the navbar bag.
  const flyToCart = useCallback((src, fromEl, { openDrawer = true } = {}) => {
    const target = cartIconRef.current;
    if (!fromEl || !target) {
      setCartPulse((p) => p + 1);
      if (openDrawer) setCartOpen(true);
      return;
    }
    const from = fromEl.getBoundingClientRect();
    let to = target.getBoundingClientRect();
    // Navbar may be hidden (scrolled away) — aim at the top-right corner instead.
    if (to.bottom <= 0) to = { left: window.innerWidth - 56, top: 18, width: 24, height: 24 };
    setFlights((f) => [...f, { id: Date.now() + Math.random(), src, from, to, openDrawer }]);
  }, []);

  const landFlight = useCallback((id, openDrawer) => {
    setFlights((f) => f.filter((x) => x.id !== id));
    setCartPulse((p) => p + 1);
    if (openDrawer) setTimeout(() => setCartOpen(true), 180);
  }, []);

  const value = useMemo(
    () => ({
      cartOpen, setCartOpen,
      searchOpen, setSearchOpen,
      menuOpen, setMenuOpen,
      flights, flyToCart, landFlight,
      cartPulse, cartIconRef,
    }),
    [cartOpen, searchOpen, menuOpen, flights, flyToCart, landFlight, cartPulse]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export default UIContextProvider;
