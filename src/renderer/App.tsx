import React, { useState } from "react";
import "./App.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const theme = createMuiTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Button>Start</Button>
    </ThemeProvider>
  );
}

export default App;
