import type {
  AppConfig,
  ArchivesAPI,
  NodeJsWorkerAPI,
} from "../electron/preload";

export declare global {
  interface Window {
    appConfig: AppConfig;
    archives: ArchivesAPI;
    nodeJsWorkerAPI: NodeJsWorkerAPI;
  }
}
