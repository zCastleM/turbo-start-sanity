import type { SlugifierFn } from "sanity";
import slugify from "slugify";

export const getDocTypePrefix = (type: string) => {
  if (type === "mainPage" || type === "page") {
    return "";
  }
  return type;
};

export const createSlug: SlugifierFn = (input, _, { parent }) => {
  const { _type } = parent as {
    _type: string;
  };

  const prefix = getDocTypePrefix(_type);

  const slug = slugify(input, {
    lower: true,
    remove: /[^a-zA-Z0-9 ]/g,
  });

  return `/${[prefix, slug].filter(Boolean).join("/")}`;
};
