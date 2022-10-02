// These module declarations are necessary to resolve the file imports at TS transpile.
// Ref: https://github.com/jupyterlite/jupyterlite/blob/main/packages/pyolite-kernel/src/declarations.d.ts
// See also,
// https://stackoverflow.com/questions/33915930/using-file-loader-with-es6-modules-and-typescript-in-webpack
// https://stackoverflow.com/questions/61129013/how-to-import-a-file-into-a-react-app-that-uses-create-react-app-as-raw-text

declare module "*.whl" {
  const res: string;
  return res;
}

declare module "*?raw" {
  const res: string;
  return res;
}

declare module "!!raw-loader!*" {
  const res: string;
  export default res;
}

// Ref: https://v4.webpack.js.org/loaders/worker-loader/
declare module "!!worker-loader?*" {
  // You need to change `Worker`, if you specified a different value for the `workerType` option
  class WebpackWorker extends Worker {
    constructor();
  }

  // Uncomment this if you set the `esModule` option to `false`
  // export = WebpackWorker;
  export default WebpackWorker;
}

// Declarations for worker.ts where some variables are dynamically loaded through importScript.
declare let loadPyodide: any;

// Declarations for the `self` object in worker.ts some of whose properties are used to share values with the Python environment.
interface Window {
  __logCallback__: (msg: string) => void;
}
