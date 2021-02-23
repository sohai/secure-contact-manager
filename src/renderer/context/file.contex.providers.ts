// separate file because hot reload issuehttps://github.com/snowpackjs/snowpack/discussions/1555

import React from "react";
import type { State, Dispatch } from "./file.context";

const FileStateContext = React.createContext<State | undefined>(undefined);
const FileDispachContext = React.createContext<Dispatch | undefined>(undefined);

export { FileDispachContext, FileStateContext };
