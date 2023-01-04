import _ from "lodash";
import type { NextPage } from "next";
import { useState } from "react";
import { PlanGoalList } from "../features/goal/plan-list";
import { TodoForm } from "../features/todo/form";
import { TodosList } from "../features/todo/list";
import { Button } from "../features/ui/button";
import { Title } from "../features/ui/title";
import { trpc } from "../utils/trpc";

const PlanPage: NextPage = () => {
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const focusMutation = trpc.planning.setDayFocus.useMutation();

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
          <FocusTimeSection
            onFinish={(time) => {
              const startDate = new Date();
              startDate.setHours(_.parseInt(time.start.hour));
              startDate.setMinutes(_.parseInt(time.start.minute));
              const endDate = new Date();
              endDate.setHours(_.parseInt(time.end.hour));
              endDate.setMinutes(_.parseInt(time.end.minute));
              if (selectedGoalId)
                focusMutation.mutate({
                  goalId: selectedGoalId,
                  focusTimeStart: startDate,
                  focusTimeEnd: endDate,
                });
            }}
            submitting={focusMutation.isLoading}
          />
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

const FocusTimeSection = ({
  onFinish,
  submitting,
}: {
  onFinish: (focusTime: { start: TimeInputValue; end: TimeInputValue }) => void;
  submitting: boolean;
}) => {
  const [start, setStart] = useState<TimeInputValue>({
    hour: "13",
    minute: "00",
  });
  const [end, setEnd] = useState<TimeInputValue>({
    hour: "14",
    minute: "00",
  });

  return (
    <div className="flex flex-col items-center">
      <Title>Focus time</Title>
      <div className="grid w-40 grid-cols-2 divide-x divide-neutral-700 border border-neutral-700 p-1 font-mono font-bold">
        <TimeInput value={start} onChange={setStart} />
        <TimeInput value={end} onChange={setEnd} />
      </div>
      <Button
        className="mt-20 px-10 text-lg"
        onClick={() => onFinish({ start, end })}
        loading={submitting}
      >
        Finish
      </Button>
    </div>
  );
};

type TimeInputValue = { hour: string; minute: string };

const TimeInput = ({
  value,
  onChange,
}: {
  value: TimeInputValue;
  onChange: (value: TimeInputValue) => void;
}) => {
  const setHour = (hour: string) => onChange({ hour, minute: value.minute });
  const setMinute = (minute: string) => onChange({ hour: value.hour, minute });

  return (
    <div className="flex items-center justify-center p-1">
      <input
        value={value.hour}
        onChange={(event) => {
          const value = event.target.value.substring(0, 2);
          if (_.parseInt(value) > 23) setHour("23");
          else setHour(value);
          if (!value) setHour("00");
        }}
        className="form-input w-[2ch] focus:outline-none"
        type="number"
      />
      <span>:</span>
      <input
        value={value.minute}
        onChange={(event) => {
          const value = event.target.value.substring(0, 2);
          if (_.parseInt(value) > 59) setMinute("59");
          else setMinute(value);
          if (!value) setMinute("00");
        }}
        className="w-[2ch] focus:outline-none"
        type="number"
      />
    </div>
  );
};
