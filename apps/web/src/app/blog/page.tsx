import { BlogCard, FeaturedBlogCard } from "@/components/blog-card";
import { sanityFetch } from "@/lib/sanity/live";
import { queryBlogIndexPageData } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";

async function fetchBlogPosts() {
  return await sanityFetch({
    query: queryBlogIndexPageData,
  });
}

export async function generateMetadata() {
  const { data } = await fetchBlogPosts();
  if (!data) return getMetaData({});
  return getMetaData(data);
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
