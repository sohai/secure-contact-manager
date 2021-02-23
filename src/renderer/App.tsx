import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import { FileProvider, useFileState } from "./context/file.context";
import AppRoutes from "./Routes";

const theme = createMuiTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <>
        <CssBaseline />
        <FileProvider>
          <AppRoutes />
        </FileProvider>
      </>
    </ThemeProvider>
  );
}

export default App;
