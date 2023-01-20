import { type NextPage } from "next";
import { useState } from "react";
import { GoalForm } from "../features/goal/form";
import { GoalList } from "../features/goal/list";
import { Anchor } from "../features/ui/anchor";
import { Button } from "../features/ui/button";
import { Title } from "../features/ui/title";

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
    const onClickAddGoal = () => setIsAddingGoal(true);
    const onAddGoal = () => setIsAddingGoal(false);

    return (
        <div>
            <Title>Goals</Title>
            <GoalList />
            <div className="mt-6">
                {isAddingGoal && <GoalForm onSuccess={onAddGoal} />}
                {!isAddingGoal && (
                    <Button onClick={onClickAddGoal}>New Goal</Button>
                )}
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
            <Anchor href="/day-view" className="px-5 py-3 !text-xl">
                View Day
            </Anchor>
        </div>
    );
};

export default Home;
