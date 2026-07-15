// Datové typy pro Šafy Signature Utility

export interface Banner {
  imageUrl: string;
  linkUrl: string;
  alt: string;
}

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
}

export interface Person {
  id: string;
  fullName: string;
  role: string;
  phone: string;
  email: string;
  photoUrl: string;
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
    photoUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    showFacebook: true,
    showInstagram: true,
    showBanners: true,
  };
}
