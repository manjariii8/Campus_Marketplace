
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

const API_BASE_URL = (
  configuredApiUrl || "http://localhost:8080/api"
).replace(/\/+$/, "");

const BACKEND_URL = API_BASE_URL.replace(/\/api$/i, "");

export const getImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    return null;
  }

  const value = imageUrl.trim();

  if (!value) {
    return null;
  }

  // Cloudinary, other absolute URLs, and Base64 images.
  if (/^(https?:\/\/|data:|blob:)/i.test(value)) {
    return value;
  }

  // Backend returns paths such as /uploads/product.jpg.
  const path = value.startsWith("/")
    ? value
    : `/${value}`;

  return `${BACKEND_URL}${path}`;
};
