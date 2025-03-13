import { defineField, defineType } from 'sanity';
import { ImageIcon } from 'lucide-react';

export const logoListWithMotion = defineType({
  name: 'logoListWithMotion',
  title: 'Logo List with Motion',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'logos',
      type: 'array',
      title: 'Logos',
      of: [{ type: 'image' }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title,
        subtitle: 'Logo List with Motion',
      };
    },
  },
});
