import { type NextPage } from "next";
import Head from "next/head";
import { Button } from "../features/ui/button";
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
        <Button className="text-lg">New Day</Button>
      </main>
    </>
  );
};

export default Home;
