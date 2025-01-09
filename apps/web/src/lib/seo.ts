/* eslint-disable @typescript-eslint/no-explicit-any */
import { getBaseUrl } from "@/config";
import type { Metadata } from "next";

interface OgImageOptions {
  type?: string;
  id?: string;
}

const getOgImage = ({ type, id }: OgImageOptions = {}): string => {
  const params = new URLSearchParams();
  if (id) params.set("id", id);
  if (type) params.set("type", type);
  return `api/og?${params.toString()}`;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const getMetaData = (data: Record<string, any>): Metadata => {
  const {
    _type,
    seoDescription,
    seoTitle,
    slug,
    title,
    description,
    _id,
  } = data;

  const baseUrl = getBaseUrl();

  const pageSlug = typeof slug === "string" ? slug : slug?.current;

  const pageUrl = `${baseUrl}${pageSlug}`;

  console.log("🚀 ~ getMetaData ~ pageUrl:", pageUrl);
  const meta = {
    title: seoTitle ?? title ?? "",
    description: seoDescription ?? description ?? "",
  };

  const ogImage = getOgImage({
    type: _type,
    id: _id,
  });

  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL(baseUrl),
    creator: "Roboto Studio Demo",
    authors: [
      {
        name: "Roboto",
      },
    ],
    twitter: {
      card: "summary_large_image",
      images: [ogImage],
      creator: "@studioroboto",
      title: meta.title,
      description: meta.description,
    },
    openGraph: {
      type: "website",
      countryName: "UK",
      description: meta.description,
      title: meta.title,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: meta.title,
          secureUrl: ogImage,
        },
      ],
      url: pageUrl,
    },
  };
};
