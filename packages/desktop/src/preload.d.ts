import type {
  AppConfig,
  ArchivesAPI,
  NodeJsWorkerAPI,
} from "../electron/preload";

declare global {
  interface Window {
    appConfig: AppConfig;
    archivesAPI: ArchivesAPI;
    nodeJsWorkerAPI: NodeJsWorkerAPI;
  }
}
