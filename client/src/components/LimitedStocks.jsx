import { useContext, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ShopContext } from "../context/shop-context";
import ProductItem from "./ProductItem";
import Tittle from "./Tittle";
import Rail from "./ui/Rail";

// Limited-stock rail: native horizontal scroll + snap, arrow controls on desktop.
const LimitedStocks = () => {
  const { products } = useContext(ShopContext);
  const sliderRef = useRef(null);
  const limitedProducts = products.filter((item) => item.limitedStocks === true);

  const slide = (direction) => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: (direction === "next" ? 1 : -1) * el.clientWidth * 0.7, behavior: "smooth" });
  };

  if (!limitedProducts.length) return null;

  return (
    <section className="pt-28" aria-labelledby="limited-rail-title">
      <div className="gutter mb-10 flex items-end justify-between gap-6">
        <Tittle text1="LIMITED" text2="EDITIONS" eyebrow="( Rare ) — Won’t restock" />
        <div className="hidden gap-2 sm:flex">
          {[["prev", ArrowLeft], ["next", ArrowRight]].map(([dir, Icon]) => (
            <button
              key={dir}
              type="button"
              onClick={() => slide(dir)}
              aria-label={dir === "next" ? "Next products" : "Previous products"}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-bone"
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>
      <Rail ref={sliderRef} label="Limited editions">
        {limitedProducts.map((item, i) => (
          <div key={item._id} className="w-[64vw] shrink-0 snap-start sm:w-[34vw] lg:w-[22vw]">
            <ProductItem id={item._id} images={item.images} name={item.name} price={item.price} index={i} tag="Limited" />
          </div>
        ))}
      </Rail>
    </section>
  );
};

export default LimitedStocks;
