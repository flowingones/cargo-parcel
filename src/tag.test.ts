import { tag } from "./tag.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test(tag.name, async (t) => {
  // html
  await t.step(
    'should create JSX.Element from html element with "null" as attributes',
    () => {
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
    },
  );

  await t.step(
    'should create JSX.Element from html element with "{}" as attributes',
    () => {
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
    },
  );

  await t.step(
    'should create JSX.Element from html element with "{ class: "blue" }" as attributes',
    () => {
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
    },
  );

  await t.step(
    'should create JSX.Element from html element with "undefined" as children',
    () => {
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
    },
  );

  await t.step(
    'should create JSX.Element from html element with "[]" as children',
    () => {
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
    },
  );

  await t.step(
    'should create JSX.Element from html element with "["Hello"]" as children',
    () => {
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
    },
  );

  await t.step(
    'should create JSX.Element from html element with "html element" as children',
    () => {
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
    },
  );

  await t.step(
    "should create JSX.Element from html element with events as attributes",
    () => {
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
    },
  );

  function App() {
    return tag("div", null, []);
  }

  await t.step(
    'should create JSX.Element from function element with "null" as attributes',
    () => {
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
    },
  );

  await t.step(
    'should create JSX.Element from function element with "{}" as attributes',
    () => {
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
    },
  );

  await t.step(
    'should create JSX.Element from function element with "{ class: "blue" }" as attributes',
    () => {
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
    },
  );

  await t.step(
    'should create JSX.Element from function element with "undefined" as children',
    () => {
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
    },
  );

  await t.step(
    'should create JSX.Element from function element with "[]" as children',
    () => {
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
    },
  );

  await t.step(
    'should create JSX.Element from function element with "["Hello"]" as children',
    () => {
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
    },
  );

  await t.step(
    'should create JSX.Element from function element with "["Hello", " World"]" as children',
    () => {
      const component: JSX.Element = tag(App, null, ["Hello", " World"]);
      assertEquals(
        component,
        <unknown> {
          tag: App,
          props: {},
          eventRefs: [],
          children: ["Hello", " World"],
        },
      );
    },
  );

  await t.step(
    "should create JSX.Element from function element with html element and string as children",
    () => {
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
    },
  );

  await t.step(
    "should create JSX.Element from function element with events as attributes",
    () => {
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
          eventRefs: [{ name: "click", listener }, {
            name: "scroll",
            listener,
          }],
          children: [],
        },
      );
    },
  );

  await t.step(
    'should create JSX.Element from function element with string and "undefined" as children',
    () => {
      assertEquals(
        tag("div", null, ["hello", undefined, <any> false, null, " world"])
          .children,
        ["hello", " world"],
      );
    },
  );
});
