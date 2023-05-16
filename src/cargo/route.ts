import { getRequest } from "./context.ts";

function url(): URL {
  return getRequest();
}

function navigate(url: string) {
  if (!window.location) {
    throw Error("Not allowed to navigate on the server side");
  }
  return window.location.assign(url);
}

export const Route = {
  url,
  navigate,
};
