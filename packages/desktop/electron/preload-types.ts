export interface AppConfig {
  entrypoint: string;
  idbfsMountpoints: string[];
}

export interface ArchivesAPI {
  readSitePackagesSnapshot: () => Promise<Buffer>;
  readPrebuiltPackageNames: () => Promise<string[]>;
  readStreamlitAppDirectory: () => Promise<Record<string, Buffer>>;
}

export interface NodeJsWorkerAPI {
  USE_NODEJS_WORKER: boolean;
  initialize: () => Promise<void>;
  postMessage: (opts: {
    data: unknown;
    onPortMessage: ((arg: unknown) => void) | null;
  }) => void;
  onMessage: (callback: (data: unknown) => void) => void;
  terminate: () => Promise<void>;
}
