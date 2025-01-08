import type { QueryHomePageDataResult } from "@/lib/sanity/sanity.types";

export type PageBuilderProps = {
  pageBuilder: NonNullable<QueryHomePageDataResult>["pageBuilder"];
};

type HeroProps = Extract<
  NonNullable<
    NonNullable<QueryHomePageDataResult>["pageBuilder"]
  >[number],
  { _type: "hero" }
>;

const HeroBlock = ({ title }: HeroProps) => {
  return <div>{title}</div>;
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
