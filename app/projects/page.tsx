import { createProjectAction } from "@/app/actions";
import { AppShell } from "@/app/components/app-shell";
import { Card, PageHeader, styles } from "@/app/components/ui";
import { getClients, getProjects } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function ProjectsPage() {
  const [clients, projects] = await Promise.all([getClients(), getProjects()]);

  return (
    <AppShell>
      <PageHeader
        kicker="Deliverable containers"
        title="Projects"
        lead="Organize review links by client without turning ApprovalFlow into project management."
      />

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <form
          action={createProjectAction}
          className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_16px_48px_rgba(24,24,27,0.05)] sm:p-6"
        >
          <h2 className="text-lg font-semibold tracking-tight text-zinc-950">Create project</h2>
          <div className="mt-5 space-y-5">
            <label className="block">
              <span className={styles.label}>Client</span>
              <select
                required
                name="clientId"
                className={styles.input}
              >
                <option value="">Choose client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={styles.label}>Name</span>
              <input
                required
                name="name"
                placeholder="Website approval package"
                className={styles.input}
              />
            </label>
            <label className="block">
              <span className={styles.label}>Description</span>
              <textarea
                name="description"
                rows={4}
                placeholder="Assets that need client review and sign-off."
                className={styles.textarea}
              />
            </label>
          </div>
          <button
            type="submit"
            className={`${styles.primaryButton} mt-6 w-full`}
          >
            Save project
          </button>
        </form>

        <Card className="overflow-hidden p-0">
          <div className="grid grid-cols-[1fr_auto] border-b border-zinc-100 px-5 py-4 text-xs font-semibold uppercase text-zinc-400">
            <span>Project</span>
            <span>Created</span>
          </div>
          <div className="divide-y divide-zinc-100">
            {projects.map((project) => (
              <div
                key={project.id}
                className="grid grid-cols-[1fr_auto] gap-4 px-5 py-5 transition hover:bg-zinc-50/70"
              >
                <div>
                  <p className="font-semibold text-zinc-950">{project.name}</p>
                  <p className="mt-1 text-sm text-zinc-500">{project.clientName}</p>
                  {project.description ? (
                    <p className="mt-2 max-w-2xl text-sm text-zinc-600">
                      {project.description}
                    </p>
                  ) : null}
                </div>
                <p className="text-sm text-zinc-500">{formatDate(project.createdAt)}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
