import type {
  StructureBuilder,
  StructureResolverContext,
} from "sanity/structure";
import { getTitleCase } from "./utils/helper";
import type { SchemaType, SingletonType } from "./schemaTypes";
import {
  BookMarked,
  File,
  FileText,
  HomeIcon,
  type LucideIcon,
} from "lucide-react";

type Base<T = SchemaType> = {
  type: T;
  preview?: boolean;
  title?: string;
  icon?: LucideIcon;
};

type CreateSingleTon = {
  S: StructureBuilder;
} & Base<SingletonType>;

const createSingleTon = ({
  S,
  type,
  title,
  icon,
}: CreateSingleTon) => {
  const newTitle = title ?? getTitleCase(type);
  return S.listItem()
    .title(newTitle)
    .icon(icon ?? File)
    .child(S.document().schemaType(type).documentId(type));
};

type CreateList = {
  S: StructureBuilder;
} & Base;

// This function creates a list item for a type. It takes a StructureBuilder instance (S),
// a type, an icon, and a title as parameters. It generates a title for the type if not provided,
// and uses a default icon if not provided. It then returns a list item with the generated or
// provided title and icon.

const createList = ({ S, type, icon, title }: CreateList) => {
  const newTitle = title ?? getTitleCase(type);
  return S.documentTypeListItem(type)
    .title(newTitle)
    .icon(icon ?? File);
};

type CreateIndexList = {
  S: StructureBuilder;
  list: Base;
  index: Base<SingletonType>;
};

const createIndexList = ({ S, index, list }: CreateIndexList) => {
  const indexTitle = index.title ?? getTitleCase(index.type);
  const listTitle = list.title ?? getTitleCase(list.type);
  return S.listItem()
    .title(listTitle)
    .icon(index.icon ?? File)
    .child(
      S.list()
        .title(indexTitle)
        .items([
          S.listItem()
            .title(indexTitle)
            .icon(index.icon ?? File)
            .child(
              S.document()
                .views([S.view.form()])
                .schemaType(index.type)
                .documentId(index.type)
            ),
          S.documentTypeListItem(list.type)
            .title(`${listTitle}s`)
            .icon(list.icon ?? File),
        ])
    );
};

export const structure = (
  S: StructureBuilder,
  context: StructureResolverContext
) =>
  S.list()
    .title("Content")
    .items([
      createSingleTon({ S, type: "homePage", icon: HomeIcon }),
      S.divider(),
      createList({ S, type: "page" }),
      createIndexList({
        S,
        index: { type: "blogIndex", icon: BookMarked },
        list: { type: "blog", icon: FileText },
      }),
      //   createIndexList({
      //     S,
      //     index: { type: "blogIndex", icon: BookMarked },
      //     list: { type: "blog", icon: FileText },
      //   }),
      //   createList({ S, type: "form", icon: ClipboardType }),
      //   S.divider(),
      //   createNestedList({
      //     S,
      //     title: "Settings",
      //     icon: Settings,
      //     items: [
      //       createSingleTon({ S, type: "navbar", icon: Menu }),
      //       createSingleTon({ S, type: "footer", icon: Footprints }),
      //       createSingleTon({ S, type: "logo", icon: Building2 }),
      //     ],
      //   }),
    ]);
