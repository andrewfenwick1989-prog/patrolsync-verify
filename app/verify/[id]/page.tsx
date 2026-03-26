import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from("report_verifications")
    .select("*")
    .eq("verification_id", id)
    .maybeSingle();

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-12">
          <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-sm">
            <div className="mb-6 flex justify-center">
              <Image
                src="/patrolsync-logo.png"
                alt="PatrolSync"
                width={64}
                height={64}
              />
            </div>

            <div className="mb-4 text-red-300 text-xs uppercase tracking-widest">
              Verification failed
            </div>

            <h1 className="text-3xl font-bold">Report not found</h1>

            <p className="mt-4 text-sm text-slate-400">
              This verification ID does not match any PatrolSync record.
            </p>

            <p className="mt-8 text-xs text-slate-500 uppercase tracking-widest">
              Powered by FenCore Cloud
            </p>
          </div>
        </div>
      </main>
    );
  }

  const generatedDate = new Date(data.generated_at);
  const isActivity = data.report_type === "activity" || data.report_type === "Activity Report";
  const isCompliance = data.report_type === "compliance" || data.report_type === "Staff Compliance Report";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Image src="/patrolsync-logo.png" alt="PatrolSync" width={48} height={48} />
              <div>
                <p className="text-green-400 text-xs uppercase tracking-widest">
                  Verified by PatrolSync
                </p>
                <h1 className="text-3xl font-bold">Report Verified</h1>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase">Verification ID</p>
              <p className="font-mono text-sm">{data.verification_id}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.35fr_.85fr]">
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-lg">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Verified report details</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Document record</h2>
                </div>
                <div className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300 sm:inline-flex">
                  Authentic
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Organisation</p>
                  <p className="mt-2 text-base font-semibold text-white">{data.org_name}</p>
                </div>

                <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Report type</p>
                  <p className="mt-2 text-base font-semibold text-white">{data.report_type}</p>
                </div>

                <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-4 sm:col-span-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Reporting period</p>
                  <p className="mt-2 text-base font-semibold text-white">{data.report_from} → {data.report_to}</p>
                </div>

                <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-4 sm:col-span-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Generated</p>
                  <p className="mt-2 text-base font-semibold text-white">
                    {generatedDate.toLocaleDateString("en-GB")} {generatedDate.toLocaleTimeString("en-GB")}
                  </p>
                </div>
              </div>

              {isActivity ? (
                <div className="mt-6 rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.04] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/80">Activity verification</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Site</p>
                      <p className="mt-2 text-base font-semibold text-white">{data.site_name || "—"}</p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Total scans</p>
                      <p className="mt-2 text-base font-semibold text-white">{data.total_scans ?? data.row_count ?? "—"}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              {isCompliance ? (
                <div className="mt-6 rounded-3xl border border-amber-400/10 bg-amber-400/[0.04] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300/80">Compliance verification</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Records</p>
                      <p className="mt-2 text-base font-semibold text-white">{data.row_count ?? "—"}</p>
                    </div>
                  </div>

                  {data.meta?.summary ? (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Total guards</p>
                        <p className="mt-2 text-base font-semibold text-white">{data.meta.summary.total_guards ?? "—"}</p>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Licence records</p>
                        <p className="mt-2 text-base font-semibold text-white">{data.meta.summary.licence_records_recorded ?? "—"}</p>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Right to work records</p>
                        <p className="mt-2 text-base font-semibold text-white">{data.meta.summary.right_to_work_records_recorded ?? "—"}</p>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Licence review soon</p>
                        <p className="mt-2 text-base font-semibold text-white">{data.meta.summary.licence_review_soon ?? "—"}</p>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-4 sm:col-span-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Right to work review soon</p>
                        <p className="mt-2 text-base font-semibold text-white">{data.meta.summary.right_to_work_review_soon ?? "—"}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </section>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-emerald-400/10 bg-emerald-400/[0.04] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300/80">Verification status</p>
                <h3 className="mt-3 text-xl font-semibold text-white">Authenticity confirmed</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  PatrolSync has confirmed this report against a stored verification record. The visible report details match the original generated document record.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Why this matters</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                  <li>• Confirms the document was generated by PatrolSync.</li>
                  <li>• Supports independent validation by clients, auditors, and compliance reviewers.</li>
                  <li>• Helps demonstrate document integrity without exposing operational data.</li>
                </ul>
              </div>
            </aside>
          </div>

        </div>
      </div>
    </main>
  );
}
