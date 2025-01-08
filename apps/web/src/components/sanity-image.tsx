import { urlFor } from "@/lib/sanity/client";
import type { SanityImageProps } from "@/types";
import { getImageDimensions } from "@sanity/asset-utils";
import Image, { type ImageProps as NextImageProps } from "next/image";

type ImageProps = {
  asset: SanityImageProps;
  alt?: string;
} & Omit<NextImageProps, "alt" | "src">;

export function SanityImage({
  asset,
  alt,
  width,
  height,
  ...props
}: ImageProps) {
  if (!asset?.asset) return null;
  const dimensions = getImageDimensions(asset.asset);

  const url = urlFor({ ...asset, _id: asset.asset._ref })
    .width(dimensions.width)
    .height(dimensions.height)
    .url();

  return (
    <Image
      alt={alt ?? asset.alt ?? "Image"}
      src={url}
      width={width ?? dimensions.width}
      height={height ?? dimensions.height}
      {...props}
    />
  );
}
