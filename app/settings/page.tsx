import { AppShell } from "@/app/components/app-shell";
import { Card, PageHeader } from "@/app/components/ui";
import { getCurrentUser } from "@/lib/data";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <AppShell>
      <PageHeader
        kicker="Workspace controls"
        title="Settings"
        lead="Security and account details for the approval workspace."
      />

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-950">Account</h2>
          <dl className="mt-5 space-y-5 text-sm">
            <div>
              <dt className="font-semibold text-zinc-500">Name</dt>
              <dd className="mt-1 font-medium text-zinc-950">{user.name}</dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-500">Email</dt>
              <dd className="mt-1 font-medium text-zinc-950">{user.email}</dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-500">Role</dt>
              <dd className="mt-2 inline-flex rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold uppercase text-zinc-700">
                {user.role === "AGENCY_OWNER" ? "Agency owner" : "Agency member"}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
            Review security
          </h2>
          <div className="mt-5 space-y-3 text-sm leading-6 text-zinc-600">
            <p className="rounded-2xl bg-zinc-50 p-4">
              Public review links use non-sequential IDs.
            </p>
            <p className="rounded-2xl bg-zinc-50 p-4">
              Approval actions verify a server-signed nonce for the current version.
            </p>
            <p className="rounded-2xl bg-zinc-50 p-4">
              Files are stored in a private Supabase bucket and served with signed URLs.
            </p>
            <p className="rounded-2xl bg-zinc-50 p-4">
              Comments, views, approvals, and change requests are written to the audit timeline.
            </p>
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
