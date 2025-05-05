import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [index("routes/home.tsx")]),
  route("/api/trpc/*", "routes/trpc.ts"),
] satisfies RouteConfig;
