import type { Deliverable } from "@/lib/types";

export function DeliverablePreview({ deliverable }: { deliverable: Deliverable }) {
  if (deliverable.fileKind === "IMAGE") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={deliverable.fileUrl}
        alt={deliverable.title}
        className="h-auto max-h-[74vh] w-full rounded-[28px] border border-zinc-200/80 bg-white object-contain shadow-[0_24px_70px_rgba(24,24,27,0.10)]"
      />
    );
  }

  if (deliverable.fileKind === "PDF") {
    return (
      <iframe
        title={deliverable.title}
        src={deliverable.fileUrl}
        className="h-[72vh] w-full rounded-[28px] border border-zinc-200/80 bg-white shadow-[0_24px_70px_rgba(24,24,27,0.10)]"
      />
    );
  }

  if (deliverable.fileKind === "VIDEO") {
    return (
      <video
        src={deliverable.fileUrl}
        controls
        playsInline
        className="w-full rounded-[28px] border border-zinc-200/80 bg-black shadow-[0_24px_70px_rgba(24,24,27,0.10)]"
      />
    );
  }

  return (
    <div className="rounded-[28px] border border-zinc-200/80 bg-white p-6 shadow-[0_24px_70px_rgba(24,24,27,0.10)]">
      <p className="text-base font-semibold text-zinc-950">External review asset</p>
      <a
        href={deliverable.fileUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex min-h-12 items-center rounded-2xl bg-zinc-950 px-5 text-sm font-semibold text-white shadow-lg shadow-zinc-950/15 transition hover:-translate-y-0.5"
      >
        Open deliverable
      </a>
    </div>
  );
}
