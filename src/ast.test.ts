import { AST, tag, VComponent, VElement, VMode, VText, VType } from "./mod.ts";
import { state } from "./state/mod.ts";
import { assert, assertEquals } from "./test_deps.ts";

Deno.test("should create a vText", async (t) => {
  const vText = AST.create("hello world");

  await t.step('should have type equals "vText"', () => {
    assertEquals(vText?.type, VType.TEXT);
  });
  await t.step('should have text props equals "hello world"', () => {
    assertEquals((<VText<unknown>> vText).text, "hello world");
  });
  await t.step('should have empty prop "eventRefs"', () => {
    assertEquals((<VText<unknown>> vText).eventsRefs, []);
  });
});

Deno.test('should create a "vElement"', async (t) => {
  const vElement = AST.create(
    tag("div", { class: "button" }, ["hello"]),
  );
  await t.step('should have type "vElement"', () => {
    assertEquals(vElement?.type, VType.ELEMENT);
  });
});

Deno.test('should create "vComponent"', async (t) => {
  const vNode = <VComponent<unknown>> AST.create(tag(App, null, []));

  await t.step('should have type "vComponent"', () => {
    assert(vNode.type === VType.COMPONENT);
  });
  await t.step('should have an "id"', () => {
    assert(Boolean(vNode.id));
  });
  await t.step("should be in mode: 'Created'", () => {
    assert(vNode.mode === VMode.Created);
  });
  await t.step("should have a 'fn' prop", () => {
    assert(typeof vNode.fn === "function");
  });
  await t.step("should have 'children' prop", () => {
    assert(Array.isArray(vNode.props.children));
  });
  await t.step("should have 'ast' prop", () => {
    assert(vNode.ast);
  });
});

Deno.test("should update vComponent", async (t) => {
  const vNode = <VComponent<unknown>> AST.create(tag(App, null, []));

  await t.step('Attribute: "class" before AST update', () => {
    // @ts-ignore
    assert((<VComponent<unknown>> vNode).ast?.props?.class === "blue");
  });

  await t.step("should have attribute class after update", () => {
    setter(false);
    const updatedVNode = <VComponent<unknown>> AST.update(vNode);
    assert((<VElement<unknown>> updatedVNode.ast).props?.class === "red");
  });
});

function App() {
  const [visible, setVisibilty] = state(true);
  setter = setVisibilty;
  return tag("div", { class: visible ? "blue" : "red" }, "Hello World");
}

let setter: (value: boolean) => void;
