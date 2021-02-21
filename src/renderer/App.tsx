import React, { useState } from "react";
import "./App.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Test from "./components/Test";

const theme = createMuiTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Test />
    </ThemeProvider>
  );
}

export default App;
