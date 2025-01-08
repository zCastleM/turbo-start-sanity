import { SanityImage } from "@/components/sanity-image";
import { sanityFetch } from "@/lib/sanity/live";
import { queryBlogIndexPageData } from "@/lib/sanity/query";
import type { QueryBlogIndexPageDataResult } from "@/lib/sanity/sanity.types";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";

type Blog = NonNullable<
  NonNullable<QueryBlogIndexPageDataResult>["featuredBlog"]
>;

async function fetchBlogPosts() {
  return await sanityFetch({
    query: queryBlogIndexPageData,
  });
}

function BlogAuthor({ author }: { author: Blog["authors"] }) {
  return (
    <div className="flex items-center gap-x-2.5 text-sm/6 font-semibold text-gray-900">
      {author?.image && (
        <SanityImage
          asset={author?.image}
          alt={author?.name ?? "Author Image"}
          className="size-8 flex-none rounded-full bg-gray-50"
        />
      )}
      {author?.name}
    </div>
  );
}

function FeaturedBlogCard({ blog }: { blog: Blog }) {
  const { title, publishedAt, slug, authors, description } =
    blog ?? {};
  return (
    <article className="mx-auto w-full max-w-2xl lg:mx-0 lg:max-w-lg">
      <time
        dateTime={new Date(publishedAt ?? new Date()).toISOString()}
        className="block text-sm/6 text-gray-600"
      >
        {new Date(blog?.publishedAt ?? new Date()).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )}
      </time>
      <h2
        id="featured-post"
        className="my-4 text-pretty text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl"
      >
        {title}
      </h2>
      <Badge variant="outline">Featured</Badge>
      <p className="mt-4 text-lg/8 text-gray-600">{description}</p>
      <div className="mt-4 flex flex-col justify-between gap-6 sm:mt-8 sm:flex-row-reverse sm:gap-8 lg:mt-4 lg:flex-col">
        <div className="flex">
          <Link
            href={slug ?? "#"}
            aria-describedby="featured-post"
            className="text-sm/6 font-semibold text-indigo-600"
          >
            Continue reading <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <div className="flex lg:border-t lg:border-gray-900/10 lg:pt-8">
          <BlogAuthor author={authors} />
        </div>
      </div>
    </article>
  );
}

function BlogCard({ blog }: { blog: Blog }) {
  return (
    <article className="py-12">
      <div className="group relative max-w-xl">
        <time
          dateTime={new Date(
            blog?.publishedAt ?? new Date()
          ).toISOString()}
          className="block text-sm/6 text-gray-600"
        >
          {new Date(
            blog?.publishedAt ?? new Date()
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h2 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-gray-600">
          <span className="absolute inset-0" />
          {blog.title}
        </h2>
        <p className="mt-4 text-sm/6 text-gray-600">
          {blog.description}
        </p>
      </div>
      <div className="mt-4 flex items-center gap-x-2.5">
        <BlogAuthor author={blog.authors} />
      </div>
      <div className="mt-4">
        <Link
          href={blog.slug ?? "#"}
          aria-describedby="featured-post"
          className="text-sm/6 font-semibold text-indigo-600"
        >
          Continue reading <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </article>
  );
}

export default async function BlogIndexPage() {
  const { data } = await fetchBlogPosts();
  if (!data) return null;
  return (
    <div className="my-16">
      <div className="container mx-auto grid grid-cols-1 gap-x-8 gap-y-12 px-4 md:px-6 sm:gap-y-16 ">
        {data?.featuredBlog && (
          <FeaturedBlogCard blog={data?.featuredBlog} />
        )}
        <div className="mx-auto w-full  border-t border-gray-900/10 pt-12 sm:pt-16 lg:mx-0 lg:max-w-none lg:border-t-0 lg:pt-0">
          <div className="-my-12 divide-y divide-gray-900/10">
            {data?.blogs?.map((blog, indx) => (
              <BlogCard key={`${blog._id}-${indx}`} blog={blog} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
