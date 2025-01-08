import { defineQuery } from "next-sanity";

export const queryHomePageData =
  defineQuery(/* groq */ `*[_type == "homePage"][0]{
    ...,
  }`);
