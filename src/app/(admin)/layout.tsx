export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full">
      <div className="w-64 border-r bg-muted p-4 hidden md:block">
        <h2 className="font-semibold text-lg mb-4 text-destructive">
          Prohor Admin
        </h2>
        <nav className="flex flex-col gap-2">{/* Admin Nav */}</nav>
      </div>
      <main className="flex-1 p-6 flex flex-col">{children}</main>
    </div>
  );
}
