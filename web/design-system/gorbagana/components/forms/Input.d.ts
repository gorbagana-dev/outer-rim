export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  /** Error message; turns border sunset-red. */
  error?: string;
  /** Lucide icon inside the field, left. */
  iconLeft?: string;
  /** Trailing unit/ticker text, e.g. "$GOR". */
  suffix?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** JetBrains Mono — for addresses, hashes, amounts. */
  mono?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
