import * as React from "react";
import type { Contact } from "../../types/Contact";
import { FileDispachContext, FileStateContext } from "./file.contex.providers";
import { v4 as uuidv4 } from "uuid";
const { ipcRenderer } = window.require("electron");

type Action =
  | { type: "reinit" }
  | { type: "set_password"; payload: string }
  | { type: "set_contacts"; payload: Contact[] }
  | { type: "save_contact"; payload: Contact }
  | { type: "delete_contact"; payload: string };

export type Dispatch = (action: Action) => void;
export type State = {
  data: Contact[];
  isLoaded: boolean;
  password: string | null;
};
export type FileProviderProps = { children: React.ReactNode };

const defaultValue = {
  data: [],
  password: "V9cL^S*gzEy^",
  isLoaded: false,
};
function fileReducer(state: State, action: Action): State {
  switch (action.type) {
    case "set_password": {
      return {
        ...state,
        password: action.payload,
      };
    }
    case "set_contacts":
      return {
        ...state,
        isLoaded: true,
        data: action.payload,
      };

    case "reinit":
      return {
        ...state,
        isLoaded: false,
      };
    case "save_contact": {
      const { payload } = action;
      const isNew = !payload.uuid;
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
      throw new Error(`Unhandled action type: ${(action as Action).type}`);
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
