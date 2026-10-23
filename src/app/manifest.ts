import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Teduh",
    short_name: "Teduh",
    description:
      "Sistem informasi manajemen data penghuni Panti Jompo Kemah Beth Shalom.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2F6BF5",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
