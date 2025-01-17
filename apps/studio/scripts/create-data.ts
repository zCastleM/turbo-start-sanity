// ./scripts/createData.ts

import { getCliClient } from "sanity/cli";
import {
  checkIfDataExists,
  generateMockBlogPages,
  generateMockPages,
  getMockHomePageData,
} from "../utils/mock-data";
import ora from "ora";

const client = getCliClient();

async function createData() {
  const spinner = ora("🔍 Checking if data exists...").start();
  const isDataExists = await checkIfDataExists(client);
  if (isDataExists) {
    spinner.info("⚠️ Data already exists in dataset");
    return;
  }

  spinner.info("📝 Creating new data...");
  const transaction = client.transaction();

  spinner.info("🏠 Generating home page...");
  const homePage = await getMockHomePageData(client);
  transaction.create(homePage);

  spinner.info("📄 Generating regular pages...");
  const pages = await generateMockPages(client);
  for (const page of pages) {
    transaction.create(page);
  }
  spinner.succeed(`✅ Created ${pages.length} pages`);

  spinner.info("📚 Generating blog posts...");
  const blogPages = await generateMockBlogPages(client);

  for (const page of blogPages) {
    transaction.create(page);
  }
  spinner.succeed(`✅ Created ${blogPages.length} blog posts`);

  spinner.info("💾 Committing transaction...");
  await transaction.commit();
  spinner.succeed("✨ Successfully created all content!");

  spinner.info("\n📊 Dataset Information:");
  spinner.info(`🆔 Project ID: ${client.config().projectId}`);
  spinner.info(`📁 Dataset: ${client.config().dataset}`);

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
