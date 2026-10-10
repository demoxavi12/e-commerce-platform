import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ShopContext } from "../context/shop-context";
import { useUI } from "../context/ui-context";
import { useOverlay } from "../hooks/useOverlay";
import { ease, pad } from "../lib/motion";

// Full-screen editorial menu: ink curtain drops, oversized serif links rise.
const MobileMenu = () => {
  const { token, logout } = useContext(ShopContext);
  const { menuOpen, setMenuOpen } = useUI();
  const close = () => setMenuOpen(false);
  const panelRef = useOverlay(menuOpen, close);

  const links = [
    { to: "/", label: "Home" },
    { to: "/collection", label: "Collections" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    ...(token ? [{ to: "/orders", label: "Orders" }, { to: "/profile", label: "Profile" }] : [{ to: "/login", label: "Sign in" }]),
  ];

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="glass-dark fixed inset-0 z-[55] flex flex-col !rounded-none !border-0 bg-ink/40 text-bone outline-none lg:hidden"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.6, ease: ease.inOut, delay: 0.1 } }}
          transition={{ duration: 0.7, ease: ease.inOut }}
        >
          <nav aria-label="Mobile" className="gutter flex flex-1 flex-col justify-center pt-[var(--nav-h)]">
            <ul>
              {links.map((l, i) => (
                <li key={l.to} className="overflow-hidden border-b border-bone/10">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0, transition: { duration: 0.8, ease: ease.out, delay: 0.25 + i * 0.06 } }}
                    exit={{ y: "-100%", transition: { duration: 0.35, ease: ease.inOut } }}
                  >
                    <NavLink
                      to={l.to}
                      end={l.to === "/"}
                      onClick={close}
                      className={({ isActive }) => `flex items-baseline gap-4 py-3 ${isActive ? "text-ember" : ""}`}
                    >
                      <span className="eyebrow w-6 text-bone/40">{pad(i + 1)}</span>
                      <span className="display text-[13vw] leading-none sm:text-7xl">{l.label}</span>
                    </NavLink>
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.6 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="gutter flex items-center justify-between pb-[max(24px,env(safe-area-inset-bottom))] pt-6"
          >
            <Link to="/collection" onClick={close} className="eyebrow text-bone/60">SS—26 Collection</Link>
            {token && (
              <button
                type="button"
                onClick={() => {
                  close();
                  logout();
                }}
                className="eyebrow text-ember"
              >
                Log out
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
