export const BUILD_ID = Deno.env.get("DENO_DEPLOY_ID") ??
  crypto.randomUUID().replaceAll("-", "");
