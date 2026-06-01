declare module "react-icons/fa" {
  import type { ComponentType, SVGProps } from "react";

  export type IconType = ComponentType<
    SVGProps<SVGSVGElement> & {
      size?: number | string;
      color?: string;
      title?: string;
      className?: string;
    }
  >;

  export const FaYoutube: IconType;
  export const FaBlog: IconType;
}