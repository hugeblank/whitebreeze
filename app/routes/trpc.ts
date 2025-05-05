import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "~/api/router";
import type { Route } from "./+types/trpc";
import { createContext } from "~/api/context";

function handleRequest(args: Route.ActionArgs | Route.LoaderArgs) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: args.request,
    router: appRouter,
    createContext,
  });
}

export function loader(args: Route.LoaderArgs) {
  return handleRequest(args);
}

export function action(args: Route.ActionArgs) {
  return handleRequest(args);
}
