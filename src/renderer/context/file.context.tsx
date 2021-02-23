import * as React from "react";
import type { Contact } from "../../types/Contact";
import { FileDispachContext, FileStateContext } from "./file.contex.providers";
import { v4 as uuidv4 } from "uuid";

type Action =
  | { type: "set"; payload?: Contact[] }
  | { type: "clear" }
  | { type: "save_contact"; payload: Contact }
  | { type: "delete_contact"; payload: string }
  | { type: "sync" }
  | { type: "sync_pending" }
  | { type: "sync_success" }
  | { type: "sync_failed" };

export type Dispatch = (action: Action) => void;
export type State = { data: Contact[]; isLoaded: boolean };
export type FileProviderProps = { children: React.ReactNode };
const defaultValue = {
  data: [],
  isLoaded: false,
};
function fileReducer(state: State, action: Action): State {
  switch (action.type) {
    case "set":
      return {
        ...state,
        isLoaded: true,
        data: action.payload,
      };

    case "clear":
      return {
        ...defaultValue,
      };
    case "save_contact": {
      const { payload } = action;
      const isNew = !payload.uuid;
      console.log(isNew, payload);
      if (isNew) {
        return {
          ...state,
          data: [
            ...state.data,
            {
              ...payload,
              uuid: uuidv4(),
            },
          ],
        };
      }
      return {
        ...state,
        data: [
          ...state.data.filter(({ uuid }) => uuid !== action.payload.uuid),
          action.payload,
        ],
      };
    }
    case "delete_contact": {
      return {
        ...state,
        data: state.data.filter(({ uuid }) => uuid !== action.payload),
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function FileProvider({ children }: FileProviderProps) {
  const [state, dispatch] = React.useReducer(fileReducer, defaultValue);
  return (
    <FileStateContext.Provider value={state}>
      <FileDispachContext.Provider value={dispatch}>
        {children}
      </FileDispachContext.Provider>
    </FileStateContext.Provider>
  );
}

function useFileState(): State {
  const context = React.useContext(FileStateContext);
  if (context === undefined) {
    throw new Error("useFileState must be used within a FileProvider");
  }
  return context;
}
function useFileDispatch(): Dispatch {
  const context = React.useContext(FileDispachContext);
  if (context === undefined) {
    throw new Error("useFileDispatch must be used within a FileProvider");
  }
  return context;
}

export { FileProvider, useFileState, useFileDispatch };
