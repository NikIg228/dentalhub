"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type ModalShellProps = {
  articleClassName: string;
  backdropClassName: string;
  children: React.ReactNode;
  closeClassName: string;
  labelledBy: string;
  onClose: () => void;
};

export function ModalShell({
  articleClassName,
  backdropClassName,
  children,
  closeClassName,
  labelledBy,
  onClose
}: ModalShellProps) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className={backdropClassName} role="presentation" onMouseDown={onClose}>
      <article
        className={articleClassName}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className={closeClassName} type="button" onClick={onClose} aria-label="Закрыть">
          <X size={18} />
        </button>
        {children}
      </article>
    </div>
  );
}
