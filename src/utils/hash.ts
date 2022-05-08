export async function sha1Hash(msg: string) {
  const hashBuffer = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(msg),
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
  return hashHex;
}

export async function byteHash(msg: string) {
  return (await sha1Hash(msg)).slice(-8);
}
