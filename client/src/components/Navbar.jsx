import { useContext, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Search, User, ShoppingBag } from "lucide-react";
import { ShopContext } from "../context/shop-context";
import { useUI } from "../context/ui-context";
import { ease } from "../lib/motion";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/collection", label: "Collections" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

// Rolling label used for nav hover.
const Roll = ({ children }) => (
  <span className="relative block overflow-hidden">
    <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">{children}</span>
    <span aria-hidden="true" className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0">
      {children}
    </span>
  </span>
);

const Navbar = () => {
  const { getCartCount, token, logout } = useContext(ShopContext);
  const { setSearchOpen, setCartOpen, menuOpen, setMenuOpen, cartIconRef, cartPulse } = useUI();
  const { pathname } = useLocation();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [heroZone, setHeroZone] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const count = getCartCount();

  const isHome = pathname === "/";

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const nextHidden = y > 160 && y > prev && !menuOpen;
    if (nextHidden !== hidden) setHidden(nextHidden);
    const nextZone = y < window.innerHeight - 80;
    if (nextZone !== heroZone) setHeroZone(nextZone);
    const nextScrolled = y > 12;
    if (nextScrolled !== scrolled) setScrolled(nextScrolled);
  });

  // Light-on-dark only while the home hero is behind the bar.
  const overHero = isHome && heroZone;
  const dark = overHero && !menuOpen;
  const solid = scrolled && !overHero && !menuOpen;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: hidden ? "-110%" : 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: ease.out }}
      className={`fixed inset-x-0 top-0 z-[60] transition-colors duration-500 ${dark || menuOpen ? "text-bone" : "text-ink"}`}
    >
      <div
        className={`absolute inset-0 -z-10 transition-[opacity,backdrop-filter] duration-500 ${
          solid ? "bg-bone/80 opacity-100 backdrop-blur-xl" : "opacity-0"
        }`}
      />
      <div className={`absolute inset-x-0 bottom-0 h-px transition-opacity duration-500 ${solid ? "bg-ink/10 opacity-100" : "opacity-0"}`} />

      <nav aria-label="Primary" className="gutter mx-auto grid h-[var(--nav-h)] grid-cols-[1fr_auto_1fr] items-center">
        {/* Left: links (desktop) / menu toggle (mobile) */}
        <div className="flex items-center">
          <ul className="hidden items-center gap-7 lg:flex">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === "/"} className="group relative flex items-center gap-2 py-2 label-ui" data-cursor="">
                  {({ isActive }) => (
                    <>
                      <span className="relative flex h-1.5 w-1.5 items-center justify-center">
                        {isActive && (
                          <motion.span layoutId="nav-dot" className="h-1.5 w-1.5 rounded-full bg-ember" transition={{ type: "spring", stiffness: 500, damping: 35 }} />
                        )}
                      </span>
                      <Roll>{l.label}</Roll>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="-ml-2 flex h-11 items-center gap-3 px-2 lg:hidden"
          >
            <span className="relative block h-3 w-6">
              <motion.span
                className="absolute left-0 top-0 block h-px w-6 bg-current"
                animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.5, ease: ease.out }}
              />
              <motion.span
                className="absolute bottom-0 left-0 block h-px bg-current"
                animate={menuOpen ? { rotate: -45, y: -5, width: 24 } : { rotate: 0, y: 0, width: 16 }}
                transition={{ duration: 0.5, ease: ease.out }}
              />
            </span>
            <span className="label-ui">{menuOpen ? "Close" : "Menu"}</span>
          </button>
        </div>

        {/* Center: wordmark */}
        <Link to="/" aria-label="ELEVÉ home" className="group flex flex-col items-center leading-none" data-cursor="">
          <span className="display text-[28px] tracking-[0.18em] sm:text-[32px]">ELEVÉ</span>
          <span className="eyebrow mt-1 hidden !text-[9px] opacity-60 transition-opacity group-hover:opacity-100 sm:block">Above Ordinary</span>
        </Link>

        {/* Right: actions */}
        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search products"
            className="flex h-11 w-11 items-center justify-center transition-transform duration-300 hover:scale-110"
          >
            <Search size={19} strokeWidth={1.5} />
          </button>

          <div className="group relative hidden sm:block">
            {token ? (
              <button type="button" aria-label="Account menu" aria-haspopup="true" className="flex h-11 w-11 items-center justify-center transition-transform duration-300 hover:scale-110">
                <User size={19} strokeWidth={1.5} />
              </button>
            ) : (
              <Link to="/login" aria-label="Sign in" className="flex h-11 w-11 items-center justify-center transition-transform duration-300 hover:scale-110">
                <User size={19} strokeWidth={1.5} />
              </Link>
            )}
            {token && (
              <div className="pointer-events-none absolute right-0 top-full translate-y-2 pt-2 opacity-0 transition-all duration-300 ease-[var(--ease-out-expo)] group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                <div className="w-56 bg-ink p-2 text-bone shadow-[var(--shadow-float)]">
                  <p className="eyebrow px-3 pb-2 pt-1 text-bone/50">Account</p>
                  {[
                    { to: "/profile", label: "Profile" },
                    { to: "/orders", label: "Orders" },
                  ].map((i) => (
                    <Link key={i.to} to={i.to} className="group/i flex items-center justify-between px-3 py-2.5 text-sm transition-colors hover:bg-bone/10">
                      {i.label}
                      <span className="translate-x-[-4px] opacity-0 transition-all group-hover/i:translate-x-0 group-hover/i:opacity-100">→</span>
                    </Link>
                  ))}
                  <button type="button" onClick={logout} className="w-full px-3 py-2.5 text-left text-sm text-ember transition-colors hover:bg-ember hover:text-ink">
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            ref={cartIconRef}
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}
            className="relative flex h-11 items-center gap-2 pl-2 transition-transform duration-300 hover:scale-105"
          >
            <motion.span key={cartPulse} animate={cartPulse ? { scale: [1, 1.35, 0.9, 1], rotate: [0, -10, 6, 0] } : {}} transition={{ duration: 0.6, ease: ease.out }} className="block">
              <ShoppingBag size={19} strokeWidth={1.5} />
            </motion.span>
            <span className="relative flex h-5 min-w-5 items-center justify-center overflow-hidden rounded-full bg-ember px-1.5 font-mono text-[10px] font-medium text-ink">
              <span className="invisible">{count}</span>
              <AnimatePresence initial={false}>
                <motion.span key={count} initial={{ y: 12 }} animate={{ y: 0 }} exit={{ y: -12 }} transition={{ duration: 0.35, ease: ease.out }} className="absolute inset-0 flex items-center justify-center">
                  {count}
                </motion.span>
              </AnimatePresence>
            </span>
          </button>
        </div>
      </nav>
    </motion.header>
  );
};

export default Navbar;
