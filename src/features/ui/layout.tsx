import Head from "next/head";
import type { ReactNode } from "react";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Head>
        <title>Koal</title>
        <meta name="description" content="Time management at it's finest" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="container mx-auto flex h-screen flex-col p-8 font-display text-neutral-700 selection:bg-neutral-700 selection:text-white">
        <div className="flex grow flex-col rounded-sm border-4 border-neutral-700 px-6 py-4">
          {children}
        </div>
      </div>
    </>
  );
};
