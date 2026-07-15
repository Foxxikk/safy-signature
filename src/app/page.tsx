"use client";

import SignatureEditor from "@/components/editor/SignatureEditor";
import InstallGuide from "@/components/InstallGuide";

export default function Home() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">
          Editor podpisu
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Přetahuj prvky, klikni pro úpravu, měň barvy, velikosti, obrázky i
          rozestupy. Výstup funguje v Gmailu, Outlooku (Windows) i Outlooku pro
          Mac.
        </p>
      </div>

      <SignatureEditor />

      <div className="mt-6">
        <InstallGuide />
      </div>
    </div>
  );
}
