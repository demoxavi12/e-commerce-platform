import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { ShopContext } from "../context/shop-context";
import ProductItem from "../components/ProductItem";
import Searchbar from "../components/Searchbar";
import SplitText from "../components/motion/SplitText";
import MerchandiseCollections from "../components/MerchandiseCollections";
import BrandCollection from "../components/BrandCollection";
import LimitedStocks from "../components/LimitedStocks";
import AnimatedNumber from "../components/motion/AnimatedNumber";
import { ease, pad } from "../lib/motion";
import assets from "../assets/assets";
import { editorial } from "../assets/editorial";

// Header photography per category (project assets only).
const HEADER_IMAGE = {
  all: editorial.whiteCircle,
  Men: editorial.rosesPanel,
  Women: assets.women_collection,
  Kids: assets.kids_collection,
};

const categories = [
  { name: "Men", types: ["TopWear", "BottomWear", "WinterWear"] },
  { name: "Women", types: ["TopWear", "BottomWear", "WinterWear"] },
  { name: "Kids", types: ["TopWear", "BottomWear", "WinterWear"] },
];

const SORTS = [
  { label: "Featured", value: "" },
  { label: "Price: Low → High", value: "price-low-high" },
  { label: "Price: High → Low", value: "price-high-low" },
  { label: "Rating: High → Low", value: "rating-high-low" },
  { label: "Name: A → Z", value: "name-az" },
];

