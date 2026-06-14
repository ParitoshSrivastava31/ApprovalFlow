import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import {
  addCommentAction,
  approveDeliverableAction,
  requestChangesAction,
} from "@/app/actions";
import { DeliverablePreview } from "@/app/components/deliverable-preview";
import { StatusBadge } from "@/app/components/status-badge";
import { Timeline } from "@/app/components/timeline";
import { getPublicReview, recordReviewView } from "@/lib/data";
import { formatDateTime } from "@/lib/format";
import { requestBrowser, requestIp } from "@/lib/security";
import type { DeliverableStatus } from "@/lib/types";

export default async function ReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ publicId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { publicId } = await params;
  const query = await searchParams;
  const review = await getPublicReview(publicId);

  if (!review) {
    notFound();
  }

  const headersList = await headers();
  await recordReviewView(
    review.deliverable,
    requestIp(headersList),
    requestBrowser(headersList),
  );

  const isApproved = review.deliverable.status === "APPROVED";
  const approved = query.approved === "1";
  const changes = query.changes === "1";
  const commented = query.commented === "1";

  return (
    <main className="min-h-screen bg-[#f7f7f8] pb-28 text-zinc-950 lg:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <header className="rounded-[28px] border border-zinc-200/80 bg-white/90 p-5 shadow-[0_20px_60px_rgba(24,24,27,0.08)] backdrop-blur sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-zinc-500">
                {review.deliverable.clientName}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                {review.deliverable.title}
              </h1>
            </div>
            <StatusBadge status={review.deliverable.status} />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
            <span className="rounded-full bg-zinc-100 px-3 py-1.5 font-medium">
              Version {review.deliverable.version}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1.5 font-medium">
              No login required
            </span>
          </div>
          {review.deliverable.description ? (
            <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-600">
              {review.deliverable.description}
            </p>
          ) : null}
        </header>

        {approved ? <Banner tone="success" title="Approved successfully" /> : null}
        {changes ? <Banner tone="warning" title="Changes requested" /> : null}
        {commented ? <Banner tone="neutral" title="Comment added" /> : null}

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
          <div className="space-y-6">
            <DeliverablePreview deliverable={review.deliverable} />
            <CommentPanel
              publicId={review.deliverable.publicId}
              nonce={review.actionNonce}
              clientName={review.deliverable.clientName}
              comments={review.comments}
            />
            <VersionPanel versions={review.versions} />
            <section>
              <div className="mb-4">
                <p className="text-sm font-semibold text-zinc-500">Audit trail</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-950">
                  Approval history
                </h2>
              </div>
              <Timeline events={review.events} comments={review.comments} />
            </section>
          </div>

          <aside className="hidden space-y-4 lg:sticky lg:top-8 lg:block">
            <DecisionCard
              publicId={review.deliverable.publicId}
              nonce={review.actionNonce}
              isApproved={isApproved}
            />
            <ChangeRequestForm
              id="changes-panel"
              publicId={review.deliverable.publicId}
              nonce={review.actionNonce}
              clientName={review.deliverable.clientName}
              isApproved={isApproved}
              compact
            />
          </aside>
        </section>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-6 lg:hidden">
        <ChangeRequestForm
          id="changes-panel-mobile"
          publicId={review.deliverable.publicId}
          nonce={review.actionNonce}
          clientName={review.deliverable.clientName}
          isApproved={isApproved}
        />
      </div>

      <MobileActionBar
        publicId={review.deliverable.publicId}
        nonce={review.actionNonce}
        isApproved={isApproved}
      />
    </main>
  );
}

function DecisionCard({
  publicId,
  nonce,
  isApproved,
}: {
  publicId: string;
  nonce: string;
  isApproved: boolean;
}) {
  return (
    <div className="rounded-[28px] border border-zinc-200/80 bg-white p-5 shadow-[0_20px_60px_rgba(24,24,27,0.08)]">
      <p className="text-sm font-semibold text-zinc-500">Decision</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">
        Ready to sign off?
      </h2>
      <form action={approveDeliverableAction} className="mt-5">
        <input type="hidden" name="publicId" defaultValue={publicId} />
        <input type="hidden" name="nonce" defaultValue={nonce} />
        <button
          type="submit"
          disabled={isApproved}
          className="min-h-14 w-full rounded-2xl bg-emerald-600 px-5 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:shadow-none"
        >
          {isApproved ? "Already approved" : "Approve"}
        </button>
      </form>
      <a
        href="#changes-panel"
        className="mt-3 flex min-h-14 w-full items-center justify-center rounded-2xl border border-rose-200 bg-white px-5 text-base font-semibold text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-50"
      >
        Request changes
      </a>
    </div>
  );
}

