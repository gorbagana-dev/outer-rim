export interface CardProps {
  /** default = void surface + purple hairline. neon = 2px glowing accent border. sticker = cream paper, hard ink shadow, tilt. cardboard = corrugated brown. glass = blurred overlay surface. */
  variant?: 'default' | 'neon' | 'sticker' | 'cardboard' | 'glass';
  /** Accent for neon variant. */
  accent?: 'acid' | 'pink' | 'cyan' | 'yellow' | 'purple';
  /** CSS padding for the body. Default var(--space-5). */
  padding?: string;
  /** Rotation degrees for paper variants. */
  tilt?: number;
  /** Hover glow / un-tilt. */
  interactive?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
