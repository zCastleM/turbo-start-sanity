import { defineField, defineType } from "sanity";
import { MobileDeviceIcon } from "@sanity/icons";
import { buttonsField, richTextField } from "../common";

export const cta = defineType({
  name: "cta",
  type: "object",
  icon: MobileDeviceIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
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
      subtitle: "CTA Block",
    }),
  },
});
