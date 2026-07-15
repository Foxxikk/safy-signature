"use client";

import { useEffect, useState } from "react";
import PersonForm from "@/components/PersonForm";
import SignaturePanel from "@/components/SignaturePanel";
import InstallGuide from "@/components/InstallGuide";
import { CompanySettings, Person, emptyPerson } from "@/lib/types";
import { defaultCompany } from "@/lib/defaults";
import { loadCompany } from "@/lib/storage";

export default function Home() {
  const [company, setCompany] = useState<CompanySettings>(defaultCompany());
  const [person, setPerson] = useState<Person>(emptyPerson());

  // Načti firemní nastavení (a doménu pro obrázky) až v prohlížeči.
  useEffect(() => {
    setCompany(loadCompany());
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">
          Vytvoř si emailový podpis
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Vyplň svoje údaje, sleduj náhled a podpis si zkopíruj nebo stáhni.
          Funguje v Gmailu, Outlooku (Windows) i Outlooku pro Mac.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Tvoje údaje
          </h2>
          <PersonForm person={person} onChange={setPerson} />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <SignaturePanel person={person} company={company} />
          </div>
          <InstallGuide />
        </div>
      </div>
    </div>
  );
}
