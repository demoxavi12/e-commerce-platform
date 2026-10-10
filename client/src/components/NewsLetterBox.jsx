import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import SplitText from "./motion/SplitText";
import { ease } from "../lib/motion";

// Newsletter. There is no subscribe API, so nothing is sent: the confirmation
// says so plainly instead of claiming an email is on its way.
export const NewsletterForm = ({ dark = false, id = "nl-email" }) => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.p
            key="ok"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: ease.out }}
            className={`flex items-center gap-3 border-b pb-4 text-lg ${dark ? "border-bone/40" : "border-ink"}`}
            role="status"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ember text-ink"><Check size={16} /></span>
            Thanks! Sign-ups aren’t connected yet in this demo.
          </motion.p>
        ) : (
          <motion.div
            key="form"
            exit={{ opacity: 0, y: -12 }}
            className={`group relative flex items-center border-b transition-colors ${dark ? "border-bone/30 focus-within:border-bone" : "border-ink/30 focus-within:border-ink"}`}
          >
            <label htmlFor={id} className="sr-only">Email address</label>
            <input
              id={id}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={`w-full bg-transparent py-4 text-lg outline-none ${dark ? "text-bone placeholder:text-bone/35" : "placeholder:text-ink/30"}`}
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all duration-500 hover:bg-ember hover:text-ink group-focus-within:rotate-[-45deg] ${dark ? "bg-bone text-ink" : "bg-ink text-bone"}`}
            >
              <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

const NewsLetterBox = () => (
  <section className="gutter py-24 sm:py-32" aria-labelledby="newsletter-title">
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
      <div>
        <p className="eyebrow text-mute">The inner circle</p>
        <h2 id="newsletter-title" className="display mt-5 text-[clamp(44px,6vw,100px)]">
          <SplitText text="Get *20% off* your first order" accentClassName="italic text-ember" />
        </h2>
      </div>
      <div>
        <p className="max-w-sm text-[15px] leading-relaxed text-mute">
          Early access to drops, restocks before they go public, and nothing you’ll want to unsubscribe from.
        </p>
        <div className="mt-8">
          <NewsletterForm />
        </div>
      </div>
    </div>
  </section>
);

export default NewsLetterBox;
