import Link from "next/link";
import { Eraser, Trash } from "phosphor-react";
import { useState } from "react";
import type { Goal } from "../../server/trpc/router/todo";
import { trpc } from "../../utils/trpc";
import { IconButton } from "../ui/button";
import { Loader } from "../ui/loader";
import { Subtitle } from "../ui/title";

export const GoalList = () => {
    const goalsQuery = trpc.todo.getGoals.useQuery();
    const goals = goalsQuery.data?.goals ?? [];

    if (goalsQuery.isLoading) return <Loader />;

    if (goals.length === 0) {
        return (
            <Subtitle>How can a man lead his life without any goal?</Subtitle>
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
    return (
        <li className="flex items-center justify-between">
            <Link
                href={`/goal/${goal.id}`}
                className="rounded-sm hover:bg-neutral-50"
            >
                {goal.name}
            </Link>
            <DeleteButton goalId={goal.id} />
        </li>
    );
};

const DeleteButton = ({ goalId }: { goalId: string }) => {
    const [confirmed, setConfirmed] = useState(false);
    const deleteGoalMutation = trpc.todo.deleteGoal.useMutation();
    const handleDelete = () => {
        if (!confirmed) {
            setConfirmed(true);
        } else {
            deleteGoalMutation.mutate(
                { goalId },
                { onSuccess: () => setConfirmed(false) }
            );
        }
    };

    return (
        <IconButton
            onClick={handleDelete}
            loading={deleteGoalMutation.isLoading}
        >
            {!confirmed && <Eraser weight="duotone" />}
            {confirmed && <Trash weight="duotone" />}
        </IconButton>
    );
};
