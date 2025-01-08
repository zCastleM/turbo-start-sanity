import { isPortableTextTextBlock, type StringOptions } from "sanity";

export const isRelativeUrl = (url: string) =>
  url.startsWith("/") || url.startsWith("#") || url.startsWith("?");

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return isRelativeUrl(url);
  }
};

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const getTitleCase = (name: string) => {
  const titleTemp = name.replace(/([A-Z])/g, " $1");
  return titleTemp.charAt(0).toUpperCase() + titleTemp.slice(1);
};

export const createRadioListLayout = (
  items: Array<string | { title: string; value: string }>,
  options?: StringOptions
): StringOptions => {
  const list = items.map((item) => {
    if (typeof item === "string") {
      return {
        title: getTitleCase(item),
        value: item,
      };
    }
    return item;
  });
  return {
    layout: "radio",
    list,
    ...options,
  };
};

export const parseRichTextToString = (
  value: unknown,
  maxWords: number | undefined = undefined
) => {
  if (!Array.isArray(value)) return "No Content";

  const text = value.map((val) => {
    const test = isPortableTextTextBlock(val);
    if (!test) return "";
    return val.children
      .map((child) => child.text)
      .filter(Boolean)
      .join(" ");
  });
  if (maxWords)
    return `${text.join(" ").split(" ").slice(0, maxWords).join(" ")}...`;
  return text.join(" ");
};
