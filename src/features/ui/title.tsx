import type { ReactNode } from "react";

export const Title = ({ children }: { children: ReactNode }) => {
    return (
        <h2 className="mb-6 text-xl underline underline-offset-4">
            {children}
        </h2>
    );
};
