"use client";

import React from "react";
import { Toast, Toaster, createToaster } from "@ark-ui/react/toast";
import { Portal } from "@ark-ui/react/portal";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export const toaster = createToaster({
  placement: "bottom-end",
  gap: 16,
  overlap: true,
});

export default function ToastBasic() {
  return (
    <div className="bg-surface/40 border border-border-subtle backdrop-blur-md w-full px-4 py-8 rounded-xl flex flex-col items-center shadow-lg">
      <button
        type="button"
        onClick={() =>
          toaster.create({
            title: "Welcome!",
            description: "Your account has been created successfully.",
            type: "success",
          })
        }
        className="px-5 py-2.5 bg-accent-primary hover:bg-accent-primary/80 text-bg-primary font-bold rounded-lg transition-colors text-sm shadow-md cursor-pointer font-display tracking-wider"
      >
        Show Toast
      </button>
    </div>
  );
}

export function GlobalToaster() {
  return (
    <Portal>
      <Toaster toaster={toaster}>
        {(toast) => {
          let colors = "bg-bg-secondary/95 border-border-subtle text-text-primary shadow-lg";
          let borderStyle = "border-l-4 border-info";
          let iconColor = "text-info";
          let Icon = Info;

          if (toast.type === "success") {
            colors = "bg-bg-secondary/95 border-border-subtle text-text-primary shadow-[0_0_25px_rgba(16,185,129,0.12)]";
            borderStyle = "border-l-4 border-success";
            iconColor = "text-success";
            Icon = CheckCircle;
          } else if (toast.type === "error") {
            colors = "bg-bg-secondary/95 border-border-subtle text-text-primary shadow-[0_0_25px_rgba(239,68,68,0.12)]";
            borderStyle = "border-l-4 border-danger";
            iconColor = "text-danger";
            Icon = AlertCircle;
          } else if (toast.type === "warning") {
            colors = "bg-bg-secondary/95 border-border-subtle text-text-primary shadow-[0_0_25px_rgba(245,158,11,0.12)]";
            borderStyle = "border-l-4 border-warning";
            iconColor = "text-warning";
            Icon = AlertTriangle;
          } else if (toast.type === "info") {
            colors = "bg-bg-secondary/95 border-border-subtle text-text-primary shadow-[0_0_25px_rgba(34,211,238,0.12)]";
            borderStyle = "border-l-4 border-accent-primary";
            iconColor = "text-accent-primary";
            Icon = Info;
          }

          return (
            <Toast.Root
              className={`rounded-xl border border-border-subtle backdrop-blur-md min-w-[320px] max-w-sm p-4 relative overflow-hidden transition-all duration-300 ease-in-out will-change-transform h-(--height) opacity-(--opacity) translate-x-(--x) translate-y-(--y) scale-(--scale) z-(--z-index) ${colors} ${borderStyle}`}
            >
              <div className="flex items-start gap-3.5 pr-6">
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
                <div className="flex-1">
                  <Toast.Title className="font-display font-semibold text-sm tracking-wide text-text-primary">
                    {toast.title}
                  </Toast.Title>
                  {toast.description && (
                    <Toast.Description className="text-xs text-text-secondary mt-1 font-sans leading-relaxed">
                      {toast.description}
                    </Toast.Description>
                  )}
                </div>
              </div>
              <Toast.CloseTrigger className="absolute top-3 right-3 p-1.5 hover:bg-surface/60 text-text-secondary hover:text-text-primary rounded-lg transition-colors cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </Toast.CloseTrigger>
            </Toast.Root>
          );
        }}
      </Toaster>
    </Portal>
  );
}
