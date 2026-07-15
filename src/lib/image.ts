"use client";

// Načte nahranou fotku, zmenší ji a zkomprimuje na malý čtverec (data URL).
// Drží podpis lehký – i nahraná fotka pak zabírá jen pár kB.
export function resizeImageToDataUrl(
  file: File,
  maxSize = 240,
  quality = 0.82,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Nepodařilo se načíst soubor."));
    reader.onload = () => {
      const imgEl = new Image();
      imgEl.onerror = () => reject(new Error("Neplatný obrázek."));
      imgEl.onload = () => {
        // ořízni na čtverec (center crop)
        const side = Math.min(imgEl.width, imgEl.height);
        const sx = (imgEl.width - side) / 2;
        const sy = (imgEl.height - side) / 2;

        const canvas = document.createElement("canvas");
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas není dostupný."));
        ctx.drawImage(imgEl, sx, sy, side, side, 0, 0, maxSize, maxSize);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      imgEl.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function dataUrlSizeKb(dataUrl: string): number {
  if (!dataUrl) return 0;
  const base64 = dataUrl.split(",")[1] || "";
  return Math.round(((base64.length * 3) / 4 / 1024) * 10) / 10;
}
