import {
  Avatar,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemProps,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { styled } from "@material-ui/styles";
import React from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditIcon from "@material-ui/icons/Edit";
import PhoneIcon from "@material-ui/icons/Phone";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import type { Contact } from "../../types/Contact";

const getInitials = (name: String) => {
  const arr = name.split(" ");
  return arr[0][0] + (arr[1] ? arr[1][0] : "");
};

const IconTypography = styled(Typography)({
  display: "inline-grid",
  gridTemplateColumns: `auto 1fr`,
  gap: ".5rem",
});

const ContactMoreListItem = (props: ListItemProps) => {
  const classes = useStyles();
  return <ListItem className={classes.root} {...props} />;
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gap: ".5rem",
    marginBottom: theme.spacing(2),
  },
}));

type ContactMoreProps = Pick<Contact, "address" | "phone">;

function ContactMore({ address, phone }: ContactMoreProps) {
  return (
    <ContactMoreListItem component="div">
      <IconTypography color="textSecondary">
        <PhoneIcon /> {phone}
      </IconTypography>
      <IconTypography color="textSecondary">
        <ContactMailIcon />
        {address}
      </IconTypography>
    </ContactMoreListItem>
  );
}

type ContactListItemProps = Contact;

export default function ContactListItem({
  name,
  email,
  address,
  phone,
}: ContactListItemProps) {
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <React.Fragment>
      <ListItem component="div">
        <ListItemAvatar>
          <Avatar>{getInitials(name)}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={name} secondary={email} />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="comments" onClick={handleClick}>
            <ExpandMoreIcon />
          </IconButton>
          <IconButton edge="end" aria-label="comments">
            <EditIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <ContactMore address={address} phone={phone} />
      </Collapse>
    </React.Fragment>
  );
}
