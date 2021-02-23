import * as React from "react";
import type { Contact } from "../../types/Contact";
import { FileDispachContext, FileStateContext } from "./file.contex.providers";

type Action =
  | { type: "set"; payload?: Contact[] }
  | { type: "clear"; payload: State | null };
export type Dispatch = (action: Action) => void;
export type State = { data: Contact[]; isLoaded: boolean };
export type FileProviderProps = { children: React.ReactNode };
const defaultValue = {
  data: [],
  isLoaded: false,
};
function fileReducer(state: State, { type, payload }: Action): State {
  switch (type) {
    case "set":
      return {
        ...state,
        isLoaded: true,
        data: payload,
      };
    case "clear": {
      return {
        ...defaultValue,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${type}`);
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
