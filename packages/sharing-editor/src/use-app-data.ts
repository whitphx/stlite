import React, { useCallback, useReducer, useMemo } from "react";
import { AppData } from "@stlite/sharing-common";

type AppDataUpdater = (current: AppData) => AppData;
interface AppDataInitializeAction {
  type: "initialize";
  appData: AppData;
}
interface AppDataUpdateAction {
  type: "update";
  updater: AppDataUpdater;
}
type AppDataAction = AppDataInitializeAction | AppDataUpdateAction;

/**
 * In <App />, both <Editor /> (monaco editor) and <StliteSharingIFrame /> (an iframe wrapper for the stlite app)
 * are not fully declarative, but mostly imperative only except the initial state.
 * So we separately manage `initialAppData` that is used to initialize these child elements
 * and `appData` that is used to track the updated state, for example, to generate the sharable URL upon every code edit.
 * The `key` state is expected to be used along with `initialAppData` and passed to the `key` prop of the child components
 * so that they are re-mounted as different elements to reset and initialize the internal states.
 */
interface InitializedState {
  key: number;
  initialAppData: AppData;
  appData: AppData;
}
interface InitState {
  key: number;
  initialAppData: undefined;
  appData: undefined;
}
type State = InitState | InitializedState;

type AppDataDispatchers = {
  initializeAppData: (appData: AppData) => void;
  updateAppData: (updater: AppDataUpdater) => void;
};
export function useAppData(
  onUpdate: (appData: AppData) => void
): [State, AppDataDispatchers] {
  const reducer = useCallback<React.Reducer<State, AppDataAction>>(
    (currentState, action) => {
      switch (action.type) {
        case "initialize": {
          return {
            initialAppData: action.appData,
            appData: action.appData,
            key: currentState.key + 1,
          };
        }
        case "update": {
          if (currentState.appData == null) {
            return currentState;
          }
          const newAppData = action.updater(currentState.appData);
          onUpdate(newAppData);
          return {
            initialAppData: currentState.initialAppData,
            appData: newAppData,
            key: currentState.key,
          };
        }
      }
    },
    [onUpdate]
  );

  const [state, dispatch] = useReducer(reducer, {
    initialAppData: undefined,
    appData: undefined,
    key: 0,
  });
  const dispatchers = useMemo<AppDataDispatchers>(
    () => ({
      initializeAppData: (appData) =>
        dispatch({
          type: "initialize",
          appData,
        }),
      updateAppData: (updater) =>
        dispatch({
          type: "update",
          updater,
        }),
    }),
    [dispatch]
  );

  return [state, dispatchers];
}
