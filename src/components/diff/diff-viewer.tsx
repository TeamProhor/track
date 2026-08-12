import React from "react";
import * as cheerio from "cheerio";
import { diffLines } from "diff";

function stripHtmlToText(htmlOrText: string): string {
  if (!htmlOrText) return "";
  if (/<[a-z][\s\S]*>/i.test(htmlOrText)) {
    const $ = cheerio.load(htmlOrText);
    $("script, style, noscript, iframe, link, meta").remove();
    const text = $("body").length > 0 ? $("body").text() : $.text();
    return text.replace(/\n\s*\n/g, "\n").trim();
  }
  return htmlOrText.trim();
}

export function DiffViewer({ oldText, newText }: { oldText: string; newText: string }) {
  const cleanOld = stripHtmlToText(oldText);
  const cleanNew = stripHtmlToText(newText);

  // Compute line-by-line diff
  const diffParts = diffLines(cleanOld, cleanNew);
  const changesOnly = diffParts.filter(part => part.added || part.removed);

  if (changesOnly.length === 0) {
    return (
      <div className="p-6 border rounded-md text-center text-muted-foreground text-sm bg-muted/20">
        কোনো দৃশ্যমান পরিবর্তন পাওয়া যায়নি (No visible text changes).
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden bg-card font-mono text-xs shadow-sm">
      <div className="bg-muted px-3 py-2 sm:px-4 sm:py-2 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 font-sans text-xs text-muted-foreground">
        <span>শুধুমাত্র পরিবর্তনসমূহ (Changes Only)</span>
        <div className="flex flex-wrap gap-3 text-[11px] sm:text-xs font-semibold">
          <span className="text-emerald-600 dark:text-emerald-400">+ নতুন যুক্ত (Added)</span>
          <span className="text-destructive">- মুছে ফেলা (Removed)</span>
        </div>
      </div>

      <div className="p-4 overflow-auto max-h-[500px] space-y-1">
        {changesOnly.map((part, idx) => {
          const lines = part.value.split("\n").filter(l => l.trim().length > 0);
          if (part.added) {
            return (
              <div key={idx} className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 p-2 rounded border border-emerald-500/20 space-y-1">
                {lines.map((line, lIdx) => (
                  <div key={lIdx} className="flex gap-2 items-start">
                    <span className="font-bold select-none text-emerald-600">+</span>
                    <span className="break-all">{line}</span>
                  </div>
                ))}
              </div>
            );
          }
          if (part.removed) {
            return (
              <div key={idx} className="bg-destructive/10 text-destructive p-2 rounded border border-destructive/20 space-y-1">
                {lines.map((line, lIdx) => (
                  <div key={lIdx} className="flex gap-2 items-start">
                    <span className="font-bold select-none text-destructive">-</span>
                    <span className="break-all">{line}</span>
                  </div>
                ))}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
