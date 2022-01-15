/// <reference lib="DOM" />

declare namespace JSX {
  // The return type of our JSX Factory: this could be anything
  type Element = HTMLElement;

  // IntrinsicElementMap grabs all the standard HTML tags in the TS DOM lib.
  interface IntrinsicElements extends HtmlElementMap, SvgElementMap {}

  // The following are custom types, not part of TS's known JSX namespace:
  type HtmlElementMap = {
    [K in keyof HTMLElementTagNameMap]: {
      [k: string]: any;
    };
  };

  type SvgElementMap = {
    [K in keyof SVGElementTagNameMap]: {
      [k: string]: any;
    };
  };

  interface Component {
    (properties?: { [key: string]: any }, children?: Node[]): Node;
  }
}
