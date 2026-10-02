import { useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { ShopContext } from "../context/shop-context";
import { useUI } from "../context/ui-context";
import { useOverlay } from "../hooks/useOverlay";
import { ease, formatPrice } from "../lib/motion";
import { img } from "../lib/image";

// Global search: works from any page. Live results come from the product
// list already in ShopContext; Enter / "See all" hands off to /collection
// using the same `search` + `showSearch` state the collection filter uses.
const SearchOverlay = () => {
  const { products, search, setSearch, setShowSearch, currecy } = useContext(ShopContext);
  const { searchOpen, setSearchOpen } = useUI();
  const navigate = useNavigate();
  const close = () => setSearchOpen(false);
  const panelRef = useOverlay(searchOpen, close);

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.category?.toLowerCase() === q).slice(0, 6);
  }, [products, search]);

  const seeAll = () => {
    setShowSearch(true);
    close();
    navigate("/collection");
  };

  const suggestions = ["Hoodie", "Jacket", "Denim", "T-shirt", "Women", "Kids"];

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <motion.div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            className="relative max-h-[90svh] overflow-y-auto bg-bone outline-none"
            data-lenis-prevent
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: ease.inOut }}
          >
            <div className="gutter pb-10 pt-6">
              <div className="flex items-center justify-between">
                <p className="eyebrow text-mute">Search the store — {products.length} pieces</p>
                <button type="button" onClick={close} aria-label="Close search" className="flex h-11 w-11 items-center justify-center transition-transform hover:rotate-90">
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  seeAll();
                }}
                className="relative mt-4 border-b border-ink"
                role="search"
              >
                <label htmlFor="global-search" className="sr-only">Search products</label>
                <input
                  id="global-search"
                  data-autofocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="What are you looking for?"
                  autoComplete="off"
                  className="display w-full bg-transparent pb-3 text-[9vw] leading-none outline-none placeholder:text-ink/20 sm:text-6xl lg:text-7xl"
                />
              </form>

              {!search.trim() && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.4 } }} className="mt-6 flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSearch(s)}
                      className="border border-ink/15 px-4 py-2 text-sm transition-colors hover:border-ink hover:bg-ink hover:text-bone"
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}

              <div aria-live="polite" className="mt-8">
                {search.trim() && results.length === 0 && (
                  <p className="text-mute">Nothing matches “{search}”. Try a broader word.</p>
                )}
                <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
                  <AnimatePresence>
                    {results.map((p, i) => (
                      <motion.li
                        key={p._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.5, ease: ease.out } }}
                        exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      >
                        <Link to={`/product/${p._id}`} onClick={close} className="group block" data-cursor="View">
                          <div className="aspect-[3/4] overflow-hidden bg-stone-2">
                            <img src={img(p.images?.[0], 400)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105" />
                          </div>
                          <p className="mt-2 line-clamp-1 text-sm">{p.name}</p>
                          <p className="font-mono text-xs text-mute">{formatPrice(currecy, p.price)}</p>
                        </Link>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                {results.length > 0 && (
                  <button type="button" onClick={seeAll} className="group mt-8 inline-flex items-center gap-2 label-ui link-line">
                    See all results <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
