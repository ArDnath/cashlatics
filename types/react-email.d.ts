declare module "@react-email/components" {
  import { FC, ReactNode, CSSProperties } from "react";

  interface BaseProps {
    children?: ReactNode;
    style?: CSSProperties;
  }

  export const Html: FC<BaseProps>;
  export const Head: FC<BaseProps>;
  export const Preview: FC<BaseProps>;
  export const Body: FC<BaseProps>;
  export const Container: FC<BaseProps>;
  export const Section: FC<BaseProps>;
  export const Heading: FC<BaseProps & { as?: string }>;
  export const Text: FC<BaseProps>;
  export const Link: FC<BaseProps & { href?: string }>;
  export const Img: FC<BaseProps & { src?: string; alt?: string; width?: number; height?: number }>;
  export const Button: FC<BaseProps & { href?: string }>;
  export const Hr: FC<BaseProps>;
  export const Column: FC<BaseProps>;
  export const Row: FC<BaseProps>;
}
