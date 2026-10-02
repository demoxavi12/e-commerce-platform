import { motion } from "framer-motion";
import { useUI } from "../context/ui-context";

// Renders in-flight product thumbnails travelling on an arc to the bag icon.
const FlyToCartLayer = () => {
  const { flights, landFlight } = useUI();
  return (
    <div className="pointer-events-none fixed inset-0 z-[90]" aria-hidden="true">
      {flights.map((f) => {
        const size = Math.min(f.from.width, 220);
        const startX = f.from.left + f.from.width / 2 - size / 2;
        const startY = f.from.top + f.from.height / 2 - size / 2;
        const endX = f.to.left + f.to.width / 2 - size / 2;
        const endY = f.to.top + f.to.height / 2 - size / 2;
        const midX = (startX + endX) / 2;
        const midY = Math.min(startY, endY) - 120;
        return (
          <motion.img
            key={f.id}
            src={f.src}
            alt=""
            className="absolute left-0 top-0 object-cover shadow-[var(--shadow-float)]"
            style={{ width: size, height: size * 1.25 }}
            initial={{ x: startX, y: startY, scale: 1, opacity: 1, borderRadius: 2 }}
            animate={{
              x: [startX, midX, endX],
              y: [startY, midY, endY],
              scale: [1, 0.55, 0.08],
              rotate: [0, -8, 12],
              borderRadius: [2, 40, 200],
              opacity: [1, 1, 0.6],
            }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1], times: [0, 0.45, 1] }}
            onAnimationComplete={() => landFlight(f.id, f.openDrawer)}
          />
        );
      })}
    </div>
  );
};

export default FlyToCartLayer;
