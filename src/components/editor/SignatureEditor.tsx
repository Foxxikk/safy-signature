"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Block,
  SignatureDoc,
  defaultSignatureDoc,
  deleteBlock,
  duplicateBlock,
  insertBlock,
  moveBlock,
  newBlock,
  updateBlock,
} from "@/lib/blocks";
import { renderSignatureHtml, renderSignatureDocument, sizeKb } from "@/lib/render";
import { CompanySettings } from "@/lib/types";
import { defaultCompany } from "@/lib/defaults";
import { loadCompany } from "@/lib/storage";
import {
  loadCurrentDoc,
  saveCurrentDoc,
  loadLibrary,
  upsertToLibrary,
  deleteFromLibrary,
} from "@/lib/library";
import { copyRichHtml, downloadHtml } from "@/lib/clipboard";
import { EditorCtx } from "./EditorContext";
import EditorCanvas from "./EditorCanvas";
import Palette from "./Palette";
import Inspector from "./Inspector";

export default function SignatureEditor() {
  const [company, setCompany] = useState<CompanySettings>(defaultCompany());
  const [doc, setDoc] = useState<SignatureDoc | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [library, setLibrary] = useState<SignatureDoc[]>([]);
  const [copied, setCopied] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    const c = loadCompany();
    setCompany(c);
    const existing = loadCurrentDoc();
    setDoc(existing ?? defaultSignatureDoc(c));
    setLibrary(loadLibrary());
    initialized.current = true;
  }, []);

  useEffect(() => {
    if (initialized.current && doc) saveCurrentDoc(doc);
  }, [doc]);

  const inner = useMemo(() => (doc ? renderSignatureHtml(doc) : ""), [doc]);
  const kb = sizeKb(inner);
  const sizeOk = kb < 15;

  if (!doc) {
    return <div className="p-8 text-sm text-neutral-400">Načítám editor…</div>;
  }

  const api = {
    doc,
    selectedId,
    select: setSelectedId,
    dragId,
    setDragId,
    update: (id: string, patch: Record<string, unknown>) =>
      setDoc((d) => (d ? updateBlock(d, id, patch) : d)),
    remove: (id: string) => {
      setDoc((d) => (d ? deleteBlock(d, id) : d));
      setSelectedId((s) => (s === id ? null : s));
    },
    duplicate: (id: string) => setDoc((d) => (d ? duplicateBlock(d, id) : d)),
    move: (blockId: string, containerId: string, index: number) =>
      setDoc((d) => (d ? moveBlock(d, blockId, containerId, index) : d)),
    addBlock: (type: Block["type"], containerId: string, index: number) => {
      const b = newBlock(type, company);
      setDoc((d) => (d ? insertBlock(d, b, containerId, index) : d));
      setSelectedId(b.id);
    },
  };

  async function handleCopy() {
    const ok = await copyRichHtml(inner);
    setCopied(ok);
    setTimeout(() => setCopied(false), 2500);
  }
  function handleDownload() {
    const slug = doc!.name.trim().toLowerCase().replace(/\s+/g, "-") || "podpis";
    downloadHtml(`podpis-${slug}.html`, renderSignatureDocument(doc!));
  }
  function handleSaveLibrary() {
    setLibrary(upsertToLibrary(doc!));
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  }
  function handleLoad(id: string) {
    const found = library.find((d) => d.id === id);
    if (found) {
      setDoc(JSON.parse(JSON.stringify(found)));
      setSelectedId(null);
    }
  }
  function handleNew() {
    setDoc(defaultSignatureDoc(company));
    setSelectedId(null);
  }

  return (
    <EditorCtx.Provider value={api}>
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200 bg-white p-3">
        <input
          value={doc.name}
          onChange={(e) => setDoc({ ...doc, name: e.target.value })}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium focus:border-[#8DC63F] focus:outline-none"
        />
        <span
          className={`text-xs font-medium ${sizeOk ? "text-green-600" : "text-amber-600"}`}
          title="Velikost HTML (nahrané obrázky se počítají)"
        >
          {kb} kB {sizeOk ? "✓" : "⚠"}
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button onClick={handleCopy} className="rounded-md bg-[#8DC63F] px-3 py-1.5 text-sm font-semibold text-black hover:brightness-95">
            {copied ? "✓ Zkopírováno" : "Kopírovat podpis"}
          </button>
          <button onClick={handleDownload} className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">
            Stáhnout .html
          </button>
          <button onClick={handleSaveLibrary} className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">
            {savedFlash ? "✓ Uloženo" : "Uložit do knihovny"}
          </button>
          <select
            onChange={(e) => {
              if (e.target.value) handleLoad(e.target.value);
              e.target.value = "";
            }}
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
            defaultValue=""
          >
            <option value="">Knihovna…</option>
            {library.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <button onClick={handleNew} className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">
            Nový ze šablony
          </button>
        </div>
      </div>

      {/* Hlavní layout */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[190px_1fr_300px]">
        <aside className="rounded-xl border border-neutral-200 bg-white p-3">
          <Palette />
          {library.length > 0 && (
            <div className="mt-4 border-t border-neutral-100 pt-3">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Uložené podpisy
              </h3>
              <ul className="space-y-1">
                {library.map((d) => (
                  <li key={d.id} className="flex items-center justify-between text-xs">
                    <button onClick={() => handleLoad(d.id)} className="truncate text-left text-neutral-700 hover:text-black">
                      {d.name}
                    </button>
                    <button
                      onClick={() => setLibrary(deleteFromLibrary(d.id))}
                      className="ml-2 text-neutral-400 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        <section>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Plocha – přetahuj, klikni pro úpravu
          </div>
          <EditorCanvas />
        </section>

        <aside className="rounded-xl border border-neutral-200 bg-white p-4">
          <Inspector />
        </aside>
      </div>

      {/* Skutečný e-mailový náhled */}
      <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Náhled e-mailu (přesně jak dorazí)
          </h3>
          <button onClick={() => setShowSource((s) => !s)} className="text-xs text-neutral-500 hover:underline">
            {showSource ? "Skrýt HTML" : "Zobrazit HTML"}
          </button>
        </div>
        <div className="overflow-x-auto rounded-lg border border-neutral-100 p-4">
          <div dangerouslySetInnerHTML={{ __html: inner }} />
        </div>
        {showSource && (
          <textarea
            readOnly
            value={inner}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-3 h-40 w-full rounded-md border border-neutral-300 bg-neutral-50 p-3 font-mono text-xs text-neutral-700"
          />
        )}
      </div>
    </EditorCtx.Provider>
  );
}
