import { ImageIcon, LinkIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const richText = defineType({
  name: "richText",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "H5", value: "h5" },
        { title: "H6", value: "h6" },
        { title: "Inline", value: "inline" },
      ],
      lists: [
        { title: "Numbered", value: "number" },
        { title: "Bullet", value: "bullet" },
      ],
      marks: {
        annotations: [
          {
            name: "customLink",
            type: "object",
            title: "Internal/External Link",
            icon: LinkIcon,
            fields: [
              defineField({
                name: "customLink",
                type: "customUrl",
              }),
            ],
          },
        ],
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
      },
    }),
    defineArrayMember({
      name: "image",
      title: "Image",
      type: "image",
      icon: ImageIcon,
      fields: [
        defineField({
          name: "caption",
          type: "string",
          title: "Caption Text",
        }),
      ],
    }),
  ],
});
