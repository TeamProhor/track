import { db } from "@/lib/db/client";
import { monitors, changes } from "@/lib/db/schema";
import { count } from "drizzle-orm";
import { getUser } from "@/lib/auth/user";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPage() {
  const user = await getUser();
  if (!user || user.role !== "admin") redirect("/dashboard");

  const [totalMonitors, totalChanges] = await Promise.all([
    db.select({ count: count() }).from(monitors),
    db.select({ count: count() }).from(changes)
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">এডমিন ওভারভিউ</h1>
        <p className="text-muted-foreground mt-1">সিস্টেম মেট্রিক্স এবং স্থিতি।</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">সর্বমোট মনিটর</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{totalMonitors[0].count}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">শনাক্তকৃত সর্বমোট পরিবর্তন</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalChanges[0].count}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
