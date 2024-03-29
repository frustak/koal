import _ from "lodash";
import type { NextPage } from "next";
import { useState } from "react";
import { PlanGoalList } from "../features/goal/plan-list";
import { TodoSection } from "../features/todo/section";
import { Button } from "../features/ui/button";
import { Subtitle, Title } from "../features/ui/title";
import { trpc } from "../utils/trpc";

interface Goal {
    id: string;
    name: string;
}

const PlanPage: NextPage = () => {
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [focusedGoal, setFocusedGoal] = useState<Goal | null>(null);
    const focusMutation = trpc.planning.setDayFocus.useMutation();

    return (
        <main className="flex grow flex-col">
            <GoalsSection
                selectedGoalId={selectedGoalId}
                setSelectedGoalId={setSelectedGoalId}
                focusedGoal={focusedGoal}
                setFocusedGoal={setFocusedGoal}
            />
            <hr className="mt-10 rounded-sm border-t-2 border-neutral-700" />
            <div className="grid grow grid-cols-2 divide-x-2 divide-neutral-700">
                <div className="pt-10 pr-8">
                    <TodoSection goalId={selectedGoalId} />
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
                            if (focusedGoal)
                                focusMutation.mutate({
                                    goalId: focusedGoal.id,
                                    focusTimeStart: startDate,
                                    focusTimeEnd: endDate,
                                });
                        }}
                        submitting={focusMutation.isLoading}
                        focusedGoal={focusedGoal}
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
    focusedGoal,
    setFocusedGoal,
}: {
    selectedGoalId: string | null;
    setSelectedGoalId: (value: string | null) => void;
    focusedGoal: Goal | null;
    setFocusedGoal: (value: Goal | null) => void;
}) => {
    return (
        <div>
            <Title>Goals</Title>
            <PlanGoalList
                selectedGoalId={selectedGoalId}
                setSelectedGoalId={setSelectedGoalId}
                focusedGoal={focusedGoal}
                setFocusedGoal={setFocusedGoal}
            />
        </div>
    );
};

const FocusTimeSection = ({
    onFinish,
    submitting,
    focusedGoal,
}: {
    onFinish: (focusTime: {
        start: TimeInputValue;
        end: TimeInputValue;
    }) => void;
    submitting: boolean;
    focusedGoal: Goal | null;
}) => {
    const inboxQuery = trpc.planning.inbox.useQuery();
    const focusTime = inboxQuery.data?.focusTime;

    const startHour = focusTime?.start?.getHours() ?? 13;
    const startMinute = focusTime?.start?.getMinutes() ?? 0;
    const endHour = focusTime?.end?.getHours() ?? 14;
    const endMinute = focusTime?.end?.getMinutes() ?? 0;

    const [start, setStart] = useState<TimeInputValue>({
        hour: startHour.toString().padStart(2, "0"),
        minute: startMinute.toString().padStart(2, "0"),
    });
    const [end, setEnd] = useState<TimeInputValue>({
        hour: endHour.toString().padStart(2, "0"),
        minute: endMinute.toString().padStart(2, "0"),
    });

    let focusedGoalText = (
        <Subtitle>
            No goal is selected to focus on. Select a goal to focus on it in
            this time.
        </Subtitle>
    );
    if (focusedGoal) {
        focusedGoalText = (
            <div>
                You&apos;re going to focus on
                <span className="ml-1  font-bold">
                    {focusedGoal?.name} &nbsp;
                </span>
                at this time.
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center">
            <Title>Focus time</Title>
            <div className="grid w-40 grid-cols-2 divide-x divide-neutral-700 border border-neutral-700 p-1 font-mono font-bold">
                <TimeInput value={start} onChange={setStart} />
                <TimeInput value={end} onChange={setEnd} />
            </div>
            <div className="mt-6 text-lg">{focusedGoalText}</div>
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
    const setMinute = (minute: string) =>
        onChange({ hour: value.hour, minute });

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
