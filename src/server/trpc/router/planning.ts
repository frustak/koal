import { TRPCError } from "@trpc/server";
import { isBefore } from "date-fns";
import { z } from "zod";
import { prisma } from "../../db/client";
import { protectedProcedure, router } from "../trpc";
import type { Todo } from "./todo";
import { todoSchema } from "./todo";

export const planningRouter = router({
    setDayFocus: protectedProcedure
        .input(
            z.object({
                goalId: z.string(),
                focusTimeStart: z.date(),
                focusTimeEnd: z.date(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (
                new Date(input.focusTimeStart).getDate() !==
                    new Date().getDate() ||
                new Date(input.focusTimeEnd).getDate() !== new Date().getDate()
            ) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Focus time must be today",
                });
            }

            if (isBefore(input.focusTimeEnd, input.focusTimeStart)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Focus time start must be before focus time end",
                });
            }
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
                    priority: "urgent",
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

            const todoGroupedByGoal: Record<string, Todo[]> = {};

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
