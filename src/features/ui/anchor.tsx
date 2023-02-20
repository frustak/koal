import clsx from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";
import { sound } from "./sound";

type AnchorProps = {
    children: ReactNode;
    href: string;
    className?: string;
};

export const Anchor = ({ children, href, className }: AnchorProps) => {
    return (
        <Link
            href={href}
            className={clsx(
                "inline-flex rounded-sm bg-neutral-700 p-1 text-xs font-medium text-white hover:-rotate-3",
                className
            )}
            onMouseEnter={() => sound.play()}
            onClick={() => sound.play()}
        >
            {children}
        </Link>
    );
};
