import { useContext, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ShopContext } from "../../context/shop-context";
import { img } from "../../lib/image";

// Scroll-scrubbed statement: each word brightens as the reader passes it.
// "{0}" / "{1}" tokens become small inline product images (editorial trick).
const COPY =
  "We make fewer things, {0} and we make them better. Heavyweight cottons, honest denim and cuts that outlast the season — {1} garments designed to be lived in, not just looked at.";

const Word = ({ children, progress, range, accent }) => {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className={`inline-block ${accent ? "italic text-ember" : ""}`}>
      {children}
    </motion.span>
  );
};

const Inline = ({ src, progress, range }) => {
  const scale = useTransform(progress, range, [0.4, 1]);
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <motion.span
      style={{ scale, opacity }}
      className="relative mx-[0.12em] inline-block h-[0.78em] w-[1.5em] overflow-hidden rounded-full bg-stone-2 align-[-0.06em]"
      aria-hidden="true"
    >
      {src && <img src={img(src, 200)} alt="" loading="lazy" className="h-full w-full object-cover" />}
    </motion.span>
  );
};

const Manifesto = () => {
  const { products } = useContext(ShopContext);
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });

  const tokens = COPY.split(" ");
  const n = tokens.length;
  const accentWords = new Set(["better.", "lived"]);
  const imgs = [products[4]?.images?.[0], products[7]?.images?.[0]];
  const feature = products.find((p) => p.limitedStocks) || products[10];
  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const featureY = useTransform(pass, [0, 1], reduced ? ["0%", "0%"] : ["25%", "-25%"]);

  return (
    <section ref={ref} className="gutter relative bg-bone py-28 sm:py-40" aria-label="Our philosophy">
      <p className="eyebrow mb-10 text-mute">( 03 ) — Manifesto</p>
      <div className="grid items-center gap-16 lg:grid-cols-[1fr_minmax(260px,30%)]">
      <p className="display max-w-[22ch] text-[clamp(38px,6vw,104px)] leading-[1.02]" aria-label={COPY.replace(/\{\d\}\s?/g, "")}>
        {tokens.map((t, i) => {
          const range = [i / n, Math.min(1, (i + 1.5) / n)];
          const m = t.match(/^\{(\d)\}$/);
          if (m) return <Inline key={i} src={imgs[+m[1]]} progress={scrollYProgress} range={range} />;
          return (
            <span key={i} aria-hidden="true">
              {reduced ? <span className={accentWords.has(t) ? "italic text-ember" : ""}>{t}</span> : <Word progress={scrollYProgress} range={range} accent={accentWords.has(t)}>{t}</Word>}{" "}
            </span>
          );
        })}
      </p>
      {feature && (
        <motion.figure style={{ y: featureY }} className="hidden lg:block" aria-hidden="true">
          <div className="aspect-[3/4] overflow-hidden bg-stone-2">
            <img src={img(feature.images?.[0], 700)} alt="" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <figcaption className="mt-3 flex justify-between eyebrow text-mute">
            <span>Fabric study</span>
            <span>N°{String(products.indexOf(feature) + 1).padStart(3, "0")}</span>
          </figcaption>
        </motion.figure>
      )}
      </div>
    </section>
  );
};

export default Manifesto;
