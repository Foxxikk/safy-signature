// Blokový model podpisu – základ pro drag-and-drop editor.
// Podpis = strom bloků. Kořen i každý sloupec jsou "kontejnery" bloků.

import { CompanySettings } from "./types";
import { ASSET_BASE } from "./defaults";

export type Align = "left" | "center" | "right";

export interface TextBlock {
  id: string;
  type: "text";
  text: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  color: string;
  align: Align;
  padTop: number;
  padBottom: number;
}

export interface ContactBlock {
  id: string;
  type: "contact";
  label: string; // "Tel: ", "E-mail: ", "Web: " …
  value: string;
  href: string; // "mailto:…", "tel:…", "https://…" (volitelné)
  fontSize: number;
  color: string;
  linkColor: string;
  align: Align;
  padTop: number;
  padBottom: number;
}

export interface ImageBlock {
  id: string;
  type: "image";
  src: string; // URL nebo data URL (nahraná)
  alt: string;
  width: number;
  height: number; // 0 = auto (dopočítá klient); pro Outlook je lepší vyplnit
  href: string;
  radius: number; // zaoblení rohů
  align: Align;
  padTop: number;
  padBottom: number;
}

export interface SocialItem {
  iconUrl: string;
  href: string;
  alt: string;
  w: number;
  h: number;
}

export interface SocialsBlock {
  id: string;
  type: "socials";
  items: SocialItem[];
  gap: number;
  align: Align;
  padTop: number;
  padBottom: number;
}

export interface DividerBlock {
  id: string;
  type: "divider";
  color: string;
  thickness: number;
  padTop: number;
  padBottom: number;
}

export interface SpacerBlock {
  id: string;
  type: "spacer";
  height: number;
}

export interface Column {
  id: string;
  width: number; // 0 = auto
  items: LeafBlock[];
}

export interface RowBlock {
  id: string;
  type: "row";
  columns: Column[];
  gap: number; // mezera mezi sloupci (px)
  barColor: string; // barva svislého oddělovače mezi sloupci ("" = žádný)
  valign: "top" | "middle";
  padTop: number;
  padBottom: number;
}

export type LeafBlock =
  | TextBlock
  | ContactBlock
  | ImageBlock
  | SocialsBlock
  | DividerBlock
  | SpacerBlock;

export type Block = LeafBlock | RowBlock;

export interface SignatureDoc {
  id: string;
  name: string;
  blocks: Block[];
  background: string;
  templateVersion?: number;
}

export const ROOT = "root";

// Verze výchozí šablony. Zvedni při úpravě defaultSignatureDoc,
// aby se neupravený uložený podpis automaticky obnovil.
export const TEMPLATE_VERSION = 7;

export const DEFAULT_DOC_NAME = "Šafy podpis";

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ---- Tovární funkce pro nové bloky ----
export function newBlock(type: Block["type"], c?: CompanySettings): Block {
  const base = { id: uid(), padTop: 0, padBottom: 6 };
  switch (type) {
    case "text":
      return {
        ...base,
        type: "text",
        text: "Nový text",
        fontSize: 14,
        bold: false,
        italic: false,
        color: "#2D2D2D",
        align: "left",
      };
    case "contact":
      return {
        ...base,
        type: "contact",
        label: "Tel: ",
        value: "+420 000 000 000",
        href: "",
        fontSize: 13,
        color: "#444444",
        linkColor: c?.linkColor || "#1155CC",
        align: "left",
      };
    case "image":
      return {
        ...base,
        type: "image",
        src: c?.logoUrl || "",
        alt: "Obrázek",
        width: 180,
        height: 0,
        href: "",
        radius: 0,
        align: "left",
      };
    case "socials":
      return {
        ...base,
        type: "socials",
        gap: 8,
        align: "left",
        items: [
          {
            iconUrl: c?.fbIconUrl || "",
            href: c?.defaultFacebookUrl || "",
            alt: "Facebook",
            w: 24,
            h: 24,
          },
          {
            iconUrl: c?.igIconUrl || "",
            href: c?.defaultInstagramUrl || "",
            alt: "Instagram",
            w: 24,
            h: 24,
          },
        ],
      };
    case "divider":
      return {
        ...base,
        type: "divider",
        color: "#E5E5E5",
        thickness: 1,
        padTop: 6,
      };
    case "spacer":
      return { id: uid(), type: "spacer", height: 12 } as SpacerBlock;
    case "row":
      return {
        ...base,
        type: "row",
        gap: 14,
        barColor: c?.brandColor || "#8DC63F",
        valign: "top",
        columns: [
          { id: uid(), width: 0, items: [] },
          { id: uid(), width: 0, items: [] },
        ],
      };
  }
}

