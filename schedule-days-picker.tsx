"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/stat-card";

export function SubmitButton({
  children,
  variant = "primary",
  className,
  pendingText = "Saving…",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost" | "outline";
  className?: string;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} disabled={pending} className={className}>
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
