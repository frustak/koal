import clsx from "clsx";
import { Bookmark } from "phosphor-react";
import type { Goal } from "../../server/trpc/router/todo";
import { trpc } from "../../utils/trpc";
import { Anchor } from "../ui/anchor";
import { IconButton } from "../ui/button";
import { Subtitle } from "../ui/title";

export const PlanGoalList = ({
    selectedGoalId,
    setSelectedGoalId,
    focusedGoal,
    setFocusedGoal,
}: {
    selectedGoalId: string | null;
    setSelectedGoalId: (value: string | null) => void;
    focusedGoal: Goal | null;
    setFocusedGoal: (value: Goal | null) => void;
}) => {
    const goalsQuery = trpc.todo.getGoals.useQuery();
    const goals = goalsQuery.data?.goals ?? [];

    if (goals.length === 0)
        return (
            <div className="flex gap-1">
                <Subtitle>Add a goal first, then plan it here.</Subtitle>
                <Anchor href="/">click to add a goal</Anchor>
            </div>
        );

    return (
        <ul className="flex flex-col space-y-3">
            {goals.map((goal) => (
                <GoalItem
                    key={goal.id}
                    goal={goal}
                    selected={selectedGoalId === goal.id}
                    focused={focusedGoal?.id === goal.id}
                    onClick={() =>
                        setSelectedGoalId(
                            goal.id === selectedGoalId ? null : goal.id
                        )
                    }
                    onClickFocus={() =>
                        setFocusedGoal(
                            goal.id === focusedGoal?.id
                                ? null
                                : {
                                      id: goal.id,
                                      name: goal.name,
                                  }
                        )
                    }
                />
            ))}
        </ul>
    );
};

const GoalItem = ({
    goal,
    selected,
    onClick,
    onClickFocus,
    focused,
}: {
    goal: Goal;
    selected: boolean;
    focused: boolean;
    onClick: () => void;
    onClickFocus: () => void;
}) => {
    return (
        <li key={goal.id} className="flex items-center gap-4">
            <IconButton title="Focus" onClick={onClickFocus}>
                <Bookmark weight={focused ? "fill" : "duotone"} />
            </IconButton>
            <p
                className={clsx(
                    "grow cursor-pointer select-none rounded-sm px-2 outline-2 outline-offset-1 outline-neutral-700 hover:outline",
                    selected && "bg-neutral-700 text-white"
                )}
                onClick={onClick}
            >
                {goal.name}
            </p>
        </li>
    );
};
