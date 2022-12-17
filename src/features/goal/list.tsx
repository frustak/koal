import { Eraser } from "phosphor-react";
import { trpc } from "../../utils/trpc";
import { IconButton } from "../ui/button";
import { Loader } from "../ui/loader";

type Goal = { id: string; name: string };

export const GoalList = () => {
  const goalsQuery = trpc.todo.getGoals.useQuery();
  const goals = goalsQuery.data?.goals ?? [];

  if (goalsQuery.isLoading) return <Loader />;

  if (goals.length === 0) {
    return (
      <p className="text-xs leading-6">
        How can a man lead his life without any goal?
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {goals.map((goal) => (
        <GoalItem key={goal.id} goal={goal} />
      ))}
    </ul>
  );
};

const GoalItem = ({ goal }: { goal: Goal }) => {
  const deleteGoalMutation = trpc.todo.deleteGoal.useMutation();
  const handleDelete = () => deleteGoalMutation.mutate({ goalId: goal.id });

  return (
    <li className="flex items-center justify-between">
      <p>{goal.name}</p>
      <IconButton onClick={handleDelete} loading={deleteGoalMutation.isLoading}>
        <Eraser weight="duotone" />
      </IconButton>
    </li>
  );
};
