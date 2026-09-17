export interface IconButtonProps {
  /** Lucide icon name. */
  icon: string;
  /** Accessible label (required). */
  label: string;
  variant?: 'ghost' | 'outline' | 'primary' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  /** Selected/toggled state — tints the glyph acid green. */
  active?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
