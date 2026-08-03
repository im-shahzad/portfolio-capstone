"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6 mx-auto w-full max-w-screen-xl px-6 py-5 bg-bg text-text font-body">
      <ul className="flex flex-wrap gap-6 list-none m-0 p-0">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={
                pathname === link.href
                  ? "text-accent font-semibold"
                  : "text-text opacity-80 hover:opacity-100"
              }
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
