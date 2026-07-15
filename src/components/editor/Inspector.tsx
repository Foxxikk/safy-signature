"use client";

import { useRef } from "react";
import { Align, Block, SocialItem, uid } from "@/lib/blocks";
import { resizeImageToDataUrl } from "@/lib/image";
import { useEditor } from "./EditorContext";

/* -------- malé ovládací prvky -------- */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1 block text-xs font-medium text-neutral-600">
      {children}
    </span>
  );
}
function Text({
  label,
  value,
  onChange,
  area,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  area?: boolean;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      {area ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm focus:border-[#8DC63F] focus:outline-none"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm focus:border-[#8DC63F] focus:outline-none"
        />
      )}
    </label>
  );
}
function Num({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm focus:border-[#8DC63F] focus:outline-none"
      />
    </label>
  );
}
function Color({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-9 shrink-0 cursor-pointer rounded border border-neutral-300"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm focus:border-[#8DC63F] focus:outline-none"
        />
      </div>
    </label>
  );
}
function AlignPicker({
  value,
  onChange,
}: {
  value: Align;
  onChange: (v: Align) => void;
}) {
  return (
    <div>
      <Label>Zarovnání</Label>
      <div className="flex gap-1">
        {(["left", "center", "right"] as Align[]).map((a) => (
          <button
            key={a}
            onClick={() => onChange(a)}
            className={`flex-1 rounded-md border px-2 py-1.5 text-xs ${
              value === a
                ? "border-[#8DC63F] bg-[#8DC63F]/15 font-semibold"
                : "border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            {a === "left" ? "Vlevo" : a === "center" ? "Střed" : "Vpravo"}
          </button>
        ))}
      </div>
    </div>
  );
}
function Spacing({
  top,
  bottom,
  onTop,
  onBottom,
}: {
  top: number;
  bottom: number;
  onTop: (v: number) => void;
  onBottom: (v: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Num label="Mezera nahoře" value={top} min={0} onChange={onTop} />
      <Num label="Mezera dole" value={bottom} min={0} onChange={onBottom} />
    </div>
  );
}

/* -------- Inspector -------- */
export default function Inspector() {
  const { selectedId, update, find } = useEditorFind();
  const fileRef = useRef<HTMLInputElement>(null);

  const block = selectedId ? find(selectedId) : null;
  if (!block) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-400">
        Vyber prvek v podpisu a uprav ho tady.
      </div>
    );
  }

  const set = (patch: Record<string, unknown>) => update(block.id, patch);

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Úprava: {typeLabel(block.type)}
      </h3>

      {block.type === "text" && (
        <>
          <Text label="Text" value={block.text} area onChange={(v) => set({ text: v })} />
          <div className="grid grid-cols-2 gap-2">
            <Num label="Velikost (px)" value={block.fontSize} min={8} max={48} onChange={(v) => set({ fontSize: v })} />
            <Color label="Barva" value={block.color} onChange={(v) => set({ color: v })} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => set({ bold: !block.bold })} className={btn(block.bold)}>
              Tučně
            </button>
            <button onClick={() => set({ italic: !block.italic })} className={btn(block.italic)}>
              Kurzíva
            </button>
          </div>
          <AlignPicker value={block.align} onChange={(v) => set({ align: v })} />
          <Spacing top={block.padTop} bottom={block.padBottom} onTop={(v) => set({ padTop: v })} onBottom={(v) => set({ padBottom: v })} />
        </>
      )}

      {block.type === "contact" && (
        <>
          <Text label="Popisek" value={block.label} onChange={(v) => set({ label: v })} />
          <Text label="Hodnota" value={block.value} onChange={(v) => set({ value: v })} />
          <Text label="Odkaz (mailto:, tel:, https://)" value={block.href} onChange={(v) => set({ href: v })} />
          <div className="grid grid-cols-2 gap-2">
            <Num label="Velikost" value={block.fontSize} min={8} max={32} onChange={(v) => set({ fontSize: v })} />
            <Color label="Barva textu" value={block.color} onChange={(v) => set({ color: v })} />
          </div>
          <Color label="Barva odkazu" value={block.linkColor} onChange={(v) => set({ linkColor: v })} />
          <AlignPicker value={block.align} onChange={(v) => set({ align: v })} />
          <Spacing top={block.padTop} bottom={block.padBottom} onTop={(v) => set({ padTop: v })} onBottom={(v) => set({ padBottom: v })} />
        </>
      )}

      {block.type === "image" && (
        <>
          <div>
            <Label>Obrázek</Label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-700"
              >
                Nahrát
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) set({ src: await resizeImageToDataUrl(f, 600, 0.85) });
                  e.target.value = "";
                }}
              />
            </div>
          </div>
          <Text label="…nebo URL obrázku" value={block.src} onChange={(v) => set({ src: v })} />
          <Text label="Popisek (alt)" value={block.alt} onChange={(v) => set({ alt: v })} />
          <Text label="Odkaz po kliknutí" value={block.href} onChange={(v) => set({ href: v })} />
          <div className="grid grid-cols-2 gap-2">
            <Num label="Šířka (px)" value={block.width} min={16} max={640} onChange={(v) => set({ width: v })} />
            <Num label="Zaoblení (px)" value={block.radius} min={0} max={400} onChange={(v) => set({ radius: v })} />
          </div>
          <AlignPicker value={block.align} onChange={(v) => set({ align: v })} />
          <Spacing top={block.padTop} bottom={block.padBottom} onTop={(v) => set({ padTop: v })} onBottom={(v) => set({ padBottom: v })} />
        </>
      )}

      {block.type === "socials" && (
        <>
          {block.items.map((it, i) => (
            <div key={i} className="rounded-md border border-neutral-200 p-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-600">Ikona {i + 1}</span>
                <button
                  onClick={() => set({ items: block.items.filter((_, j) => j !== i) })}
                  className="text-xs text-red-500 hover:underline"
                >
                  odebrat
                </button>
              </div>
              <div className="space-y-2">
                <Text label="URL ikony" value={it.iconUrl} onChange={(v) => set({ items: patchItem(block.items, i, { iconUrl: v }) })} />
                <Text label="Odkaz" value={it.href} onChange={(v) => set({ items: patchItem(block.items, i, { href: v }) })} />
                <div className="grid grid-cols-2 gap-2">
                  <Num label="Šířka" value={it.w} min={8} max={200} onChange={(v) => set({ items: patchItem(block.items, i, { w: v }) })} />
                  <Num label="Výška" value={it.h} min={8} max={200} onChange={(v) => set({ items: patchItem(block.items, i, { h: v }) })} />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() =>
              set({
                items: [
                  ...block.items,
                  { iconUrl: "", href: "", alt: "Ikona", w: 24, h: 24 } as SocialItem,
                ],
              })
            }
            className="w-full rounded-md border border-dashed border-neutral-300 py-1.5 text-xs text-neutral-500 hover:bg-neutral-50"
          >
            + přidat ikonu
          </button>
          <div className="grid grid-cols-2 gap-2">
            <Num label="Mezera mezi (px)" value={block.gap} min={0} max={40} onChange={(v) => set({ gap: v })} />
          </div>
          <AlignPicker value={block.align} onChange={(v) => set({ align: v })} />
          <Spacing top={block.padTop} bottom={block.padBottom} onTop={(v) => set({ padTop: v })} onBottom={(v) => set({ padBottom: v })} />
        </>
      )}

      {block.type === "divider" && (
        <>
          <Color label="Barva" value={block.color} onChange={(v) => set({ color: v })} />
          <Num label="Tloušťka (px)" value={block.thickness} min={1} max={10} onChange={(v) => set({ thickness: v })} />
          <Spacing top={block.padTop} bottom={block.padBottom} onTop={(v) => set({ padTop: v })} onBottom={(v) => set({ padBottom: v })} />
        </>
      )}

      {block.type === "spacer" && (
        <Num label="Výška mezery (px)" value={block.height} min={2} max={120} onChange={(v) => set({ height: v })} />
      )}

      {block.type === "row" && (
        <>
          <Num label="Mezera mezi sloupci (px)" value={block.gap} min={0} max={60} onChange={(v) => set({ gap: v })} />
          <Color label="Svislý oddělovač (prázdné = žádný)" value={block.barColor} onChange={(v) => set({ barColor: v })} />
          <button
            onClick={() => set({ barColor: "" })}
            className="text-xs text-neutral-500 hover:underline"
          >
            odebrat oddělovač
          </button>
          <div>
            <Label>Svislé zarovnání</Label>
            <div className="flex gap-1">
              {(["top", "middle"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => set({ valign: v })}
                  className={`flex-1 rounded-md border px-2 py-1.5 text-xs ${
                    block.valign === v ? "border-[#8DC63F] bg-[#8DC63F]/15 font-semibold" : "border-neutral-300"
                  }`}
                >
                  {v === "top" ? "Nahoru" : "Na střed"}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Šířky sloupců (px, 0 = auto)</Label>
            {block.columns.map((col, i) => (
              <div key={col.id} className="flex items-center gap-2">
                <span className="w-16 text-xs text-neutral-500">Sloupec {i + 1}</span>
                <input
                  type="number"
                  value={col.width}
                  min={0}
                  onChange={(e) =>
                    set({
                      columns: block.columns.map((c, j) =>
                        j === i ? { ...c, width: Number(e.target.value) } : c,
                      ),
                    })
                  }
                  className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
                />
                {block.columns.length > 1 && (
                  <button
                    onClick={() => set({ columns: block.columns.filter((_, j) => j !== i) })}
                    className="text-xs text-red-500"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => set({ columns: [...block.columns, { id: uid(), width: 0, items: [] }] })}
              className="w-full rounded-md border border-dashed border-neutral-300 py-1.5 text-xs text-neutral-500 hover:bg-neutral-50"
            >
              + přidat sloupec
            </button>
          </div>
          <Spacing top={block.padTop} bottom={block.padBottom} onTop={(v) => set({ padTop: v })} onBottom={(v) => set({ padBottom: v })} />
        </>
      )}
    </div>
  );
}

function useEditorFind() {
  const api = useEditor();
  // najdi blok v aktuálním docu
  const find = (id: string): Block | null => {
    for (const b of api.doc.blocks) {
      if (b.id === id) return b;
      if (b.type === "row") {
        for (const col of b.columns) {
          for (const it of col.items) if (it.id === id) return it;
        }
      }
    }
    return null;
  };
  return { ...api, find };
}

function patchItem(items: SocialItem[], i: number, patch: Partial<SocialItem>): SocialItem[] {
  return items.map((it, j) => (j === i ? { ...it, ...patch } : it));
}

function btn(active: boolean): string {
  return `flex-1 rounded-md border px-2 py-1.5 text-xs ${
    active ? "border-[#8DC63F] bg-[#8DC63F]/15 font-semibold" : "border-neutral-300 hover:bg-neutral-50"
  }`;
}

function typeLabel(type: Block["type"]): string {
  const map: Record<Block["type"], string> = {
    text: "Text",
    contact: "Kontakt",
    image: "Obrázek",
    socials: "Ikony",
    divider: "Linka",
    spacer: "Mezera",
    row: "Sloupce",
  };
  return map[type];
}
