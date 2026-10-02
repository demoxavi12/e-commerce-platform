import { Link } from "react-router-dom";
import assets from "../assets/assets";
import Tittle from "./Tittle";
import Marquee from "./motion/Marquee";

const merchandiseCollections = [
  { id: "marvel", name: "Marvel", image: assets.marvel_collection },
  { id: "DC", name: "DC Universe", image: assets.DC_collection },
  { id: "harry-potter", name: "Harry Potter", image: assets.hp_collection },
  { id: "star-wars", name: "Star Wars", image: assets.starwars_collection },
  { id: "anime", name: "Anime", image: assets.anime_collection },
  { id: "netflix", name: "Netflix Originals", image: assets.netflix_collection },
  { id: "F1", name: "F1", image: assets.F1_collection },
];

const MerchandiseCollections = () => (
  <section className="pt-28" aria-labelledby="merch-title">
    <div className="gutter mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
      <Tittle text1="MERCHANDISE" text2="UNIVERSES" eyebrow="( Fandom ) — Licensed collections" />
      <p className="max-w-xs text-[15px] leading-relaxed text-mute">Pieces from the worlds you love — premium fabrics, timeless silhouettes.</p>
    </div>
    <Marquee baseVelocity={-1.2} repeat={2}>
      {merchandiseCollections.map((item) => (
        <Link
          key={item.id}
          to={`/collection/${item.id}`}
          data-cursor="Open"
          className="group mr-4 block w-[200px] shrink-0 sm:w-[260px]"
        >
          <div className="aspect-square overflow-hidden bg-stone-2">
            <img src={item.image} alt="" loading="lazy" draggable={false} className="h-full w-full object-cover grayscale-[40%] transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:grayscale-0" />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <h3 className="display text-2xl">{item.name}</h3>
            <span className="text-sm opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100">→</span>
          </div>
        </Link>
      ))}
    </Marquee>
  </section>
);

export default MerchandiseCollections;
