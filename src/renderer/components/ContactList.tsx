import AppBar from "@material-ui/core/AppBar";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useMemo, useState } from "react";
import ContactListItem from "./ContactListItem";
import { useFileDispatch, useFileState } from "../context/file.context";
import { Redirect } from "react-router-dom";
import ContactEditDialog from "./ContactEditDialog";
import { CircularProgress } from "@material-ui/core";
import type { Contact } from "../../types/Contact";

const { ipcRenderer } = window.require("electron");

const useStyles = makeStyles((theme) => ({
  text: {
    padding: theme.spacing(2, 2, 0),
  },
  paper: {
    paddingBottom: 50,
  },
  list: {
    marginBottom: theme.spacing(2),
  },
  subheader: {
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    top: "auto",
    bottom: 0,
  },
  grow: {
    flexGrow: 1,
  },
  fabButton: {
    position: "absolute",
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: "0 auto",
  },
}));

const NEW_CONTACT: Partial<Contact> = {
  name: "",
  address: "",
  phone: "",
  email: "",
};

export default function ContactList() {
  const classes = useStyles();

  const { data: contacts, isLoaded } = useFileState();
  const dispatch = useFileDispatch();

  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    let didCancel = false;
    setSyncing(true);
    async function getInit() {
      await ipcRenderer.invoke("app:save-file", contacts);
      if (!didCancel) {
        setSyncing(false);
      }
    }

    getInit();
    return () => {
      didCancel = true;
    };
  }, [contacts]);

  const handleClear = () => {
    dispatch({
      type: "reinit",
    });
  };

  /** I thnik its good to keep in store/context unsorted data and deal with it locally because
   * I can image that this app could have sorting functionality */
  const memoizedContacts = useMemo(
    () =>
      contacts.sort((a, b) => {
        return a.name.localeCompare(b.name);
      }),
    [contacts]
  );

  const [editContact, setEditContact] = useState<Partial<Contact> | null>(null);

  const handlCloseEditDialog = () => {
    setEditContact(null);
  };

  const handleAddNewContact = () => {
    setEditContact(NEW_CONTACT);
  };

  const handleDeleteContact = (uuid: string) => {
    dispatch({
      type: "delete_contact",
      payload: uuid,
    });
  };

  return (
    <React.Fragment>
      {!isLoaded && <Redirect to="/" />}
      <Paper square className={classes.paper}>
        <List className={classes.list} component="div">
          {memoizedContacts.map((contact) => (
            <ContactListItem
              key={contact.uuid}
              contact={contact}
              onEdit={(contact: Contact) => setEditContact(contact)}
              onDelete={handleDeleteContact}
            />
          ))}
        </List>
      </Paper>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <IconButton onClick={handleClear} edge="start" color="inherit">
            <CloseIcon />
          </IconButton>
          <Fab
            onClick={handleAddNewContact}
            color="secondary"
            aria-label="add"
            className={classes.fabButton}
          >
            <AddIcon />
          </Fab>
          <div className={classes.grow} />
          {syncing && <CircularProgress />}
          <IconButton color="inherit">
            <SearchIcon />
            
          </IconButton>
        </Toolbar>
      </AppBar>
      {editContact && (
        <ContactEditDialog
          onClose={handlCloseEditDialog}
          contact={editContact}
        />
      )}
    </React.Fragment>
  );
}
