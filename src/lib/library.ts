"use client";

import { SignatureDoc } from "./blocks";

const K_CURRENT = "safy-sig-current-doc";
const K_LIBRARY = "safy-sig-library";

export function loadCurrentDoc(): SignatureDoc | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(K_CURRENT);
    return raw ? (JSON.parse(raw) as SignatureDoc) : null;
  } catch {
    return null;
  }
}

export function saveCurrentDoc(doc: SignatureDoc): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(K_CURRENT, JSON.stringify(doc));
}

export function loadLibrary(): SignatureDoc[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(K_LIBRARY);
    return raw ? (JSON.parse(raw) as SignatureDoc[]) : [];
  } catch {
    return [];
  }
}

export function saveLibrary(docs: SignatureDoc[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(K_LIBRARY, JSON.stringify(docs));
}

// Uloží / přepíše podpis v knihovně podle id.
export function upsertToLibrary(doc: SignatureDoc): SignatureDoc[] {
  const lib = loadLibrary();
  const i = lib.findIndex((d) => d.id === doc.id);
  const copy = JSON.parse(JSON.stringify(doc)) as SignatureDoc;
  if (i >= 0) lib[i] = copy;
  else lib.push(copy);
  saveLibrary(lib);
  return lib;
}

export function deleteFromLibrary(id: string): SignatureDoc[] {
  const lib = loadLibrary().filter((d) => d.id !== id);
  saveLibrary(lib);
  return lib;
}
