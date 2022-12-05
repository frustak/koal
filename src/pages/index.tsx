import { type NextPage } from "next";
import Head from "next/head";
import { Anchor } from "../features/ui/anchor";
import { Header } from "../features/ui/header";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Koal</title>
        <meta name="description" content="Time management at it's finest" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main>
        <Header />
        <div className="flex justify-center">
          <Anchor href="/plan" className="px-6 py-4 text-2xl">
            New Day
          </Anchor>
        </div>
      </main>
    </>
  );
};

export default Home;
