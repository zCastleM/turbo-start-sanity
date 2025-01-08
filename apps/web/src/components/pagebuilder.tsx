import type { QueryHomePageDataResult } from "@/lib/sanity/sanity.types";
import { HeroBlock } from "./sections/hero";

export type PageBuilderProps = {
  pageBuilder: NonNullable<QueryHomePageDataResult>["pageBuilder"];
};


export function PageBuilder({ pageBuilder }: PageBuilderProps) {
  if (!pageBuilder) return null;

  return pageBuilder.map((block) => {
    switch (block._type) {
      case "hero":
        return <HeroBlock key={block._key} {...block} />;
      default:
        return (
          <div key={block._key}>Block not found: {block._type}</div>
        );
    }
  });
}
