"use client";

import { SignatureDoc } from "./blocks";

// Zakódování podpisu přímo do odkazu (URL hash) – žádný server, žádná databáze.
// Podpis tak „cestuje" v odkazu; příjemce si ho otevře a vidí ho, i když ho
// nemá uložený u sebe v prohlížeči.

function b64encode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64decode(s: string): string {
  const t = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(t);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeDoc(doc: SignatureDoc): string {
  return b64encode(JSON.stringify(doc));
}

export function decodeDoc(s: string): SignatureDoc | null {
  try {
    return JSON.parse(b64decode(s)) as SignatureDoc;
  } catch {
    return null;
  }
}

export function encodeLib(docs: SignatureDoc[]): string {
  return b64encode(JSON.stringify(docs));
}

export function decodeLib(s: string): SignatureDoc[] | null {
  try {
    return JSON.parse(b64decode(s)) as SignatureDoc[];
  } catch {
    return null;
  }
}

// Postaví sdílecí odkaz. kind: "d" = jeden podpis, "t" = celý tým.
export function buildShareUrl(kind: "d" | "t", payload: string): string {
  const base =
    typeof window !== "undefined"
      ? window.location.origin + window.location.pathname
      : "";
  return `${base}#${kind}=${payload}`;
}

export function parseHash(): { kind: "d" | "t"; payload: string } | null {
  if (typeof window === "undefined") return null;
  const h = window.location.hash.replace(/^#/, "");
  const m = h.match(/^(d|t)=(.+)$/);
  if (!m) return null;
  return { kind: m[1] as "d" | "t", payload: m[2] };
}
