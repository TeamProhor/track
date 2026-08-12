"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  TaskSquare,
  DocumentDownload,
  SecurityCard,
  ShieldCheck,
  Logout,
  ArrowLeft2,
  StatusUp,
} from "@/components/icons";
import { signOut } from "@/lib/actions/auth";

interface ShellProps {
  readonly children: React.ReactNode;
}

const navItems = [
  {
    name: "ড্যাশবোর্ড",
    path: "/dashboard",
    icon: Home,
    exact: true,
  },
  {
    name: "মনিটরসমূহ",
    path: "/dashboard/monitors",
    icon: StatusUp,
    exact: false,
  },
  {
    name: "নতুন মনিটর",
    path: "/dashboard/monitors/new",
    icon: DocumentDownload,
    exact: true,
  },
  {
    name: "সেটিংস",
    path: "/dashboard/settings",
    icon: SecurityCard,
    exact: true,
  },
  {
    name: "এডমিন",
    path: "/admin",
    icon: ShieldCheck,
    exact: true,
  },
];

export function Shell({ children }: ShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-[100dvh] w-full bg-muted text-foreground font-sans overflow-hidden relative">
      {/* Mobile Top Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 flex w-full border-b border-border bg-background/80 backdrop-blur-xl px-[20px] py-[12px] shadow-xs justify-between items-center">
        <div className="flex flex-row items-center gap-[10px]">
          <button
            type="button"
            aria-label="Toggle Menu"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-lg hover:bg-muted active:scale-95 transition-all text-foreground"
          >
            {isSidebarOpen ? (
              <svg className="size-6" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ) : (
              <svg className="size-6" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            )}
          </button>
          <Link
            href="/dashboard"
            onClick={() => setIsSidebarOpen(false)}
            className="flex flex-row items-center gap-2"
          >
            <div className="size-7 rounded-[8px] bg-primary text-primary-foreground flex items-center justify-center font-[800] text-[12px]">
              PT
            </div>
            <h3 className="text-[18px] font-[800] text-foreground whitespace-nowrap mt-[1px]">
              প্রহর ট্র্যাক
            </h3>
          </Link>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      <button
        type="button"
        aria-label="Close sidebar"
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-30 transition-opacity duration-300 lg:hidden cursor-default border-none outline-none ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Component */}
      <aside
        className={`fixed lg:static top-[8px] bottom-[8px] left-[8px] right-[8px] lg:inset-auto z-40 lg:z-10 bg-muted lg:bg-transparent rounded-[24px] lg:rounded-none border-[0.5px] border-border lg:border-none p-[16px] lg:p-0 transition-transform duration-500 ease-[cubic-bezier(0.075,0.82,0.165,1)] lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-[110%]"
        } w-full h-full lg:h-[calc(100vh-40px)] lg:m-[20px] shrink-0 flex flex-col pt-0 lg:pt-[16px] justify-between overflow-x-hidden overflow-y-auto no-scrollbar transition-all duration-[300ms] ease-[cubic-bezier(0.83,0,0.17,1)] ${
          isCollapsed ? "lg:w-[48px]" : "lg:w-[192px]"
        }`}
      >
        <div className="flex flex-col gap-[24px]">
          {/* Header & Logo */}
          <div className="flex items-center justify-between w-full">
            <Link
              href="/dashboard"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center px-[8px] py-[4px] rounded-[8px] hover:bg-accent transition-colors overflow-hidden shrink-0"
            >
              <div className="size-6 rounded-[6px] bg-primary text-primary-foreground flex items-center justify-center shrink-0 mr-[12px]">
                <TaskSquare className="size-4" />
              </div>
              <h3
                className={`font-[800] text-[18px] lg:text-[16px] whitespace-nowrap mt-[3px] transition-opacity duration-200 ${
                  isCollapsed ? "opacity-0" : "opacity-100"
                }`}
              >
                প্রহর ট্র্যাক
              </h3>
            </Link>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="flex lg:hidden w-fit p-[4px] rounded-[8px] hover:bg-accent transition-colors h-auto"
            >
              <svg className="size-6 text-foreground" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          {/* Collapse Button (Desktop) */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-start px-[8px] py-[4px] rounded-[8px] hover:bg-accent transition-colors text-muted-foreground overflow-hidden -mt-[8px] h-auto w-full shrink-0"
          >
            <ArrowLeft2
              className={`size-5 shrink-0 mr-[12px] transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
            <span
              className={`text-[14px] whitespace-nowrap transition-opacity duration-200 ${
                isCollapsed ? "opacity-0" : "opacity-100"
              }`}
            >
              সংকুচিত করুন
            </span>
          </button>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-[4px] lg:-mt-[16px]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.path
                : pathname.startsWith(item.path);

              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  title={isCollapsed ? item.name : undefined}
                  className={`relative flex items-center px-[8px] py-[4px] rounded-[8px] transition-colors overflow-hidden shrink-0 ${
                    isActive
                      ? "bg-accent text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-[8px]">
                    <Icon className={`size-6 shrink-0 ${isActive ? "text-foreground" : "text-muted-foreground"}`} />
                    <span
                      className={`text-[14px] whitespace-nowrap transition-opacity duration-200 ${
                        isCollapsed ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sign Out */}
        <div className="flex flex-col gap-[12px] mt-[24px] lg:mt-[32px] px-[8px] items-center lg:items-stretch border-t border-border/50 pt-[16px]">
          <form action={signOut as any}>
            <button
              type="submit"
              className="w-full flex items-center gap-[8px] px-[8px] py-[4px] rounded-[8px] text-destructive hover:bg-destructive/10 transition-colors overflow-hidden whitespace-nowrap"
            >
              <Logout className="size-5 shrink-0" />
              <span
                className={`text-[14px] font-medium transition-opacity duration-200 ${
                  isCollapsed ? "opacity-0" : "opacity-100"
                }`}
              >
                লগ আউট করুন
              </span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-background relative overflow-hidden rounded-[0px] lg:rounded-[24px] border-0 lg:border-[0.5px] lg:border-border mt-0 lg:my-[20px] lg:mr-[20px] pt-[56px] lg:pt-0">
        <div className="w-full h-full overflow-y-auto p-4 md:p-8 lg:p-10">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden absolute bottom-[12px] left-[16px] right-[16px] z-20 flex justify-center pointer-events-none">
        <div className="flex items-center justify-between bg-muted/90 backdrop-blur-xl border-[0.5px] border-border rounded-[24px] p-[6px] shadow-lg pointer-events-auto w-full max-w-[400px]">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.path
              : pathname.startsWith(item.path);

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex flex-1 flex-col items-center justify-center py-[8px] px-[4px] rounded-[16px] transition-all duration-300 ${
                  isActive
                    ? "bg-accent text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                }`}
              >
                <Icon className={`size-6 mb-[4px] ${isActive ? "text-foreground" : "text-muted-foreground"}`} />
                <span className="text-[11px] tracking-tight whitespace-nowrap">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
