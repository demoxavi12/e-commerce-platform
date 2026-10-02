import { Link } from "react-router-dom";
import assets from "../assets/assets";
import Tittle from "./Tittle";
import Reveal from "./motion/Reveal";

const brands = [
  { id: "H&M", name: "H&M", image: assets.handm },
  { id: "Adidas", name: "Adidas", image: assets.adiddas },
  { id: "calvin-klein", name: "Calvin Klein", image: assets.calvin },
  { id: "lacoste", name: "Lacoste", image: assets.lacoste },
  { id: "gucci", name: "Gucci", image: assets.gucci },
  { id: "nike", name: "Nike", image: assets.nike },
];

// Brand index: hairline grid, logo desaturated until hover, spotlight fill.
const BrandCollection = () => (
  <section className="gutter pt-28" aria-labelledby="brands-title">
    <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
      <Tittle text1="TOP" text2="BRANDS" eyebrow="( Index ) — Houses we carry" />
      <p className="max-w-xs text-[15px] leading-relaxed text-mute">A diverse range of styles and quality craftsmanship from the names you trust.</p>
    </div>
    <ul className="grid grid-cols-2 border-l border-t border-ink/10 sm:grid-cols-3 lg:grid-cols-6">
      {brands.map((b, i) => (
        <Reveal as="li" key={b.id} variant="fade" delay={i * 0.06} className="border-b border-r border-ink/10">
          <Link to={`/collection/${encodeURIComponent(b.id)}`} data-cursor="Open" className="group relative flex aspect-square flex-col items-center justify-center overflow-hidden p-6">
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-paper transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
            <img src={b.image} alt="" loading="lazy" className="relative max-h-16 w-auto object-contain opacity-70 grayscale transition-all duration-500 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0" />
            <span className="relative mt-4 eyebrow text-mute transition-colors group-hover:text-ink">{b.name}</span>
          </Link>
        </Reveal>
      ))}
    </ul>
  </section>
);

export default BrandCollection;
