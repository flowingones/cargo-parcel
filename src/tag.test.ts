import { tag } from "./tag.ts";
import { assertEquals } from "./test_deps.ts";

Deno.test("JSX Element:", async (t) => {
  await t.step('Props: "null"', () => {
    const element: JSX.Element = tag("div", null, []);
    assertEquals(
      element,
      <unknown> {
        tag: "div",
        props: {},
        eventRefs: [],
        children: [],
      },
    );
  });

  await t.step('Props: "{}"', () => {
    const element: JSX.Element = tag("div", {}, []);
    assertEquals(
      element,
      <unknown> {
        tag: "div",
        props: {},
        eventRefs: [],
        children: [],
      },
    );
  });

  await t.step('Props: "{ class: "blue" }"', () => {
    const element: JSX.Element = tag("div", { class: "blue" }, []);
    assertEquals(
      element,
      <unknown> {
        tag: "div",
        props: {
          class: "blue",
        },
        eventRefs: [],
        children: [],
      },
    );
  });

  await t.step('Children: "undefined"', () => {
    const element: JSX.Element = tag("div", null, undefined);
    assertEquals(
      element,
      <unknown> {
        tag: "div",
        props: {},
        eventRefs: [],
        children: [],
      },
    );
  });

  await t.step('Children: "[]"', () => {
    const element: JSX.Element = tag("div", null, []);
    assertEquals(
      element,
      <unknown> {
        tag: "div",
        props: {},
        eventRefs: [],
        children: [],
      },
    );
  });

  await t.step('Children: "["Hello"]"', () => {
    const element: JSX.Element = tag("div", null, ["Hello"]);
    assertEquals(
      element,
      <unknown> {
        tag: "div",
        props: {},
        eventRefs: [],
        children: ["Hello"],
      },
    );
  });

  await t.step('Children: "[tag("div,...,..."),"Hello"]"', () => {
    const element: JSX.Element = tag("div", null, [
      tag(
        "div",
        null,
        ["Hello"],
      ),
      "Hello",
    ]);
    assertEquals(
      element,
      <unknown> {
        tag: "div",
        props: {},
        eventRefs: [],
        children: [{
          tag: "div",
          props: {},
          eventRefs: [],
          children: ["Hello"],
        }, "Hello"],
      },
    );
  });

  await t.step('Events: "on-click","on-scroll"', () => {
    const listener = () => {};
    const element: JSX.Element = tag("div", {
      "on-click": listener,
      "on-scroll": listener,
    }, []);
    assertEquals(element, {
      tag: "div",
      props: {},
      eventRefs: [
        {
          name: "click",
          listener,
        },
        {
          name: "scroll",
          listener,
        },
      ],
      children: [],
    });
  });
});

Deno.test("JSX: Component", async (t) => {
  function App() {
    return tag("div", null, []);
  }

  await t.step('Props: "null"', () => {
    const component: JSX.Element = tag(App, null, []);
    assertEquals(
      component,
      <unknown> {
        tag: App,
        props: {},
        eventRefs: [],
        children: [],
      },
    );
  });

  await t.step('Props: "{}"', () => {
    const component: JSX.Element = tag(App, {}, []);
    assertEquals(
      component,
      <unknown> {
        tag: App,
        props: {},
        eventRefs: [],
        children: [],
      },
    );
  });

  await t.step('Props: "{class: "blue"}"', () => {
    const component: JSX.Element = tag(App, { class: "blue" }, []);
    assertEquals(
      component,
      <unknown> {
        tag: App,
        props: {
          class: "blue",
        },
        eventRefs: [],
        children: [],
      },
    );
  });

  await t.step('Children: "undefined"', () => {
    const component: JSX.Element = tag(App, null, []);
    assertEquals(
      component,
      <unknown> {
        tag: App,
        props: {},
        eventRefs: [],
        children: [],
      },
    );
  });

  await t.step('Children: "[]"', () => {
    const component: JSX.Element = tag(App, null, []);
    assertEquals(
      component,
      <unknown> {
        tag: App,
        props: {},
        eventRefs: [],
        children: [],
      },
    );
  });

  await t.step('Children: "["Hello"]"', () => {
    const component: JSX.Element = tag(App, null, ["Hello"]);
    assertEquals(
      component,
      <unknown> {
        tag: App,
        props: {},
        eventRefs: [],
        children: ["Hello"],
      },
    );
  });

  await t.step('Children: "["Hello"," World"]"', () => {
    const component: JSX.Element = tag(App, null, ["Hello", " World"]);
    assertEquals(
      component,
      <unknown> {
        tag: App,
        props: {},
        eventRefs: [],
        children: ["Hello World"],
      },
    );
  });

  await t.step('Children: "[tag("div,...,..."),"Hello"]"', () => {
    const component: JSX.Element = tag(App, null, [
      tag("div", null, ["Hello"]),
      "Hello",
    ]);
    assertEquals(
      component,
      <unknown> {
        tag: App,
        props: {},
        eventRefs: [],
        children: [tag("div", null, ["Hello"]), "Hello"],
      },
    );
  });

  await t.step('Events: "on-click","on-scroll"', () => {
    const listener = () => {};
    const component: JSX.Element = tag(App, {
      "on-click": listener,
      "on-scroll": listener,
    }, []);
    assertEquals(
      component,
      <unknown> {
        tag: App,
        props: {},
        eventRefs: [{ name: "click", listener }, { name: "scroll", listener }],
        children: [],
      },
    );
  });
});
