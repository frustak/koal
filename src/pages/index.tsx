import { type NextPage } from "next";
import { useState } from "react";
import { GoalForm } from "../features/goal/form";
import { GoalList } from "../features/goal/list";
import { Anchor } from "../features/ui/anchor";
import { Button } from "../features/ui/button";
import { Loader } from "../features/ui/loader";
import { Title } from "../features/ui/title";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  return (
    <main className="grid grow grid-cols-2 divide-x-2 divide-neutral-700">
      <div className="pr-6 pt-4">
        <GoalsSection />
      </div>

      <div className="pt-4">
        <PlanningSection />
      </div>
    </main>
  );
};

export const GoalsSection = () => {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const goalsQuery = trpc.todo.getGoals.useQuery();
  const goals = goalsQuery.data?.goals ?? [];
  const onClickAddGoal = () => setIsAddingGoal(true);
  const onCreateGoal = () => setIsAddingGoal(false);

  if (goalsQuery.isLoading) return <Loader />;

  return (
    <div>
      <Title>Goals</Title>
      <GoalList goals={goals} />
      <div className="mt-6">
        {isAddingGoal && <GoalForm onSuccess={onCreateGoal} />}
        {!isAddingGoal && <Button onClick={onClickAddGoal}>Add Goal</Button>}
      </div>
    </div>
  );
};

export const PlanningSection = () => {
  return (
    <div className="flex items-start justify-center">
      <Anchor href="/plan" className="px-5 py-3 !text-xl">
        New Day
      </Anchor>
    </div>
  );
};

export default Home;
