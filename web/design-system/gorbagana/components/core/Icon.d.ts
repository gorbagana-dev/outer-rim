export interface IconProps {
  /** Lucide icon name, kebab or Pascal case (e.g. "arrow-right", "Trash2"). */
  name: string;
  /** Pixel size. Default 20. */
  size?: number;
  color?: string;
  strokeWidth?: number;
  /** Adds a currentColor neon drop-shadow. */
  glow?: boolean;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
