import { AlertCircle, Loader2 } from "lucide-react";

type InlineNoticeProps = {
  title: string;
  text: string;
  tone?: "info" | "warning";
};

type SkeletonListProps = {
  rows?: number;
  variant?: "cards" | "lines";
};

export function InlineNotice({ title, text, tone = "info" }: InlineNoticeProps) {
  return (
    <div className={`inline-notice ${tone}`}>
      <AlertCircle size={17} />
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}

export function SkeletonList({ rows = 4, variant = "cards" }: SkeletonListProps) {
  return (
    <div className={`skeleton-list ${variant}`} aria-label="Загрузка данных">
      {Array.from({ length: rows }).map((_, index) => (
        <div className="skeleton-row" key={index}>
          <span />
          <div>
            <b />
            <small />
          </div>
          <em />
        </div>
      ))}
    </div>
  );
}

export function LoadingBadge({ label = "Обновляем данные" }: { label?: string }) {
  return (
    <span className="loading-badge">
      <Loader2 size={14} />
      {label}
    </span>
  );
}
