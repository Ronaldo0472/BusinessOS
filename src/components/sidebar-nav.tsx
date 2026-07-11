"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface SidebarNavItem {
  slug: string;
  title: string;
  href: string;
}

export interface SidebarNavGroup {
  section: string;
  label: string;
  href: string;
  items: SidebarNavItem[];
}

export interface SidebarNavProps {
  groups: SidebarNavGroup[];
}

export function SidebarNav({ groups }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-border bg-background">
      <div className="px-6 py-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          BusinessOS
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        <ul className="flex flex-col gap-4">
          {groups.map((group) => {
            const groupActive = pathname === group.href;
            const groupOpen = pathname.startsWith(`${group.href}/`) || groupActive;

            return (
              <li key={group.section}>
                <Link
                  href={group.href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                    "hover:bg-muted dark:hover:bg-white/10",
                    groupActive ? "bg-muted text-foreground" : "text-foreground/80"
                  )}
                >
                  {group.label}
                </Link>

                {group.items.length > 0 && groupOpen && (
                  <ul className="mt-1 flex flex-col gap-0.5 pl-3">
                    {group.items.map((item) => {
                      const itemActive = pathname === item.href;

                      return (
                        <li key={item.slug}>
                          <Link
                            href={item.href}
                            className={cn(
                              "block rounded-md px-3 py-1.5 text-sm transition-colors duration-150",
                              "hover:bg-muted dark:hover:bg-white/10",
                              itemActive
                                ? "bg-muted font-medium text-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            {item.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
