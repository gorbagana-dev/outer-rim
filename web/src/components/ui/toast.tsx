import { cn } from "@/lib/cn";
import { CheckCircle2, Info, Skull, TriangleAlert, X, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { IconButton } from "./icon-button";

const TONE = {
  success: { color: "var(--acid-500)", Icon: CheckCircle2 },
  info: { color: "var(--cyan-500)", Icon: Info },
  warning: { color: "var(--yellow-500)", Icon: TriangleAlert },
  danger: { color: "var(--sunset-600)", Icon: Skull },
  gor: { color: "var(--pink-500)", Icon: Zap },
};

export function Toast({
  tone = "success",
  title,
  description,
  action,
  onDismiss,
}: {
  tone?: keyof typeof TONE;
  title?: string;
  description?: string;
  action?: ReactNode;
  onDismiss?: () => void;
}) {
  const { color, Icon } = TONE[tone];
  return (
    <div
      role="status"
      className="flex items-start gap-3 w-[360px] max-w-full py-3 pr-3 pl-3.5 bg-[var(--void-3)] rounded-md border border-[var(--border-default)] shadow-elevated"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      <Icon size={20} color={color} className="mt-0.5 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1 flex flex-col gap-0.5">
        {title && <div className="font-body font-bold text-[var(--text-primary)]">{title}</div>}
        {description && <div className="text-sm text-[var(--text-secondary)]">{description}</div>}
        {action && <div className="mt-1.5">{action}</div>}
      </div>
      {onDismiss && (
        <IconButton label="Dismiss" size="sm" onClick={onDismiss}>
          <X size={14} aria-hidden />
        </IconButton>
      )}
    </div>
  );
}

export function ToastViewport({ children }: { children: ReactNode }) {
  return (
    <div className="fixed bottom-4 right-4 z-[1100] flex flex-col gap-2 pointer-events-none [&>*]:pointer-events-auto pb-[env(safe-area-inset-bottom)]">
      {children}
    </div>
  );
}
