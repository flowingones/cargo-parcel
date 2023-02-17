declare global {
  export namespace JSX {
    type Node = string | Element | undefined | null;

    type Element = {
      tag: string | 0 | Component;
      eventRefs: EventRef[];
      props: IntrinsicElements;
      children: Node[];
    };

    type Component = (props: ComponentProps) => JSX.Element | null;

    type EventRef = {
      name: string;
      listener: () => void;
    };

    type ComponentProps = {
      children?: Node[];
      [type: string]: unknown;
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
  }
}

export {};
