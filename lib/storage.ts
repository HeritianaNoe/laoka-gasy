/**
 * Portable photo storage: always stores images as data URLs in the DB.
 * No external blob service required (works on Vercel, Netlify, local, any host).
 */

/** Upload a photo. Returns a data: URL to store in foods.photo / categories.photo */
export async function uploadPhoto(
  file: File | ArrayBuffer,
  contentType: string,
): Promise<string> {
  const buffer = file instanceof File ? await file.arrayBuffer() : file;
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  const b64 = btoa(binary);
  return `data:${contentType || "image/jpeg"};base64,${b64}`;
}

/** Alias used by server actions (same as uploadPhoto with File). */
export async function toDataUrl(file: File): Promise<string> {
  return uploadPhoto(file, file.type || "image/jpeg");
}

/** No-op for data URLs / static paths (kept for API compatibility) */
export async function deletePhoto(_photo: string | null | undefined) {
  // Photos are stored as data URLs in the row itself — nothing external to delete.
}

export function isBlobPhoto(photo: string) {
  return false;
}
