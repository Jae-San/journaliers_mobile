import { Link } from "@tanstack/react-router";
import { Home, Briefcase, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/home", label: "Accueil", icon: Home },
  { to: "/missions", label: "Missions", icon: Briefcase },
  { to: "/payments", label: "Paiements", icon: Wallet },
  { to: "/profile", label: "Profil", icon: User },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] border-t border-border bg-card shadow-nav">
      <ul className="grid grid-cols-4 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              className="press-sm group flex flex-col items-center gap-1 py-2.5 text-muted-foreground"
              activeProps={{ "data-status": "active" } as never}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    key={isActive ? "active" : "inactive"}
                    className={cn(
                      "h-6 w-6 transition-colors",
                      isActive && "pop-in text-primary",
                    )}
                    strokeWidth={isActive ? 2.25 : 1.75}
                  />
                  <span
                    className={cn(
                      "text-[11px] font-medium transition-colors",
                      isActive ? "font-semibold text-primary" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                </>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
