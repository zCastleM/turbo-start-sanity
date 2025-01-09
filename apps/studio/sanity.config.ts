import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import { structure } from "./structure";
import { iconPicker } from "sanity-plugin-icon-picker";
import { presentationUrl } from "./plugins/presentation-url";


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
    presentationUrl(),
  ],
  schema: {
    types: schemaTypes,
  },
});
