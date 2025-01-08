import { blog } from "./blog";
import { homePage } from "./home-page";
import { page } from "./page";
import { blogIndex } from "./blog-index";

export const singletons = [homePage, blogIndex];

export const documents = [blog, page, ...singletons];
