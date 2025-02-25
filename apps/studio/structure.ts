import {
  BookMarked,
  CogIcon,
  File,
  FileText,
  FolderIcon,
  HomeIcon,
  type LucideIcon,
  MessageCircleQuestion,
  PanelBottomIcon,
  PanelTopDashedIcon,
  Settings2,
  User,
} from "lucide-react";
import type {
  StructureBuilder,
  StructureResolverContext,
} from "sanity/structure";

import type { SchemaType, SingletonType } from "./schemaTypes";
import { getTitleCase } from "./utils/helper";

type Base<T = SchemaType> = {
  id?: string;
  type: T;
  preview?: boolean;
  title?: string;
  icon?: LucideIcon;
};

type CreateSingleTon = {
  S: StructureBuilder;
} & Base<SingletonType>;

const createSingleTon = ({ S, type, title, icon }: CreateSingleTon) => {
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

const createList = ({ S, type, icon, title, id }: CreateList) => {
  const newTitle = title ?? getTitleCase(type);
  return S.documentTypeListItem(type)
    .id(id ?? type)
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
                .documentId(index.type),
            ),
          S.documentTypeListItem(list.type)
            .title(`${listTitle}`)
            .icon(list.icon ?? File),
        ]),
    );
};

type CreateNestedList = {
  S: StructureBuilder;
  list: Base;
  index: Base;
  context: StructureResolverContext;
};

// First, let's add an interface for the Page type
interface SanityPage {
  _id: string;
  _type: string;
  title: string;
  slug: string;
}

interface PageTemplate {
  title: string;
  slug: string;
}

const createNestedList = async ({
  S,
  list,
  index,
  context,
}: CreateNestedList) => {
  const { getClient } = context;
  const client = getClient({ apiVersion: "2024-01-17" });

  // Fetch all pages with their slugs
  const pages = await client.fetch<SanityPage[]>(
    `
    *[_type == "page"] {
      _id,
      _type,
      title,
      "slug": slug.current
    }
  `,
    {},
    {
      perspective: "previewDrafts",
    },
  );

  interface GroupedPages {
    [key: string]: {
      name: string;
      parent: SanityPage | undefined;
      children: SanityPage[];
    };
  }

  const rootPages = pages.filter(
    (p) =>
      p.slug.split("/").filter(Boolean).length === 1 &&
      !pages.some((child) => child.slug.startsWith(`${p.slug}/`)),
  );
  const nestedPages = pages.filter(
    (p) => p.slug.split("/").filter(Boolean).length > 1,
  );
  const grouped = nestedPages.reduce<GroupedPages>((acc, page) => {
    const pathParts = page.slug.split("/").filter(Boolean);
    if (pathParts.length < 2) return acc;

    const [first] = pathParts;
    const parent = pages.find((p) => p.slug === `/${first}`);
    if (!acc[first]) {
      acc[first] = {
        name: first,
        parent,
        children: [],
      };
    }
    acc[first].children.push(page);
    return acc;
  }, {});

  return S.listItem()
    .title(list.title ?? getTitleCase(list.type))
    .icon(list.icon ?? FolderIcon)
    .child(
      S.list()
        .title(list.title ?? getTitleCase(list.type))
        .items([
          S.divider(),
          ...Object.values(grouped).map((g) =>
            S.listItem()
              .title(getTitleCase(g.name))
              .icon(FolderIcon)
              .child(
                S.documentList()
                  .title(g.name)
                  .filter(
                    `_type == "page" && string::startsWith(slug.current, "${g.parent?.slug}")`,
                  )
                  .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                  .initialValueTemplates([
                    {
                      id: "create-child-page",
                      title: "Create Child Page",
                      schemaType: "page",
                      parameters: {
                        slug: g.parent?.slug || "",
                        title: getTitleCase(g.name),
                      },
                      templateId: "create-child-page",
                      type: "initialValueTemplateItem",
                    },
                    // S.initialValueTemplateItem("create-child-page", {
                    S.initialValueTemplateItem("create-child-paged-list", {
                      parentId: g.parent?._id || "",
                      title: `${getTitleCase(g.name)} List`,
                    }),
                  ])
                  .schemaType("page"),
              ),
          ),
          S.divider(),
          ...rootPages.map((p) =>
            S.documentListItem().schemaType("page").title(p.title).id(p._id),
          ),
        ]),
    );
};

export const structure = async (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  return S.list()
    .title("Content")
    .items([
      createSingleTon({ S, type: "homePage", icon: HomeIcon }),
      S.divider(),
      await createNestedList({
        S,
        list: { type: "page", title: "Pages" },
        index: { type: "page" },
        context,
      }),
      createIndexList({
        S,
        index: { type: "blogIndex", icon: BookMarked },
        list: { type: "blog", title: "Blogs", icon: FileText },
      }),
      createList({
        S,
        type: "faq",
        title: "FAQs",
        icon: MessageCircleQuestion,
      }),
      createList({ S, type: "author", title: "Authors", icon: User }),
      S.divider(),
      S.listItem()
        .title("Site Configuration")
        .icon(Settings2)
        .child(
          S.list()
            .title("Site Configuration")
            .items([
              createSingleTon({
                S,
                type: "navbar",
                title: "Navigation",
                icon: PanelTopDashedIcon,
              }),
              createSingleTon({
                S,
                type: "footer",
                title: "Footer",
                icon: PanelBottomIcon,
              }),
              createSingleTon({
                S,
                type: "settings",
                title: "Global Settings",
                icon: CogIcon,
              }),
            ]),
        ),
    ]);
};
