import { PageBuilder } from "@/components/pagebuilder";
import { sanityFetch } from "@/lib/sanity/live";
import { queryHomePageData } from "@/lib/sanity/query";

async function fetchHomePageData() {
  return await sanityFetch({
    query: queryHomePageData,
  });
}

export default async function Page() {
  const { data: homePageData } = await fetchHomePageData();

  if (!homePageData) {
    return <div>No home page data</div>;
  }

  return <PageBuilder pageBuilder={homePageData.pageBuilder} />;
}
