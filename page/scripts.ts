export interface Script {
  name: string;
  tags: string[];
}

const scripts: Script[] = [];

function get(name: string): Script | undefined {
  return scripts.find((script) => {
    return script.name === name;
  });
}

function append(name: string, tags: string[]): void {
  const to = scripts.find((script) => {
    return script.name === name;
  });
  to?.tags.push(...tags);
}

function set(script: Script) {
  scripts.push(script);
}

export const Scripts = {
  get,
  set,
  append,
};
