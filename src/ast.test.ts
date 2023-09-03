import { create, VText, VType } from "./ast.ts";
import { tag } from "./tag.ts";

import { assertEquals, assertThrows } from "std/assert/mod.ts";
import { State } from "./state/mod.ts";

Deno.test(`${create.name}: string and number values`, async (t) => {
  // null and undefined values
  await t.step("should return undefined from undefined", () => {
    assertEquals(
      create(undefined),
      undefined,
    );
  });
  await t.step("should return null from null", () => {
    assertEquals(
      create(null),
      null,
    );
  });

  // string number and State values
  await t.step("should create vText from <number>0", () => {
    assertEquals(
      create(0),
      {
        type: VType.TEXT,
        text: "0",
        eventRefs: [],
      },
    );
  });
  await t.step("should create vText from <number>1", () => {
    const vText = <VText<unknown>> create(1);
    assertEquals(vText, {
      type: VType.TEXT,
      text: "1",
      eventRefs: [],
    });
  });
  await t.step("should create vText from <string>0", () => {
    const vText = <VText<unknown>> create("0");
    assertEquals(vText, {
      type: VType.TEXT,
      text: "0",
      eventRefs: [],
    });
  });
  await t.step("should create vText from <string>1", () => {
    const vText = <VText<unknown>> create("1");
    assertEquals(vText, {
      type: VType.TEXT,
      text: "1",
      eventRefs: [],
    });
  });
  await t.step("should create vText from <State>", () => {
    const state = new State("Hello World!");
    const vText = <VText<unknown>> create(state);
    assertEquals(vText, {
      type: VType.TEXT,
      text: state,
      eventRefs: [],
    });
    assertEquals((<State<string>> vText.text).get, state.get);
  });

  await t.step("should create vElement with string as child", () => {
    assertEquals(
      create(tag("h1", null, ["Hello world!"])),
      {
        tag: "h1",
        type: VType.ELEMENT,
        props: {},
        eventRefs: [],
        children: [
          {
            eventRefs: [],
            text: "Hello world!",
            type: 0,
          },
        ],
      },
    );
  });

  /*
  await t.step("should create vComponent", () => {
    assertEquals(from(tag(App, null, [])), {
      id: Symbol(),
      type: VType.COMPONENT,
      fn: App,
      mode: VMode.Created,
      props: {
        children: [],
      },
      ast: {
        type: VType.ELEMENT,
        tag: "div",
        props: { class: "blue" },
        eventRefs: [],
        children: [{
          eventRefs: [],
          text: "Hello World",
          type: 0,
        }],
      },
    });
  });
  */

  // arbitrary values
  await t.step("should throw an error for value NaN", () => {
    assertThrows(() => create(NaN), undefined);
  });
});

function App() {
  return tag("div", { class: "blue" }, "Hello World");
}

/*
Deno.test("AST: vComponent", async (t) => {
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

  await t.step("should have attribute class before update", () => {
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
  return tag("div", { class: "blue" }, "Hello World");
}

let setter: (value: boolean) => void;
*/
