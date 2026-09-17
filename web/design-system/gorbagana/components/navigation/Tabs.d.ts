export interface TabItem { value: string; label: React.ReactNode; /** Lucide icon */ icon?: string; count?: number | string; disabled?: boolean; }
export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  onChange?: (value: string) => void;
  /** underline = acid glowing underline (default). pill = segmented control on a bin well. */
  variant?: 'underline' | 'pill';
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;
