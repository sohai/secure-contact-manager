import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import type { Contact } from "../../types/Contact";
import { useForm, Controller } from "react-hook-form";
import { useFileDispatch } from "../context/file.context";

type ContactEditDialogProps = Omit<DialogProps, "open"> & {
  contact: Partial<Contact>;
};

const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

function ContactEditDialog({
  contact,
  onClose,
  ...props
}: ContactEditDialogProps) {
  const dispatch = useFileDispatch();

  const { register, handleSubmit, control, errors } = useForm<Contact>();

  const onSubmit = (data: Contact) => {
    dispatch({
      type: "save_contact",
      payload: data,
    });
    onClose();
  };

  const open = !!contact;

  return (
    <Dialog onClose={onClose} open={open} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <input
            type="hidden"
            name="uuid"
            value={contact.uuid}
            ref={register}
          />
          <Controller
            as={TextField}
            autoFocus
            error={Boolean(errors.name)}
            fullWidth
            label="Name"
            name="name"
            control={control}
            defaultValue={contact.name}
            rules={{
              required: 'Name is required',
            }}
            helperText={errors.name ? errors.name.message : " "}
          />
          <Controller
            as={TextField}
            error={Boolean(errors.email)}
            fullWidth
            label="E-mail"
            name="email"
            control={control}
            defaultValue={contact.email}
            rules={{
              pattern: {
                value: emailRegex,
                message: "Wrong email",
              },
            }}
            helperText={errors.email ? errors.email.message : " "}
          />
          <Controller
            as={TextField}
            fullWidth
            label="Phone"
            name="phone"
            control={control}
            defaultValue={contact.phone}
            helperText={" "}
          />
          <Controller
            as={TextField}
            multiline
            fullWidth
            label="Address"
            name="address"
            control={control}
            defaultValue={contact.address}
            helperText={" "}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="primary">
            Save
          </Button>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ContactEditDialog;
