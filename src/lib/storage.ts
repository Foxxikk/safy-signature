"use client";

import { CompanySettings, Person } from "./types";
import { defaultCompany } from "./defaults";

const K_COMPANY = "safy-sig-company";
const K_PEOPLE = "safy-sig-people";

export function loadCompany(): CompanySettings {
  if (typeof window === "undefined") return defaultCompany();
  try {
    const raw = localStorage.getItem(K_COMPANY);
    if (!raw) return defaultCompany(window.location.origin);
    return { ...defaultCompany(window.location.origin), ...JSON.parse(raw) };
  } catch {
    return defaultCompany(window.location.origin);
  }
}

export function saveCompany(c: CompanySettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(K_COMPANY, JSON.stringify(c));
}

export function loadPeople(): Person[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(K_PEOPLE);
    return raw ? (JSON.parse(raw) as Person[]) : [];
  } catch {
    return [];
  }
}

export function savePeople(people: Person[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(K_PEOPLE, JSON.stringify(people));
}

export interface Backup {
  company: CompanySettings;
  people: Person[];
  exportedAt: string;
}

export function exportBackup(): Backup {
  return {
    company: loadCompany(),
    people: loadPeople(),
    exportedAt: new Date().toISOString(),
  };
}

export function importBackup(b: Backup): void {
  if (b.company) saveCompany(b.company);
  if (b.people) savePeople(b.people);
}
