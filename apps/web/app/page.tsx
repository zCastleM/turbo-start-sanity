import { sanityFetch } from "@/lib/sanity/live";
import { queryHomePageData } from "@/lib/sanity/query";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";

async function fetchHomePageData() {
  return await sanityFetch({
    query: queryHomePageData,
  });
}

export default async function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm">Button</Button>
        <Input placeholder="Search" />
      </div>
    </div>
  );
}
