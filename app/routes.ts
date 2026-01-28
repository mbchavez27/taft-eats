import {
  type RouteConfig,
  route,
  index,
  prefix
} from "@react-router/dev/routes";

export default [
  index("./routes/index.tsx"),

    ...prefix("restaurants", [
    route(":restaurant", "./routes/restaurants/index.tsx"),
  ]),

    ...prefix("user", [
    route("/", "./routes/user-page/index.tsx"),
  ]),
] satisfies RouteConfig;
