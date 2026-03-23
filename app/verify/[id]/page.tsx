import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default async function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data } = await supabase
    .from("report_verifications")
    .select("*")
    .eq("verification_id", id)
    .maybeSingle();

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/patrolsync-logo.png"
              alt="PatrolSync"
              width={60}
              height={60}
            />
          </div>
          <h1 className="text-3xl font-bold">Report not found</h1>
          <p className="text-sm text-slate-300 mt-2">Powered by FenCore</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="max-w-xl p-10 text-center mx-auto">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Image
              src="/patrolsync-logo.png"
              alt="PatrolSync"
              width={60}
              height={60}
            />
          </div>
          <h1 className="text-3xl font-bold">Report Verified</h1>
          <p className="text-sm text-slate-300 mt-2">Powered by FenCore</p>
        </div>

        <div className="text-left inline-block mt-4">
          <p><strong>Organisation:</strong> {data.org_name}</p>
          <p><strong>Site:</strong> {data.site_name}</p>
          <p><strong>Report type:</strong> {data.report_type}</p>
          <p><strong>Period:</strong> {data.report_from} → {data.report_to}</p>
          <p><strong>Generated:</strong> {new Date(data.generated_at).toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })} at {new Date(data.generated_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
          <p><strong>Total scans:</strong> {data.total_scans}</p>
        </div>
      </div>
    </main>
  );
}
