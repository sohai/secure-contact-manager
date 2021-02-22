import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import { FileProvider } from "./context/file.context";
import ContactList from "./components/ContactList";

const theme = createMuiTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <>
        <CssBaseline />
        <FileProvider>
          <ContactList />
        </FileProvider>
      </>
    </ThemeProvider>
  );
}

export default App;
