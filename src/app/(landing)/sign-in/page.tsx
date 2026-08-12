import { signIn } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">প্রহর ট্র্যাকে সাইন ইন করুন</h1>
          <p className="text-muted-foreground mt-2 text-sm">আপনার ড্যাশবোর্ডে প্রবেশ করতে নিচে তথ্য দিন।</p>
        </div>
        <form action={signIn as any} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">ইমেইল ঠিকানা</label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">পাসওয়ার্ড</label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">সাইন ইন করুন</Button>
        </form>
        <div className="text-center text-sm">
          অ্যাকাউন্ট নেই? <Link href="/sign-up" className="underline">সাইন আপ করুন</Link>
        </div>
      </div>
    </div>
  );
}
