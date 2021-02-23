import * as React from "react";
import type { Contact } from "../../types/Contact";

type Action = { type: "set"; payload: Contact[] };
type Dispatch = (action: Action) => void;
type State = { data: Contact[] };
type FileProviderProps = { children: React.ReactNode };

const FileStateContext = React.createContext<State | undefined>(undefined);
const FileDispachContext = React.createContext<Dispatch | undefined>(undefined);

function fileReducer(state: State, { type, payload }: Action): State {
  switch (type) {
    case "set":
      return {
        ...state,
        data: payload,
      };
    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
}

const defaultValue = {
  data: [],
};

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
