import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Head from "next/head";
import { AuthChecker } from "../features/auth/auth-checker";
import { Layout } from "../features/ui/layout";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>Koal</title>
        <meta name="description" content="Time management at it's finest" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <SessionProvider session={session}>
        <Layout>
          <AuthChecker>
            <Component {...pageProps} />
          </AuthChecker>
        </Layout>
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
