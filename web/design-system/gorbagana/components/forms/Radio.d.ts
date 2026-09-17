export interface RadioOption { value: string; label: React.ReactNode; description?: React.ReactNode; }
export interface RadioProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  direction?: 'row' | 'column';
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Radio(props: RadioProps): JSX.Element;
