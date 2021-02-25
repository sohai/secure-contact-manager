import React, { ReactElement, useEffect, useMemo, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import { grey } from "@material-ui/core/colors";
import { Redirect } from "react-router-dom";
import FlexSearch from "flexsearch";
import { useFileDispatch, useFileState } from "../context/file.context";
import ContactListItem from "./ContactListItem";
import ContactEditDialog from "./ContactEditDialog";
import { useFlexSearch } from "react-use-flexsearch";
import type { Contact } from "../../types/Contact";
import { Box, Typography } from "@material-ui/core";

const { ipcRenderer } = window.require("electron");

const strigifyContact = ({ name, address, phone, email }: Contact) =>
  `${name} ${email} ${phone} ${address}`;

const useStyles = makeStyles((theme) => ({
  text: {
    padding: theme.spacing(2, 2, 0),
  },
  paper: {
    height: "100vh",
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
  searchInput: {
    color: "#fff",
  },
}));

const NEW_CONTACT: Partial<Contact> = {
  name: "",
  address: "",
  phone: "",
  email: "",
};

const index = FlexSearch.create();

export default function ContactList(): ReactElement {
  const classes = useStyles();

  const { data: contacts, isLoaded, password } = useFileState();
  const dispatch = useFileDispatch();

  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    let didCancel = false;
    setSyncing(true);
    async function getInit() {
      await ipcRenderer.invoke("app:save-file", contacts, password);
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

  /** I thnik its good to keep in store/context as unsorted data and deal with it locally because
   * I can image that this app could have sorting functionality */
  const memoizedContacts = useMemo(() => {
    const result = contacts.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    index.clear();
    for (let i = 0; i < contacts.length; i++) {
      index.add(i, strigifyContact(contacts[i]));
    }
    return result;
  }, [contacts]);

  const [query, setQuery] = useState<string | null>("");
  const results = useFlexSearch(query, index, memoizedContacts);

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
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <React.Fragment>
      {!isLoaded && <Redirect to="/" />}
      <Paper square className={classes.paper}>
        {memoizedContacts.length > 0 && (
          <List className={classes.list} component="div">
            {(query ? results : memoizedContacts).map((contact: Contact) => (
              <ContactListItem
                key={contact.uuid}
                contact={contact}
                onEdit={(contact: Contact) => setEditContact(contact)}
                onDelete={handleDeleteContact}
              />
            ))}
          </List>
        )}
        {memoizedContacts.length === 0 && (
          <Box
            component={Paper}
            display="flex"
            height="100vh"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <ImportContactsIcon style={{ fontSize: 120, color: grey[500] }} />
            <Typography variant="h3" color="textSecondary">
              Add your first contact
            </Typography>
          </Box>
        )}
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
          <TextField
            InputProps={{
              className: classes.searchInput,
            }}
            value={query}
            onChange={handleQueryChange}
          />
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
