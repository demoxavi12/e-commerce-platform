import assets from "../assets/assets";
import Marquee from "./motion/Marquee";

const brands = [
  { id: "hm", name: "H&M", image: assets.handm },
  { id: "adidas", name: "Adidas", image: assets.adiddas },
  { id: "calvin-klein", name: "Calvin Klein", image: assets.calvin },
  { id: "lacoste", name: "Lacoste", image: assets.lacoste },
  { id: "gucci", name: "Gucci", image: assets.gucci },
  { id: "nike", name: "Nike", image: assets.nike },
];

// Brand strip — speed reacts to scroll velocity; logos desaturate until hovered.
const TopBrands = () => (
  <section className="border-y border-ink/10 py-10" aria-label="Top brands we carry">
    <div className="gutter mb-8 flex items-center justify-between">
      <p className="eyebrow text-mute">( 06 ) — Also in store</p>
      <ul className="sr-only">
        {brands.map((b) => (
          <li key={b.id}>{b.name}</li>
        ))}
      </ul>
    </div>
    <Marquee baseVelocity={-1.6} repeat={3}>
      {brands.map((b) => (
        <div key={b.id} className="mx-8 flex h-16 w-36 items-center justify-center sm:mx-14">
          <img src={b.image} alt="" loading="lazy" draggable={false} className="max-h-12 w-auto object-contain opacity-60 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0" />
        </div>
      ))}
    </Marquee>
  </section>
);

export default TopBrands;
