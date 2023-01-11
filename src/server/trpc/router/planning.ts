import { z } from "zod";
import { prisma } from "../../db/client";
import { protectedProcedure, router } from "../trpc";
import { Todo, todoSchema } from "./todo";

export const planningRouter = router({
    setDayFocus: protectedProcedure
        .input(
            z.object({
                goalId: z.string(),
                focusTimeStart: z
                    .date()
                    .min(new Date(new Date().setHours(0, 0, 0, 0)))
                    .max(new Date(new Date().setHours(23, 59, 59, 0))),
                focusTimeEnd: z
                    .date()
                    .min(new Date(new Date().setHours(0, 0, 0, 0)))
                    .max(new Date(new Date().setHours(23, 59, 59, 0))),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await prisma.dayFocus.upsert({
                where: {
                    ownerId_date: {
                        ownerId: ctx.session.user.id,
                        date: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
                update: {
                    goalId: input.goalId,
                    focusTimeStart: input.focusTimeStart,
                    focusTimeEnd: input.focusTimeEnd,
                },
                create: {
                    goalId: input.goalId,
                    ownerId: ctx.session.user.id,
                    focusTimeStart: input.focusTimeStart,
                    focusTimeEnd: input.focusTimeEnd,
                    date: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            });
        }),
    inbox: protectedProcedure
        .output(
            z.object({
                goalToTodos: z.record(z.string(), z.array(todoSchema)),
                focusTime: z.object({
                    start: z.date().optional(),
                    end: z.date().optional(),
                }),
                focusGoal: z.object({
                    name: z.string().optional(),
                    id: z.string().optional(),
                }),
            })
        )
        .query(async ({ ctx }) => {
            const todos = await prisma.todo.findMany({
                where: {
                    isDone: null,
                    Goal: { ownerId: ctx.session.user.id },
                },
                include: { Goal: true },
            });
            const dayFocus = await prisma.dayFocus.findFirst({
                where: {
                    ownerId: ctx.session.user.id,
                    date: new Date(new Date().setHours(0, 0, 0, 0)),
                },
                include: { Goal: true },
            });

            const todoGroupedByGoal = {} as Record<string, Todo[]>;

            todos.map((todo) => {
                const transformedTodo = {
                    id: todo.id,
                    title: todo.title,
                    isDone: todo.isDone,
                    goalName: todo.Goal.name,
                };
                if (todoGroupedByGoal[todo.Goal.name]) {
                    todoGroupedByGoal[todo.Goal.name]?.push(transformedTodo);
                } else {
                    todoGroupedByGoal[todo.Goal.name] = [transformedTodo];
                }
            });

            return {
                goalToTodos: todoGroupedByGoal,
                focusTime: {
                    start: dayFocus?.focusTimeStart,
                    end: dayFocus?.focusTimeEnd,
                },
                focusGoal: {
                    name: dayFocus?.Goal.name,
                    id: dayFocus?.Goal.id,
                },
            };
        }),
});
