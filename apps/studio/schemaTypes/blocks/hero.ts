import { defineField, defineType } from "sanity";
import { buttonsField, richTextField } from "../common";
import { StarIcon } from "@sanity/icons";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  icon: StarIcon,
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    richTextField,
    buttonsField,
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title,
      subtitle: "Hero Block",
    }),
  },
});
