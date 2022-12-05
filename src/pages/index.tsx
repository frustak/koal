import { type NextPage } from "next";
import { Anchor } from "../features/ui/anchor";
import { Header } from "../features/ui/header";

const Home: NextPage = () => {
  return (
    <main>
      <Header />
      <div className="flex justify-center">
        <Anchor href="/plan" className="px-6 py-4 text-2xl">
          New Day
        </Anchor>
      </div>
    </main>
  );
};

export default Home;
