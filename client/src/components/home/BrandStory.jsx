import { useRef } from "react";
import { motion, useMotionTemplate, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Reveal from "../motion/Reveal";
import Button from "../ui/Button";
import { editorial, size } from "../../assets/editorial";

// Editorial interlude: the campaign photograph lives *inside* oversized
// type (background-clip: text) and drifts as you scroll; below, an
// asymmetric collage with overlapping frames. Copy describes the aesthetic,
// not factual claims about sourcing or production.
const BrandStory = () => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], reduced ? [50, 50] : [20, 80]);
  const bgPos = useMotionTemplate`50% ${bgY}%`;
  const lift = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["12%", "-12%"]);
  const sink = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-6%", "10%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-ivory py-24 sm:py-32" aria-labelledby="story-title">
      <p className="gutter eyebrow text-mute">( 07 ) — The point of view</p>

      {/* Image-filled typography */}
      <h2 id="story-title" className="gutter mt-6 select-none">
        <motion.span
          className="display block bg-ink bg-cover bg-clip-text text-[16vw] leading-[0.84] text-transparent [-webkit-background-clip:text] supports-[not(background-clip:text)]:text-ink"
          style={{ backgroundImage: `url(${editorial.redWall})`, backgroundPosition: bgPos }}
        >
          Considered
        </motion.span>
        <motion.span
          className="display block bg-ink bg-cover bg-clip-text pl-[1.2em] text-[16vw] italic leading-[0.84] text-transparent [-webkit-background-clip:text] supports-[not(background-clip:text)]:text-ink"
          style={{ backgroundImage: `url(${editorial.redWall})`, backgroundPosition: bgPos }}
        >
          everyday.
        </motion.span>
      </h2>

      {/* Asymmetric collage */}
      <div className="gutter relative mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-6">
        <motion.figure style={{ y: lift }} className="relative m-0 lg:col-span-5">
          <Reveal variant="clip" className="aspect-[4/5] overflow-hidden bg-stone-2">
            <img src={editorial.denim} width={size.denim[0]} height={size.denim[1]} loading="lazy" decoding="async" alt="Layered denim and print, styled for the season" className="h-full w-full object-cover" />
          </Reveal>
          <figcaption className="mt-3 eyebrow text-mute">Fig. 01 — Layering</figcaption>
        </motion.figure>

        <div className="flex flex-col justify-center lg:col-span-4 lg:col-start-7 lg:pt-24">
          <Reveal>
            <p className="display text-4xl leading-[1.05] sm:text-5xl">
              Quiet pieces, <span className="italic text-ember">loud</span> details.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-mute">
              The ELEVÉ wardrobe is built around things you reach for twice a week — a jacket with weight to it, denim that
              looks better worn, knitwear you can live in. Nothing shouts. Everything is considered.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-8">
            <Button to="/about" variant="outline">Read our story</Button>
          </Reveal>
        </div>

        <motion.figure style={{ y: sink }} className="relative m-0 lg:col-span-3 lg:col-start-10 lg:-mt-24">
          <Reveal variant="clip" className="aspect-square overflow-hidden bg-stone-2">
            <img src={editorial.flatlay} width={size.flatlay[0]} height={size.flatlay[1]} loading="lazy" decoding="async" alt="Flat lay of denim, knitwear and suede boots" className="h-full w-full object-cover" />
          </Reveal>
          <figcaption className="mt-3 eyebrow text-mute">Fig. 02 — Everyday</figcaption>
        </motion.figure>
      </div>
    </section>
  );
};

export default BrandStory;
