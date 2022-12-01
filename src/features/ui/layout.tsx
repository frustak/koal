import type { ReactNode } from "react";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="container mx-auto flex h-screen  flex-col p-8 font-display text-neutral-700">
      <div className="grow rounded-sm border-4 border-neutral-700 px-6 py-4">
        {children}
      </div>
    </div>
  );
};
