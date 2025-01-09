import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import { structure } from "./structure";
import { iconPicker } from "sanity-plugin-icon-picker";
import { presentationUrl } from "./plugins/presentation-url";
import { presentationTool } from "sanity/presentation";
import { resolve } from "./resolve-presentation-document";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";
const title = process.env.SANITY_STUDIO_TITLE ?? "";


export default defineConfig({
  name: "default",
  title: title,
  projectId: projectId,
  dataset: dataset,
  plugins: [
    structureTool({
      structure: structure,
    }),
    visionTool(),
    iconPicker(),
    presentationTool({
      resolve: resolve,
      previewUrl: {
        origin:
          window.location.hostname === "localhost"
            ? "http://localhost:3000"
            : "https://template.roboto.studio",
        previewMode: {
          enable: "/api/presentation-draft",
        },
      },
    }),
    presentationUrl(),
  ],
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      const { type } = creationContext;
      if (type === "global") return [];
      return prev;
    },
  },
  schema: {
    types: schemaTypes,
  },
});
