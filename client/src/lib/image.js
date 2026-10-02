// Cloudinary delivery optimisation (frontend-only).
// Admin uploads are stored as res.cloudinary.com/.../image/upload/... URLs;
// inserting f_auto,q_auto,w_<n> serves AVIF/WebP at a sensible size.
// Any other URL (local assets, mock data) is returned untouched.
const UPLOAD = "/image/upload/";

export const img = (url, width = 800) => {
  if (typeof url !== "string" || !url.includes("res.cloudinary.com") || !url.includes(UPLOAD)) return url;
  const [head, tail] = url.split(UPLOAD);
  if (/^(f_|q_|w_|c_)/.test(tail)) return url; // already transformed
  return `${head}${UPLOAD}f_auto,q_auto,w_${width},c_limit/${tail}`;
};
