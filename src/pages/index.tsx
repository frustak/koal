import { type NextPage } from "next";
import { Anchor } from "../features/ui/anchor";

const Home: NextPage = () => {
  return (
    <main className="flex justify-center">
      <Anchor href="/plan" className="px-6 py-4 text-2xl">
        New Day
      </Anchor>
    </main>
  );
};

export default Home;
