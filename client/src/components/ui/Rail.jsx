// Horizontal swipe rail: native scroll + snap, aligned to the page gutter.
// Used for product rows on touch / reduced-motion and for secondary carousels.
const Rail = ({ ref, children, className = "", label }) => (
  <div
    ref={ref}
    role={label ? "region" : undefined}
    aria-label={label}
    className={`scrollbar-hide gutter flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scroll-padding-inline:var(--gutter)] sm:gap-6 ${className}`}
  >
    {children}
  </div>
);

export default Rail;
