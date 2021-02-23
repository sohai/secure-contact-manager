import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import { FileProvider } from "./context/file.context";
import ContactList from "./components/ContactList";
import Welcome from "./components/Welcome";

const theme = createMuiTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <>
        <CssBaseline />
        <FileProvider>
          <Welcome />
        </FileProvider>
      </>
    </ThemeProvider>
  );
}

export default App;
