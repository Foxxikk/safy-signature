import { CompanySettings, Person } from "./types";

// Vrátí základ URL aplikace (pro odkazování obrázků z /public).
// Na Vercelu to bude nasazená doména, lokálně localhost.
export function appOrigin(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

// Výchozí firemní nastavení Šafy Production.
export function defaultCompany(origin = ""): CompanySettings {
  const base = origin || appOrigin();
  return {
    logoUrl: `${base}/sig/logo-safy.png`,
    logoLinkUrl: "https://www.safyproduction.cz",
    brandColor: "#8DC63F",
    textColor: "#2D2D2D",
    mutedColor: "#444444",
    linkColor: "#1155CC",
    fbIconUrl: `${base}/sig/fb.png`,
    igIconUrl: `${base}/sig/ig.png`,
    defaultFacebookUrl: "https://www.facebook.com/safyproduction",
    defaultInstagramUrl: "https://www.instagram.com/safyproduction",
    photoSize: 92,
    photoShape: "circle",
    spacing: "normal",
    bannerWidth: 300,
    banners: [
      {
        imageUrl: `${base}/sig/banner-obcasnik.png`,
        linkUrl: "https://www.safyproduction.cz",
        alt: "Šafy Občasník",
      },
      {
        imageUrl: `${base}/sig/banner-showreel.png`,
        linkUrl: "https://www.youtube.com/@safyproduction",
        alt: "Šafy Showreel",
      },
    ],
  };
}

// Ukázková osoba (předvyplněno podle podpisu Gabriely).
export function sampleGabriela(): Person {
  return {
    id: "gabriela",
    fullName: "Gabriela Hudec",
    role: "creative director",
    phone: "+420 702 024 636",
    email: "gabriela.hudec@safyproduction.cz",
    website: "",
    photoUrl: `${appOrigin()}/sig/sample-photo.png`,
    photoDataUrl: "",
    facebookUrl: "https://www.facebook.com/safyproduction",
    instagramUrl: "https://www.instagram.com/safyproduction",
    showFacebook: true,
    showInstagram: true,
    showBanners: true,
  };
}
