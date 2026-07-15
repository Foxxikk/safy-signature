// Datové typy pro Šafy Signature Utility

export interface Banner {
  imageUrl: string;
  linkUrl: string;
  alt: string;
}

export type Spacing = "compact" | "normal" | "spacious";
export type PhotoShape = "circle" | "square" | "rounded";

export interface CompanySettings {
  logoUrl: string;
  logoLinkUrl: string;
  brandColor: string; // firemní zelená
  textColor: string; // barva jména
  mutedColor: string; // barva popisků
  linkColor: string; // barva odkazů
  fbIconUrl: string;
  igIconUrl: string;
  defaultFacebookUrl: string;
  defaultInstagramUrl: string;
  banners: Banner[]; // firemní bannery (Občasník, Showreel …)
  photoSize: number; // px
  photoShape: PhotoShape; // tvar fotky
  spacing: Spacing; // rozestupy
  bannerWidth: number; // px, šířka jednoho banneru
}

export interface Person {
  id: string;
  fullName: string;
  role: string;
  phone: string;
  email: string;
  website: string;
  photoUrl: string; // odkaz na fotku (hostovanou na webu)
  photoDataUrl: string; // nahraná fotka (data URL) – má přednost
  facebookUrl: string;
  instagramUrl: string;
  showFacebook: boolean;
  showInstagram: boolean;
  showBanners: boolean;
}

export function emptyPerson(): Person {
  return {
    id: Math.random().toString(36).slice(2, 10),
    fullName: "",
    role: "",
    phone: "",
    email: "",
    website: "",
    photoUrl: "",
    photoDataUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    showFacebook: true,
    showInstagram: true,
    showBanners: true,
  };
}
