"use client";

import { Block, ROOT } from "@/lib/blocks";
import { useEditor } from "./EditorContext";

const items: { type: Block["type"]; label: string; icon: string }[] = [
  { type: "text", label: "Text", icon: "T" },
  { type: "contact", label: "Kontakt", icon: "☎" },
  { type: "image", label: "Obrázek / banner", icon: "🖼" },
  { type: "socials", label: "Sociální ikony", icon: "◎" },
  { type: "divider", label: "Linka", icon: "―" },
  { type: "spacer", label: "Mezera", icon: "↕" },
  { type: "row", label: "Sloupce", icon: "▥" },
];

export default function Palette() {
  const { doc, addBlock } = useEditor();
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Přidat prvek
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {items.map((it) => (
          <button
            key={it.type}
            onClick={() => addBlock(it.type, ROOT, doc.blocks.length)}
            className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-2.5 py-2 text-left text-sm text-neutral-700 hover:border-[#8DC63F] hover:bg-[#8DC63F]/10"
          >
            <span className="text-base leading-none">{it.icon}</span>
            <span className="text-xs">{it.label}</span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-neutral-400">
        Nový prvek se přidá dolů. Přetáhni ho kamkoliv – i do sloupců. Prvek
        vybereš kliknutím a upravíš vpravo.
      </p>
    </div>
  );
}
