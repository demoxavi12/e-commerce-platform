import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube, ArrowUp } from "lucide-react";
import ShaderCanvas from "./motion/ShaderCanvas";
import { scrollToTop } from "../lib/lenis";
import { ease } from "../lib/motion";

const cols = [
  {
    title: "Shop",
    links: [
      { label: "Men", to: "/collection?category=Men" },
      { label: "Women", to: "/collection?category=Women" },
      { label: "Kids", to: "/collection?category=Kids" },
      { label: "New arrivals", to: "/collection" },
    ],
  },
  {
    title: "Customer care",
    links: [
      { label: "Contact us", to: "/contact" },
      { label: "Orders", to: "/orders" },
      { label: "Shipping & delivery", to: "/contact" },
      { label: "Returns & exchanges", to: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Terms & conditions" },
      { label: "Privacy policy" },
      { label: "Refund policy" },
    ],
  },
];

const socials = [
  { icon: Facebook, href: "https://www.facebook.com/omm.prasaad", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/0mprasadmaharana/?hl=en", label: "Instagram" },
  { icon: Twitter, href: "https://x.com/home", label: "X (Twitter)" },
  { icon: Youtube, href: "https://www.youtube.com/@Turning_wheel6608", label: "YouTube" },
];

const Footer = () => {
  // Home ends on a full-bleed image that should meet the footer directly.
  const { pathname } = useLocation();
  return (
  <footer className={`relative overflow-hidden bg-ink text-bone ${pathname === "/" ? "" : "mt-24"}`}>
    <ShaderCanvas palette="dusk" grain={0.05} className="opacity-70" />
    <div className="relative">
      <div className="gutter grid gap-12 pb-16 pt-20 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <p className="display text-4xl leading-tight sm:text-5xl">
            Considered clothing,
            <br />
            <span className="italic text-ember">above ordinary.</span>
          </p>
          <button
            type="button"
            onClick={() => scrollToTop(false)}
            className="group mt-8 inline-flex items-center gap-3 label-ui text-bone/70 hover:text-bone"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-bone/30 transition-all duration-500 group-hover:-translate-y-1 group-hover:border-ember group-hover:bg-ember group-hover:text-ink">
              <ArrowUp size={16} />
            </span>
            Back to top
          </button>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h4 className="eyebrow mb-5 text-bone/45">{c.title}</h4>
            <ul className="space-y-2.5 text-[15px]">
              {c.links.map((l) => (
                <li key={l.label}>
                  {l.to ? (
                    <Link to={l.to} className="link-line text-bone/85 hover:text-bone">{l.label}</Link>
                  ) : (
                    <span className="text-bone/45">{l.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Giant wordmark — letters rise in as the footer enters */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        className="gutter flex select-none justify-between overflow-hidden pt-[5vw]"
        aria-hidden="true"
      >
        {"ELEVÉ".split("").map((ch, i) => (
          <motion.span
            key={i}
            variants={{ hidden: { y: "100%" }, visible: { y: "0%", transition: { duration: 1.2, ease: ease.out } } }}
            className="display block text-[25vw] leading-[0.8] text-bone"
          >
            {ch}
          </motion.span>
        ))}
      </motion.div>

      <div className="gutter flex flex-col items-center justify-between gap-6 border-t border-bone/10 py-6 md:flex-row">
        <p className="eyebrow text-bone/45">© {new Date().getFullYear()} E L E V É. All rights reserved.</p>
        <div className="flex items-center gap-1">
          {socials.map(({ icon: Icon, href, label }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="flex h-11 w-11 items-center justify-center text-bone/60 transition-all duration-300 hover:-translate-y-0.5 hover:text-ember">
              <Icon size={18} strokeWidth={1.5} />
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
