// ./scripts/createData.ts

import { getCliClient } from "sanity/cli";
import {
  checkIfDataExists,
  generateMockBlogPages,
  generateMockPages,
  getMockHomePageData,
} from "../utils/mock-data";

const client = getCliClient();

async function createData() {
  console.log("🔍 Checking if data exists...");
  const isDataExists = await checkIfDataExists(client);
  if (isDataExists) {
    console.log("⚠️ Data already exists in dataset");
    return;
  }

  console.log("📝 Creating new data...");
  const transaction = client.transaction();

  console.log("🏠 Generating home page...");
  const homePage = await getMockHomePageData(client);
  transaction.create(homePage);

  console.log("📄 Generating regular pages...");
  const pages = await generateMockPages(client);
  for (const page of pages) {
    transaction.create(page);
  }
  console.log(`✅ Created ${pages.length} pages`);

  console.log("📚 Generating blog posts...");
  const blogPages = await generateMockBlogPages(client);

  for (const page of blogPages) {
    transaction.create(page);
  }
  console.log(`✅ Created ${blogPages.length} blog posts`);

  console.log("💾 Committing transaction...");
  await transaction.commit();
  console.log("✨ Successfully created all content!");

  console.log("\n📊 Dataset Information:");
  console.log(`🆔 Project ID: ${client.config().projectId}`);
  console.log(`📁 Dataset: ${client.config().dataset}`);

  console.log(
    "\n\x1b[34m┌────────────────────────────────────────────┐\x1b[0m"
  );
  console.log(
    "\x1b[34m│                                            │\x1b[0m"
  );
  console.log(
    "\x1b[34m│  Please remove the postinstall script      │\x1b[0m"
  );
  console.log(
    "\x1b[34m│  from package.json to prevent multiple     │\x1b[0m"
  );
  console.log(
    "\x1b[34m│  executions                                │\x1b[0m"
  );
  console.log(
    "\x1b[34m│                                            │\x1b[0m"
  );
  console.log(
    "\x1b[34m└────────────────────────────────────────────┘\x1b[0m\n"
  );
}

createData().catch((error) => {
  console.error("❌ Error creating data:", error);
  process.exit(1);
});
