export interface ToastProps {
  /** success = acid, info = cyan, warning = yellow, danger = sunset (skull), gor = pink zap. */
  tone?: 'success' | 'info' | 'warning' | 'danger' | 'gor';
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Inline action (usually a small ghost Button). */
  action?: React.ReactNode;
  onDismiss?: () => void;
  /** Override Lucide icon. */
  icon?: string;
  style?: React.CSSProperties;
}
export declare function Toast(props: ToastProps): JSX.Element;
