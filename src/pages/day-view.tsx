import clsx from "clsx";
import { format, isAfter, isBefore } from "date-fns";
import _ from "lodash";
import type { NextPage } from "next";
import { TodosList } from "../features/todo/list";
import { Loader } from "../features/ui/loader";
import { Title } from "../features/ui/title";
import { trpc } from "../utils/trpc";

const DayViewPage: NextPage = () => {
    return (
        <main className="grid grow grid-cols-4 divide-x-2 divide-neutral-700">
            <div className="col-span-3 pr-6 pt-4">
                <TodosSection />
            </div>

            <div className="pt-4">
                <FocusSection />
            </div>
        </main>
    );
};

const TodosSection = () => {
    const inboxQuery = trpc.planning.inbox.useQuery();
    const goalToTodos = inboxQuery.data?.goalToTodos ?? {};
    const focusGoal = inboxQuery.data?.focusGoal.name;
    const goals = _.toPairs(goalToTodos);
    if (inboxQuery.isLoading) return <Loader />;

    if (goals.length === 0) {
        return (
            <div>
                <Title>Awesome...</Title>
                <p className="text-xs">
                    You are done for today. Come back tomorrow
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {goals.map(([goal, todos]) => (
                <div key={goal}>
                    <Title>{goal == focusGoal ? `Focus ${goal}` : goal}</Title>
                    <TodosList todos={todos} />
                </div>
            ))}
        </div>
    );
};

const FocusSection = () => {
    const inboxQuery = trpc.planning.inbox.useQuery();
    const focusTime = inboxQuery.data?.focusTime;
    const now = new Date();
    const start = focusTime?.start;
    const end = focusTime?.end;

    if (inboxQuery.isLoading) return <Loader />;
    if (!start || !end)
        return (
            <p className="text-center text-xs">
                You haven&apos;t set a focus time
            </p>
        );

    const focused = isBefore(now, end) && isAfter(now, start);

    return (
        <div className="flex flex-col items-center">
            <Title>Focus Time</Title>
            <div
                className={clsx(
                    "rounded-sm px-6 py-4",
                    focused && "bg-neutral-700 text-white"
                )}
            >
                <div className="space-y-6 text-center">
                    <FocusTime focused={focused} label="start" time={start} />
                    <FocusTime focused={focused} label="end" time={end} />
                </div>
            </div>
        </div>
    );
};

const FocusTime = ({
    label,
    time,
    focused,
}: {
    label: string;
    time: Date;
    focused: boolean;
}) => {
    return (
        <div>
            <h4
                className={clsx(
                    "text-xs",
                    focused && "text-neutral-300",
                    !focused && "text-neutral-500"
                )}
            >
                {label}
            </h4>
            <p>{format(time, "kk:mm")}</p>
        </div>
    );
};

export default DayViewPage;
