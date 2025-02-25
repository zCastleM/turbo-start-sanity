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

  // Safely handle empty results
  if (!pages || !Array.isArray(pages) || pages.length === 0) {
    return S.listItem()
      .title(list.title ?? getTitleCase(list.type))
      .icon(list.icon ?? FolderIcon)
      .child(
        S.list()
          .title(list.title ?? getTitleCase(list.type))
          .items([])
          .canHandleIntent(
            (intent, params) => intent === "create" && params.type === "page",
          ),
      );
  }

  // Normalize slugs to ensure consistent format
  const normalizedPages = pages.map((page) => ({
    ...page,
    slug: page.slug
      ? page.slug.startsWith("/")
        ? page.slug
        : `/${page.slug}`
      : "/",
    title: page.title || "Untitled Page",
  }));

  // Identify parent-child relationships
  const pageHierarchy: Record<
    string,
    { parent: SanityPage | null; children: SanityPage[] }
  > = {};

  // First, identify all potential parent paths
  for (const page of normalizedPages) {
    const segments = page.slug.split("/").filter(Boolean);
    if (segments.length === 1) {
      const path = `/${segments[0]}`;
      if (!pageHierarchy[path]) {
        pageHierarchy[path] = { parent: page, children: [] };
      } else {
        pageHierarchy[path].parent = page;
      }
    }
  }

  // Then, identify all children
  for (const page of normalizedPages) {
    const segments = page.slug.split("/").filter(Boolean);
    if (segments.length > 1) {
      const parentPath = `/${segments[0]}`;
      if (!pageHierarchy[parentPath]) {
        pageHierarchy[parentPath] = { parent: null, children: [] };
      }
      pageHierarchy[parentPath].children.push(page);
    }
  }

  // Create list items - only create folders for parents with children
  const listItems = [];
  const standalonePages = [];

  for (const [path, { parent, children }] of Object.entries(pageHierarchy)) {
    // If this page has children, create a folder
    if (children.length > 0) {
      const parentSlug = path.substring(1);
      const parentTitle = parent?.title || getTitleCase(parentSlug);

      listItems.push(
        S.listItem()
          .title(parentTitle)
          .icon(FolderIcon)
          .child(
            S.list()
              .title(parentTitle)
              .items([
                // Parent page document (if it exists)
                ...(parent
                  ? [
                      S.documentListItem()
                        .id(parent._id)
                        .schemaType("page")
                        .title("Overview"),
                    ]
                  : []),

                // Divider if we have both parent and children
                ...(parent && children.length > 0 ? [S.divider()] : []),

                // Child pages
                ...children.map((child) =>
                  S.documentListItem()
                    .id(child._id)
                    .schemaType("page")
                    .title(child.title || "Untitled"),
                ),
              ])
              .initialValueTemplates([
                S.initialValueTemplateItem("create-child-page", {
                  title: "Create Child Page",
                  slug: path || "",
                }),
              ]),
          ),
      );
    }
    // If this page has no children, add it as a standalone page
    else if (parent) {
      standalonePages.push(parent);
    }
  }

  // Add any other pages that aren't in the hierarchy
  for (const page of normalizedPages) {
    const segments = page.slug.split("/").filter(Boolean);
    if (segments.length === 1) {
      const path = `/${segments[0]}`;
      // If this page isn't a parent in our hierarchy, add it as standalone
      if (!pageHierarchy[path]) {
        standalonePages.push(page);
      }
    }
  }

  // Create the main list item
  return S.listItem()
    .title(list.title ?? getTitleCase(list.type))
    .icon(list.icon ?? FolderIcon)
    .child(
      S.list()
        .initialValueTemplates([])
        .title(list.title ?? getTitleCase(list.type))
        .items([
          // Add all standalone pages
          ...listItems,
          S.divider(),
          ...standalonePages.map((page) =>
            S.documentListItem()
              .id(page._id)
              .schemaType("page")
              .title(page.title),
          ),
          // Add all the parent folders with their children
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