function CommentPanel({
  publicId,
  nonce,
  clientName,
  comments,
}: {
  publicId: string;
  nonce: string;
  clientName: string;
  comments: Array<{ id: string; authorName: string; message: string; createdAt: string }>;
}) {
  return (
    <form
      id="comments"
      action={addCommentAction}
      className="rounded-[28px] border border-zinc-200/80 bg-white p-5 shadow-[0_16px_48px_rgba(24,24,27,0.06)] sm:p-6"
    >
      <div>
        <p className="text-sm font-semibold text-zinc-500">Feedback</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-950">
          Comments
        </h2>
      </div>
      <input type="hidden" name="publicId" defaultValue={publicId} />
      <input type="hidden" name="nonce" defaultValue={nonce} />
      <input type="hidden" name="authorName" defaultValue={clientName || "Client"} />
      <input
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <label className="mt-5 block">
        <span className="text-sm font-semibold text-zinc-800">Comment</span>
        <textarea
          required
          name="message"
          rows={4}
          placeholder="Add a note for the agency"
          className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base leading-7 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
        />
      </label>
      <button
        type="submit"
        className="mt-4 min-h-12 w-full rounded-2xl bg-zinc-950 px-5 text-base font-semibold text-white shadow-lg shadow-zinc-950/15 transition hover:-translate-y-0.5 hover:bg-zinc-800"
      >
        Add comment
      </button>

      <div className="mt-6 space-y-3">
        {comments.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500">
            No comments yet.
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-sm font-semibold text-zinc-950">
                {comment.authorName}
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-700">
                {comment.message}
              </p>
              <p className="mt-3 text-xs text-zinc-500">
                {formatDateTime(comment.createdAt)}
              </p>
            </div>
          ))
        )}
      </div>
    </form>
  );
}

function VersionPanel({
  versions,
}: {
  versions: Array<{
    id: string;
    publicId: string;
    version: number;
    status: DeliverableStatus;
  }>;
}) {
  return (
    <details className="group rounded-[28px] border border-zinc-200/80 bg-white p-5 shadow-[0_16px_48px_rgba(24,24,27,0.06)] sm:p-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-zinc-500">History</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-950">
            Versions
          </h2>
        </div>
        <span className="grid size-8 place-items-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-600 transition group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="mt-5 space-y-2">
        {versions.map((version) => (
          <Link
            key={version.id}
            href={`/r/${version.publicId}`}
            className="flex min-h-14 items-center justify-between rounded-2xl border border-zinc-200 px-4 text-sm font-medium transition hover:bg-zinc-50"
          >
            <span>Version {version.version}</span>
            <StatusBadge status={version.status} />
          </Link>
        ))}
      </div>
    </details>
  );
}

function ChangeRequestForm({
  id,
  publicId,
  nonce,
  clientName,
  isApproved,
  compact = false,
}: {
  id: string;
  publicId: string;
  nonce: string;
  clientName: string;
  isApproved: boolean;
  compact?: boolean;
}) {
  return (
    <form
      id={id}
      action={requestChangesAction}
      className="rounded-[28px] border border-zinc-200/80 bg-white p-5 shadow-[0_16px_48px_rgba(24,24,27,0.06)]"
    >
      <h2
        className={
          compact
            ? "text-base font-semibold text-zinc-950"
            : "text-xl font-semibold tracking-tight text-zinc-950"
        }
      >
        Request changes
      </h2>
      <input type="hidden" name="publicId" defaultValue={publicId} />
      <input type="hidden" name="nonce" defaultValue={nonce} />
      <input type="hidden" name="authorName" defaultValue={clientName || "Client"} />
      <label className="mt-5 block">
        <span className="text-sm font-semibold text-zinc-800">Feedback</span>
        <textarea
          required
          name="message"
          rows={4}
          disabled={isApproved}
          placeholder="What needs to change?"
          className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base leading-7 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 disabled:bg-zinc-50 lg:text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={isApproved}
        className="mt-4 min-h-12 w-full rounded-2xl border border-rose-200 bg-white px-5 text-base font-semibold text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-50 disabled:translate-y-0 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-400 lg:text-sm"
      >
        Send change request
      </button>
    </form>
  );
}

function MobileActionBar({
  publicId,
  nonce,
  isApproved,
}: {
  publicId: string;
  nonce: string;
  isApproved: boolean;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200/80 bg-white/90 p-3 shadow-[0_-20px_50px_rgba(24,24,27,0.12)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
        <a
          href="#changes-panel-mobile"
          className="flex min-h-[52px] items-center justify-center rounded-2xl border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-700 shadow-sm"
        >
          Request changes
        </a>
        <form action={approveDeliverableAction}>
          <input type="hidden" name="publicId" defaultValue={publicId} />
          <input type="hidden" name="nonce" defaultValue={nonce} />
          <button
            type="submit"
            disabled={isApproved}
            className="min-h-[52px] w-full rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:shadow-none"
          >
            {isApproved ? "Approved" : "Approve"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Banner({
  title,
  tone,
}: {
  title: string;
  tone: "success" | "warning" | "neutral";
}) {
  const className =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-zinc-200 bg-white text-zinc-700";

  return (
    <div
      className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm ${className}`}
    >
      {title}
    </div>
  );
}
