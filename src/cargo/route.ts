import { context } from "./context.ts";

function url(): URL {
  assertRequestScope();
  return new URL(context()?.request?.url || window.location.href);
}

function navigate(url: string) {
  assertRequestScope();
  if (context()?.request) {
    throw Error("Not allowed to navigate on the server side");
  }

  return window.location.assign(url);
}

function assertRequestScope() {
  if (!context()?.request && !window.location) {
    throw Error("Scope for the route could not be found");
  }
}

export const Route = {
  url,
  navigate,
};
