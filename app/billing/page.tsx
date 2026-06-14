import { AppShell } from "@/app/components/app-shell";
import { Card, PageHeader, styles } from "@/app/components/ui";
import { getDashboardOverview } from "@/lib/data";

export default async function BillingPage() {
  const overview = await getDashboardOverview();

  return (
    <AppShell>
      <PageHeader
        kicker="Plan and usage"
        title="Billing"
        lead="A simple view of approval usage and plan status."
      />

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-950">Current plan</h2>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950">
            Studio
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Built for small agencies and freelancers collecting client sign-offs.
          </p>
          <button
            type="button"
            className={`${styles.secondaryButton} mt-6`}
          >
            Manage plan
          </button>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-950">Approval usage</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Usage label="Pending" value={overview.pendingApprovals} />
            <Usage label="Approved" value={overview.approvedDeliverables} />
            <Usage label="Needs changes" value={overview.changesRequested} />
          </div>
        </Card>
      </section>
    </AppShell>
  );
}

function Usage({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
      <p className="text-sm font-semibold text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">{value}</p>
    </div>
  );
}
