import { defineQuery } from "next-sanity";


const urlFragment = /* groq */ `
  "openInNewTab": url.openInNewTab,
  "href": select(
    type == "internal" => url.internal->slug.current,
    type == "external" => url.external,
    "#"
  ),
`;
// url{
//   openInNewTab,
//   "href": select(
//     type == "internal" => internal->slug.current,
//     type == "external" => external,
//     "#"
//   ),
// }

const customLinkFragment = /* groq */ `
  ...customLink{
    openInNewTab,
    "href": select(
      type == "internal" => internal->slug.current,
      type == "external" => external,
      "#"
    ),
  }
`;

const markDefsFragment = /* groq */ `
  markDefs[]{
    ...,
    ${customLinkFragment}
  }
`;

const richTextFragment = /* groq */ `
  richText[]{
    ...,
    ${markDefsFragment}
  }
`;

const buttonsFragment = /* groq */ `
  buttons[]{
    text,
    variant,
    _key,
    _type,
    "openInNewTab": url.openInNewTab,
    "href": select(
      url.type == "internal" => url.internal->slug.current,
      url.type == "external" => url.external,
      url.href
    ),
  }
`;

// Page builder block fragments
const ctaBlock = /* groq */ `
  _type == "cta" => {
    ...,
    ${richTextFragment},
    ${buttonsFragment}
  }
`;

const heroBlock = /* groq */ `
  _type == "hero" => {
    ...,
    ${buttonsFragment},
    ${richTextFragment}
  }
`;

const pageBuilderFragment = /* groq */ `
  pageBuilder[]{
    ...,
    _type,
    ${ctaBlock},
    ${heroBlock},
  }
`;

export const queryHomePageData =
  defineQuery(/* groq */ `*[_type == "homePage"][0]{
    _id,
    _type,
    title,
    description,
    ${pageBuilderFragment}
  }`);
