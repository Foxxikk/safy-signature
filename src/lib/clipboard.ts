"use client";

// Zkopíruje formátovaný (rich) HTML podpis do schránky,
// aby se do Gmailu/Outlooku vložil jako naformátovaný podpis, ne prostý text.
export async function copyRichHtml(html: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const item = new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([html.replace(/<[^>]+>/g, "")], {
          type: "text/plain",
        }),
      });
      await navigator.clipboard.write([item]);
      return true;
    }
  } catch {
    // fallback níže
  }
  // Fallback: dočasný element + execCommand
  try {
    const el = document.createElement("div");
    el.contentEditable = "true";
    el.innerHTML = html;
    el.style.position = "fixed";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    const ok = document.execCommand("copy");
    sel?.removeAllRanges();
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

export function downloadHtml(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
