"use client";

import { useState } from "react";
import { CompanySettings, Person } from "@/lib/types";
import {
  generateSignatureHtml,
  generateSignatureDocument,
  signatureSizeKb,
} from "@/lib/signature";
import { copyRichHtml, downloadHtml } from "@/lib/clipboard";

export default function SignaturePanel({
  person,
  company,
}: {
  person: Person;
  company: CompanySettings;
}) {
  const [copied, setCopied] = useState(false);
  const [showSource, setShowSource] = useState(false);

  const inner = generateSignatureHtml(person, company);
  const doc = generateSignatureDocument(person, company);
  const sizeKb = signatureSizeKb(inner);
  const sizeOk = sizeKb < 15;

  async function handleCopy() {
    const ok = await copyRichHtml(inner);
    setCopied(ok);
    setTimeout(() => setCopied(false), 2500);
  }

  function handleDownload() {
    const slug =
      person.fullName.trim().toLowerCase().replace(/\s+/g, "-") || "podpis";
    downloadHtml(`podpis-${slug}.html`, doc);
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
            Náhled podpisu
          </h3>
          <span
            className={`text-xs font-medium ${
              sizeOk ? "text-green-600" : "text-amber-600"
            }`}
            title="Velikost HTML bez obrázků (ty jsou hostované na URL)"
          >
            {sizeKb} kB {sizeOk ? "✓" : "⚠ velké"}
          </span>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-5 overflow-x-auto">
          <div dangerouslySetInnerHTML={{ __html: inner }} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCopy}
          className="rounded-md bg-[#8DC63F] px-4 py-2 text-sm font-semibold text-black hover:brightness-95 transition"
        >
          {copied ? "✓ Zkopírováno" : "Kopírovat podpis"}
        </button>
        <button
          onClick={handleDownload}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 transition"
        >
          Stáhnout .html
        </button>
        <button
          onClick={() => setShowSource((s) => !s)}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 transition"
        >
          {showSource ? "Skrýt zdroj" : "Zobrazit HTML"}
        </button>
      </div>

      {showSource && (
        <textarea
          readOnly
          value={inner}
          onFocus={(e) => e.currentTarget.select()}
          className="h-40 w-full rounded-md border border-neutral-300 bg-neutral-50 p-3 font-mono text-xs text-neutral-700"
        />
      )}
    </div>
  );
}
