declare module "react-icons/si" {
  import type { ComponentType, SVGProps } from "react";

  type IconType = ComponentType<
    SVGProps<SVGSVGElement> & {
      size?: number | string;
      color?: string;
      title?: string;
      className?: string;
    }
  >;

  export const SiLine: IconType;
  export const SiInstagram: IconType;
}
