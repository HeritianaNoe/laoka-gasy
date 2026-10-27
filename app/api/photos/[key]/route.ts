import { getStore } from "@netlify/blobs";

// Serves dish photos uploaded from the "Hampiditra" screen
export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const result = await getStore("laoka-photos").getWithMetadata(key, { type: "arrayBuffer" });
  if (!result) return new Response("Not found", { status: 404 });

  return new Response(result.data, {
    headers: {
      "Content-Type": String(result.metadata.contentType ?? "image/jpeg"),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
