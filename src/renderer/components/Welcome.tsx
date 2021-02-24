import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import LoadingButton from "./LoadingButton";
import { useFileDispatch, useFileState } from "../context/file.context";
import { Redirect } from "react-router";
import { Controller, useForm } from "react-hook-form";

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

type FormData = { password: string };

export default function Welcome() {
  const classes = useStyles();

  const dispatch = useFileDispatch();
  const { isLoaded } = useFileState();
  const [loadingFile, setLoadingFile] = useState(false);
  const [initializing, setIsInitializing] = useState(true);
  const [hasFile, setHasFile] = useState(false);
  const [password, setPasword] = useState("");

  const { setError, handleSubmit, control, errors } = useForm<FormData>();

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

  const onSubmit = async ({ password }: FormData) => {
    setLoadingFile(true);
    try {
      const result = await ipcRenderer.invoke(
        hasFile ? "app:open-file" : "app:create-file",
        password
      );
      dispatch({
        type: "set_contacts",
        payload: result,
      });
      dispatch({
        type: "set_password",
        payload: password,
      });
    } catch (e) {
      if (e.message.includes("BAD_DECRYPT")) {
        setError("password", {
          type: "server",
          message: "Wrong password",
        });
      }
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
              Please enter the password for your {hasFile ? "" : "new"} contact
              data file.
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box display="flex" alignItems="baseline">
                <Controller
                  as={TextField}
                  margin="normal"
                  fullWidth
                  label="Password"
                  name="password"
                  control={control}
                  defaultValue={""}
                  type="password"
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ""}
                />
                <LoadingButton type="submit" loading={loadingFile}>
                  {hasFile ? "Open" : "Create"}
                </LoadingButton>
              </Box>
            </form>
          </>
        )}
      </div>
    </>
  );
}
