declare namespace JSX {
  type Node = string | Element | undefined | null;

  type Element = {
    tag: string;
    [type: string]: unknown;
    children: Node[];
  };

  type IntrinsicElements = {
    [key: string]: unknown;
  };

  /*
  type HtmlElementMap = {
    [K in keyof HTMLElementTagNameMap]: {
      [k: string]: unknown;
    };
  };

  type SvgElementMap = {
    [K in keyof SVGElementTagNameMap]: {
      [k: string]: unknown;
    };
  };
  */

  type ComponentProps = {
    children?: Node[];
    [type: string]: unknown;
  };

  type Component = {
    (props: ComponentProps): Element;
  };

  interface EventProps {
    "on:click": () => void;
  }
}
