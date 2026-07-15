"use client";

import { useState } from "react";

const guides: { key: string; label: string; steps: string[] }[] = [
  {
    key: "gmail",
    label: "Gmail",
    steps: [
      "Klikni na „Kopírovat podpis“ výše.",
      "V Gmailu otevři Nastavení (ozubené kolo) → Zobrazit všechna nastavení.",
      "Sjeď dolů na sekci „Podpis“ a vytvoř nový podpis.",
      "Do pole podpisu vlož (Ctrl/Cmd+V) zkopírovaný podpis.",
      "Dole ulož změny tlačítkem „Uložit změny“.",
    ],
  },
  {
    key: "outlook-win",
    label: "Outlook (Windows)",
    steps: [
      "Klikni na „Kopírovat podpis“ výše.",
      "V Outlooku: Soubor → Možnosti → Pošta → Podpisy.",
      "Vytvoř nový podpis a do editoru vlož (Ctrl+V).",
      "Nastav podpis jako výchozí pro nové zprávy i odpovědi.",
      "Potvrď tlačítkem OK.",
    ],
  },
  {
    key: "outlook-mac",
    label: "Outlook (Mac)",
    steps: [
      "Klikni na „Kopírovat podpis“ výše.",
      "V Outlooku: Nastavení → Podpisy.",
      "Přidej nový podpis (+) a do editoru vlož (Cmd+V).",
      "Přiřaď podpis k účtu pro nové zprávy i odpovědi.",
      "Zavři okno – uloží se automaticky.",
    ],
  },
];

export default function InstallGuide() {
  const [active, setActive] = useState("gmail");
  const g = guides.find((x) => x.key === active)!;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
        Jak podpis nainstalovat
      </h3>
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
    </div>
  );
}
