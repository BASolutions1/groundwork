import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { StageContent } from "./types";
import { stagePath } from "./content";

export function stageMetadata(stage: StageContent): Metadata {
  const url = `${SITE_URL}${stagePath(stage.slug)}`;
  const fullTitle = `${stage.h1} | ${SITE_NAME}`;
  return {
    title: {
      absolute: fullTitle,
    },
    description: stage.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: stage.metaDescription,
      url,
      siteName: SITE_NAME,
      locale: "en_CA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: stage.metaDescription,
    },
  };
}

export function stageFaqJsonLd(stage: StageContent) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: stage.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function stageBreadcrumbJsonLd(stage: StageContent) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Start",
        item: `${SITE_URL}/start`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: stage.shortTitle,
        item: `${SITE_URL}${stagePath(stage.slug)}`,
      },
    ],
  };
}

export function startIndexMetadata(): Metadata {
  const url = `${SITE_URL}/start`;
  const fullTitle = `Start your business, step by step | ${SITE_NAME}`;
  const description =
    "Seven stages to get a new Canadian business running: register, tax, banking, insurance, getting paid, tools and getting found.";
  return {
    title: {
      absolute: fullTitle,
    },
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_CA",
      type: "website",
    },
  };
}

export function startIndexBreadcrumbJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Start",
        item: `${SITE_URL}/start`,
      },
    ],
  };
}
