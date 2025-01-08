import type { SlugifierFn } from "sanity";
import slugify from "slugify";



export const getDocTypePrefix = (type: string) => {
  if (["page"].includes(type)) return "";
  return type;
};


const slugMapper = {
  homePage: "/",
  blogIndex: "/blog",
} as Record<string, string>;

export const createSlug: SlugifierFn = (input, _, { parent }) => {
  const { _type } = parent as {
    _type: string;
  };

  if (slugMapper[_type]) return slugMapper[_type];

  const prefix = getDocTypePrefix(_type);

  const slug = slugify(input, {
    lower: true,
    remove: /[^a-zA-Z0-9 ]/g,
  });

  return `/${[prefix, slug].filter(Boolean).join("/")}`;
};
