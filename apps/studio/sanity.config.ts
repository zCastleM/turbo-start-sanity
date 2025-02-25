import { assist } from "@sanity/assist";
import { visionTool } from "@sanity/vision";
import { defineConfig, type TemplateResolver } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import {
  unsplashAssetSource,
  unsplashImageAsset,
} from "sanity-plugin-asset-source-unsplash";
import { iconPicker } from "sanity-plugin-icon-picker";
import { media, mediaAssetSource } from "sanity-plugin-media";

import { Logo } from "./components/logo";
import { locations } from "./location";
import { presentationUrl } from "./plugins/presentation-url";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";
import { createPageTemplate } from "./utils/helper";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET;
const title = process.env.SANITY_STUDIO_TITLE;
const presentationOriginUrl = process.env.SANITY_STUDIO_PRESENTATION_URL;

const template: TemplateResolver = (prev, { getClient }) => {
  return [
    ...createPageTemplate(),
    ...prev,
    {
      id: "create-child-page",
      title: "Create Child Page",
      schemaType: "page",
      parameters: [
        {
          name: "slug",
          type: "string",
          title: "Parent Slug",
        },
        {
          name: "title",
          type: "string",
          title: "Page Title",
        },
      ],
      value: async (props: { parameters: { slug: string; title: string } }) => {
        console.log("🚀 ~ props:", props);
        const parentSlug = props.parameters?.slug || "";
        const pageTitle = props.parameters?.title || "";
        const childSlug = `${parentSlug}/${pageTitle}`
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/^\/+/, "");

        return {
          _type: "page",
          title: pageTitle,
          slug: {
            _type: "slug",
            current: childSlug,
          },
        };
      },
    },
    {
      id: "create-child-paged-list",
      title: "Create Child Paged List",
      schemaType: "page",
      // parameters: [
      //   {
      //     name: "parentId",
      //     type: "string",
      //     title: "Parent Document ID",
      //   },
      //   {
      //     name: "title",
      //     type: "string",
      //     title: "Page Title",
      //   },
      // ],
      value: async (props: {
        parameters: { parentId: string; title: string };
      }) => {
        console.log("🚀 ~ props:", props);
        // const client = getClient({ apiVersion: "2024-01-17" });
        const parentId = props.parameters?.parentId;
        const pageTitle = props.parameters?.title || "Child Paged List";

        // let parentSlug = "";
        // if (parentId) {
        //   const parent = await client.fetch(
        //     `*[_id == $parentId][0].slug.current`,
        //     { parentId },
        //   );
        //   parentSlug = parent || "";
        // }

        // const childSlug = `${parentSlug}/${pageTitle}`
        //   .toLowerCase()
        //   .replace(/\s+/g, "-")
        //   .replace(/^\/+/, "");

        return {
          _type: "page",
          title: pageTitle,
          // slug: {
          //   _type: "slug",
          //   // current: childSlug,
          // },
        };
      },
    },
  ];
};

export default defineConfig({
  name: "default",
  title: title ?? "Turbo Studio",
  projectId: projectId,
  icon: Logo,
  dataset: dataset ?? "production",
  plugins: [
    presentationTool({
      resolve: {
        locations,
      },
      previewUrl: {
        origin: presentationOriginUrl ?? "http://localhost:3000",
        previewMode: {
          enable: "/api/presentation-draft",
        },
      },
    }),
    assist(),
    structureTool({
      structure,
    }),
    visionTool(),
    iconPicker(),
    media(),
    presentationUrl(),
    unsplashImageAsset(),
  ],

  form: {
    image: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter(
          (assetSource) =>
            assetSource === mediaAssetSource ||
            assetSource === unsplashAssetSource,
        );
      },
    },
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      const { type } = creationContext;
      if (type === "global") return [];
      return prev;
    },
  },
  schema: {
    types: schemaTypes,
    templates: template,
  },
});
