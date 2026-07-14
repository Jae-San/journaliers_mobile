import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/_tabs")({
  component: TabsLayout,
});

function TabsLayout() {
  return (
    <div className="min-h-screen pb-[calc(env(safe-area-inset-bottom)+4.5rem)]">
      <Outlet />
      <BottomNav />
    </div>
  );
}
