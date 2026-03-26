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
  const isActivity = data.report_type === "activity";
  const isCompliance = data.report_type === "compliance";

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

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <p className="text-slate-400">Organisation</p>
              <p className="font-semibold">{data.org_name}</p>
            </div>

            <div>
              <p className="text-slate-400">Report type</p>
              <p className="font-semibold">{data.report_type}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-slate-400">Reporting period</p>
              <p className="font-semibold">{data.report_from} → {data.report_to}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-slate-400">Generated</p>
              <p className="font-semibold">
                {generatedDate.toLocaleDateString("en-GB")} {generatedDate.toLocaleTimeString("en-GB")}
              </p>
            </div>
          </div>

          {isActivity && (
            <div className="mt-6">
              <p className="text-slate-400 text-xs">Activity verification</p>
              <p className="font-semibold">Site: {data.site_name || "—"}</p>
              <p className="font-semibold">Total scans: {data.total_scans ?? data.row_count ?? "—"}</p>
            </div>
          )}

          {isCompliance && (
            <div className="mt-6">
              <p className="text-slate-400 text-xs">Compliance verification</p>
              <p className="font-semibold">Records: {data.row_count ?? "—"}</p>
            </div>
          )}

          <div className="mt-8 border-t border-white/10 pt-6 text-xs text-slate-500">
            This document has been verified against PatrolSync records and is confirmed authentic.
          </div>

        </div>
      </div>
    </main>
  );
}
