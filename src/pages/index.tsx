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
      <main className="container flex flex-col items-center justify-center min-h-screen p-4 mx-auto">
        <AuthShowcase />
        <GoalsList />
        <GoalSubmitForm />
      </main>
    </>
  );
};

export default Home;

const AuthShowcase = () => {
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery();
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {sessionData && (
        <p className="text-2xl text-blue-500">
          Logged in as {sessionData?.user?.name}
        </p>
      )}
      {secretMessage && (
        <p className="text-2xl text-blue-500">{secretMessage}</p>
      )}
      <button
        className="px-4 py-2 text-xl border border-black rounded-md shadow-lg bg-violet-50 hover:bg-violet-100"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

const GoalsList = () => {
  const { data: goals, isLoading } = trpc.todo.getGoals.useQuery();

  if (isLoading) return <div> fetching goals </div>;

  return <div>Your goals: {goals?.goals.map((goal) => `${goal.name} , `)}</div>;
};

const GoalSubmitForm = () => {
  const [message, setMessage] = useState("");
  const createGoal = trpc.todo.createGoal.useMutation();

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        createGoal.mutate({
          name: message,
        });
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
        className="px-4 py-2 border-2 rounded-md border-zinc-800 bg-neutral-900 focus:outline-none"
      />
      <button
        type="submit"
        className="p-2 border-2 rounded-md border-zinc-800 focus:outline-none"
      >
        Submit
      </button>
    </form>
  );
};
