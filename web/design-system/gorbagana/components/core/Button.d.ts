/** Acid, pink, cyan, sticker and danger buttons. */
export interface ButtonProps {
  /** primary = acid fill (default CTA). secondary = pink outline. outline = cyan outline. ghost = text only. sticker = torn-paper marker button. danger = sunset red. */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'sticker' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Lucide icon name rendered before the label. */
  iconLeft?: string;
  iconRight?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
