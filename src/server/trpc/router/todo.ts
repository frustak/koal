import { z } from "zod";
import { prisma } from "../../db/client";
import { protectedProcedure, router } from "../trpc";

const goalSchema = z.object({
    name: z.string(),
    id: z.string(),
});

export type Goal = z.infer<typeof goalSchema>;

export const todoSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullish(),
    isDone: z.date().nullable(),
    goalName: z.string(),
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
                priority: z.enum(["not_urgent", "urgent"]),
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
            };
            return response;
        }),
    updateTodo: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string().optional(),
                description: z.string().optional(),
                priority: z.enum(["not_urgent", "urgent"]).optional(),
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
                priority: z.enum(["not_urgent", "urgent"]),
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
                include: { Goal: true },
            });
            return {
                todos: todos.map((todo) => ({
                    id: todo.id,
                    title: todo.title,
                    isDone: todo.isDone,
                    goalName: todo.Goal.name,
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
});
