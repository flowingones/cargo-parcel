declare global {
  export namespace JSX {
    type Node = string | number | StateLike | Element | undefined | null;

    type Element = {
      tag: string | Component;
      eventRefs: EventRef[];
      props: ElementProps;
      children: Node[];
    };

    type Component = (props: ElementProps) => Element;

    type StateLike = {
      get: string | number;
      subscribe: (scope: { update: (value: string | number) => void }) => void;
    };

    type EventRef = {
      name: string;
      listener: () => void;
    };

    type ElementProps = {
      children?: Node[];
      unsafeInnerHTML?: string;
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
