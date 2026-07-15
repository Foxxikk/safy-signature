"use client";

import { useState } from "react";

type Guide = {
  key: string;
  label: string;
  intro?: string;
  steps: string[];
  note?: string;
};

const guides: Guide[] = [
  {
    key: "gmail",
    label: "Gmail",
    steps: [
      "Klikni na „Kopírovat podpis“ nahoře.",
      "Gmail → Nastavení (ozubené kolo) → Zobrazit všechna nastavení.",
      "Sekce „Podpis“ → vytvoř nový a vlož (Ctrl/Cmd+V).",
      "Dole ulož tlačítkem „Uložit změny“.",
    ],
    note: "V Gmailu funguje kopírování spolehlivě.",
  },
  {
    key: "outlook-win",
    label: "Outlook (Windows)",
    steps: [
      "Klikni na „Kopírovat podpis“ nahoře.",
      "Outlook → Soubor → Možnosti → Pošta → Podpisy.",
      "Vytvoř nový podpis a vlož (Ctrl+V).",
      "Nastav jako výchozí pro nové zprávy i odpovědi → OK.",
      "Pošli si TESTOVACÍ e-mail sobě a zkontroluj, jak podpis dorazí.",
    ],
    note: "Obrázky se načítají z webu. Pokud je Outlook napoprvé skryje, dej „Stáhnout obrázky“. Nepoužívej nahranou (vloženou) fotku – jen fotku přes URL.",
  },
  {
    key: "outlook-mac",
    label: "Outlook (Mac)",
    steps: [
      "Klikni na „Kopírovat podpis“ nahoře.",
      "Outlook → Nastavení → Podpisy → nový podpis.",
      "Vlož do editoru (Cmd+V) a zavři okno.",
      "DŮLEŽITÉ: pošli si testovací e-mail sobě.",
    ],
    note: "V editoru podpisů Outlooku pro Mac se obrázky často NEZOBRAZÍ, ale v reálně odeslaném e-mailu ANO. Proto vždy pošli test. Fotku používej přes URL, ne nahranou.",
  },
  {
    key: "apple-mail",
    label: "Apple Mail",
    steps: [
      "Mail → Nastavení → Podpisy → přidej nový (+).",
      "Zruš zaškrtnutí „Vždy použít výchozí písmo“.",
      "Klikni na „Kopírovat podpis“ nahoře a vlož (Cmd+V).",
      "Přiřaď podpis ke svému účtu vlevo.",
    ],
    note: "Když se rozhodí formát, použij místo kopírování stažený .html soubor: otevři ho v prohlížeči, tam ho označ a zkopíruj, pak vlož do Mailu.",
  },
  {
    key: "mobil",
    label: "Mobil",
    steps: [
      "Nastav podpis na počítači (viz ostatní záložky).",
      "Na mobilu ponech jednoduchý textový podpis (jméno, pozice, telefon).",
    ],
    note: "Poctivě: mobilní e-mailové aplikace (iOS Mail, Outlook i Gmail na mobilu) neumí bohaté podpisy s obrázky – podporují jen prostý text. Obrázkový podpis na mobilu obecně nejde nastavit; to je omezení těch aplikací, ne téhle appky.",
  },
];

export default function InstallGuide() {
  const [active, setActive] = useState("gmail");
  const g = guides.find((x) => x.key === active)!;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-neutral-500">
        Jak podpis nainstalovat
      </h3>
      <p className="mb-3 text-xs text-neutral-500">
        Tip: pro Outlook a Apple Mail funguje nejlíp fotka přes URL (ne nahraná)
        a vždy si pošli testovací e-mail – v editoru se obrázky občas nezobrazí,
        ale v odeslané zprávě ano.
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {guides.map((x) => (
          <button
            key={x.key}
            onClick={() => setActive(x.key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              active === x.key
                ? "bg-neutral-900 text-white"
                : "border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>
      <ol className="list-decimal space-y-2 pl-5 text-sm text-neutral-700">
        {g.steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
      {g.note && (
        <p className="mt-3 rounded-md bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-600">
          {g.note}
        </p>
      )}
    </div>
  );
}
