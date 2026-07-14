import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_tabs/missions")({
  component: () => <Outlet />,
});
