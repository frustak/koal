import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { Profile } from "../features/auth/profile";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Koal</title>
        <meta name="description" content="Time management at it's finest" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main>
        <div className="flex justify-end">
          <Profile />
        </div>
        <GoalsList />
        <GoalSubmitForm />
      </main>
    </>
  );
};

export default Home;

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
      />
      <button type="submit">Submit</button>
    </form>
  );
};
