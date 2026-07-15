import { CompanySettings, Person } from "./types";

// ---------------------------------------------------------------------------
// Generátor emailového podpisu.
//
// Zásady kompatibility (Outlook Win = render engine Wordu, Outlook Mac, Gmail):
//  - pouze tabulky (žádný flex/grid), vše inline CSS
//  - žádný <style> blok ani class/id (Gmail je odstraňuje)
//  - obrázky odkazované přes absolutní URL (NE base64) → malá velikost
//  - pixelové rozměry, border:0, bezpečné fonty s fallbacky
// ---------------------------------------------------------------------------

function esc(s: string): string {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const FONT = "Arial, Helvetica, sans-serif";

function img(
  src: string,
  alt: string,
  width: number,
  height: number,
  extra = "",
): string {
  return `<img src="${esc(src)}" alt="${esc(alt)}" width="${width}" height="${height}" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;${extra}" />`;
}

// Vnitřní HTML podpisu (bez <html>/<body>) — pro náhled i kopírování.
export function generateSignatureHtml(
  p: Person,
  c: CompanySettings,
): string {
  const size = c.photoSize || 92;

  const photoCell = p.photoUrl
    ? `<td valign="top" style="padding:0 14px 0 0;">${img(
        p.photoUrl,
        p.fullName,
        size,
        size,
        `border-radius:${Math.round(size / 2)}px;object-fit:cover;`,
      )}</td>`
    : "";

  // svislý zelený oddělovač
  const barCell = `<td width="3" style="width:3px;background-color:${esc(
    c.brandColor,
  )};font-size:0;line-height:0;">&nbsp;</td>`;

  // řádek se sociálními ikonami + logem
  const icons: string[] = [];
  if (p.showFacebook && (p.facebookUrl || c.defaultFacebookUrl)) {
    icons.push(
      `<a href="${esc(
        p.facebookUrl || c.defaultFacebookUrl,
      )}" style="text-decoration:none;">${img(
        c.fbIconUrl,
        "Facebook",
        24,
        24,
      )}</a>`,
    );
  }
  if (p.showInstagram && (p.instagramUrl || c.defaultInstagramUrl)) {
    icons.push(
      `<a href="${esc(
        p.instagramUrl || c.defaultInstagramUrl,
      )}" style="text-decoration:none;">${img(
        c.igIconUrl,
        "Instagram",
        24,
        24,
      )}</a>`,
    );
  }
  const logoCell = `<a href="${esc(
    c.logoLinkUrl,
  )}" style="text-decoration:none;">${img(c.logoUrl, "Šafy", 60, 24)}</a>`;

  const iconCells = icons
    .map((i) => `<td style="padding:0 8px 0 0;">${i}</td>`)
    .join("");

  const iconsRow = `
      <tr>
        <td style="padding:10px 0 0 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            ${iconCells}
            <td style="padding:0 0 0 4px;">${logoCell}</td>
          </tr></table>
        </td>
      </tr>`;

  const infoCell = `<td valign="top" style="padding:0 0 0 14px;font-family:${FONT};">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="font-family:${FONT};font-size:20px;font-weight:bold;color:${esc(
          c.textColor,
        )};line-height:24px;">${esc(p.fullName)}</td></tr>
        <tr><td style="font-family:${FONT};font-size:13px;color:${esc(
          c.mutedColor,
        )};line-height:18px;padding:2px 0 8px 0;">${esc(p.role)}</td></tr>
        ${
          p.phone
            ? `<tr><td style="font-family:${FONT};font-size:13px;color:${esc(
                c.mutedColor,
              )};line-height:20px;">Tel: ${esc(p.phone)}</td></tr>`
            : ""
        }
        ${
          p.email
            ? `<tr><td style="font-family:${FONT};font-size:13px;color:${esc(
                c.mutedColor,
              )};line-height:20px;">E-mail: <a href="mailto:${esc(
                p.email,
              )}" style="color:${esc(
                c.linkColor,
              )};text-decoration:underline;">${esc(p.email)}</a></td></tr>`
            : ""
        }
        ${iconsRow}
      </table>
    </td>`;

  const identityTable = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
    <tr>${photoCell}${barCell}${infoCell}</tr>
  </table>`;

  // Bannery
  let bannersTable = "";
  if (p.showBanners && c.banners.length > 0) {
    const bw = 300;
    const cells = c.banners
      .map(
        (b) =>
          `<td style="padding:0 6px 0 0;"><a href="${esc(
            b.linkUrl,
          )}" style="text-decoration:none;">${img(
            b.imageUrl,
            b.alt,
            bw,
            Math.round((bw * 260) / 640),
          )}</a></td>`,
      )
      .join("");
    bannersTable = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;padding-top:14px;">
      <tr><td style="padding-top:14px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${cells}</tr></table></td></tr>
    </table>`;
  }

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${FONT};">
    <tr><td style="padding:0;">${identityTable}</td></tr>
    ${bannersTable ? `<tr><td style="padding:0;">${bannersTable}</td></tr>` : ""}
  </table>`;
}

// Kompletní HTML dokument (pro stažení .html souboru).
export function generateSignatureDocument(
  p: Person,
  c: CompanySettings,
): string {
  return `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>Podpis – ${esc(
    p.fullName,
  )}</title></head>
<body style="margin:0;padding:16px;">
${generateSignatureHtml(p, c)}
</body>
</html>`;
}

// Odhad velikosti výstupu v kB (bez obrázků – ty jsou hostované na URL).
export function signatureSizeKb(html: string): number {
  return Math.round((new TextEncoder().encode(html).length / 1024) * 10) / 10;
}
