export interface TagProps {
  children?: React.ReactNode;
  /** chip = pill filter tag (default). sticker = tilted paper label in marker type. */
  variant?: 'chip' | 'sticker';
  selected?: boolean;
  /** Lucide icon shown before the label. */
  icon?: string;
  /** Rotation in degrees for sticker variant (-4..4). */
  tilt?: number;
  onClick?: () => void;
  /** Renders an × and makes the tag removable. */
  onRemove?: () => void;
  style?: React.CSSProperties;
}
export declare function Tag(props: TagProps): JSX.Element;
