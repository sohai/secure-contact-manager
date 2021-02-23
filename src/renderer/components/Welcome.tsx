import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { Button, Typography } from "@material-ui/core";
import LoadingButton from "./LoadingButton";
import { useFileDispatch, useFileState } from "../context/file.context";

declare var window: any;

const { ipcRenderer } = window.require("electron");

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: "100vh",
    paddingTop: "-10vh",
  },
}));

export default function Welcome() {
  const classes = useStyles();

  const dispatch = useFileDispatch();
  const fileState = useFileState();

  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const result = await ipcRenderer.invoke("app:open-file");
      dispatch({
        type: "set",
        payload: result,
      });
    } catch {
      // TODO: error handling
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={classes.root}>
      <Typography align="center" variant="h5" gutterBottom>
        Welcome to <br />
        Simple Secure Contact Manager
      </Typography>
      <Typography>
        Please enter the password for your new contact data file.
      </Typography>
      <LoadingButton onClick={handleClick} loading={loading}>
        Test
      </LoadingButton>
      {JSON.stringify(fileState)}
    </div>
  );
}
