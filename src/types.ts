declare global {
  export namespace JSX {
    type Node = string | Element | undefined | null;

    type Element = {
      tag: string | ((props: ElementProps) => Element);
      eventRefs: EventRef[];
      props: ElementProps;
      children?: Node[];
    };

    type EventRef = {
      name: string;
      listener: () => void;
    };

    type ElementProps = {
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
