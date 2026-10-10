import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { editorial } from "../assets/editorial";
import NewsLetterBox from "../components/NewsLetterBox";
import SplitText from "../components/motion/SplitText";
import Reveal from "../components/motion/Reveal";
import Field from "../components/ui/Field";
import Button from "../components/ui/Button";
import { ease } from "../lib/motion";

const Contact = () => {
  // There is no contact API, so the form does not send anything; the
  // confirmation is explicit about that and points to the support address.
  const [sent, setSent] = useState(false);

  return (
    <div className="page-top">
      <header className="gutter pb-16 pt-8 sm:pt-14">
        <p className="eyebrow text-mute">( Contact ) — We reply within a day</p>
        <h1 className="display mt-5 text-[clamp(56px,10vw,168px)]">
          <SplitText text="Say *hello.*" trigger="mount" accentClassName="italic text-ember" />
        </h1>
      </header>

      <section className="gutter grid gap-14 pb-24 md:grid-cols-2 md:gap-20">
        <div>
          <Reveal variant="clip" className="aspect-[4/3] overflow-hidden bg-stone-2">
            <img src={editorial.studioDesk} alt="A desk with a laptop, coffee and a phone" loading="lazy" className="h-full w-full object-cover" />
          </Reveal>
          <dl className="mt-10 grid gap-8 sm:grid-cols-2">
            {[
              ["Our store", <>54709 Willms Station<br />Suite 350, Washington, USA</>],
              ["Talk to us", <>Tel: (415) 555-0132<br />admin@eleve.com</>],
              ["Customer support", <>support@eleve.com<br />+91 98765 43210</>],
              ["Business hours", <>Mon – Sat<br />10:00 AM – 7:00 PM</>],
            ].map(([t, v], i) => (
              <Reveal key={t} delay={i * 0.08}>
                <dt className="eyebrow text-mute">{t}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed">{v}</dd>
              </Reveal>
            ))}
          </dl>
        </div>

        <Reveal className="md:pt-4">
          <h2 className="display text-4xl sm:text-5xl">Send us a message</h2>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="ok" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: ease.out }} className="mt-10 border-y border-ink/10 py-12" role="status">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ember"><Check size={20} /></span>
                <p className="display mt-6 text-4xl">Thanks for writing.</p>
                <p className="mt-2 text-mute">This demo form isn’t connected to email yet — please reach us at support@eleve.com.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0, y: -12 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="mt-8 space-y-5"
              >
                <Field label="Your name" required autoComplete="name" />
                <Field label="Email address" type="email" required autoComplete="email" />
                <Field label="Your message" as="textarea" rows={5} required />
                <div className="pt-4">
                  <Button type="submit" size="lg">Send message</Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-16 border-t border-ink/10 pt-8">
            <p className="eyebrow text-mute">Careers at ELEVÉ</p>
            <p className="mt-3 max-w-sm text-[15px] text-mute">Learn more about our teams and current job openings.</p>
            <div className="mt-5">
              <Button variant="outline" size="sm">Explore careers</Button>
            </div>
          </div>
        </Reveal>
      </section>

      <NewsLetterBox />
    </div>
  );
};

export default Contact;
