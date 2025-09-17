import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Apostio",
    short_name: "Apostio",
    description: "A modern social platform ",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#ffffff",
    icons: [
      {
        src: "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1701708322/jual47jntd2lpkgx8mfx.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1701708322/jual47jntd2lpkgx8mfx.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
