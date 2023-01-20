import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { AuthChecker } from "../features/auth/auth-checker";
import { Header } from "../features/ui/header";
import { Layout } from "../features/ui/layout";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <Layout>
                <AuthChecker>
                    <Header />
                    <div className="flex grow flex-col px-6">
                        <Component {...pageProps} />
                    </div>
                </AuthChecker>
            </Layout>
        </SessionProvider>
    );
};

export default trpc.withTRPC(MyApp);
