import * as cheerio from "cheerio";

export function extractContent(html: string, selector?: string): string {
  const $ = cheerio.load(html);

  // Remove noise
  $("script, style, noscript, iframe, link, meta").remove();

  if (selector) {
    const selected = $(selector);
    if (selected.length > 0) {
      return selected.text().replace(/\s+/g, " ").trim();
    }
  }

  // Extract clean plain text from body
  const bodyText = $("body").length > 0 ? $("body").text() : $.text();
  // Clean up excess whitespace/newlines for clean diff comparison
  return bodyText.replace(/\n\s*\n/g, "\n").trim();
}
