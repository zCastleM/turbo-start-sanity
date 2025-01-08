import { defineField, defineType } from "sanity";
import {
  capitalize,
  createRadioListLayout,
} from "../../utils/helper";

const buttonVariants = ["default", "secondary", "outline", "link"];

export const button = defineType({
  name: "button",
  title: "Button",
  type: "object",
  fields: [
    defineField({
      name: "variant",
      type: "string",
      initialValue: () => "default",
      options: createRadioListLayout(buttonVariants, {
        direction: "horizontal",
      }),
    }),
    defineField({
      name: "text",
      title: "Button Text",
      type: "string",
    }),
    defineField({
      name: "url",
      title: "Url",
      type: "customUrl",
    }),
  ],
  preview: {
    select: {
      title: "text",
      variant: "variant",
    },
    prepare: ({ title, variant }) => {
      return {
        title,
        subtitle: `${capitalize(variant ?? "default")} button`,
      };
    },
  },
});
