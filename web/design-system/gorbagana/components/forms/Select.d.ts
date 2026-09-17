export interface SelectOption { value: string; label: string; /** Lucide icon */ icon?: string; }
export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;
