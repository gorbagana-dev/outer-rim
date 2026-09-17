export interface TooltipProps {
  content: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** default = void/purple glow. sticker = paper note in marker type. */
  tone?: 'default' | 'sticker';
  children: React.ReactNode;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;
