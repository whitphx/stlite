import type {
  AppConfig,
  ArchivesAPI,
  NodeJsWorkerAPI,
} from "../electron/preload-types";

declare global {
  interface Window {
    appConfig: AppConfig;
    archivesAPI: ArchivesAPI;
    nodeJsWorkerAPI: NodeJsWorkerAPI;
  }
}
