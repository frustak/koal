import type { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return <div className="font-display text-neutral-700">{children}</div>;
}
