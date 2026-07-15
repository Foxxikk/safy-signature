"use client";

import { useRef, useState } from "react";
import { Person } from "@/lib/types";
import { resizeImageToDataUrl, dataUrlSizeKb } from "@/lib/image";

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-neutral-700">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-[#8DC63F] focus:outline-none focus:ring-2 focus:ring-[#8DC63F]/30"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#8DC63F]"
      />
      {label}
    </label>
  );
}

export default function PersonForm({
  person,
  onChange,
}: {
  person: Person;
  onChange: (p: Person) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState("");

  const set = <K extends keyof Person>(key: K, val: Person[K]) =>
    onChange({ ...person, [key]: val });

  async function handleFile(file: File) {
    setUploadError("");
    if (!file.type.startsWith("image/")) {
      setUploadError("Vyber prosím obrázek.");
      return;
    }
    try {
      const dataUrl = await resizeImageToDataUrl(file, 240, 0.82);
      onChange({ ...person, photoDataUrl: dataUrl });
    } catch {
      setUploadError("Fotku se nepodařilo zpracovat.");
    }
  }

  const photoSizeKb = dataUrlSizeKb(person.photoDataUrl);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Jméno a příjmení"
          value={person.fullName}
          onChange={(v) => set("fullName", v)}
          placeholder="Gabriela Hudec"
        />
        <Field
          label="Pozice"
          value={person.role}
          onChange={(v) => set("role", v)}
          placeholder="creative director"
        />
        <Field
          label="Telefon"
          value={person.phone}
          onChange={(v) => set("phone", v)}
          placeholder="+420 702 024 636"
        />
        <Field
          label="E-mail"
          type="email"
          value={person.email}
          onChange={(v) => set("email", v)}
          placeholder="jmeno@safyproduction.cz"
        />
      </div>

      <Field
        label="Web (volitelné)"
        value={person.website}
        onChange={(v) => set("website", v)}
        placeholder="www.safyproduction.cz"
      />

      {/* Fotka: nahrání nebo URL */}
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <span className="mb-2 block text-sm font-medium text-neutral-700">
          Profilová fotka
        </span>
        <div className="flex items-center gap-4">
          {(person.photoDataUrl || person.photoUrl) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={person.photoDataUrl || person.photoUrl}
              alt="Náhled fotky"
              className="h-16 w-16 rounded-full object-cover ring-1 ring-neutral-300"
            />
          )}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700"
            >
              Nahrát fotku
            </button>
            {person.photoDataUrl && (
              <>
                <span className="text-xs text-neutral-500">
                  nahráno ({photoSizeKb} kB)
                </span>
                <button
                  type="button"
                  onClick={() => set("photoDataUrl", "")}
                  className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-600 hover:bg-white"
                >
                  Odebrat
                </button>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
          </div>
        </div>
        {uploadError && (
          <p className="mt-2 text-sm text-red-600">{uploadError}</p>
        )}
        <div className="mt-3">
          <Field
            label="…nebo URL fotky (lehčí varianta pro e-mail)"
            value={person.photoUrl}
            onChange={(v) => set("photoUrl", v)}
            placeholder="https://…/foto.jpg"
          />
        </div>
        <p className="mt-1 text-xs text-neutral-400">
          Nahraná fotka se vloží přímo do podpisu (zmenšená). URL fotka drží
          podpis nejlehčí.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Odkaz na Facebook (volitelné)"
          value={person.facebookUrl}
          onChange={(v) => set("facebookUrl", v)}
          placeholder="ponech prázdné = firemní"
        />
        <Field
          label="Odkaz na Instagram (volitelné)"
          value={person.instagramUrl}
          onChange={(v) => set("instagramUrl", v)}
          placeholder="ponech prázdné = firemní"
        />
      </div>

      <div className="flex flex-wrap gap-6 pt-1">
        <Toggle
          label="Facebook"
          checked={person.showFacebook}
          onChange={(v) => set("showFacebook", v)}
        />
        <Toggle
          label="Instagram"
          checked={person.showInstagram}
          onChange={(v) => set("showInstagram", v)}
        />
        <Toggle
          label="Bannery (Občasník, Showreel)"
          checked={person.showBanners}
          onChange={(v) => set("showBanners", v)}
        />
      </div>
    </div>
  );
}
