"use client";

import { CompanySettings } from "@/lib/types";

function Row({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-neutral-700">
        {label}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-[#8DC63F] focus:outline-none focus:ring-2 focus:ring-[#8DC63F]/30"
      />
    </label>
  );
}

export default function CompanyForm({
  company,
  onChange,
}: {
  company: CompanySettings;
  onChange: (c: CompanySettings) => void;
}) {
  const set = <K extends keyof CompanySettings>(k: K, v: CompanySettings[K]) =>
    onChange({ ...company, [k]: v });

  const setBanner = (i: number, field: "imageUrl" | "linkUrl" | "alt", v: string) => {
    const banners = company.banners.map((b, idx) =>
      idx === i ? { ...b, [field]: v } : b,
    );
    onChange({ ...company, banners });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Row
          label="URL loga"
          value={company.logoUrl}
          onChange={(v) => set("logoUrl", v)}
        />
        <Row
          label="Odkaz z loga"
          value={company.logoLinkUrl}
          onChange={(v) => set("logoLinkUrl", v)}
        />
        <Row
          label="Firemní barva (HEX)"
          value={company.brandColor}
          onChange={(v) => set("brandColor", v)}
          placeholder="#8DC63F"
        />
        <Row
          label="Barva odkazů (HEX)"
          value={company.linkColor}
          onChange={(v) => set("linkColor", v)}
          placeholder="#1155CC"
        />
        <Row
          label="Výchozí Facebook"
          value={company.defaultFacebookUrl}
          onChange={(v) => set("defaultFacebookUrl", v)}
        />
        <Row
          label="Výchozí Instagram"
          value={company.defaultInstagramUrl}
          onChange={(v) => set("defaultInstagramUrl", v)}
        />
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold text-neutral-600">Bannery</h4>
        <div className="space-y-4">
          {company.banners.map((b, i) => (
            <div
              key={i}
              className="grid grid-cols-1 gap-3 rounded-md border border-neutral-200 p-3 sm:grid-cols-3"
            >
              <Row
                label={`Banner ${i + 1} – obrázek`}
                value={b.imageUrl}
                onChange={(v) => setBanner(i, "imageUrl", v)}
              />
              <Row
                label="Odkaz"
                value={b.linkUrl}
                onChange={(v) => setBanner(i, "linkUrl", v)}
              />
              <Row
                label="Popisek (alt)"
                value={b.alt}
                onChange={(v) => setBanner(i, "alt", v)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
