import { getStore } from "@netlify/blobs";

export default async (req) => {

  const url = new URL(req.url);
  const product = url.searchParams.get("product");

  // فقط محصولات مجاز
  const products = {
    fashion: "fashion/4k-pack.zip",
    cybernetic: "cybernetic/4k-pack.zip",
    mythic: "mythic/4k-pack.zip",
    toonverse: "toonverse/4k-pack.zip",
    neo: "neo/4k-pack.zip",
    dark: "dark/4k-pack.zip",
    space: "space/4k-pack.zip"
  };

  const fileKey = products[product];

  if (!fileKey) {
    return new Response("Invalid product", {
      status: 400
    });
  }

  const store = getStore("drxtuning-downloads");

  const file = await store.get(fileKey, {
    type: "blob"
  });

  if (!file) {
    return new Response("File not found", {
      status: 404
    });
  }

  return new Response(file, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${product}-4k-pack.zip"`,
      "Cache-Control": "private, no-store"
    }
  });
};