// ---- Výchozí šablona: reprodukuje stávající podpis Šafy ----
export function defaultSignatureDoc(c: CompanySettings): SignatureDoc {
  // Fotka Šafy má kruh i zelenou linku zapečené přímo v PNG (průhledné rohy),
  // hostovaná na firemní doméně → čistá a v Outlooku se nezablokuje.
  const photo: ImageBlock = {
    id: uid(),
    type: "image",
    src: `${ASSET_BASE}/people/gabi.png`,
    alt: "Gabriela Hudec",
    width: 140,
    height: 123,
    href: "",
    radius: 0,
    align: "left",
    padTop: 0,
    padBottom: 0,
  };
  const name: TextBlock = {
    id: uid(),
    type: "text",
    text: "Gabriela Hudec",
    fontSize: 18,
    bold: true,
    italic: false,
    color: c.textColor,
    align: "left",
    padTop: 0,
    padBottom: 1,
  };
  const role: TextBlock = {
    id: uid(),
    type: "text",
    text: "creative director",
    fontSize: 13,
    bold: false,
    italic: false,
    color: c.mutedColor,
    align: "left",
    padTop: 0,
    padBottom: 8,
  };
  const tel: ContactBlock = {
    id: uid(),
    type: "contact",
    label: "Tel: ",
    value: "+ 420 702 024 636",
    href: "",
    fontSize: 13,
    color: c.mutedColor,
    linkColor: c.linkColor,
    align: "left",
    padTop: 0,
    padBottom: 1,
  };
  const email: ContactBlock = {
    id: uid(),
    type: "contact",
    label: "E-mail: ",
    value: "Gabriela.hudec@safyproduction.cz",
    href: "mailto:gabriela.hudec@safyproduction.cz",
    fontSize: 13,
    color: c.mutedColor,
    linkColor: c.linkColor,
    align: "left",
    padTop: 0,
    padBottom: 6,
  };
  const socials: SocialsBlock = {
    id: uid(),
    type: "socials",
    gap: 8,
    align: "left",
    padTop: 0,
    padBottom: 0,
    items: [
      {
        iconUrl: c.fbIconUrl,
        href: c.defaultFacebookUrl,
        alt: "Facebook",
        w: 20,
        h: 20,
      },
      {
        iconUrl: c.igIconUrl,
        href: c.defaultInstagramUrl,
        alt: "Instagram",
        w: 20,
        h: 20,
      },
      { iconUrl: c.logoUrl, href: c.logoLinkUrl, alt: "Šafy", w: 52, h: 20 },
    ],
  };
  const identityRow: RowBlock = {
    id: uid(),
    type: "row",
    gap: 16,
    barColor: "", // zelená linka je zapečená přímo ve fotce (gabi.png)
    valign: "middle",
    padTop: 0,
    padBottom: 16,
    columns: [
      { id: uid(), width: 0, items: [photo] },
      { id: uid(), width: 0, items: [name, role, tel, email, socials] },
    ],
  };

  const bw = c.bannerWidth || 300;
  const bh = Math.round((bw * 130) / 300);
  const bannerImgs: ImageBlock[] = c.banners.map((b) => ({
    id: uid(),
    type: "image",
    src: b.imageUrl,
    alt: b.alt,
    width: bw,
    height: bh,
    href: b.linkUrl,
    radius: 0,
    align: "left",
    padTop: 0,
    padBottom: 0,
  }));
  const bannerRow: RowBlock = {
    id: uid(),
    type: "row",
    gap: 0,
    barColor: "",
    valign: "top",
    padTop: 0,
    padBottom: 0,
    columns: bannerImgs.map((img) => ({
      id: uid(),
      width: 0,
      items: [img],
    })),
  };

  return {
    id: uid(),
    name: DEFAULT_DOC_NAME,
    background: "",
    templateVersion: TEMPLATE_VERSION,
    blocks: [identityRow, bannerRow],
  };
}

// ---- Operace nad stromem (přesun/vložení/smazání) ----
export function findContainer(
  doc: SignatureDoc,
  containerId: string,
): Block[] | null {
  if (containerId === ROOT) return doc.blocks;
  for (const b of doc.blocks) {
    if (b.type === "row") {
      for (const col of b.columns) {
        if (col.id === containerId) return col.items;
      }
    }
  }
  return null;
}

