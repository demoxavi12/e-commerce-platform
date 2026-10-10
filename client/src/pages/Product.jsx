import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { toast } from "react-toastify";
import { Heart, Star, Truck, RefreshCcw, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { ShopContext } from "../context/shop-context";
import { useUI } from "../context/ui-context";
import RelatedProduct from "../components/RelatedProduct";
import SplitText from "../components/motion/SplitText";
import Button from "../components/ui/Button";
import { QtyStepper } from "../components/CartLineItem";
import { useFinePointer } from "../hooks/useMedia";
import { ease, formatPrice, pad } from "../lib/motion";
import { img } from "../lib/image";

const REVIEWS = [
  { name: "Aarav", text: "Amazing quality, fits perfectly!" },
  { name: "Riya", text: "Fabric feels premium. Totally worth it." },
  { name: "Kabir", text: "Looks even better in real life." },
];

// Directional clip-wipe: next image wipes in from the right, previous from the left.
const wipe = {
  enter: (dir) => ({ clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)", scale: 1.1 }),
  center: { clipPath: "inset(0% 0% 0% 0%)", scale: 1 },
  exit: { opacity: 0.4, transition: { duration: 0.6 } },
};

// Main image with a hover zoom lens (desktop) and clip-wipe between images.
// The lens position is written to CSS variables on the element — no React
// re-render per pointer move.
const Stage = ({ images, active, setActive, imgRef, name }) => {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const lensRef = useRef(null);
  const [dir, setDir] = useState(1);
  const src = images[active];
  const canZoom = fine && !reduced;

  const go = (i) => {
    const next = (i + images.length) % images.length;
    setDir(next >= active ? 1 : -1);
    setActive(next);
  };

  const onMove = (e) => {
    const lens = lensRef.current;
    if (!canZoom || !lens) return;
    const r = e.currentTarget.getBoundingClientRect();
    lens.style.setProperty("--zx", `${((e.clientX - r.left) / r.width) * 100}%`);
    lens.style.setProperty("--zy", `${((e.clientY - r.top) / r.height) * 100}%`);
    lens.style.opacity = "1";
  };
  const onLeave = () => {
    if (lensRef.current) lensRef.current.style.opacity = "0";
  };

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row">
      {images.length > 1 && (
        <div
          className="scrollbar-hide flex gap-2 overflow-x-auto lg:w-20 lg:flex-col"
          role="tablist"
          aria-label="Product images"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); go(active + 1); }
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); go(active - 1); }
          }}
        >
          {images.map((thumb, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={active === i}
              tabIndex={active === i ? 0 : -1}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              onClick={() => go(i)}
              className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden bg-stone-2 lg:w-full"
            >
              <img src={img(thumb, 200)} alt="" className={`h-full w-full object-cover transition-all duration-500 ${active === i ? "opacity-100" : "opacity-50 hover:opacity-90"}`} />
              {active === i && <motion.span layoutId="thumb-ring" className="absolute inset-0 ring-1 ring-inset ring-ink" />}
            </button>
          ))}
        </div>
      )}

      <div
        className="relative aspect-[4/5] flex-1 overflow-hidden bg-stone-2"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        data-cursor={canZoom ? "Zoom" : undefined}
      >
        <AnimatePresence initial={false} custom={dir}>
          <motion.img
            ref={imgRef}
            key={src}
            src={img(src, 1400)}
            alt={name}
            fetchPriority="high"
            custom={dir}
            variants={wipe}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.9, ease: ease.inOut }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        {canZoom && (
          <div
            ref={lensRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-no-repeat opacity-0 transition-opacity duration-300"
            style={{ backgroundImage: `url(${img(src, 2000)})`, backgroundSize: "200%", backgroundPosition: "var(--zx, 50%) var(--zy, 50%)" }}
          />
        )}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 z-10 flex gap-1.5">
            <button type="button" onClick={() => go(active - 1)} aria-label="Previous image" className="glass-chip flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95">
              <ChevronLeft size={18} />
            </button>
            <button type="button" onClick={() => go(active + 1)} aria-label="Next image" className="glass-chip flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
        <span className="glass-chip pointer-events-none absolute bottom-3 left-3 rounded-full px-3 py-1.5 font-mono text-[10px]" aria-live="polite">
          {pad(active + 1)} / {pad(images.length)}
        </span>
      </div>
    </div>
  );
};

