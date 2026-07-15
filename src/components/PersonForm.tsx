"use client";

import { Person } from "@/lib/types";

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
  const set = <K extends keyof Person>(key: K, val: Person[K]) =>
    onChange({ ...person, [key]: val });

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
        label="URL profilové fotky (volitelné)"
        value={person.photoUrl}
        onChange={(v) => set("photoUrl", v)}
        placeholder="https://…/foto.jpg"
      />

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
