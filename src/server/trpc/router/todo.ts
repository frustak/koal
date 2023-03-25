import { z } from "zod";
import { prisma } from "../../db/client";
import { protectedProcedure, router } from "../trpc";

const goalSchema = z.object({
    name: z.string(),
    id: z.string(),
});

export type Goal = z.infer<typeof goalSchema>;

export const prioritySchema = z.enum(["urgent", "not_urgent"]);

export const todoSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullish(),
    isDone: z.date().nullable(),
    goalName: z.string(),
    priority: prioritySchema,
});

export type Todo = z.infer<typeof todoSchema>;

export const todoRouter = router({
    createGoal: protectedProcedure
        .input(
            z.object({
                name: z.string(),
            })
        )
        .output(
            z.object({
                name: z.string(),
                id: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const goal = await prisma.goal.create({
                data: {
                    name: input.name,
                    ownerId: ctx.session.user.id,
                },
            });
            return { name: goal.name, id: goal.id };
        }),
    updateGoal: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string().optional(),
            })
        )
        .output(
            z.object({
                id: z.string(),
                title: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            const updatedTodo = await prisma.todo.update({
                data: {
                    title: input.title,
                },
                where: {
                    id: input.id,
                },
            });
            return updatedTodo;
        }),
    getGoals: protectedProcedure
        .output(
            z.object({
                goals: z.array(goalSchema),
            })
        )
        .query(async ({ ctx }) => {
            const goals = await prisma.goal.findMany({
                where: { ownerId: ctx.session.user.id },
            });
            return {
                goals,
            };
        }),
    deleteGoal: protectedProcedure
        .input(
            z.object({
                goalId: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            await prisma.goal.delete({
                where: { id: input.goalId },
            });
        }),
    createTodo: protectedProcedure
        .input(
            z.object({
                title: z.string(),
                description: z.string().nullable(),
                goalId: z.string(),
                priority: prioritySchema,
            })
        )
        .output(todoSchema)
        .mutation(async ({ input }) => {
            const createdTodo = await prisma.todo.create({
                data: {
                    title: input.title,
                    description: input.description,
                    goalId: input.goalId,
                    priority: input.priority,
                },
                include: {
                    Goal: true,
                },
            });
            const response: Todo = {
                id: createdTodo.id,
                title: createdTodo.title,
                isDone: createdTodo.isDone,
                goalName: createdTodo.Goal.name,
                priority: prioritySchema.parse(createdTodo.priority),
            };
            return response;
        }),
    updateTodo: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string().optional(),
                description: z.string().optional(),
                priority: prioritySchema.optional(),
            })
        )
        .output(todoSchema)
        .mutation(async ({ input }) => {
            const updatedTodo = await prisma.todo.update({
                data: {
                    title: input.title,
                    description: input.description,
                },
                where: {
                    id: input.id,
                },
                include: {
                    Goal: true,
                },
            });
            const response: Todo = {
                id: updatedTodo.id,
                title: updatedTodo.title,
                isDone: updatedTodo.isDone,
                goalName: updatedTodo.Goal.name,
                priority: prioritySchema.parse(updatedTodo.priority),
            };
            return response;
        }),
    updateTodoStatus: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                isDone: z.boolean(),
            })
        )
        .mutation(async ({ input }) => {
            await prisma.todo.update({
                data: {
                    isDone: input.isDone ? new Date() : null,
                },
                where: {
                    id: input.id,
                },
            });
        }),
    getTodos: protectedProcedure
        .input(
            z.object({
                goalIds: z.array(z.string()).default([]),
                priority: prioritySchema.optional(),
            })
        )
        .output(
            z.object({
                todos: z.array(todoSchema),
            })
        )
        .query(async ({ input, ctx }) => {
            const todos = await prisma.todo.findMany({
                where: {
                    Goal: { ownerId: ctx.session.user.id },
                    priority: input.priority,
                    ...(input.goalIds.length > 0
                        ? { goalId: { in: input.goalIds } }
                        : {}),
                },
                orderBy: [
                    { priority: "desc" },
                    { order: "asc" },
                    { createdAt: "asc" },
                ],
                include: { Goal: true },
            });
            return {
                todos: todos.map((todo) => ({
                    id: todo.id,
                    title: todo.title,
                    isDone: todo.isDone,
                    goalName: todo.Goal.name,
                    priority: prioritySchema.parse(todo.priority),
                })),
            };
        }),
    deleteTodo: protectedProcedure
        .input(
            z.object({
                todoId: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            await prisma.todo.delete({
                where: { id: input.todoId },
            });
        }),
    updateOrders: protectedProcedure
        .input(
            z.object({
                todoIds: z.array(z.string()),
            })
        )
        .mutation(async ({ input }) => {
            await prisma.$transaction(
                input.todoIds.map((todoId, index) =>
                    prisma.todo.update({
                        where: { id: todoId },
                        data: { order: index },
                    })
                )
            );
        }),
});
