import { router } from "../trpc";
import { authRouter } from "./auth";
import { planningRouter } from "./planning";
import { todoRouter } from "./todo";

export const appRouter = router({
    auth: authRouter,
    todo: todoRouter,
    planning: planningRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
