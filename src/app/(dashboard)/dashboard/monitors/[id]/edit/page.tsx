import { db } from "@/lib/db/client";
import { monitors } from "@/lib/db/schema";
import { getUser } from "@/lib/auth/user";
import { eq } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { updateMonitor, deleteMonitor } from "@/lib/actions/monitors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScheduleSelect } from "@/components/monitors/schedule-select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cronToSeconds } from "@/lib/utils/schedule";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

export default async function EditMonitorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUser();
  if (!user) redirect("/sign-in");

  const { id } = await params;
  const monitor = await db.query.monitors.findFirst({
    where: eq(monitors.id, id),
  });

  if (!monitor || monitor.ownerId !== user.id) {
    notFound();
  }

  const defaultIntervalSeconds = cronToSeconds(monitor.schedule).toString();

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <div>
        <Link
          href={`/dashboard/monitors/${monitor.id}`}
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4"
        >
          ← মনিটর বিস্তারিত তালিকায় ফিরে যান
        </Link>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          মনিটর সম্পাদনা (Edit Monitor)
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {monitor.name} মনিটরের তথ্য হালনাগাদ করুন।
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>মনিটর কনফিগারেশন পরিবর্তন</CardTitle>
          <CardDescription>
            নাম, ওয়েবসাইটের ইউআরএল বা চেকিং ব্যবধান পরিবর্তন করুন।
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={updateMonitor} className="space-y-5">
            <input type="hidden" name="id" value={monitor.id} />

            <div className="space-y-2">
              <Label htmlFor="name">মনিটরের নাম</Label>
              <Input
                id="name"
                name="name"
                defaultValue={monitor.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">ওয়েবসাইট ইউআরএল (URL)</Label>
              <Input
                id="url"
                name="url"
                type="url"
                defaultValue={monitor.url}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule">চেকিং ব্যবধান (Check Interval)</Label>
              <ScheduleSelect defaultValue={defaultIntervalSeconds} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">স্ট্যাটাস (Status)</Label>
              <NativeSelect
                id="status"
                name="status"
                defaultValue={monitor.status}
                className="w-full"
              >
                <NativeSelectOption value="active">সক্রিয় (Active)</NativeSelectOption>
                <NativeSelectOption value="paused">স্থগিত (Paused)</NativeSelectOption>
              </NativeSelect>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button type="submit" className="w-full sm:w-auto">
                পরিবর্তন সংরক্ষণ করুন (Save Changes)
              </Button>
              <Link href={`/dashboard/monitors/${monitor.id}`} className="w-full sm:w-auto">
                <Button type="button" variant="outline" className="w-full sm:w-auto">
                  বাতিল করুন
                </Button>
              </Link>
            </div>
          </form>

          <div className="border-t pt-4">
            <form action={deleteMonitor}>
              <input type="hidden" name="monitorId" value={monitor.id} />
              <Button
                type="submit"
                variant="destructive"
                size="sm"
                className="w-full sm:w-auto"
              >
                🗑️ এই মনিটরটি মুছে ফেলুন (Delete Monitor)
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
