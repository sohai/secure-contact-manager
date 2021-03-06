import React, { useState, useEffect, ReactElement } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Box,
  CircularProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import { Redirect } from "react-router";
import { Controller, useForm } from "react-hook-form";
import LoadingButton from "./LoadingButton";
import { useFileDispatch, useFileState } from "../context/file.context";

const { ipcRenderer } = window.require("electron");

const useStyles = makeStyles(() => ({
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

const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export default function Welcome(): ReactElement {
  const classes = useStyles();

  const dispatch = useFileDispatch();
  const { isLoaded } = useFileState();
  const [loadingFile, setLoadingFile] = useState(false);
  const [hasFile, setHasFile] = useState(null);

  const { setError, handleSubmit, control, errors } = useForm<FormData>();

  useEffect(() => {
    let didCancel = false;
    async function getInit() {
      const hasFile = await ipcRenderer.invoke("app:check-file");
      if (!didCancel) {
        setHasFile(hasFile);
      }
    }

    getInit();
    return () => {
      didCancel = true;
      console.log("exit");
    };
  }, []);

  const onSubmit = async ({ password }: FormData) => {
    setLoadingFile(true);
    try {
      const result = await ipcRenderer.invoke(
        hasFile ? "app:open-file" : "app:create-file",
        password
      );
      setLoadingFile(false);
      dispatch({
        type: "set_contacts",
        payload: result,
      });
      dispatch({
        type: "set_password",
        payload: password,
      });
    } catch (e) {
      setLoadingFile(false);
      if (e.message.includes("BAD_DECRYPT")) {
        setError("password", {
          type: "server",
          message: "Wrong password",
        });
      }
    }
  };

  return (
    <>
      {isLoaded && <Redirect to="/app" />}

      <div className={classes.root}>
        {hasFile === null && <CircularProgress size={100} />}
        {hasFile !== null && (
          <>
            <Typography align="center" variant="h5" gutterBottom>
              <>
                Welcome to <br />
                Simple Secure Contact Manager {hasFile}
              </>
            </Typography>
            <Typography>
              Please enter the password for your {hasFile ? "" : "new"} contact
              data file.
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box
                display="flex"
                alignItems="baseline"
                width="300px"
                height="132px"
              >
                <Controller
                  as={TextField}
                  rules={{
                    pattern: {
                      value: passwordRegex,
                      message:
                        "Password not strong enought. Min 8 characters, upper and lower case letter, special character and number",
                    },
                  }}
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
