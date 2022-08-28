import { AST, tag, VComponent, VComponentMode, VElement } from "./mod.ts";
import { state } from "./state/mod.ts";
import { assert } from "./test_deps.ts";

let setter: (value: boolean) => void;

function App() {
  const [visible, setVisibilty] = state(true);
  setter = setVisibilty;
  return tag("div", { class: visible ? "blue" : "red" }, "Hello World");
}

Deno.test("AST:", async (t) => {
  const vNode = <VComponent<unknown>> AST.create(tag(App, null, []));

  await t.step("VComponent: Type", () => {
    assert(vNode.type === "component");
  });
  await t.step("VComponent: Id", () => {
    assert(Boolean(vNode.id));
  });
  await t.step("VComponent: Mode", () => {
    assert(vNode.mode === VComponentMode.Created);
  });
  await t.step("VComponent: fn", () => {
    assert(typeof vNode.fn === "function");
  });
  await t.step("VComponent: children in props", () => {
    assert(Array.isArray(vNode.props.children));
  });
  await t.step("VComponent: ast", () => {
    assert(vNode.ast);
  });
});

Deno.test("AST: Create and update", async (t) => {
  const vNode = <VComponent<unknown>> AST.create(tag(App, null, []));

  await t.step('Attribute: "class" before AST update', () => {
    // @ts-ignore
    assert((<VComponent<unknown>> vNode).ast?.props?.class === "blue");
  });

  await t.step('Attribute: "class" after AST update', () => {
    setter(false);
    const updatedVNode = <VComponent<unknown>> AST.update(vNode);
    assert((<VElement<unknown>> updatedVNode.ast).props?.class === "red");
  });
});
