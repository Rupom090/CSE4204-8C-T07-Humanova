"use client";

import React from "react";
import { toaster } from "./basic-toast";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const toastTypes = [
  {
    type: "success" as const,
    title: "Success!",
    description: "Your changes have been saved.",
    icon: CheckCircle,
    colors: "bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-950/60 shadow-[0_0_15px_rgba(16,185,129,0.06)]",
  },
  {
    type: "error" as const,
    title: "Error occurred",
    description: "Something went wrong. Please try again.",
    icon: AlertCircle,
    colors: "bg-red-950/40 border border-red-500/20 text-red-300 hover:bg-red-950/60 shadow-[0_0_15px_rgba(239,68,68,0.06)]",
  },
  {
    type: "warning" as const,
    title: "Warning",
    description: "This action cannot be undone.",
    icon: AlertTriangle,
    colors: "bg-amber-950/40 border border-amber-500/20 text-amber-300 hover:bg-amber-950/60 shadow-[0_0_15px_rgba(245,158,11,0.06)]",
  },
  {
    type: "info" as const,
    title: "New update available",
    description: "Version 2.1.0 is now available for download.",
    icon: Info,
    colors: "bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-950/60 shadow-[0_0_15px_rgba(34,211,238,0.06)]",
  },
];

export default function ToastTypes() {
  return (
    <div className="bg-surface/30 border border-border-subtle backdrop-blur-md w-full px-4 py-8 rounded-2xl flex flex-col items-center">
      <h3 className="text-sm font-semibold font-display tracking-wider text-text-secondary mb-6">
        NOTIFICATION BENCHMARK CONTROLS
      </h3>
      <div className="flex flex-wrap gap-3.5 justify-center">
        {toastTypes.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.type}
              type="button"
              onClick={() =>
                toaster.create({
                  title: item.title,
                  description: item.description,
                  type: item.type,
                })
              }
              className={`flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider font-display uppercase transition-all duration-300 cursor-pointer ${item.colors}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.type} toast</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
