import { db } from "@/lib/db/client";
import { monitors } from "@/lib/db/schema";
import { getUser } from "@/lib/auth/user";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatScheduleBangla } from "@/lib/utils/schedule";

export default async function MonitorsPage() {
  const user = await getUser();
  if (!user) redirect("/sign-in");

  const userMonitors = await db.query.monitors.findMany({
    where: eq(monitors.ownerId, user.id),
    orderBy: (monitors, { desc }) => [desc(monitors.createdAt)],
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">মনিটরসমূহ</h1>
        <Link href="/dashboard/monitors/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">নতুন মনিটর তৈরি করুন</Button>
        </Link>
      </div>
      <div className="rounded-xl border bg-card shadow-sm">
        {userMonitors.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            কোনো মনিটর পাওয়া যায়নি। শুরু করতে একটি মনিটর যোগ করুন।
          </div>
        ) : (
          <div className="divide-y">
            {userMonitors.map((m) => (
              <div key={m.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 hover:bg-muted/50">
                <div className="min-w-0 flex-1">
                  <Link href={`/dashboard/monitors/${m.id}`} className="font-semibold hover:underline block truncate">
                    {m.name}
                  </Link>
                  <div className="text-xs sm:text-sm text-muted-foreground truncate">{m.url}</div>
                </div>
                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 shrink-0">
                  <span className="text-[11px] sm:text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    ⏱️ {formatScheduleBangla(m.schedule)}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
                    {m.status === 'active' ? 'সক্রিয়' : m.status}
                  </span>
                  <Link href={`/dashboard/monitors/${m.id}`}>
                    <Button variant="outline" size="sm">বিস্তারিত</Button>
                  </Link>
                  <Link href={`/dashboard/monitors/${m.id}/edit`}>
                    <Button variant="secondary" size="sm">সম্পাদনা</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
