import {
  defineCliConfig,
  getStudioEnvironmentVariables,
} from "sanity/cli";

const { projectId, dataset } = getStudioEnvironmentVariables();
const title = process.env.SANITY_STUDIO_TITLE;
const presentationUrl = process.env.SANITY_STUDIO_PRESENTATION_URL;
console.log("🚀 ~ projectId, dataset:", {
  projectId,
  dataset,
  title,
  presentationUrl,
});

export default defineCliConfig({
  api: {
    projectId: projectId,
    dataset: dataset,
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
});
