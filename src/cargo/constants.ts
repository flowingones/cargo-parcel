export const BUILD_ID = Deno.env.get("DENO_DEPLOY_ID") ??
  crypto.randomUUID().replaceAll("-", "");

export const isProd = Deno.env.get("CARGO_ENV") === "PROD";
