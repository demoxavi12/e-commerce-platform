// Editorial (non-product) photography, pre-sized to WebP from the project's
// own hero/collection assets. Captions are the original ELEVÉ hero-carousel
// titles and subtitles, reused rather than invented.
import redWall from "./red-wall.webp";
import whiteCircle from "./white-circle.webp";
import roses from "./roses.webp";
import rosesPanel from "./roses-panel.webp";
import portrait from "./portrait.webp";
import monochrome from "./monochrome.webp";
import flatlay from "./flatlay.webp";
import studioDesk from "./studio-desk.webp";
import denim from "./denim.webp";

export const editorial = { redWall, whiteCircle, roses, rosesPanel, portrait, monochrome, flatlay, studioDesk, denim };

// Intrinsic sizes (for width/height attributes → no layout shift).
export const size = {
  redWall: [1100, 1423],
  whiteCircle: [1400, 1327],
  roses: [1800, 1722],
  rosesPanel: [1000, 957],
  portrait: [1100, 881],
  monochrome: [800, 890],
  flatlay: [1000, 1017],
  studioDesk: [897, 897],
  denim: [1000, 1297],
};

export const edits = [
  { key: "whiteCircle", title: "Minimal Luxe", subtitle: "Clean designs. Maximum impact.", to: "/collection?category=Women" },
  { key: "roses", title: "Valentine Vibes", subtitle: "Perfect looks for your special day", to: "/collection?category=Men" },
  { key: "portrait", title: "Street Ready", subtitle: "Urban fits for everyday style", to: "/collection" },
  { key: "monochrome", title: "Masculine Edge", subtitle: "Rugged styles with refined details", to: "/collection?category=Men" },
];
