import React, { useEffect } from "react";
import Card from "./Card";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function Modal({ open, title, onClose, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      {/* Backdrop */}
      <button
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/70"
      />

      {/* Dialog */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <Card className="w-full max-w-xl p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="text-lg font-semibold">{title}</div>
            <button onClick={onClose} className="btn btn-ghost px-3 py-1 text-sm">
              Cerrar
            </button>
          </div>

          <div className="px-5 py-4">{children}</div>

          {footer && (
            <div className="flex items-center justify-end gap-2 border-t border-white/10 px-5 py-4">
              {footer}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}