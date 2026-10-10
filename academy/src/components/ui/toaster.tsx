"use client";

import * as React from "react";
import { Toaster as Sonner, toast, type ToasterProps } from "sonner";
import { CircleCheck, CircleAlert, Info, TriangleAlert, LoaderCircle } from "lucide-react";
import { useTheme } from "@/components/shared/use-theme";

/**
 * Sonner toaster themed to the cream/rose/gold/sage palette. Mount once in the
 * root layout; call `toast(...)` / `toast.success(...)` anywhere on the client.
 */
function Toaster({ ...props }: ToasterProps) {
  const { resolved } = useTheme();
  return (
    <Sonner
      theme={resolved}
      position="bottom-right"
      closeButton
      duration={4500}
      className="toaster group"
      icons={{
        success: <CircleCheck className="size-4 text-sage-strong" />,
        info: <Info className="size-4 text-rose-strong" />,
        warning: <TriangleAlert className="size-4 text-warning" />,
        error: <CircleAlert className="size-4 text-danger" />,
        loading: <LoaderCircle className="size-4 animate-spin text-muted-foreground" />,
      }}
      toastOptions={{
        classNames: {
          toast: "!rounded-lg !border-border !bg-card !text-foreground !shadow-card !font-sans",
          title: "!font-semibold",
          description: "!text-muted-foreground",
          actionButton: "!bg-primary !text-primary-foreground !rounded-md !font-semibold",
          cancelButton: "!bg-muted-bg !text-foreground !rounded-md",
          closeButton: "!bg-card !border-border !text-muted-foreground hover:!bg-rose-soft",
          success: "!border-sage/40",
          error: "!border-danger/40",
          warning: "!border-warning/40",
          info: "!border-rose/30",
        },
      }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--ink)",
          "--normal-border": "var(--line)",
          "--success-bg": "var(--card)",
          "--success-text": "var(--ink)",
          "--success-border": "var(--sage)",
          "--error-bg": "var(--card)",
          "--error-text": "var(--ink)",
          "--error-border": "var(--danger)",
          "--warning-bg": "var(--card)",
          "--warning-text": "var(--ink)",
          "--warning-border": "var(--warning)",
          "--info-bg": "var(--card)",
          "--info-text": "var(--ink)",
          "--info-border": "var(--rose)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { Toaster, toast };
