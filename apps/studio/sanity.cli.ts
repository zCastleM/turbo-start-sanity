import {
  defineCliConfig,
  getStudioEnvironmentVariables,
} from "sanity/cli";

const { projectId, dataset } = getStudioEnvironmentVariables();

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
