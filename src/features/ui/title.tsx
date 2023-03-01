import clsx from "clsx";
import type { ReactNode } from "react";

export const Title = ({ children }: { children: ReactNode }) => {
    return (
        <h2 className="mb-6 text-xl underline underline-offset-4">
            {children}
        </h2>
    );
};

export const Subtitle = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => {
    return <h6 className={clsx("text-xs leading-6", className)}>{children}</h6>;
};
