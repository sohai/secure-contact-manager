import AppBar from "@material-ui/core/AppBar";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import AddIcon from "@material-ui/icons/Add";
import MenuIcon from "@material-ui/icons/Menu";
import MoreIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import React, { useMemo } from "react";
import ContactListItem from "./ContactListItem";
import { useFileDispatch, useFileState } from "../context/file.context";
import { Link, Redirect } from "react-router-dom";
import ContactEditDialog from "./ContactEditDialog";

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

const NEW_CONTACT = {
  name: "",
  address: "",
  phone: "",
  email: "",
};

export default function ContactList() {
  const classes = useStyles();

  const { data: contacts, isLoaded } = useFileState();
  const dispatch = useFileDispatch();

  const handleClear = () => {
    dispatch({
      type: "clear",
    });
  };

  const memoizedContacts = useMemo(
    () =>
      contacts.sort((a, b) => {
        return a.name.localeCompare(b.name);
      }),
    [contacts]
  );

  const [editContact, setEditContact] = React.useState(null);

  const selectEditContact = (contact) => {
    setEditContact(contact);
  };

  const handlCloseEditDialog = () => {
    setEditContact(null);
  };

  const handleAddNewContact = () => {
    setEditContact(NEW_CONTACT);
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
              onEdit={(contact) => setEditContact(contact)}
            />
          ))}
        </List>
      </Paper>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <IconButton onClick={handleClear} edge="start" color="inherit">
            <MenuIcon />
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
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton edge="end" color="inherit">
            <MoreIcon />
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
