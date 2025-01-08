import { blog } from "./blog";
import { homePage } from "./home-page";
import { page } from "./page";

export const singletons = [homePage];

export const documents = [blog, page, ...singletons];
