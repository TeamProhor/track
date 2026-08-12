import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth/user";

export default async function LandingPage() {
  const user = await getUser();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 flex items-center justify-between border-b">
        <div className="font-bold text-xl tracking-tight">প্রহর ট্র্যাক</div>
        <nav className="flex items-center gap-4">
          <Link href="#features" className="text-sm font-medium hover:underline">ফিচারসমূহ</Link>
          <Link href="#pricing" className="text-sm font-medium hover:underline">মূল্য নির্ধারণ</Link>
          {user ? (
            <Link href="/dashboard"><Button>ড্যাশবোর্ড</Button></Link>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm font-medium hover:underline">সাইন ইন</Link>
              <Link href="/sign-up"><Button>শুরু করুন</Button></Link>
            </>
          )}
        </nav>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl text-balance leading-tight">
          ওয়েবসাইট পর্যবেক্ষণ করুন নির্ভরযোগ্যতা এবং নির্ভুলতার সাথে।
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
          উন্নত ডোম নিষ্কাশন, বুদ্ধিমত্তা সম্পন্ন ডিফিং এবং অটোমেশনের সাহায্যে আপনার পছন্দের ওয়েবসাইটের গুরুত্বপূর্ণ পরিবর্তনসমূহ পর্যবেক্ষণ করুন।
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          {user ? (
            <Link href="/dashboard"><Button size="lg">ড্যাশবোর্ডে যান</Button></Link>
          ) : (
            <Link href="/sign-up"><Button size="lg">বিনামূল্যে ট্র্যাকিং শুরু করুন</Button></Link>
          )}
          <Link href="#features"><Button variant="outline" size="lg">ফিচারসমূহ দেখুন</Button></Link>
        </div>
      </main>

      <footer className="border-t py-8 px-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} প্রহর ট্র্যাক। সর্বস্বত্ব সংরক্ষিত।
      </footer>
    </div>
  );
}
