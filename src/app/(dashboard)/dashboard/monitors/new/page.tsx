import { createMonitor } from "@/lib/actions/monitors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScheduleSelect } from "@/components/monitors/schedule-select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function NewMonitorPage() {
  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">নতুন মনিটর তৈরি করুন</h1>
        <p className="text-muted-foreground mt-1">ট্র্যাক করার জন্য একটি নতুন ওয়েবসাইট যুক্ত করুন।</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>মনিটর কনফিগারেশন</CardTitle>
          <CardDescription>
            ওয়েবসাইটের ঠিকানা ও চেকিং সময়সূচি কনফিগার করুন।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createMonitor} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">মনিটরের নাম</Label>
              <Input
                id="name"
                name="name"
                placeholder="যেমন: আকমি কর্পোরেশন প্রাইসিং"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">ওয়েবসাইট ইউআরএল (URL)</Label>
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule">চেকিং ব্যবধান (Check Interval)</Label>
              <ScheduleSelect defaultValue="300" />
            </div>

            <Button type="submit" className="w-full sm:w-auto">
              মনিটর তৈরি করুন
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
