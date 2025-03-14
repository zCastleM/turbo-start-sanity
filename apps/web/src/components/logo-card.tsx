import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

import type { PagebuilderType } from "@/types";

import { SanityImage } from "./sanity-image";

export type LogoCardProps = {
  logo: NonNullable<PagebuilderType<"logoListWithMotion">["logos"]>[number];
  className?: string;
};

export function LogoCard({ logo, className }: LogoCardProps) {
  const { image } = logo ?? {};
  return (
    <div className={cn("flex justify-center", className)}>
      {image?.asset && (
        <SanityImage
          asset={image}
          className="object-contain max-h-16 md:max-h-20 w-auto transition-all duration-300 pointer-events-none grayscale hover:grayscale-0"
        />
      )}
    </div>
  );
}
