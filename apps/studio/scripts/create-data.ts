// ./scripts/createData.ts

import { getCliClient } from "sanity/cli";
import fs from "node:fs/promises";
import {
  checkIfDataExists,
  generateMockBlogPages,
  generateMockPages,
  getMockHomePageData,
} from "../utils/mock-data";

const client = getCliClient();

function updateProgressBar(current: number, total: number) {
  const width = 30;
  const progress = Math.round((current / total) * width);
  const filled = "█".repeat(progress);
  const empty = "░".repeat(width - progress);
  const percentage = Math.round((current / total) * 100);
  // Use console.log instead of process.stdout methods which may not be available
  console.log(`Progress: [${filled}${empty}] ${percentage}%`);
}
async function removePostinstallScript() {
  try {
    const packageJson = await fs.readFile("package.json", "utf8");
    const parsedJson = JSON.parse(packageJson);

    if (parsedJson.scripts?.postinstall) {
      // biome-ignore lint/performance/noDelete: <explanation>
      delete parsedJson.scripts.postinstall;
      await fs.writeFile(
        "package.json",
        JSON.stringify(parsedJson, null, 2)
      );
      console.log("✅ Successfully removed postinstall script");
    }
  } catch (error) {
    console.error("❌ Error removing postinstall script:", error);
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
}

async function createData() {
  console.log("🔍 Checking if data exists...");
  const totalSteps = 5;
  let currentStep = 0;
  updateProgressBar(++currentStep, totalSteps);
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
  updateProgressBar(++currentStep, totalSteps);

  console.log("\n📄 Generating regular pages...");
  const pages = await generateMockPages(client);
  for (const page of pages) {
    transaction.create(page);
  }
  console.log(`✅ Created ${pages.length} pages`);
  updateProgressBar(++currentStep, totalSteps);

  console.log("\n📚 Generating blog posts...");
  const { blogIndexPage, blogs } =
    await generateMockBlogPages(client);
  for (const page of blogs) {
    transaction.create(page);
  }
  transaction.create(blogIndexPage);
  console.log(`✅ Created ${blogs.length} blog posts`);
  updateProgressBar(++currentStep, totalSteps);

  console.log("\n💾 Committing transaction...");
  await transaction.commit();
  console.log("✨ Successfully created all content!");
  console.log("\n📊 Dataset Information:");
  console.log(`🆔 Project ID: ${client.config().projectId}`);
  console.log(`📁 Dataset: ${client.config().dataset}`);

  console.log("\n🧹 Removing postinstall script...");
  await removePostinstallScript();
  updateProgressBar(++currentStep, totalSteps);
  console.log("✅ Successfully removed postinstall script");
}


createData().catch((error) => {
  console.error("❌ Error creating data:", error);
  process.exit(1);
});
