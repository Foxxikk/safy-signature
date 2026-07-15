// Serializace blokového podpisu do e-mailově kompatibilního HTML
// (tabulky, inline CSS, žádné <style>/class, obrázky přes URL nebo data URL).

import { Block, LeafBlock, SignatureDoc } from "./blocks";

const FONT = "Arial, Helvetica, sans-serif";

function esc(s: string): string {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function href(h: string): string {
  if (!h) return "";
  if (/^(mailto:|tel:|https?:\/\/)/i.test(h)) return h;
  return "https://" + h;
}

function pad(top: number, bottom: number): string {
  return `padding:${top || 0}px 0 ${bottom || 0}px 0;`;
}

function imgTag(
  src: string,
  alt: string,
  width: number,
  radius: number,
  height?: number,
): string {
  const h = height ? ` height="${height}"` : "";
  return `<img src="${esc(src)}" alt="${esc(
    alt,
  )}" width="${width}"${h} style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;max-width:100%;${
    radius ? `border-radius:${radius}px;` : ""
  }" />`;
}

function renderLeafInner(b: LeafBlock): string {
  switch (b.type) {
    case "text": {
      const style = `font-family:${FONT};font-size:${b.fontSize}px;${
        b.bold ? "font-weight:bold;" : ""
      }${b.italic ? "font-style:italic;" : ""}color:${esc(
        b.color,
      )};line-height:1.3;`;
      return `<span style="${style}">${esc(b.text).replace(
        /\n/g,
        "<br />",
      )}</span>`;
    }
    case "contact": {
      const style = `font-family:${FONT};font-size:${b.fontSize}px;color:${esc(
        b.color,
      )};line-height:1.5;`;
      const val = b.href
        ? `<a href="${esc(href(b.href))}" style="color:${esc(
            b.linkColor,
          )};text-decoration:underline;">${esc(b.value)}</a>`
        : esc(b.value);
      return `<span style="${style}">${esc(b.label)}${val}</span>`;
    }
    case "image": {
      const img = imgTag(b.src, b.alt, b.width, b.radius);
      return b.href
        ? `<a href="${esc(href(b.href))}" style="text-decoration:none;">${img}</a>`
        : img;
    }
    case "socials": {
      const cells = b.items
        .map((it) => {
          const img = imgTag(it.iconUrl, it.alt, it.w, 0, it.h);
          const linked = it.href
            ? `<a href="${esc(
                href(it.href),
              )}" style="text-decoration:none;">${img}</a>`
            : img;
          return `<td style="padding:0 ${b.gap}px 0 0;">${linked}</td>`;
        })
        .join("");
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${cells}</tr></table>`;
    }
    case "divider": {
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="border-top:${
        b.thickness
      }px solid ${esc(b.color)};font-size:0;line-height:0;">&nbsp;</td></tr></table>`;
    }
    case "spacer": {
      return `<div style="height:${b.height}px;line-height:${b.height}px;font-size:0;">&nbsp;</div>`;
    }
  }
}

function renderBlockRow(b: Block): string {
  if (b.type === "row") {
    const cols = b.columns.filter((c) => c.items.length > 0 || true);
    const cells = cols
      .map((col, i) => {
        const w = col.width > 0 ? ` width="${col.width}"` : "";
        const wStyle = col.width > 0 ? `width:${col.width}px;` : "";
        const rightPad = i < cols.length - 1 ? `padding-right:${b.gap}px;` : "";
        const inner = renderContainer(col.items);
        const bar =
          b.barColor && i < cols.length - 1
            ? `<td width="3" style="width:3px;background-color:${esc(
                b.barColor,
              )};font-size:0;line-height:0;">&nbsp;</td>`
            : "";
        return `<td valign="${b.valign}"${w} style="${wStyle}${rightPad}">${inner}</td>${bar}`;
      })
      .join("");
    return `<tr><td style="${pad(
      b.padTop,
      b.padBottom,
    )}"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>${cells}</tr></table></td></tr>`;
  }
  const al = "align" in b ? b.align : "left";
  const alignStyle = `text-align:${al};`;
  const alignAttr = al;
  const padStyle =
    b.type === "spacer" ? "padding:0;" : pad(b.padTop, b.padBottom);
  return `<tr><td align="${alignAttr}" style="${padStyle}${alignStyle}">${renderLeafInner(
    b,
  )}</td></tr>`;
}

function renderContainer(blocks: Block[]): string {
  if (blocks.length === 0)
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-size:0;line-height:0;">&nbsp;</td></tr></table>`;
  const rows = blocks.map(renderBlockRow).join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${rows}</table>`;
}

export function renderSignatureHtml(doc: SignatureDoc): string {
  const bg = doc.background ? `background-color:${esc(doc.background)};` : "";
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${FONT};${bg}">${doc.blocks
    .map(renderBlockRow)
    .join("")}</table>`;
}

export function renderSignatureDocument(doc: SignatureDoc): string {
  return `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>Podpis – ${esc(
    doc.name,
  )}</title></head>
<body style="margin:0;padding:16px;">
${renderSignatureHtml(doc)}
</body>
</html>`;
}

export function sizeKb(html: string): number {
  return Math.round((new TextEncoder().encode(html).length / 1024) * 10) / 10;
}