const PAGE = 12;

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [params, setParams] = useSearchParams();
  const { slug } = useParams();

  const [sortOption, setSortOption] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [activeType, setActiveType] = useState(null);
  const [limit, setLimit] = useState(PAGE);
  const sortRef = useRef(null);

  // Category lives in the URL (?category=Men) so home/footer links can deep-link.
  const activeCategory = categories.find((c) => c.name.toLowerCase() === (params.get("category") || "").toLowerCase())?.name || null;
  const setActiveCategory = (name) => {
    const next = new URLSearchParams(params);
    if (name) next.set("category", name);
    else next.delete("category");
    setParams(next, { replace: true, preventScrollReset: true });
    setActiveType(null);
    setLimit(PAGE);
  };

  // Typing a search clears category filters (same rule as before).
  useEffect(() => {
    if (search.trim() === "") return;
    setParams(
      (prev) => {
        if (!prev.get("category")) return prev;
        const next = new URLSearchParams(prev);
        next.delete("category");
        return next;
      },
      { replace: true, preventScrollReset: true }
    );
  }, [search, setParams]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // /collection/:slug (merch & brand tiles): soft filter by name if anything matches.
  const slugTerm = slug ? slug.replace(/-/g, " ").toLowerCase() : "";

  const sortedProducts = useMemo(() => {
    let list = products.filter((item) => {
      if (activeCategory && item.category?.toLowerCase() !== activeCategory.toLowerCase()) return false;
      if (activeType && item.subcategory?.toLowerCase() !== activeType.toLowerCase()) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    if (slugTerm) {
      const matched = list.filter((p) => p.name.toLowerCase().includes(slugTerm));
      if (matched.length) list = matched;
    }
    return [...list].sort((a, b) => {
      switch (sortOption) {
        case "price-low-high": return a.price - b.price;
        case "price-high-low": return b.price - a.price;
        case "rating-high-low": return (b.rating || 0) - (a.rating || 0);
        case "name-az": return a.name.localeCompare(b.name);
        default: return 0;
      }
    });
  }, [products, activeCategory, activeType, search, slugTerm, sortOption]);

  const visibleProducts = sortedProducts.slice(0, limit);
  const currentCat = categories.find((c) => c.name === activeCategory);

  return (
    <div className="page-top">
      {/* ===== HEADER ===== */}
      <header className="gutter pb-10 pt-8 sm:pt-14">
        <p className="eyebrow text-mute">
          ( Shop ) — {slug ? slug.replace(/-/g, " ") : activeCategory ? `${activeCategory}${activeType ? ` / ${activeType}` : ""}` : "Everything"}
        </p>
        <div className="mt-5 grid items-end gap-8 md:grid-cols-[1fr_minmax(260px,34%)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h1 className="display text-[clamp(56px,10vw,176px)]">
              <SplitText text={activeCategory ? `${activeCategory}’s *edit*` : "The *collection*"} trigger="mount" accentClassName="italic text-ember" key={activeCategory || "all"} />
            </h1>
            <p className="pb-3 font-mono text-sm text-mute">
              <AnimatedNumber value={sortedProducts.length} format={(n) => pad(Math.round(n), 3)} /> pieces
            </p>
          </div>
          {/* Category-aware campaign image; wipes across when the category changes */}
          <div className="relative hidden aspect-[16/10] overflow-hidden rounded-[6px] bg-stone-2 md:block">
            <AnimatePresence initial={false}>
              <motion.img
                key={activeCategory || "all"}
                src={HEADER_IMAGE[activeCategory || "all"]}
                alt=""
                initial={{ clipPath: "inset(0% 0% 0% 100%)", scale: 1.08 }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.3 } }}
                transition={{ duration: 0.9, ease: ease.inOut }}
                className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
              />
            </AnimatePresence>
            <span className="glass-chip absolute bottom-3 left-3 rounded-full px-3 py-1.5 eyebrow !text-[10px]">
              {activeCategory || "All"} · SS—26
            </span>
          </div>
        </div>
      </header>

      <Searchbar />

      {/* ===== FILTER BAR ===== */}
      <div className="glass sticky top-3 z-30 mx-[var(--gutter)] rounded-[22px]">
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-2 sm:px-3">
          <LayoutGroup id="cats">
            <div className="scrollbar-hide -mx-1 flex items-center gap-1 overflow-x-auto px-1" role="tablist" aria-label="Category">
              {[{ name: null, label: "All" }, ...categories.map((c) => ({ name: c.name, label: c.name }))].map((c) => {
                const active = activeCategory === c.name;
                return (
                  <button
                    key={c.label}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveCategory(c.name)}
                    className={`relative h-10 shrink-0 px-4 label-ui transition-colors ${active ? "text-bone" : "text-ink/70 hover:text-ink"}`}
                  >
                    {active && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                    <span className="relative">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>

          {/* Sort */}
          <div ref={sortRef} className="relative">
            <button
              type="button"
              onClick={() => setSortOpen(!sortOpen)}
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
              className="flex h-10 items-center gap-2 px-2 label-ui"
            >
              Sort: <span className="text-mute">{SORTS.find((s) => s.value === sortOption)?.label}</span>
              <motion.span animate={{ rotate: sortOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown size={14} />
              </motion.span>
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.ul
                  role="listbox"
                  aria-label="Sort products"
                  initial={{ opacity: 0, y: -8, clipPath: "inset(0% 0% 100% 0%)" }}
                  animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
                  exit={{ opacity: 0, y: -8, clipPath: "inset(0% 0% 100% 0%)" }}
                  transition={{ duration: 0.4, ease: ease.out }}
                  className="glass-dark absolute right-0 top-full z-50 mt-3 w-64 rounded-2xl p-2"
                >
                  {SORTS.map((opt) => (
                    <li key={opt.value}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={sortOption === opt.value}
                        onClick={() => {
                          setSortOption(opt.value);
                          setSortOpen(false);
                        }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-bone/10"
                      >
                        {opt.label}
                        {sortOption === opt.value && <Check size={14} className="text-ember" />}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sub-type chips */}
        <AnimatePresence initial={false}>
          {currentCat && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: ease.out }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 px-3 pb-3">
                {[null, ...currentCat.types].map((t, i) => (
                  <motion.button
                    key={t || "all"}
                    type="button"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }}
                    onClick={() => {
                      setActiveType(t);
                      setLimit(PAGE);
                    }}
                    aria-pressed={activeType === t}
                    className={`h-9 rounded-full border px-4 text-[13px] transition-colors ${activeType === t ? "border-ink bg-ink text-bone" : "border-ink/15 bg-white/40 hover:border-ink"}`}
                  >
                    {t ? t.replace(/Wear/, " wear") : `All ${currentCat.name.toLowerCase()}`}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== RESULTS ===== */}
      <section className="gutter pt-10" aria-live="polite">
        {showSearch && search && (
          <p className="mb-6 text-sm text-mute">
            Showing results for “<span className="text-ink">{search}</span>”
          </p>
        )}

        {products.length === 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton aspect-[3/4]" />
                <div className="skeleton mt-3 h-3 w-2/3" />
              </div>
            ))}
          </div>
        ) : visibleProducts.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-24 text-center">
            <p className="display text-5xl">Nothing here — yet.</p>
            <p className="mt-3 text-mute">
              No products found{search && <> for “{search}”</>}. Try another filter.
            </p>
            <button type="button" onClick={() => setActiveCategory(null)} className="mt-6 label-ui link-line">
              Reset filters
            </button>
          </motion.div>
        ) : (
          <motion.ul layout className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            <AnimatePresence>
              {visibleProducts.map((item, index) => (
                <motion.li
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.6, ease: ease.out }}
                >
                  <ProductItem sizes={item.sizes} id={item._id} images={item.images} name={item.name} price={item.price} index={index} category={item.category} tag={item.limitedStocks ? "Limited" : item.bestseller ? "Best" : undefined} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}

        {sortedProducts.length > limit && (
          <div className="mt-16 flex flex-col items-center gap-4">
            <p className="font-mono text-xs text-mute">
              Showing {visibleProducts.length} of {sortedProducts.length}
            </p>
            <div className="h-px w-48 bg-ink/10">
              <motion.div className="h-px origin-left bg-ink" animate={{ scaleX: visibleProducts.length / sortedProducts.length }} transition={{ duration: 0.8, ease: ease.out }} />
            </div>
            <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="mt-2 h-12 rounded-full border border-ink px-8 label-ui transition-colors hover:bg-ink hover:text-bone">
              Load more
            </button>
          </div>
        )}
      </section>

      <MerchandiseCollections />
      <LimitedStocks />
      <BrandCollection />
    </div>
  );
};

export default Collection;
