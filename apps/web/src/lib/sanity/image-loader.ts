"use client";

import type { ImageLoaderProps } from "next/image";

export const sanityImageLoader = ({
  src,
  width,
  quality,
}: ImageLoaderProps) => {
  console.log("🚀 ~  src,width,quality,:", { src, width, quality });
  //   return "https://picsum.photos/200/300";

  return src;
};
