"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, User, Sparkles, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/work", label: "Work", icon: Briefcase },
  { href: "/about", label: "About", icon: User },
  { href: "/chat", label: "Ask AI", icon: Sparkles },
  { href: "/contact", label: "Contact", icon: Mail },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop: horizontal top nav ─────────────────────────── */}
      <nav
        aria-label="Primary"
        className="hidden md:flex items-center gap-6 mx-auto w-full max-w-screen-xl px-6 py-5 bg-bg text-text font-body"
      >
        <ul className="flex gap-6 list-none m-0 p-0">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={cn(
                  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors",
                  pathname === link.href
                    ? "text-accent font-semibold"
                    : "text-text-muted hover:text-text"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Mobile: bottom tab bar ──────────────────────────────── */}
      <nav
        aria-label="Primary"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-lg border-t border-border"
      >
        <ul className="flex items-center justify-around list-none m-0 p-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg min-w-[56px] outline-none",
                    "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                    "transition-colors",
                    isActive
                      ? "text-accent"
                      : "text-text-muted hover:text-text"
                  )}
                >
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium leading-none">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
