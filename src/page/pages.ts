interface Page {
  path: string;
}

const pages: Page[] = [];

function add(page: Page) {
  pages.push(page);
}

function stringify(): string {
  return JSON.stringify(
    pages,
  );
}

export const Pages = {
  add,
  stringify,
};
