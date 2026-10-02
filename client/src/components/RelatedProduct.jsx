import { useContext, useMemo } from "react";
import { ShopContext } from "../context/shop-context";
import ProductItem from "./ProductItem";
import Tittle from "./Tittle";
import Rail from "./ui/Rail";

// Same category (+ sub-category when it matches), excluding the current piece.
// Note: the API field is `subcategory`; the old code compared `subCategory`,
// which was always undefined. Both are accepted now.
const RelatedProduct = ({ category, subCategory, currentId }) => {
  const { products } = useContext(ShopContext);

  const related = useMemo(() => {
    const sameCat = products.filter((p) => p.category === category && p._id !== currentId);
    const sameSub = sameCat.filter((p) => (p.subcategory || p.subCategory) === subCategory);
    return (sameSub.length >= 4 ? sameSub : sameCat).slice(0, 8);
  }, [products, category, subCategory, currentId]);

  if (!related.length) return null;

  return (
    <section className="border-t border-ink/10 pt-20" aria-labelledby="related-title">
      <div className="gutter mb-10 flex items-end justify-between">
        <Tittle text1="YOU MAY" text2="ALSO LIKE" eyebrow="( More ) — Same wardrobe" size="sm" />
      </div>
      <Rail label="Related products">
        {related.map((item, i) => (
          <div key={item._id} className="w-[60vw] shrink-0 snap-start sm:w-[32vw] lg:w-[21vw]">
            <ProductItem id={item._id} images={item.images} name={item.name} price={item.price} index={i} category={item.category} />
          </div>
        ))}
      </Rail>
    </section>
  );
};

export default RelatedProduct;
