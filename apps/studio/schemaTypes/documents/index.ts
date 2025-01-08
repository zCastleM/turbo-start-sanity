import { blog } from "./blog";
import { page } from "./page";

export const singletons = [];

export const documents = [blog, page, ...singletons];
