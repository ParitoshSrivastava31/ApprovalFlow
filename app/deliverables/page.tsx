import Link from "next/link";

import { createDeliverableAction } from "@/app/actions";
import { AppShell } from "@/app/components/app-shell";
import { StatusBadge } from "@/app/components/status-badge";
import { PageHeader, styles } from "@/app/components/ui";
import { getDeliverables, getProjects } from "@/lib/data";
import { formatDateTime } from "@/lib/format";
import { getReviewUrl } from "@/lib/supabase";

export default async function DeliverablesPage() {
  const [projects, deliverables] = await Promise.all([
    getProjects(),
    getDeliverables(),
  ]);
  const latestByGroup = new Map<string, (typeof deliverables)[number]>();

  for (const deliverable of deliverables) {
    const current = latestByGroup.get(deliverable.versionGroupId);
    if (!current || deliverable.version > current.version) {
      latestByGroup.set(deliverable.versionGroupId, deliverable);
    }
  }

  return (
    <AppShell>
      <PageHeader
        kicker="Upload work and share one link"
        title="Deliverables"
        lead="Create versioned review links for images, PDFs, videos, and external assets."
      />

      <section className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form
          action={createDeliverableAction}
          className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_16px_48px_rgba(24,24,27,0.05)] sm:p-6"
        >
          <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
            Create review link
          </h2>
          <div className="mt-5 space-y-5">
            <label className="block">
              <span className={styles.label}>Project</span>
              <select
                required
                name="projectId"
                className={styles.input}
              >
                <option value="">Choose project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.clientName} / {project.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={styles.label}>Version history</span>
              <select
                name="versionGroupId"
                className={styles.input}
              >
                <option value="">Start new deliverable</option>
                {Array.from(latestByGroup.values()).map((deliverable) => (
                  <option
                    key={deliverable.versionGroupId}
                    value={deliverable.versionGroupId}
                  >
                    Add version {deliverable.version + 1} to {deliverable.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={styles.label}>Title</span>
              <input
                required
                name="title"
                placeholder="Homepage concept"
                className={styles.input}
              />
            </label>

            <label className="block">
              <span className={styles.label}>Description</span>
              <textarea
                name="description"
                rows={4}
                placeholder="What should the client review?"
                className={styles.textarea}
              />
            </label>

            <label className="block">
              <span className={styles.label}>File upload</span>
              <input
                name="file"
                type="file"
                accept="image/*,application/pdf,video/*"
                className="mt-2 w-full rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-3 py-3 text-sm text-zinc-600 file:mr-3 file:rounded-xl file:border-0 file:bg-zinc-950 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
            </label>

            <label className="block">
              <span className={styles.label}>External URL</span>
              <input
                name="externalUrl"
                type="url"
                placeholder="https://figma.com/file/..."
                className={styles.input}
              />
            </label>
          </div>

          <button
            type="submit"
            className={`${styles.primaryButton} mt-6 w-full`}
          >
            Generate review link
          </button>
        </form>

        <div className="space-y-4">
          {deliverables.map((deliverable) => (
            <article
              key={deliverable.id}
              className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_16px_48px_rgba(24,24,27,0.05)] transition hover:-translate-y-0.5 hover:border-zinc-300 sm:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
                      {deliverable.title}
                    </h2>
                    <StatusBadge status={deliverable.status} />
                  </div>
                  <p className="mt-2 text-sm text-zinc-500">
                    {deliverable.clientName} / {deliverable.projectName}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Version {deliverable.version} / {formatDateTime(deliverable.createdAt)}
                  </p>
                </div>
                <Link
                  href={`/r/${deliverable.publicId}`}
                  className={`${styles.primaryButton} w-full sm:w-auto`}
                >
                  Open review
                </Link>
              </div>

              <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase text-zinc-400">
                  Secure review link
                </p>
                <p className="mt-2 break-all font-mono text-sm text-zinc-700">
                  {getReviewUrl(deliverable.publicId)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
