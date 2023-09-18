declare global {
  export namespace JSX {
    type TextNode = string | number | StateLike;
    type EmptyNode = undefined | null | boolean;

    type Node =
      | TextNode
      | EmptyNode
      | Element;

    type Element = {
      tag: string | Component;
      eventRefs: EventRef[];
      props: ElementProps;
      children: Node[];
    };

    type Component = (props: ElementProps) => Node;

    type StateLike = {
      get: string | number;
      subscribe: (
        subscriber: { update: (value: string) => void },
      ) => () => void;
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
