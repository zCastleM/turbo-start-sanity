import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import { structure } from "./structure";
import { iconPicker } from "sanity-plugin-icon-picker";

export default defineConfig({
  name: "default",
  title: "template-sanity",

  projectId: "rqdz6bx6",
  dataset: "production",

  plugins: [
    structureTool({
      structure,
    }),
    visionTool(),
    iconPicker(),
  ],

  schema: {
    types: schemaTypes,
  },
});
