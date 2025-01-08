import { defineField } from "sanity";
import { GROUP } from "../utils/constant";

export const richTextField = defineField({
  name: "richText",
  type: "richText",
});

export const buttonsField = defineField({
  name: "buttons",
  type: "array",
  of: [{ type: "button" }],
});

export const pageBuilderField = defineField({
  name: "pageBuilder",
  group: GROUP.MAIN_CONTENT,
  type: "pageBuilder",
});

