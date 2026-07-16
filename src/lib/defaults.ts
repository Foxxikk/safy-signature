import { CompanySettings, Person } from "./types";

// Vrátí základ URL aplikace (pro odkazování obrázků z /public).
// Na Vercelu to bude nasazená doména, lokálně localhost.
export function appOrigin(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

// Firemní obrázky hostujeme na vlastní doméně Šafy (signature.safyproduction.cz).
// Důvod: Outlook blokuje obrázky z cizích domén (např. *.vercel.app), ale
// obrázky z firemní domény bere jako důvěryhodné a nezablokuje je.
// Jsou to tytéž ověřené assety, které používá i původní funkční nástroj.
const ASSETS = "https://signature.safyproduction.cz/src/img";

// Výchozí firemní nastavení Šafy Production.
export function defaultCompany(origin = ""): CompanySettings {
  void origin;
  return {
    logoUrl: `${ASSETS}/generic/safy.png`,
    logoLinkUrl: "https://www.safyproduction.cz",
    brandColor: "#8DC63F",
    textColor: "#2D2D2D",
    mutedColor: "#444444",
    linkColor: "#1155CC",
    fbIconUrl: `${ASSETS}/generic/f.png`,
    igIconUrl: `${ASSETS}/generic/i.png`,
    defaultFacebookUrl: "https://www.facebook.com/safyproduction",
    defaultInstagramUrl: "https://www.instagram.com/safyproduction",
    photoSize: 92,
    photoShape: "circle",
    spacing: "normal",
    bannerWidth: 300,
    banners: [
      {
        imageUrl: `${ASSETS}/generic/obcasnik-cz-1.1-opt.png`,
        linkUrl: "https://www.safyproduction.cz",
        alt: "Šafy Občasník",
      },
      {
        imageUrl: `${ASSETS}/generic/showreel-cz-1.1-opt.png`,
        linkUrl: "https://www.youtube.com/@safyproduction",
        alt: "Šafy Showreel",
      },
    ],
  };
}

// URL firemních assetů (pro šablonu).
export const ASSET_BASE = ASSETS;

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
