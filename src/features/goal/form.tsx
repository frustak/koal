import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import { Button } from "../ui/button";

const schema = z.object({
    name: z.string().min(1).max(100),
});

type Schema = z.infer<typeof schema>;

export const GoalForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const addGoalMutation = trpc.todo.createGoal.useMutation();
    const form = useForm<Schema>({
        defaultValues: { name: "" },
        resolver: zodResolver(schema),
    });
    const onSubmit = form.handleSubmit((values) => {
        addGoalMutation.mutate(values, {
            onSuccess: () => {
                form.reset();
                onSuccess();
            },
        });
    });

    return (
        <form onSubmit={onSubmit} className="flex">
            <div className="flex items-stretch rounded-sm border-2 border-neutral-700">
                <input
                    placeholder="Your goal"
                    autoFocus
                    className="grow px-2 py-0.5 focus:outline-0"
                    {...form.register("name")}
                />
                <Button
                    type="submit"
                    loading={addGoalMutation.isLoading}
                    variant="filled"
                >
                    Save
                </Button>
            </div>
        </form>
    );
};
