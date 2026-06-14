import Link from "next/link";

import { getCurrentUser } from "@/lib/data";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/clients", label: "Clients" },
  { href: "/projects", label: "Projects" },
  { href: "/deliverables", label: "Deliverables" },
  { href: "/settings", label: "Settings" },
  { href: "/billing", label: "Billing" },
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[#fbfbfc] text-zinc-950">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-zinc-200/80 bg-white/85 px-5 py-6 shadow-[8px_0_40px_rgba(24,24,27,0.03)] backdrop-blur-xl lg:block">
        <Link href="/dashboard" className="flex items-center gap-3 px-2">
          <span className="grid size-9 place-items-center rounded-2xl bg-zinc-950 text-sm font-semibold text-white shadow-lg shadow-zinc-950/15">
            A
          </span>
          <span>
            <span className="block text-base font-semibold tracking-tight">
              ApprovalFlow
            </span>
            <span className="block text-xs text-zinc-500">Approval layer</span>
          </span>
        </Link>
        <nav className="mt-10 space-y-1.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex min-h-10 items-center rounded-xl px-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100/80 hover:text-zinc-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-6 left-5 right-5 rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_14px_40px_rgba(24,24,27,0.08)]">
          <p className="text-sm font-medium text-zinc-950">{user.name}</p>
          <p className="mt-1 truncate text-xs text-zinc-500">{user.email}</p>
          <p className="mt-3 inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
            {user.role === "AGENCY_OWNER" ? "Agency owner" : "Agency member"}
          </p>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/88 px-4 py-3 shadow-sm shadow-zinc-950/[0.02] backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-base font-semibold">
              <span className="grid size-8 place-items-center rounded-xl bg-zinc-950 text-xs text-white">
                A
              </span>
              <span>ApprovalFlow</span>
            </Link>
            <Link
              href="/deliverables"
              className="rounded-xl bg-zinc-950 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-zinc-950/15"
            >
              New review
            </Link>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-600 shadow-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
