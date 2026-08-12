import { signUp } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">অ্যাকাউন্ট তৈরি করুন</h1>
          <p className="text-muted-foreground mt-2 text-sm">আজই প্রহর ট্র্যাকিং শুরু করুন।</p>
        </div>
        <form action={signUp as any} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">ইমেইল ঠিকানা</label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">পাসওয়ার্ড</label>
            <Input id="password" name="password" type="password" minLength={8} required />
          </div>
          <Button type="submit" className="w-full">সাইন আপ করুন</Button>
        </form>
        <div className="text-center text-sm">
          ইতিমধ্যে অ্যাকাউন্ট আছে? <Link href="/sign-in" className="underline">সাইন ইন করুন</Link>
        </div>
      </div>
    </div>
  );
}