export function cloneDoc(doc: SignatureDoc): SignatureDoc {
  return JSON.parse(JSON.stringify(doc));
}

// Najde blok podle id kdekoliv ve stromu; vrátí referenci.
export function findBlock(doc: SignatureDoc, id: string): Block | null {
  for (const b of doc.blocks) {
    if (b.id === id) return b;
    if (b.type === "row") {
      for (const col of b.columns) {
        for (const it of col.items) if (it.id === id) return it;
      }
    }
  }
  return null;
}

// Odebere blok podle id, vrátí [novýDoc, odebranýBlok]
function removeById(doc: SignatureDoc, id: string): Block | null {
  let removed: Block | null = null;
  const ri = doc.blocks.findIndex((b) => b.id === id);
  if (ri >= 0) {
    removed = doc.blocks[ri];
    doc.blocks.splice(ri, 1);
    return removed;
  }
  for (const b of doc.blocks) {
    if (b.type === "row") {
      for (const col of b.columns) {
        const ci = col.items.findIndex((it) => it.id === id);
        if (ci >= 0) {
          removed = col.items[ci];
          col.items.splice(ci, 1);
          return removed;
        }
      }
    }
  }
  return null;
}

// Přesune blok do cílového kontejneru na index. Vrací nový doc.
export function moveBlock(
  doc: SignatureDoc,
  blockId: string,
  targetContainerId: string,
  targetIndex: number,
): SignatureDoc {
  const d = cloneDoc(doc);
  // Zjisti, zda přesun probíhá ve stejném kontejneru a před cílem (kvůli indexu)
  const target = findContainer(d, targetContainerId);
  if (!target) return doc;
  // Nedovol vložit řádek do sloupce (jen listy do sloupců)
  const moving = findBlock(d, blockId);
  if (!moving) return doc;
  if (targetContainerId !== ROOT && moving.type === "row") return doc;

  // index cíle před odebráním
  const beforeIdx = target.findIndex((b) => b.id === blockId);
  const removed = removeById(d, blockId);
  if (!removed) return doc;
  const target2 = findContainer(d, targetContainerId);
  if (!target2) return doc;
  let idx = targetIndex;
  if (beforeIdx >= 0 && beforeIdx < targetIndex) idx = targetIndex - 1;
  if (idx < 0) idx = 0;
  if (idx > target2.length) idx = target2.length;
  target2.splice(idx, 0, removed as LeafBlock);
  return d;
}

export function insertBlock(
  doc: SignatureDoc,
  block: Block,
  containerId: string,
  index: number,
): SignatureDoc {
  const d = cloneDoc(doc);
  const cont = findContainer(d, containerId);
  if (!cont) return doc;
  if (containerId !== ROOT && block.type === "row") return doc;
  const idx = Math.max(0, Math.min(index, cont.length));
  cont.splice(idx, 0, block as LeafBlock);
  return d;
}

export function deleteBlock(doc: SignatureDoc, id: string): SignatureDoc {
  const d = cloneDoc(doc);
  removeById(d, id);
  return d;
}

export function duplicateBlock(doc: SignatureDoc, id: string): SignatureDoc {
  const d = cloneDoc(doc);
  const src = findBlock(d, id);
  if (!src) return doc;
  const copy = JSON.parse(JSON.stringify(src)) as Block;
  reId(copy);
  // vlož hned za původní
  for (let i = 0; i < d.blocks.length; i++) {
    if (d.blocks[i].id === id) {
      d.blocks.splice(i + 1, 0, copy);
      return d;
    }
  }
  for (const b of d.blocks) {
    if (b.type === "row") {
      for (const col of b.columns) {
        const ci = col.items.findIndex((it) => it.id === id);
        if (ci >= 0) {
          col.items.splice(ci + 1, 0, copy as LeafBlock);
          return d;
        }
      }
    }
  }
  return d;
}

function reId(b: Block) {
  b.id = uid();
  if (b.type === "row") {
    for (const col of b.columns) {
      col.id = uid();
      for (const it of col.items) it.id = uid();
    }
  }
}

export function updateBlock(
  doc: SignatureDoc,
  id: string,
  patch: Record<string, unknown>,
): SignatureDoc {
  const d = cloneDoc(doc);
  const b = findBlock(d, id);
  if (b) Object.assign(b, patch);
  return d;
}
