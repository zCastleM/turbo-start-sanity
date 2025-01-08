import { PageBuilder } from "@/components/pagebuilder";
import { sanityFetch } from "@/lib/sanity/live";
import { querySlugPageData } from "@/lib/sanity/query";

async function fetchSlugPageData(slug: string) {
  return await sanityFetch({
    query: querySlugPageData,
    params: { slug: `/${slug}` },
  });
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: pageData } = await fetchSlugPageData(slug);

  if (!pageData) {
    return <div>No home page data</div>;
  }

  return <PageBuilder pageBuilder={pageData.pageBuilder} />;
}
