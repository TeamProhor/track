import { db } from "@/lib/db/client";
import { monitors, changes } from "@/lib/db/schema";
import { getUser } from "@/lib/auth/user";
import { eq, count } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/sign-in");

  const [userMonitorsCount, userChangesCount] = await Promise.all([
    db.select({ count: count() }).from(monitors).where(eq(monitors.ownerId, user.id)),
    db.select({ count: count() }).from(changes)
  ]);

  const userMonitors = await db.query.monitors.findMany({
    where: eq(monitors.ownerId, user.id),
    limit: 5,
    orderBy: (monitors, { desc }) => [desc(monitors.createdAt)],
  });

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">ড্যাশবোর্ড</h1>
          <p className="text-muted-foreground text-sm mt-1">স্বাগতম, {user.email}</p>
        </div>
        <Link href="/dashboard/monitors/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">+ নতুন মনিটর</Button>
        </Link>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">আপনার সক্রিয় মনিটরসমূহ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{userMonitorsCount[0]?.count || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট ট্র্যাককৃত পরিবর্তন</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{userChangesCount[0]?.count || 0}</div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">অ্যাকাউন্ট রোল</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold capitalize">{user.role === 'admin' ? 'এডমিন' : 'ব্যবহারকারী'}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight">সাম্প্রতিক মনিটরসমূহ</h2>
          <Link href="/dashboard/monitors" className="text-sm font-medium text-primary hover:underline">
            সবগুলো দেখুন
          </Link>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          {userMonitors.length === 0 ? (
            <div className="p-6 sm:p-8 text-center text-muted-foreground text-sm">
              আপনি এখনো কোনো মনিটর তৈরি করেননি।{" "}
              <Link href="/dashboard/monitors/new" className="text-primary underline">
                আপনার প্রথম মনিটর তৈরি করুন
              </Link>
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
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
                      {m.status === 'active' ? 'সক্রিয়' : m.status}
                    </span>
                    <Link href={`/dashboard/monitors/${m.id}`}>
                      <Button variant="outline" size="sm">বিস্তারিত</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
