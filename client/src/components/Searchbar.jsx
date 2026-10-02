import { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { ShopContext } from "../context/shop-context";
import { ease } from "../lib/motion";

// Inline search for the collection page (shown when search is active).
// Shares `search` with the global overlay.
const Searchbar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);

  return (
    <AnimatePresence initial={false}>
      {showSearch && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: ease.out }}
          className="overflow-hidden"
        >
          <div className="gutter pb-6">
            <div className="flex items-center gap-3 border-b border-ink pb-2">
              <Search size={18} strokeWidth={1.5} className="text-mute" />
              <label htmlFor="collection-search" className="sr-only">Search products</label>
              <input
                id="collection-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search the collection"
                className="flex-1 bg-transparent py-2 text-lg outline-none placeholder:text-ink/30"
              />
              <button
                type="button"
                onClick={() => {
                  setShowSearch(false);
                  setSearch("");
                }}
                aria-label="Clear and close search"
                className="flex h-10 w-10 items-center justify-center transition-transform hover:rotate-90"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Searchbar;
