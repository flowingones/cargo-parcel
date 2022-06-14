import { page } from "../mod.ts";

export function autoloadPages(
  routes: Record<string, unknown>,
  Root: any,
) {
  return (app: any) => {
    for (const route in routes) {
      /* @ts-ignore */
      const component: any = routes[route];

      app.getProtocol("http")?.router.add({
        path: route,
        method: "GET",
        handler: () => {
          return page({
            title: component.title || "",
            component: component.default,
            twind: true,
          }, Root);
        },
      });
    }
  };
}
