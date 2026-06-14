import Link from "next/link";

import { AppShell } from "@/app/components/app-shell";
import { StatusBadge } from "@/app/components/status-badge";
import { Card, PageHeader, PrimaryLink, SectionTitle } from "@/app/components/ui";
import { getDashboardOverview } from "@/lib/data";
import { eventLabel, formatDateTime } from "@/lib/format";
import { getReviewUrl } from "@/lib/supabase";

export default async function DashboardPage() {
  const overview = await getDashboardOverview();

  return (
    <AppShell>
      <PageHeader
        kicker="Approval command center"
        title="Dashboard"
        lead="Track pending decisions, recent client activity, and the review links that need attention."
        action={<PrimaryLink href="/deliverables">Create review link</PrimaryLink>}
      />

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Pending approvals"
          value={overview.pendingApprovals}
          accent="bg-amber-400"
        />
        <MetricCard
          label="Approved deliverables"
          value={overview.approvedDeliverables}
          accent="bg-emerald-500"
        />
        <MetricCard
          label="Changes requested"
          value={overview.changesRequested}
          accent="bg-rose-500"
        />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <SectionTitle title="Active deliverables" />
            <Link href="/deliverables" className="text-sm font-semibold text-zinc-600">
              View all
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_16px_48px_rgba(24,24,27,0.05)]">
            <div className="divide-y divide-zinc-100">
              {overview.deliverables.slice(0, 6).map((deliverable) => (
                <div
                  key={deliverable.id}
                  className="grid gap-4 p-5 transition hover:bg-zinc-50/70 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-zinc-950">{deliverable.title}</p>
                      <StatusBadge status={deliverable.status} />
                    </div>
                    <p className="mt-2 text-sm text-zinc-500">
                      {deliverable.clientName} / {deliverable.projectName} / Version{" "}
                      {deliverable.version}
                    </p>
                  </div>
                  <Link
                    href={getReviewUrl(deliverable.publicId)}
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-zinc-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-50"
                  >
                    Review link
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3">
            <SectionTitle title="Recent activity" />
          </div>
          <div className="space-y-3">
            {overview.recentActivity.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(24,24,27,0.04)] transition hover:border-zinc-300"
              >
                <p className="text-sm font-semibold text-zinc-950">
                  {eventLabel(event.eventType)}
                </p>
                <p className="mt-1 text-sm text-zinc-600">{event.deliverableTitle}</p>
                <p className="mt-2 text-xs text-zinc-500">
                  {formatDateTime(event.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <span className={`absolute right-5 top-5 size-2.5 rounded-full ${accent}`} />
      <p className="text-sm font-semibold text-zinc-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
        {value}
      </p>
    </Card>
  );
}
