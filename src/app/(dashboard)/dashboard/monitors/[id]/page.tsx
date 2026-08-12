import { db } from "@/lib/db/client";
import { monitors, changes, snapshots } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getUser } from "@/lib/auth/user";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { triggerCheck } from "@/lib/actions/monitors";
import { DiffViewer } from "@/components/diff/diff-viewer";
import { formatScheduleBangla } from "@/lib/utils/schedule";

export default async function MonitorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUser();
  if (!user) redirect("/sign-in");

  const resolvedParams = await params;
  const monitorId = resolvedParams.id;

  const monitor = await db.query.monitors.findFirst({
    where: eq(monitors.id, monitorId),
  });

  if (!monitor || monitor.ownerId !== user.id) return notFound();

  const recentChanges = await db.query.changes.findMany({
    where: eq(changes.monitorId, monitor.id),
    orderBy: [desc(changes.detectedAt)],
    limit: 10,
  });

  let latestOldContent = "";
  let latestNewContent = "";

  if (recentChanges.length > 0) {
    const latestChange = recentChanges[0];
    const [prevSnap, newSnap] = await Promise.all([
      latestChange.previousSnapshotId
        ? db.query.snapshots.findFirst({
            where: eq(snapshots.id, latestChange.previousSnapshotId),
          })
        : null,
      latestChange.newSnapshotId
        ? db.query.snapshots.findFirst({
            where: eq(snapshots.id, latestChange.newSnapshotId),
          })
        : null,
    ]);

    latestOldContent = prevSnap?.extractedContent || "";
    latestNewContent = newSnap?.extractedContent || "";
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/dashboard/monitors"
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4"
        >
          ← মনিটর তালিকায় ফিরে যান
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight truncate">
              {monitor.name}
            </h1>
            <a
              href={monitor.url}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:underline text-xs sm:text-sm block truncate mt-1"
            >
              {monitor.url}
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-[11px] sm:text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded">
              ⏱️ {formatScheduleBangla(monitor.schedule)}
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
              {monitor.status === "active" ? "সক্রিয়" : monitor.status}
            </span>
            <form action={triggerCheck as any} className="w-full sm:w-auto">
              <input type="hidden" name="monitorId" value={monitor.id} />
              <Button type="submit" variant="outline" size="sm" className="w-full sm:w-auto">
                ⚡ এখনই চেক করুন
              </Button>
            </form>
            <Link href={`/dashboard/monitors/${monitor.id}/edit`} className="w-full sm:w-auto">
              <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                ✏️ সম্পাদনা (Edit)
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="border rounded-xl p-4 sm:p-6 bg-card lg:col-span-1 shadow-sm">
          <h3 className="font-semibold mb-4 text-base">সাম্প্রতিক পরিবর্তনসমূহ</h3>
          {recentChanges.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              এখনো কোনো পরিবর্তন শনাক্ত হয়নি।
            </p>
          ) : (
            <div className="space-y-3">
              {recentChanges.map((c) => (
                <div key={c.id} className="text-sm border-b pb-2.5 last:border-b-0">
                  <div className="font-medium capitalize">
                    {c.changeType === "modified" ? "পরিবর্তিত" : c.changeType}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {c.detectedAt?.toLocaleString("bn-BD")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border rounded-xl p-4 sm:p-6 bg-card lg:col-span-2 shadow-sm">
          <h3 className="font-semibold mb-4 text-base">সর্বশেষ পরিবর্তনের তুলনা (Diff Viewer)</h3>
          {recentChanges.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              তুলনা দেখার জন্য কোনো পরিবর্তন নেই।
            </p>
          ) : (
            <DiffViewer oldText={latestOldContent} newText={latestNewContent} />
          )}
        </div>
      </div>
    </div>
  );
}
