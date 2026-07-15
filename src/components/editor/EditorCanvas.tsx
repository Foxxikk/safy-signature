"use client";

import { useState } from "react";
import { Block, LeafBlock, ROOT } from "@/lib/blocks";
import { useEditor } from "./EditorContext";

// Tenká zóna pro drop mezi bloky.
function DropZone({
  containerId,
  index,
}: {
  containerId: string;
  index: number;
}) {
  const { dragId, move, setDragId } = useEditor();
  const [over, setOver] = useState(false);
  if (!dragId) return <div style={{ height: 2 }} />;
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        move(dragId, containerId, index);
        setOver(false);
        setDragId(null);
      }}
      className={`my-0.5 rounded transition-all ${
        over ? "h-8 bg-[#8DC63F]/30 ring-2 ring-[#8DC63F]" : "h-2"
      }`}
    />
  );
}

function BlockContent({ block }: { block: Block }) {
  switch (block.type) {
    case "text":
      return (
        <span
          style={{
            fontSize: block.fontSize,
            fontWeight: block.bold ? "bold" : "normal",
            fontStyle: block.italic ? "italic" : "normal",
            color: block.color,
            display: "block",
            lineHeight: 1.3,
            whiteSpace: "pre-wrap",
          }}
        >
          {block.text || " "}
        </span>
      );
    case "contact":
      return (
        <span style={{ fontSize: block.fontSize, color: block.color }}>
          {block.label}
          <span style={{ color: block.linkColor }}>{block.value}</span>
        </span>
      );
    case "image":
      return block.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={block.src}
          alt={block.alt}
          width={block.width}
          draggable={false}
          style={{
            borderRadius: block.radius,
            maxWidth: "100%",
            display: "inline-block",
          }}
        />
      ) : (
        <span className="text-xs text-neutral-400">
          (prázdný obrázek – nastav URL nebo nahraj)
        </span>
      );
    case "socials":
      return (
        <span style={{ display: "inline-flex", gap: block.gap }}>
          {block.items.map((it, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={it.iconUrl}
              alt={it.alt}
              width={it.w}
              height={it.h}
              draggable={false}
              style={{ display: "block" }}
            />
          ))}
        </span>
      );
    case "divider":
      return (
        <div
          style={{ borderTop: `${block.thickness}px solid ${block.color}` }}
        />
      );
    case "spacer":
      return (
        <div
          className="flex items-center justify-center rounded border border-dashed border-neutral-300 text-[10px] text-neutral-400"
          style={{ height: block.height }}
        >
          mezera {block.height}px
        </div>
      );
    case "row":
      return null;
  }
}

function RowView({ block }: { block: Extract<Block, { type: "row" }> }) {
  return (
    <div
      className="flex w-full"
      style={{
        gap: block.gap,
        alignItems: block.valign === "middle" ? "center" : "flex-start",
      }}
    >
      {block.columns.map((col, i) => (
        <div
          key={col.id}
          className="min-w-0"
          style={{
            flex: col.width > 0 ? `0 0 ${col.width}px` : "1 1 0",
            borderLeft:
              block.barColor && i > 0
                ? `3px solid ${block.barColor}`
                : undefined,
            paddingLeft: block.barColor && i > 0 ? block.gap / 2 : undefined,
          }}
        >
          <ContainerView items={col.items} containerId={col.id} />
        </div>
      ))}
    </div>
  );
}

function SortableItem({ block }: { block: Block }) {
  const { selectedId, select, remove, duplicate, setDragId, dragId } =
    useEditor();
  const selected = selectedId === block.id;
  const dragging = dragId === block.id;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        setDragId(block.id);
        e.dataTransfer.setData("text/plain", block.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragEnd={() => setDragId(null)}
      onClick={(e) => {
        e.stopPropagation();
        select(block.id);
      }}
      className={`group relative cursor-grab rounded px-2 py-1 transition ${
        selected
          ? "ring-2 ring-[#8DC63F]"
          : "ring-1 ring-transparent hover:ring-neutral-200"
      } ${dragging ? "opacity-40" : ""}`}
    >
      {/* ovládací lišta */}
      <div
        className={`absolute -top-2.5 right-1 z-10 flex gap-1 ${
          selected ? "flex" : "hidden group-hover:flex"
        }`}
      >
        <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] text-white">
          {labelFor(block.type)}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            duplicate(block.id);
          }}
          className="rounded bg-white px-1.5 py-0.5 text-[10px] text-neutral-600 shadow ring-1 ring-neutral-200 hover:bg-neutral-50"
          title="Duplikovat"
        >
          ⧉
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            remove(block.id);
          }}
          className="rounded bg-white px-1.5 py-0.5 text-[10px] text-red-500 shadow ring-1 ring-neutral-200 hover:bg-red-50"
          title="Smazat"
        >
          ✕
        </button>
      </div>

      <div style={{ textAlign: block.type === "row" ? "left" : blockAlign(block) }}>
        {block.type === "row" ? (
          <RowView block={block} />
        ) : (
          <BlockContent block={block} />
        )}
      </div>
    </div>
  );
}

function ContainerView({
  items,
  containerId,
}: {
  items: LeafBlock[] | Block[];
  containerId: string;
}) {
  const { dragId } = useEditor();
  const empty = items.length === 0;
  return (
    <div className="w-full">
      <DropZone containerId={containerId} index={0} />
      {items.map((b, i) => (
        <div key={b.id}>
          <SortableItem block={b} />
          <DropZone containerId={containerId} index={i + 1} />
        </div>
      ))}
      {empty && !dragId && (
        <div className="rounded border border-dashed border-neutral-300 px-3 py-4 text-center text-xs text-neutral-400">
          prázdný sloupec
        </div>
      )}
    </div>
  );
}

export default function EditorCanvas() {
  const { doc, select } = useEditor();
  return (
    <div
      onClick={() => select(null)}
      className="min-h-[300px] rounded-lg border border-neutral-200 p-4"
      style={{ background: doc.background || "#ffffff" }}
    >
      <ContainerView items={doc.blocks} containerId={ROOT} />
    </div>
  );
}

function blockAlign(block: Block): "left" | "center" | "right" {
  if (block.type === "spacer" || block.type === "divider") return "left";
  if ("align" in block) return block.align;
  return "left";
}

function labelFor(type: Block["type"]): string {
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
