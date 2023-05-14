import { RequestContext } from "cargo/http/request.ts";

type Context = RequestContext & {
  [key: string]: unknown;
};

let _context: Context | undefined;

export function setContext(ctx: RequestContext | undefined) {
  _context = ctx ? { ...ctx } : undefined;
}

export function context(): Context {
  if (_context) return _context;
  throw Error("Request Context not set!");
}
