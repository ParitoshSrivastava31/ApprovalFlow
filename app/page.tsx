import Link from "next/link";

const painPoints = [
  "Feedback split across chat threads, emails, screenshots, and calls.",
  "Clients approve one version, then reference another one later.",
  "Teams waste hours proving who said yes and when.",
];

const steps = [
  {
    title: "Upload the work",
    copy: "Add an image, PDF, video, or external link. Every version stays separate.",
  },
  {
    title: "Share one review link",
    copy: "Send it anywhere your client already talks to you, including WhatsApp.",
  },
  {
    title: "Capture the decision",
    copy: "Comments, changes, approvals, views, and timestamps land in one audit trail.",
  },
];

const benefits = [
  "One source of truth for each deliverable",
  "No client account required",
  "Version history that never overwrites feedback",
  "Approval records with timestamps and device context",
  "Mobile review flow built for WhatsApp links",
  "Clean handoff between agency and client",
];

const testimonials = [
  {
    quote:
      "We stopped digging through client chats before publishing. Every approval now has a link and a timestamp.",
    name: "Agency founder",
    company: "Social media studio",
  },
  {
    quote:
      "The review page feels obvious to clients. They approve or ask for changes without a call.",
    name: "Freelance designer",
    company: "Brand and web",
  },
  {
    quote:
      "Version history is the quiet killer feature. Nobody argues about which file was approved.",
    name: "Video lead",
    company: "Creative production team",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <Hero />
      <Problem />
      <HowItWorks />
      <Benefits />
      <Screenshots />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-zinc-200 bg-[#f7f7f8]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_25%,rgba(255,255,255,0.95),rgba(247,247,248,0.76)_42%,rgba(236,236,238,0.92)_100%)]" />
      <Nav />
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8 lg:pb-16 lg:pt-32">
        {/* Two-column grid: left = text + before/after, right = client review card */}
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1fr]">
          {/* Left column — text + CTA */}
          <div className="flex flex-col">
            <p className="text-sm font-semibold uppercase text-zinc-500">
              Client approvals for creative work
            </p>
            <h1 className="mt-5 max-w-[540px] text-5xl font-semibold tracking-tight text-zinc-950 sm:text-7xl lg:text-[5.25rem] lg:leading-[1.05]">
              Stop chasing approvals in WhatsApp.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-zinc-600 sm:text-xl">
              ApprovalFlow gives every deliverable one review link, one decision,
              and one permanent history of comments, changes, and sign-offs.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-zinc-950 px-6 text-sm font-semibold text-white shadow-xl shadow-zinc-950/15 transition hover:-translate-y-0.5"
              >
                Open dashboard
              </Link>
              <Link
                href="/r/rvw_demo_review"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-zinc-300 bg-white/80 px-6 text-sm font-semibold text-zinc-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5"
              >
                View client review page
              </Link>
            </div>
          </div>

          {/* Right column — Client review card + Before/After below */}
          <div className="flex flex-col gap-6 justify-self-end">
            {/* Client review card */}
            <div className="w-full max-w-[34rem] rounded-[32px] border border-zinc-200 bg-white p-3 shadow-2xl shadow-zinc-950/15">
              <div className="overflow-hidden rounded-[24px] border border-zinc-200 bg-zinc-50">
                <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold text-zinc-500">Client review</p>
                    <p className="text-sm font-semibold text-zinc-950">Launch carousel creative</p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold uppercase text-amber-800">
                    Pending
                  </span>
                </div>
                <div className="grid gap-3 p-4 md:grid-cols-[1fr_11rem]">
                  <div className="h-48 rounded-3xl bg-[linear-gradient(135deg,#18181b,#52525b_45%,#f4f4f5)] shadow-inner" />
                  <div className="space-y-3">
                    <div className="rounded-3xl bg-emerald-600 px-4 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-emerald-600/20">
                      Approve
                    </div>
                    <div className="rounded-3xl border border-rose-200 bg-white px-4 py-4 text-center text-sm font-semibold text-rose-700">
                      Request changes
                    </div>
                    <div className="rounded-3xl bg-white p-3 text-xs text-zinc-500">
                      Comments, versions, and approval history stay attached.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Before + After cards row, below client review */}
            <div className="-ml-10 hidden items-start gap-6 sm:flex">
              {/* Before card — tilted -6deg */}
              <div className="w-72 shrink-0 rotate-[-6deg] rounded-[24px] border border-zinc-200 bg-white/85 p-3 shadow-2xl shadow-zinc-950/10 backdrop-blur">
                <p className="text-[10px] font-semibold uppercase text-zinc-400">Before</p>
                <div className="mt-2 space-y-1.5">
                  <ChatBubble label="WhatsApp" text="Approved? Can you use the earlier logo?" />
                  <ChatBubble label="Email" text="Sharing final_v7_actual_final.pdf" />
                  <ChatBubble label="Voice note" text="Can you check the 0:14 mark?" />
                </div>
              </div>

              {/* After card — tilted 3deg */}
              <div className="w-56 shrink-0 rotate-3 rounded-[28px] border border-zinc-200 bg-white/90 p-4 shadow-2xl shadow-zinc-950/10 backdrop-blur">
                <p className="text-xs font-semibold uppercase text-zinc-400">After</p>
                <div className="mt-3 rounded-2xl bg-zinc-950 p-4 text-white">
                  <p className="text-sm font-semibold">Approved successfully</p>
                  <p className="mt-2 text-xs leading-5 text-zinc-300">
                    IP, browser, version, and timestamp saved to the timeline.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-2xl bg-zinc-950 text-sm font-semibold text-white shadow-lg shadow-zinc-950/15">
            A
          </span>
          <span className="font-semibold tracking-tight">ApprovalFlow</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 md:flex">
          <a href="#how">How it works</a>
          <a href="#benefits">Benefits</a>
          <a href="#screenshots">Screenshots</a>
        </nav>
        <Link
          href="/dashboard"
          className="rounded-full border border-zinc-300 bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm backdrop-blur"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
}

