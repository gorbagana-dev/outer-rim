export interface BadgeProps {
  tone?: 'acid' | 'pink' | 'cyan' | 'yellow' | 'danger' | 'purple' | 'neutral';
  /** soft = tinted bg (default), solid = filled, outline = neon border. */
  variant?: 'soft' | 'solid' | 'outline';
  /** Leading status dot. */
  dot?: boolean;
  /** Pulses the dot (live / mainnet-up states). */
  pulse?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