// Phone-only floating glass purchase bar, shown while the main Add-to-bag
// row is off-screen. It calls the page handler, so login/size rules,
// fly-to-cart and the cart API are unchanged.
const StickyBuyBar = ({ show, product, image, currency, token, activeSize, status, onBuy }) => {
  const thumbRef = useRef(null);
  const label = !token ? "Login to buy" : status === "added" ? "Added" : !activeSize ? "Select size" : "Add to bag";
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "130%" }}
          animate={{ y: 0 }}
          exit={{ y: "130%" }}
          transition={{ duration: 0.55, ease: ease.out }}
          className="glass fixed inset-x-2.5 bottom-[max(10px,env(safe-area-inset-bottom))] z-[50] flex items-center gap-3 rounded-[22px] p-2 lg:hidden"
        >
          <div ref={thumbRef} className="h-14 w-11 shrink-0 overflow-hidden rounded-[12px] bg-stone-2">
            <img src={img(image, 160)} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px]">{product.name}</p>
            <p className="font-mono text-xs text-mute">
              {formatPrice(currency, product.price)}{activeSize ? ` · ${activeSize}` : ""}
            </p>
          </div>
          <Button size="sm" onClick={() => onBuy(thumbRef.current)} loading={status === "adding"} success={status === "added"} icon={false}>
            {label}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, token, shippingCost } = useContext(ShopContext);
  const { flyToCart } = useUI();
  const navigate = useNavigate();
  const imgRef = useRef(null);
  const ctaRef = useRef(null);
  const [ctaInView, setCtaInView] = useState(true);

  const productData = useMemo(() => products.find((p) => p._id === productId) || null, [products, productId]);
  const [activeImage, setActiveImage] = useState(0);
  const [activeSize, setActiveSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const [status, setStatus] = useState("idle"); // idle | adding | added
  const [sizeError, setSizeError] = useState(false);
  const [liked, setLiked] = useState(false);

  // Per-product UI resets naturally: routes are keyed by pathname, so a new
  // product id remounts this page.

  // Observe the main CTA row once it exists (the page renders a skeleton
  // until products load, so this re-runs when productData arrives).
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setCtaInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [productData]);

  const handleAddToCart = async (fromEl) => {
    // 1. Must be logged in (unchanged rule)
    if (!token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    // 2. Must choose a size — shake the selector instead of only toasting
    if (!activeSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 600);
      toast.error("Please select a size");
      return;
    }
    setStatus("adding");
    flyToCart(productData.images[activeImage], fromEl instanceof Element ? fromEl : imgRef.current);
    await addToCart(productData._id, activeSize, qty);
    setStatus("added");
    setTimeout(() => setStatus("idle"), 1800);
  };

  if (!productData) {
    return (
      <div className="page-top gutter grid gap-10 pb-20 pt-8 lg:grid-cols-2">
        <div className="skeleton aspect-[4/5]" />
        <div className="space-y-4 pt-6">
          <div className="skeleton h-4 w-32" />
          <div className="skeleton h-16 w-3/4" />
          <div className="skeleton h-6 w-24" />
        </div>
      </div>
    );
  }

  const images = productData.images?.length ? productData.images : [""];

  return (
    <div className="page-top">
      <div className="gutter grid gap-10 pb-20 pt-6 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        {/* ============ GALLERY ============ */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: ease.out }}>
          <Stage images={images} active={activeImage} setActive={setActiveImage} imgRef={imgRef} name={productData.name} />
        </motion.div>

        {/* ============ PURCHASE PANEL ============ */}
        <div>
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+16px)]">
            <nav aria-label="Breadcrumb" className="eyebrow flex flex-wrap gap-2 text-mute">
              <Link to="/collection" className="link-line hover:text-ink">Shop</Link>/
              <Link to={`/collection?category=${productData.category}`} className="link-line hover:text-ink">{productData.category}</Link>/
              <span className="text-ink">{productData.subcategory || productData.subCategory}</span>
            </nav>

            <h1 className="display mt-5 text-[clamp(40px,5vw,76px)] leading-[0.95]">
              <SplitText text={productData.name} trigger="mount" stagger={0.04} key={productData._id} />
            </h1>

            <div className="mt-5 flex items-center gap-5">
              <motion.p
                key={productData._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: ease.out }}
                className="font-mono text-2xl"
              >
                {formatPrice(currency, productData.price)}
              </motion.p>
              <div className="flex items-center gap-1.5 text-sm text-mute" aria-label="Rated 4 out of 5, 122 reviews">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={13} className={i < 4 ? "fill-ink text-ink" : "text-ink/30"} />
                ))}
                <span className="ml-1">(122)</span>
              </div>
            </div>

            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-mute">{productData.description}</p>

            {/* Purchase card (glass) */}
            <div className="glass mt-9 rounded-[24px] p-4 sm:p-5">
            {/* Sizes */}
            <div>
              <div className="flex items-center justify-between">
                <p className="label-ui" id="size-label">
                  Size {activeSize && <span className="ml-2 font-mono text-mute">— {activeSize}</span>}
                </p>
                <AnimatePresence>
                  {sizeError && (
                    <motion.p initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-xs text-ember" role="alert">
                      Choose a size first
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <LayoutGroup id="sizes">
                <motion.div
                  role="radiogroup"
                  aria-labelledby="size-label"
                  animate={sizeError ? { x: [0, -10, 9, -6, 4, 0] } : { x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-3 flex flex-wrap gap-2"
                >
                  {productData.sizes.map((size) => {
                    const on = activeSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setActiveSize(size)}
                        className={`relative h-12 min-w-14 rounded-full px-4 font-mono text-sm transition-colors duration-300 ${on ? "text-bone" : `border bg-white/40 ${sizeError ? "border-ember" : "border-ink/20"} hover:border-ink`}`}
                      >
                        {on && <motion.span layoutId="size-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
                        <span className="relative">{size}</span>
                      </button>
                    );
                  })}
                </motion.div>
              </LayoutGroup>
            </div>

            {/* Quantity + CTA */}
            <div ref={ctaRef} className="mt-6 flex items-center gap-2 sm:gap-3">
              <QtyStepper value={qty} onChange={setQty} />
              <div className="min-w-0 flex-1">
                <Button full size="lg" onClick={handleAddToCart} loading={status === "adding"} success={status === "added"} icon={false}>
                  {!token ? "Login to buy" : status === "added" ? "Added to bag" : <>Add to bag<span className="hidden sm:inline"> — {formatPrice(currency, productData.price * qty)}</span></>}
                </Button>
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                onClick={() => setLiked(!liked)}
                aria-pressed={liked}
                aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-ink/20 bg-white/40 transition-colors hover:border-ink"
              >
                <motion.span key={String(liked)} initial={{ scale: liked ? 0.4 : 1 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 12 }}>
                  <Heart size={18} className={liked ? "fill-ember text-ember" : ""} />
                </motion.span>
              </motion.button>
            </div>
            </div>

            {/* Trust */}
            <ul className="mt-10 grid gap-3 border-t border-ink/10 pt-6 text-sm text-mute sm:grid-cols-3">
              {[
                [Truck, `Flat ${formatPrice(currency, shippingCost)} shipping`],
                [RefreshCcw, "Easy 7-day return"],
                [ShieldCheck, "Secure payments"],
              ].map(([Icon, t]) => (
                <li key={t} className="flex items-center gap-2">
                  <Icon size={15} strokeWidth={1.5} className="text-ink" /> {t}
                </li>
              ))}
            </ul>

            {/* Tabs */}
            <div className="mt-10">
              <LayoutGroup id="tabs">
                <div className="flex gap-6 border-b border-ink/10" role="tablist">
                  {[
                    ["desc", "Description"],
                    ["reviews", `Reviews (${REVIEWS.length})`],
                  ].map(([k, label]) => (
                    <button
                      key={k}
                      type="button"
                      role="tab"
                      aria-selected={tab === k}
                      onClick={() => setTab(k)}
                      className={`relative pb-3 label-ui transition-colors ${tab === k ? "text-ink" : "text-mute hover:text-ink"}`}
                    >
                      {label}
                      {tab === k && <motion.span layoutId="tab-line" className="absolute inset-x-0 -bottom-px h-px bg-ink" />}
                    </button>
                  ))}
                </div>
              </LayoutGroup>
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  role="tabpanel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: ease.out }}
                  className="pt-5"
                >
                  {tab === "desc" ? (
                    <p className="max-w-lg text-[15px] leading-relaxed text-mute">
                      {productData.description ||
                        "Crafted with premium materials and designed for everyday comfort. This piece blends modern aesthetics with durability, making it a perfect addition to your wardrobe."}
                    </p>
                  ) : (
                    <ul className="divide-y divide-ink/10">
                      {REVIEWS.map((r) => (
                        <li key={r.name} className="py-4">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{r.name}</p>
                            <div className="flex gap-0.5" aria-label="4 out of 5 stars">
                              {[0, 1, 2, 3, 4].map((i) => (
                                <Star key={i} size={11} className={i < 4 ? "fill-ink text-ink" : "text-ink/30"} />
                              ))}
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-mute">{r.text}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <StickyBuyBar
        show={!ctaInView}
        product={productData}
        image={images[activeImage]}
        currency={currency}
        token={token}
        activeSize={activeSize}
        status={status}
        onBuy={(el) => {
          if (token && !activeSize) {
            document.getElementById("size-label")?.scrollIntoView({ behavior: "smooth", block: "center" });
            setSizeError(true);
            setTimeout(() => setSizeError(false), 900);
            return;
          }
          handleAddToCart(el);
        }}
      />

      <RelatedProduct category={productData.category} subCategory={productData.subcategory || productData.subCategory} currentId={productData._id} />
    </div>
  );
};

export default Product;