function ChatBubble({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-2.5 py-1.5">
      <p className="text-[9px] font-semibold uppercase text-zinc-400">{label}</p>
      <p className="mt-0.5 whitespace-nowrap text-xs leading-4 text-zinc-700">{text}</p>
    </div>
  );
}

function Problem() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase text-zinc-500">The problem</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            Approval should not depend on scrolling through a chat.
          </h2>
        </div>
        <div className="grid gap-4">
          {painPoints.map((point) => (
            <div
              key={point}
              className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_16px_48px_rgba(24,24,27,0.05)]"
            >
              <p className="text-lg leading-8 text-zinc-700">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="border-y border-zinc-200 bg-zinc-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="How it works"
          title="Upload work. Share the link. Save the decision."
          copy="The whole product is built around the approval moment, not project management overhead."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_16px_48px_rgba(24,24,27,0.05)]"
            >
              <span className="grid size-10 place-items-center rounded-2xl bg-zinc-950 text-sm font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-zinc-950">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{step.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section id="benefits" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Benefits"
          title="Built for agencies that need a yes, a no, or clear feedback."
          copy="ApprovalFlow keeps the client experience short and the agency record complete."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-[0_12px_36px_rgba(24,24,27,0.04)]"
            >
              <p className="text-base font-semibold leading-7 text-zinc-900">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Screenshots() {
  return (
    <section id="screenshots" className="border-y border-zinc-200 bg-[#fafafa] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Product screenshots"
          title="A focused approval layer, not another agency suite."
          copy="The agency sees status and history. The client sees the work and two clear actions."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <AgencyScreenshot />
          <ClientScreenshot />
        </div>
      </div>
    </section>
  );
}

function AgencyScreenshot() {
  return (
    <div className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-2xl shadow-zinc-950/10">
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase text-zinc-400">Agency dashboard</p>
          <p className="mt-1 text-lg font-semibold tracking-tight text-zinc-950">
            Pending approvals
          </p>
        </div>
        <span className="rounded-full bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white">
          Create review link
        </span>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-3">
        <Metric label="Pending" value="12" />
        <Metric label="Approved" value="38" />
        <Metric label="Changes" value="4" />
      </div>
      <div className="divide-y divide-zinc-100 px-5 pb-5">
        {["Launch carousel creative", "Homepage concept", "Investor deck PDF"].map(
          (item, index) => (
            <div key={item} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="font-semibold text-zinc-950">{item}</p>
                <p className="mt-1 text-sm text-zinc-500">Version {index + 1} / Aurora Kitchen</p>
              </div>
              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold uppercase text-amber-800">
                Pending
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function ClientScreenshot() {
  return (
    <div className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white p-4 shadow-2xl shadow-zinc-950/10">
      <div className="rounded-[26px] bg-zinc-50 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-zinc-500">Aurora Kitchen</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">
              Launch carousel creative
            </p>
          </div>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold uppercase text-amber-800">
            Pending
          </span>
        </div>
        <div className="mt-5 h-52 rounded-[26px] bg-[linear-gradient(135deg,#18181b,#71717a_55%,#f4f4f5)]" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-rose-200 bg-white py-4 text-center text-sm font-semibold text-rose-700">
            Request changes
          </div>
          <div className="rounded-2xl bg-emerald-600 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-emerald-600/20">
            Approve
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <p className="text-xs font-semibold uppercase text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">{value}</p>
    </div>
  );
}

function Testimonials() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Testimonials"
          title="Made for the messy last mile of client work."
          copy="Placeholder quotes for the teams ApprovalFlow is designed to serve."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_16px_48px_rgba(24,24,27,0.05)]"
            >
              <blockquote className="text-base leading-7 text-zinc-700">
                {testimonial.quote}
              </blockquote>
              <figcaption className="mt-6">
                <p className="font-semibold text-zinc-950">{testimonial.name}</p>
                <p className="mt-1 text-sm text-zinc-500">{testimonial.company}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[36px] bg-zinc-950 p-8 text-white shadow-2xl shadow-zinc-950/20 sm:p-12 lg:p-16">
        <p className="text-sm font-semibold uppercase text-zinc-400">Start with one link</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          Give your next deliverable a clean approval trail.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
          Upload the work, share the review link, and keep the decision attached to the exact version.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-white px-6 text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5"
          >
            Open ApprovalFlow
          </Link>
          <Link
            href="/r/rvw_demo_review"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/20 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            Preview review link
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-zinc-950">ApprovalFlow</p>
        <p>Upload work. Share the review link. Capture the approval.</p>
      </div>
    </footer>
  );
}

function SectionHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase text-zinc-500">{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-lg leading-8 text-zinc-600">{copy}</p>
    </div>
  );
}
