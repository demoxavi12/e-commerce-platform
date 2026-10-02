import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import TopBrands from "../components/TopBrands";
import OurPolicy from "../components/OurPolicy";
import NewsLetterBox from "../components/NewsLetterBox";
import NInjaMask from "../components/NInjaMask";
import CategoryPanels from "../components/home/CategoryPanels";
import Manifesto from "../components/home/Manifesto";
import Marquee from "../components/motion/Marquee";

// Story order: Hero → ticker → New arrivals (horizontal) → Wardrobes →
// Manifesto → Bestsellers (3D ring) → Limited edition → Brands → Promises → Newsletter
const Ticker = () => (
  <div className="bg-ember py-3 text-ink" aria-hidden="true">
    <Marquee baseVelocity={-3} repeat={4}>
      {["Cash on delivery", "Easy 7-day exchange", "Authentic brands only", "New drop — SS/26", "Small runs, made well"].map((t) => (
        <span key={t} className="flex items-center gap-6 pr-6 label-ui">
          {t} <span className="display text-xl italic">✺</span>
        </span>
      ))}
    </Marquee>
  </div>
);

const Home = () => (
  <>
    <Hero />
    <Ticker />
    <LatestCollection />
    <CategoryPanels />
    <Manifesto />
    <BestSeller />
    <NInjaMask />
    <TopBrands />
    <OurPolicy />
    <NewsLetterBox />
  </>
);

export default Home;
