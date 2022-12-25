import type { NextPage } from "next";
import { useState } from "react";
import { PlanGoalList } from "../features/goal/plan-list";
import { TodoForm } from "../features/todo/form";
import { TodosList } from "../features/todo/list";
import { Button } from "../features/ui/button";
import { Title } from "../features/ui/title";

const PlanPage: NextPage = () => {
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  return (
    <main className="flex grow flex-col">
      <GoalsSection
        selectedGoalId={selectedGoalId}
        setSelectedGoalId={setSelectedGoalId}
      />
      <hr className="mt-10 rounded-sm border-t-2 border-neutral-700" />
      <div className="grid grow grid-cols-2 divide-x-2 divide-neutral-700">
        <div className="pt-10 pr-8">
          <TodosSection goalId={selectedGoalId} />
        </div>
        <div className="pt-10 pl-8">
          <FocusTimeSection />
        </div>
      </div>
    </main>
  );
};

export default PlanPage;

const GoalsSection = ({
  selectedGoalId,
  setSelectedGoalId,
}: {
  selectedGoalId: string | null;
  setSelectedGoalId: (value: string | null) => void;
}) => {
  return (
    <div>
      <Title>Goals</Title>
      <PlanGoalList
        selectedGoalId={selectedGoalId}
        setSelectedGoalId={setSelectedGoalId}
      />
    </div>
  );
};

const TodosSection = ({ goalId }: { goalId: string | null }) => {
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const onClickAddTodo = () => setIsAddingTodo(true);
  const onAddTodo = () => setIsAddingTodo(false);

  return (
    <div className="flex flex-col">
      <Title>Todos</Title>
      {!goalId && <p>Select a goal to see todos</p>}
      {goalId && <TodosList goalId={goalId} />}
      {goalId && (
        <div className="mt-6">
          {isAddingTodo && <TodoForm goalId={goalId} onSuccess={onAddTodo} />}
          {!isAddingTodo && <Button onClick={onClickAddTodo}>Add Todo</Button>}
        </div>
      )}
    </div>
  );
};

const FocusTimeSection = () => {
  return <p className="text-center">Work In Progress 🍕</p>;

  return (
    <div className="flex flex-col items-center">
      <Title>Focus time</Title>
      <div className="grid w-40 grid-cols-2 divide-x divide-neutral-700 border border-neutral-700 p-1 font-mono font-bold">
        <div className="flex items-center justify-center p-1">15:00</div>
        <div className="flex items-center justify-center p-1">17:00</div>
      </div>
      <Button className="mt-20 px-10 text-lg">Finish</Button>
    </div>
  );
};
