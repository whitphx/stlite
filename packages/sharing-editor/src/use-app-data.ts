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

type AppDataDispatchers = {
  initializeAppData: (appData: AppData) => void;
  updateAppData: (updater: AppDataUpdater) => void;
};
export function useAppData(
  onUpdate: (appData: AppData) => void
): [AppData | undefined, AppDataDispatchers] {
  const reducer = useCallback<
    React.Reducer<AppData | undefined, AppDataAction>
  >(
    (currentAppData, action) => {
      switch (action.type) {
        case "initialize": {
          return action.appData;
        }
        case "update": {
          if (currentAppData == null) {
            return currentAppData;
          }
          const newAppData = action.updater(currentAppData);
          onUpdate(newAppData);
          return newAppData;
        }
      }
    },
    [onUpdate]
  );

  const [appData, dispatch] = useReducer(reducer, undefined);
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

  return [appData, dispatchers];
}
