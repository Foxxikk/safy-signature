"use client";

import { useEffect, useRef, useState } from "react";
import PersonForm from "@/components/PersonForm";
import SignaturePanel from "@/components/SignaturePanel";
import CompanyForm from "@/components/CompanyForm";
import { CompanySettings, Person, emptyPerson } from "@/lib/types";
import { defaultCompany, sampleGabriela } from "@/lib/defaults";
import {
  loadCompany,
  saveCompany,
  loadPeople,
  savePeople,
  exportBackup,
  importBackup,
  Backup,
} from "@/lib/storage";

const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "safy2026";

type Tab = "roster" | "company" | "backup";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);

  const [tab, setTab] = useState<Tab>("roster");
  const [company, setCompany] = useState<CompanySettings>(defaultCompany());
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authed) return;
    setCompany(loadCompany());
    const p = loadPeople();
    setPeople(p);
    setSelectedId(p[0]?.id ?? null);
  }, [authed]);

  const selected = people.find((p) => p.id === selectedId) ?? null;

  function flashSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  // --- Roster ---
  function addPerson(seed?: Person) {
    const p = seed ?? emptyPerson();
    const next = [...people, p];
    setPeople(next);
    savePeople(next);
    setSelectedId(p.id);
    setTab("roster");
  }
  function updateSelected(p: Person) {
    const next = people.map((x) => (x.id === p.id ? p : x));
    setPeople(next);
    savePeople(next);
  }
  function deletePerson(id: string) {
    const next = people.filter((p) => p.id !== id);
    setPeople(next);
    savePeople(next);
    if (selectedId === id) setSelectedId(next[0]?.id ?? null);
  }

  // --- Company ---
  function saveCompanySettings() {
    saveCompany(company);
    flashSaved();
  }

  // --- Backup ---
  function doExport() {
    const data = exportBackup();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `safy-podpisy-zaloha-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  function doImport(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const b = JSON.parse(String(reader.result)) as Backup;
        importBackup(b);
        setCompany(loadCompany());
        const p = loadPeople();
        setPeople(p);
        setSelectedId(p[0]?.id ?? null);
        flashSaved();
      } catch {
        alert("Soubor se nepodařilo načíst – zkontroluj, že jde o export z této aplikace.");
      }
    };
    reader.readAsText(file);
  }

  // --- Login gate ---
  if (!authed) {
    return (
      <div className="mx-auto max-w-sm rounded-xl border border-neutral-200 bg-white p-6">
        <h1 className="mb-1 text-xl font-bold">Admin – přihlášení</h1>
        <p className="mb-4 text-sm text-neutral-500">
          Zadej heslo pro správu podpisů týmu.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pw === ADMIN_PASSWORD) {
              setAuthed(true);
              setPwError(false);
            } else {
              setPwError(true);
            }
          }}
        >
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Heslo"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-[#8DC63F] focus:outline-none focus:ring-2 focus:ring-[#8DC63F]/30"
          />
          {pwError && (
            <p className="mt-2 text-sm text-red-600">Nesprávné heslo.</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700"
          >
            Přihlásit
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        {saved && (
          <span className="text-sm font-medium text-green-600">✓ Uloženo</span>
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            ["roster", "Lidé"],
            ["company", "Firemní nastavení"],
            ["backup", "Záloha"],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              tab === key
                ? "bg-neutral-900 text-white"
                : "border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "roster" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="mb-3 flex gap-2">
              <button
                onClick={() => addPerson()}
                className="flex-1 rounded-md bg-[#8DC63F] px-3 py-1.5 text-sm font-semibold text-black hover:brightness-95"
              >
                + Přidat
              </button>
              {people.length === 0 && (
                <button
                  onClick={() => addPerson(sampleGabriela())}
                  className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50"
                  title="Vloží ukázkovou osobu"
                >
                  Ukázka
                </button>
              )}
            </div>
            <ul className="space-y-1">
              {people.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => setSelectedId(p.id)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm ${
                      selectedId === p.id
                        ? "bg-neutral-100 font-semibold"
                        : "hover:bg-neutral-50"
                    }`}
                  >
                    <span className="truncate">
                      {p.fullName || "(bez jména)"}
                    </span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePerson(p.id);
                      }}
                      className="ml-2 shrink-0 text-neutral-400 hover:text-red-600"
                      title="Smazat"
                    >
                      ✕
                    </span>
                  </button>
                </li>
              ))}
              {people.length === 0 && (
                <li className="px-3 py-2 text-sm text-neutral-400">
                  Zatím žádní lidé.
                </li>
              )}
            </ul>
          </aside>

          <section className="space-y-6">
            {selected ? (
              <>
                <div className="rounded-xl border border-neutral-200 bg-white p-6">
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
                    Údaje osoby
                  </h2>
                  <PersonForm person={selected} onChange={updateSelected} />
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white p-6">
                  <SignaturePanel person={selected} company={company} />
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-neutral-400">
                Přidej osobu nebo ji vyber vlevo.
              </div>
            )}
          </section>
        </div>
      )}

      {tab === "company" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <CompanyForm company={company} onChange={setCompany} />
          </div>
          <button
            onClick={saveCompanySettings}
            className="rounded-md bg-[#8DC63F] px-4 py-2 text-sm font-semibold text-black hover:brightness-95"
          >
            Uložit firemní nastavení
          </button>
        </div>
      )}

      {tab === "backup" && (
        <div className="max-w-lg space-y-4 rounded-xl border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-600">
            Data (lidé i firemní nastavení) se ukládají v tomto prohlížeči.
            Zálohuj je do souboru a přenes na jiné zařízení pomocí importu.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={doExport}
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50"
            >
              Exportovat JSON
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50"
            >
              Importovat JSON
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) doImport(f);
                e.target.value = "";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
