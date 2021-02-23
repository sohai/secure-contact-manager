import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import LoadingButton from "./LoadingButton";
import { useFileDispatch, useFileState } from "../context/file.context";
import { Redirect } from "react-router";

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
  const { isLoaded } = useFileState();
  const [loadingFile, setLoadingFile] = useState(false);
  const [initializing, setIsInitializing] = useState(true);
  const [hasFile, setHasFile] = useState(false);

  useEffect(() => {
    let didCancel = false;
    setIsInitializing(true);
    async function getInit() {
      const hasFile = await ipcRenderer.invoke("app:check-file");
      if (!didCancel) {
        setHasFile(hasFile);
        setIsInitializing(false);
      }
    }

    getInit();
    return () => {
      didCancel = true;
    };
  }, []);

  const handleClick = async () => {
    setLoadingFile(true);
    try {
      const result = await ipcRenderer.invoke(
        hasFile ? "app:open-file" : "app:create-file"
      );
      dispatch({
        type: "set_contacts",
        payload: result,
      });
    } catch {
      // TODO: error handling
    } finally {
      setLoadingFile(false);
    }
  };
  return (
    <>
      {isLoaded && <Redirect to="/app" />}

      <div className={classes.root}>
        {initializing && <CircularProgress size={100} />}
        {!initializing && (
          <>
            <Typography align="center" variant="h5" gutterBottom>
              Welcome to <br />
              Simple Secure Contact Manager {hasFile}
            </Typography>
            <Typography>
              Please enter the password for your new contact data file.
            </Typography>
            <LoadingButton onClick={handleClick} loading={loadingFile}>
              Test
            </LoadingButton>
          </>
        )}
      </div>
    </>
  );
}
