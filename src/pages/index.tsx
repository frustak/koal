import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Koal</title>
        <meta name="description" content="Time management at it's finest" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className="container flex min-h-screen flex-col items-center justify-center gap-6">
        <Authentication />
        <GoalsList />
        <GoalSubmitForm />
      </main>
    </>
  );
};

export default Home;

const Authentication = () => {
  const session = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {session.data && (
        <p className="text-2xl text-blue-500">
          Logged in as {session.data?.user?.name}
        </p>
      )}
      <button
        className="rounded-md border border-black bg-violet-50 px-4 py-2 text-xl shadow-lg hover:bg-violet-100"
        onClick={() => (session.data ? signOut() : signIn())}
      >
        {session.data ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

const GoalsList = () => {
  const goalsQuery = trpc.todo.getGoals.useQuery();

  if (goalsQuery.isLoading) return <div> fetching goals </div>;

  return (
    <div>
      Your goals: {goalsQuery.data?.goals.map((goal) => `${goal.name} , `)}
    </div>
  );
};

const GoalSubmitForm = () => {
  const [message, setMessage] = useState("");
  const createGoal = trpc.todo.createGoal.useMutation();

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        createGoal.mutate({ name: message });
        setMessage("");
      }}
    >
      <input
        type="text"
        value={message}
        placeholder="Goal name"
        minLength={2}
        maxLength={100}
        onChange={(event) => setMessage(event.target.value)}
        className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 text-neutral-100 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
      >
        Submit
      </button>
    </form>
  );
};
