export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}
export declare function Switch(props: SwitchProps): JSX.Element;
