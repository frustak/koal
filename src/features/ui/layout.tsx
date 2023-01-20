import Head from "next/head";
import type { ReactNode } from "react";

export const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Head>
                <title>Koal</title>
                <meta
                    name="description"
                    content="Time management at it's finest"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
                <link rel="manifest" href="/site.webmanifest" />
            </Head>

            <div className="container mx-auto flex h-screen flex-col p-8 font-display text-neutral-700 selection:bg-neutral-900 selection:text-white">
                <div className="flex grow flex-col rounded-sm border-4 border-neutral-700 py-4">
                    {children}
                </div>
            </div>
        </>
    );
};
