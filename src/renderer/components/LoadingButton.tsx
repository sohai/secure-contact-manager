import React from "react";
import { Button, ButtonProps, CircularProgress } from "@material-ui/core";

type LoadingButtonProps = ButtonProps & { loading: boolean };

export default function LoadingButton({
  loading,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={loading || disabled} {...props}>
      {loading && <CircularProgress size={14} />}
      {!loading && "Click Me"}
    </Button>
  );
}