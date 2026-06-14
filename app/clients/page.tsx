import { AppShell } from "@/app/components/app-shell";
import { createClientAction } from "@/app/actions";
import { Card, PageHeader, styles } from "@/app/components/ui";
import { getClients } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <AppShell>
      <PageHeader
        kicker="Approval recipients"
        title="Clients"
        lead="Keep only the client details needed to send work for review and preserve approval records."
      />

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <form
          action={createClientAction}
          className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_16px_48px_rgba(24,24,27,0.05)] sm:p-6"
        >
          <h2 className="text-lg font-semibold tracking-tight text-zinc-950">Add client</h2>
          <div className="mt-5 space-y-5">
            <Field label="Name" name="name" placeholder="Aurora Kitchen" />
            <Field label="Email" name="email" type="email" placeholder="client@example.com" />
            <Field label="Phone" name="phone" placeholder="+1 415 555 0149" />
          </div>
          <button
            type="submit"
            className={`${styles.primaryButton} mt-6 w-full`}
          >
            Save client
          </button>
        </form>

        <Card className="overflow-hidden p-0">
          <div className="grid grid-cols-[1fr_auto] border-b border-zinc-100 px-5 py-4 text-xs font-semibold uppercase text-zinc-400">
            <span>Client</span>
            <span>Added</span>
          </div>
          <div className="divide-y divide-zinc-100">
            {clients.map((client) => (
              <div
                key={client.id}
                className="grid grid-cols-[1fr_auto] gap-4 px-5 py-5 transition hover:bg-zinc-50/70"
              >
                <div>
                  <p className="font-semibold text-zinc-950">{client.name}</p>
                  <p className="mt-1 text-sm text-zinc-500">{client.email}</p>
                  {client.phone ? (
                    <p className="mt-1 text-sm text-zinc-500">{client.phone}</p>
                  ) : null}
                </div>
                <p className="text-sm text-zinc-500">{formatDate(client.createdAt)}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className={styles.label}>{label}</span>
      <input
        required={name !== "phone"}
        name={name}
        type={type}
        placeholder={placeholder}
        className={styles.input}
      />
    </label>
  );
}
