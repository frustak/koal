import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import { Button } from "../ui/button";

const schema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().max(1000),
    priority: z.enum(["urgent", "not_urgent"]),
});

type Schema = z.infer<typeof schema>;

export const TodoForm = ({ goalId }: { goalId: string }) => {
    const addTodoMutation = trpc.todo.createTodo.useMutation();
    const form = useForm<Schema>({
        defaultValues: { title: "", description: "", priority: "urgent" },
        resolver: zodResolver(schema),
    });
    const onSubmit = form.handleSubmit((values) => {
        addTodoMutation.mutate(
            { ...values, goalId },
            { onSuccess: () => form.reset() }
        );
    });

    return (
        <form onSubmit={onSubmit} className="flex">
            <div className="flex items-stretch rounded-sm border-2 border-neutral-700">
                <input
                    placeholder="What you want to do?"
                    autoFocus
                    className="grow px-2 py-0.5 focus:outline-0"
                    {...form.register("title")}
                />
                <select
                    className="px-2 py-0.5 focus:outline-0"
                    {...form.register("priority")}
                >
                    <option value="urgent">Urgent</option>
                    <option value="not_urgent">Not urgent</option>
                </select>
                <Button
                    type="submit"
                    loading={addTodoMutation.isLoading}
                    variant="filled"
                >
                    Save
                </Button>
            </div>
        </form>
    );
};
