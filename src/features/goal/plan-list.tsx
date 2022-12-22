import clsx from "clsx";
import { Bookmark } from "phosphor-react";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { IconButton } from "../ui/button";
import type { Goal } from "./list";

export const PlanGoalList = ({
  selectedGoalId,
  setSelectedGoalId,
}: {
  selectedGoalId: string | null;
  setSelectedGoalId: (value: string | null) => void;
}) => {
  const [focusedGoalId, setFocusedGoalId] = useState<string | null>(null);
  const goalsQuery = trpc.todo.getGoals.useQuery();
  const goals = goalsQuery.data?.goals ?? [];

  return (
    <ul className="flex flex-col space-y-3">
      {goals.map((goal) => (
        <GoalItem
          key={goal.id}
          goal={goal}
          selected={selectedGoalId === goal.id}
          focused={focusedGoalId === goal.id}
          onClick={() =>
            setSelectedGoalId(goal.id === selectedGoalId ? null : goal.id)
          }
          onClickFocus={() =>
            setFocusedGoalId(goal.id === focusedGoalId ? null : goal.id)
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
