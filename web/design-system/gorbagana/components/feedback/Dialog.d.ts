export interface DialogProps {
  open?: boolean;
  onClose?: () => void;
  /** Small pink uppercase line above the title. */
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Action row (right-aligned). */
  footer?: React.ReactNode;
  /** Max width in px. Default 480. */
  width?: number;
  /** default = void panel w/ purple glow. sticker = paper notice, tilted. */
  variant?: 'default' | 'sticker';
  /** Render in-flow instead of as a fixed overlay. */
  inline?: boolean;
  style?: React.CSSProperties;
}
export declare function Dialog(props: DialogProps): JSX.Element | null;
