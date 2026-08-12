import { getUser } from "@/lib/auth/user";
import { redirect } from "next/navigation";
import { updateTelegramChatId } from "@/lib/actions/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const user = await getUser();
  if (!user) redirect("/sign-in");

  const params = await searchParams;
  const isSaved = params.saved === "true";

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">সেটিংস (Settings)</h1>
        <p className="text-muted-foreground mt-1">
          আপনার নোটিফিকেশন অগ্রাধিকার এবং প্রোফাইল তথ্য পরিচালনা করুন।
        </p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
          ✓ টেলিগ্রাম চ্যাট আইডি সফলভাবে সংরক্ষিত হয়েছে! (Successfully Saved)
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>টেলিগ্রাম নোটিফিকেশন (Telegram DM Notifications)</CardTitle>
          <CardDescription>
            আপনার ওয়েবসাইটে পরিবর্তন শনাক্ত হলে টেলিগ্রামে সরাসরি নোটিফিকেশন পেতে আপনার Telegram Chat ID / User ID যুক্ত করুন।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateTelegramChatId as any} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telegramChatId">
                টেলিগ্রাম চ্যাট আইডি (Telegram Chat ID)
              </Label>
              <Input
                id="telegramChatId"
                name="telegramChatId"
                placeholder="যেমন: 123456789"
                defaultValue={user.telegramChatId || ""}
              />
              <p className="text-xs text-muted-foreground">
                আপনার Chat ID জানতে টেলিগ্রামে <strong>@userinfobot</strong> বা <strong>@raw_data_bot</strong>-এ মেসেজ দিন।
              </p>
            </div>

            <Button type="submit">সংরক্ষণ করুন (Save Settings)</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
