import Link from "next/link";
import { Eraser } from "phosphor-react";
import type { Goal } from "../../server/trpc/router/todo";
import { trpc } from "../../utils/trpc";
import { IconButton } from "../ui/button";
import { Loader } from "../ui/loader";

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
            <Link
                href={`/goal/${goal.id}`}
                className="rounded-sm hover:bg-neutral-50"
            >
                {goal.name}
            </Link>
            <IconButton
                onClick={handleDelete}
                loading={deleteGoalMutation.isLoading}
            >
                <Eraser weight="duotone" />
            </IconButton>
        </li>
    );
};
