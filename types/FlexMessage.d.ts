// LINE Flex Message types
// ref: https://developers.line.biz/ja/docs/messaging-api/flex-message-elements/

export interface FlexMessage {
  type: "flex";
  altText: string;
  contents: FlexBubble;
}

export interface FlexBubble {
  type: "bubble";
  size?: "nano" | "micro" | "kilo" | "mega" | "giga";
  header?: FlexBox;
  body?: FlexBox;
  footer?: FlexBox;
  styles?: {
    header?: FlexBlockStyle;
    body?: FlexBlockStyle;
    footer?: FlexBlockStyle;
  };
}

export interface FlexBlockStyle {
  backgroundColor?: string;
  separator?: boolean;
  separatorColor?: string;
}

export interface FlexBox {
  type: "box";
  layout: "horizontal" | "vertical" | "baseline";
  contents: FlexComponent[];
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  paddingAll?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingStart?: string;
  paddingEnd?: string;
  backgroundColor?: string;
  cornerRadius?: string;
  flex?: number;
}

export type FlexComponent = FlexBox | FlexText | FlexImage | FlexSeparator;

export interface FlexText {
  type: "text";
  text: string;
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "3xl" | "4xl" | "5xl";
  weight?: "regular" | "bold";
  color?: string;
  align?: "start" | "center" | "end";
  gravity?: "top" | "center" | "bottom";
  wrap?: boolean;
  flex?: number;
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
}

export interface FlexImage {
  type: "image";
  url: string;
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "3xl" | "4xl" | "5xl" | "full";
  aspectMode?: "cover" | "fit";
  aspectRatio?: string;
  flex?: number;
}

export interface FlexSeparator {
  type: "separator";
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  color?: string;
}
