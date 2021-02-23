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

function ContactEditDialog({
  contact,
  onClose,
  ...props
}: ContactEditDialogProps) {
  const dispatch = useFileDispatch();

  const { register, handleSubmit, control } = useForm<Contact>();

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
            margin="normal"
            fullWidth
            label="Name"
            name="name"
            control={control}
            defaultValue={contact.name}
          />
          <Controller
            as={TextField}
            margin="normal"
            fullWidth
            label="E-mail"
            name="email"
            control={control}
            defaultValue={contact.email}
          />
          <Controller
            as={TextField}
            margin="normal"
            fullWidth
            label="phone"
            name="phone"
            control={control}
            defaultValue={contact.phone}
          />
          <Controller
            as={TextField}
            margin="normal"
            fullWidth
            label="address"
            name="address"
            control={control}
            defaultValue={contact.address}
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
