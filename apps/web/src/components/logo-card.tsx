import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

import type { PagebuilderType } from "@/types";

import { SanityImage } from "./sanity-image";

export type LogoCardProps = {
  logo: NonNullable<PagebuilderType<"logoClouds">["logos"]>[number];
  logoHoverEffect?: boolean;
};

export function LogoCard({ logo, logoHoverEffect }: LogoCardProps) {
  const { image } = logo ?? {};
  return (

    <div className="relative group">
        {image?.asset && (
    <SanityImage
      asset={image}
      className={cn(
        "object-contain max-h-16 md:max-h-20 w-auto transition-all duration-300 pointer-events-none",
        logoHoverEffect ? "grayscale group-hover:grayscale-0" : "grayscale",
      )}
    />  )}
  </div> 

  );
}
