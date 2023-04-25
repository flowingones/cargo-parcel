let _request: Request | undefined;

function url(): URL {
  assertRequestScope();
  return new URL(_request?.url || window.location.href);
}

function navigate(url: string) {
  assertRequestScope();
  if (_request) {
    throw Error("Not allowed to navigate on the server side");
  }

  return window.location.assign(url);
}

function assertRequestScope() {
  if (!_request && !window.location) {
    throw Error("Scope for the route could not be found");
  }
}

export const Route = {
  url,
  navigate,
};

export function setRequest(request: Request | undefined): void {
  _request = request;
}
