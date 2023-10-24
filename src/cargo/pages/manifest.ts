import { dirname, join } from "std/path/mod.ts";
import { EOL, walk } from "std/fs/mod.ts";

interface FileImport {
  id: string;
  path: string;
  fileName: string;
}

interface Page {
  page: FileImport;
  layouts: string[];
  middleware: string[];
}

interface Manifest {
  pages: Page[];
  layouts: FileImport[];
  middleware: FileImport[];
}

type PagesManifestOptions = {
  path: string;
};

export async function pagesManifest(
  options: PagesManifestOptions,
): Promise<void> {
  const basePath = options.path;
  const data = await scan(basePath);

  const pages = data.pages.map((page) => {
    const layouts = data.layouts.filter((layout) => {
      return page.path.startsWith(layout.path);
    }).map((layout) => {
      return layout.id;
    });

    const middleware = data.middleware.filter((middleware) => {
      return page.path.startsWith(middleware.path);
    }).map((middleware) => {
      return middleware.id;
    });

    return {
      page,
      layouts,
      middleware,
    };
  });

  const manifest = {
    pages,
    layouts: data.layouts,
    middleware: data.middleware,
  };

  await write(basePath, manifest);
}

/**
 * Scan a folder for page, middleware and layout files
 */
async function scan(
  basePath: string,
): Promise<
  { pages: FileImport[]; layouts: FileImport[]; middleware: FileImport[] }
> {
  const pages: FileImport[] = [];
  const layouts: FileImport[] = [];
  const middleware: FileImport[] = [];

  let layoutIndex = 0;
  let pageIndex = 0;
  let middlewareIndex = 0;

  for await (
    const entry of walk(basePath, {
      match: [/(page\.tsx)$/, /(layout\.tsx)$/, /(middleware\.ts)$/],
    })
  ) {
    if (/\/(layout\.tsx)$/.exec(entry.path)?.length) {
      layouts.push({
        id: `L${layoutIndex}`,
        path: dirname(entry.path),
        fileName: entry.name,
      });
      layoutIndex++;
    }
    if (/\/(page\.tsx)$/.exec(entry.path)?.length) {
      pages.push({
        id: `P${pageIndex}`,
        path: dirname(entry.path),
        fileName: entry.name,
      });
      pageIndex++;
    }
    if (/\/(middleware\.ts)$/.exec(entry.path)?.length) {
      middleware.push({
        id: `M${middlewareIndex}`,
        path: dirname(entry.path),
        fileName: entry.name,
      });
      middlewareIndex++;
    }
  }

  return {
    pages: sortImports(pages, basePath),
    layouts: sortImports(layouts),
    middleware: sortImports(middleware),
  };
}

async function write(basePath: string, manifest: Manifest) {
  const content =
    `// This file is automatically generated by Cargo Parcel. Do not edit it manually.

${imports(manifest.pages.map((page) => page.page), "Page")}

${imports(manifest.layouts, "Layout")}

${imports(manifest.middleware, "Middleware")}

export default {
  ${exports(basePath, manifest.pages)}
};
`;
  try {
    const existingManifest = await Deno.readTextFile(
      join(".manifest", ".pages.ts"),
    );
    if (existingManifest !== content) {
      return await Deno.writeTextFile(
        join(".manifest", ".pages.ts"),
        content,
      );
    }
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      return await Deno.writeTextFile(
        join(".manifest", ".pages.ts"),
        content,
      );
    }
    throw e;
  }
}

function imports(pages: FileImport[], type: string): string {
  return pages.map((route) => {
    return `// ${type} imports
    import * as ${route.id} from "../${route.path}/${route.fileName}";`;
  }).join(EOL.LF);
}

function exports(path: string, pages: Page[]): string {
  return pages.map((page) => {
    return `"${page.page.path.replace(path, "") || "/"}": {
    page: ${page.page.id},
    layouts: [${page.layouts.join()}],
    middleware: [${page.middleware.join()}]
  },`;
  }).join(`${EOL.LF}  `);
}

function sortImports(imports: FileImport[], basePath?: string): FileImport[] {
  return imports.sort((a, b) => {
    const al = a.path.toLowerCase();
    const bl = b.path.toLowerCase();

    if (typeof basePath !== "undefined" && al === basePath) {
      return -1;
    }

    if (al > bl) {
      return -1;
    } else if (al == bl) {
      return 0;
    }
    return 1;
  });
}
