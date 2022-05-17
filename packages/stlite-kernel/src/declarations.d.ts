// These module declarations are necessary to resolve the file imports at TS transpile.
// Ref: https://github.com/jupyterlite/jupyterlite/blob/main/packages/pyolite-kernel/src/declarations.d.ts
// See also,
// https://stackoverflow.com/questions/33915930/using-file-loader-with-es6-modules-and-typescript-in-webpack
// https://stackoverflow.com/questions/61129013/how-to-import-a-file-into-a-react-app-that-uses-create-react-app-as-raw-text

declare module '*.whl' {
  const res: string;
  return res;
}

declare module '*?raw' {
  const res: string;
  return res;
}

declare module '!!raw-loader!*' {
  const res: string;
  export default res;
}

// Declarations for worker.ts where some variables are injected from the main thread.
declare let indexURL: string;
declare let pyodide: any;
declare let loadPyodide: any;
declare let _tornadoWheelUrl: string;
declare let _pyarrowWheelUrl: string;
declare let _blinkerWheelUrl: string;
declare let _streamlitWheelUrl: string;
