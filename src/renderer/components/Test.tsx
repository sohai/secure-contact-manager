import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Avatar from "@material-ui/core/Avatar";
import MenuIcon from "@material-ui/icons/Menu";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import MoreIcon from "@material-ui/icons/MoreVert";
import { ListItemSecondaryAction } from "@material-ui/core";
import CommentIcon from "@material-ui/icons/Comment";

const messages = [
  {
    name: "Noel Rodriquez",
    company: "TWIIST",
    email: "noel.rodriquez@twiist.io",
    phone: "+1 (826) 519-3800",
    address: "610 Miller Avenue, Manchester, Washington, 5919",
  },
  {
    name: "Melisa Morse",
    company: "VICON",
    email: "melisa.morse@vicon.name",
    phone: "+1 (874) 480-3289",
    address: "731 Dewey Place, Bluffview, Wisconsin, 7165",
  },
  {
    name: "Monica Witt",
    company: "TELEPARK",
    email: "monica.witt@telepark.info",
    phone: "+1 (895) 590-3364",
    address: "913 Bancroft Place, Gouglersville, Colorado, 9962",
  },
  {
    name: "Judy Crosby",
    company: "ATOMICA",
    email: "judy.crosby@atomica.co.uk",
    phone: "+1 (863) 542-2763",
    address: "116 Ocean Court, Golconda, Louisiana, 7637",
  },
  {
    name: "Christina Quinn",
    company: "BOILCAT",
    email: "christina.quinn@boilcat.ca",
    phone: "+1 (955) 408-2301",
    address: "625 Conway Street, Kidder, New Hampshire, 3241",
  },
  {
    name: "Hampton Barrera",
    company: "OATFARM",
    email: "hampton.barrera@oatfarm.biz",
    phone: "+1 (927) 473-2523",
    address: "411 Morgan Avenue, Brethren, Montana, 3063",
  },
  {
    name: "Kristi Carr",
    company: "TROLLERY",
    email: "kristi.carr@trollery.org",
    phone: "+1 (907) 413-3245",
    address: "163 Herzl Street, Islandia, Arizona, 154",
  },
  {
    name: "Evangelina Erickson",
    company: "OTHERSIDE",
    email: "evangelina.erickson@otherside.com",
    phone: "+1 (835) 496-2733",
    address: "296 Lincoln Road, Salix, North Carolina, 1088",
  },
  {
    name: "Katelyn Ellison",
    company: "ENORMO",
    email: "katelyn.ellison@enormo.biz",
    phone: "+1 (934) 548-3459",
    address: "161 Navy Street, Sunriver, Illinois, 7743",
  },
  {
    name: "Ramsey George",
    company: "HYPLEX",
    email: "ramsey.george@hyplex.tv",
    phone: "+1 (813) 547-2866",
    address: "630 Otsego Street, Rossmore, Texas, 5390",
  },
  {
    name: "Gina Gilmore",
    company: "ORONOKO",
    email: "gina.gilmore@oronoko.net",
    phone: "+1 (993) 562-2393",
    address: "703 Meadow Street, Beason, Nebraska, 3388",
  },
  {
    name: "Wilder Gates",
    company: "KYAGURU",
    email: "wilder.gates@kyaguru.me",
    phone: "+1 (952) 408-2308",
    address: "797 Hausman Street, Floriston, Maryland, 876",
  },
  {
    name: "Wall Whitfield",
    company: "KONGLE",
    email: "wall.whitfield@kongle.io",
    phone: "+1 (897) 596-3844",
    address: "620 Pioneer Street, Rosedale, Minnesota, 7763",
  },
  {
    name: "Margarita Thornton",
    company: "RECOGNIA",
    email: "margarita.thornton@recognia.name",
    phone: "+1 (976) 562-3249",
    address: "412 Buffalo Avenue, Wilmington, New Mexico, 4197",
  },
  {
    name: "Daphne Rowland",
    company: "HATOLOGY",
    email: "daphne.rowland@hatology.info",
    phone: "+1 (998) 495-2708",
    address: "584 Temple Court, Ahwahnee, American Samoa, 5626",
  },
  {
    name: "Washington Beard",
    company: "COMBOGENE",
    email: "washington.beard@combogene.co.uk",
    phone: "+1 (970) 451-3773",
    address: "404 Bayview Avenue, Osage, Marshall Islands, 2323",
  },
  {
    name: "Claire Spencer",
    company: "ZYPLE",
    email: "claire.spencer@zyple.ca",
    phone: "+1 (828) 459-3503",
    address: "378 Garden Place, Cochranville, Wyoming, 5308",
  },
  {
    name: "David Figueroa",
    company: "ORBAXTER",
    email: "david.figueroa@orbaxter.biz",
    phone: "+1 (991) 487-3170",
    address: "890 Centre Street, Chautauqua, Vermont, 5386",
  },
  {
    name: "Keith Michael",
    company: "CUBICIDE",
    email: "keith.michael@cubicide.org",
    phone: "+1 (807) 483-2736",
    address: "245 Java Street, Richville, Alabama, 7272",
  },
  {
    name: "George Franks",
    company: "APEXIA",
    email: "george.franks@apexia.com",
    phone: "+1 (841) 451-3601",
    address: "796 Ford Street, Jessie, New York, 3616",
  },
  {
    name: "Dee Alford",
    company: "BOSTONIC",
    email: "dee.alford@bostonic.biz",
    phone: "+1 (941) 459-3915",
    address: "577 Carlton Avenue, Needmore, Tennessee, 6272",
  },
  {
    name: "Owen Crawford",
    company: "CALCU",
    email: "owen.crawford@calcu.tv",
    phone: "+1 (939) 560-2139",
    address: "987 Gilmore Court, Dowling, Pennsylvania, 8441",
  },
  {
    name: "Parrish Sutton",
    company: "REALMO",
    email: "parrish.sutton@realmo.net",
    phone: "+1 (800) 512-2014",
    address: "263 Nixon Court, Gambrills, Ohio, 4044",
  },
  {
    name: "Monroe Nelson",
    company: "NEXGENE",
    email: "monroe.nelson@nexgene.me",
    phone: "+1 (815) 526-3557",
    address: "936 Brighton Avenue, Shelby, Massachusetts, 6240",
  },
  {
    name: "Rosie Randolph",
    company: "NIXELT",
    email: "rosie.randolph@nixelt.io",
    phone: "+1 (881) 420-2783",
    address: "712 Interborough Parkway, Kipp, Florida, 7908",
  },
  {
    name: "Thelma Cook",
    company: "GEEKKO",
    email: "thelma.cook@geekko.name",
    phone: "+1 (873) 496-2551",
    address: "636 Dunne Place, Kaka, Puerto Rico, 9734",
  },
  {
    name: "Susanne Phillips",
    company: "ECRATIC",
    email: "susanne.phillips@ecratic.info",
    phone: "+1 (872) 495-2249",
    address: "859 Chestnut Street, Southmont, Palau, 8888",
  },
  {
    name: "Jacquelyn Berger",
    company: "QIAO",
    email: "jacquelyn.berger@qiao.co.uk",
    phone: "+1 (835) 522-3503",
    address: "404 Garfield Place, Sardis, Oregon, 3911",
  },
  {
    name: "Mable Roberts",
    company: "RUGSTARS",
    email: "mable.roberts@rugstars.ca",
    phone: "+1 (890) 583-3840",
    address: "626 Jay Street, Norfolk, Virgin Islands, 9096",
  },
  {
    name: "Kaufman Deleon",
    company: "ROCKYARD",
    email: "kaufman.deleon@rockyard.biz",
    phone: "+1 (953) 540-2254",
    address: "785 Amboy Street, Fredericktown, California, 9386",
  },
  {
    name: "Dollie Raymond",
    company: "SHADEASE",
    email: "dollie.raymond@shadease.org",
    phone: "+1 (958) 540-2517",
    address: "719 Colonial Road, Davenport, Rhode Island, 3558",
  },
  {
    name: "Claudia Newton",
    company: "VISALIA",
    email: "claudia.newton@visalia.com",
    phone: "+1 (962) 540-3283",
    address: "724 Dekalb Avenue, Wildwood, North Dakota, 2504",
  },
  {
    name: "Ewing Day",
    company: "KOOGLE",
    email: "ewing.day@koogle.biz",
    phone: "+1 (842) 552-3445",
    address: "258 Duryea Court, Sheatown, Kentucky, 4866",
  },
  {
    name: "Nellie Bradshaw",
    company: "CYCLONICA",
    email: "nellie.bradshaw@cyclonica.tv",
    phone: "+1 (980) 430-3694",
    address: "293 Essex Street, Leeper, Federated States Of Micronesia, 3760",
  },
  {
    name: "Saundra Duffy",
    company: "GEEKMOSIS",
    email: "saundra.duffy@geekmosis.net",
    phone: "+1 (965) 422-3314",
    address: "308 Highland Boulevard, Starks, Maine, 317",
  },
  {
    name: "Abby Alexander",
    company: "RODEOLOGY",
    email: "abby.alexander@rodeology.me",
    phone: "+1 (819) 483-2695",
    address: "687 Ridgewood Avenue, Disautel, Iowa, 5092",
  },
  {
    name: "Gretchen Trujillo",
    company: "AFFLUEX",
    email: "gretchen.trujillo@affluex.io",
    phone: "+1 (937) 595-3913",
    address: "653 Summit Street, Lorraine, Arkansas, 9500",
  },
  {
    name: "Mendez Beach",
    company: "CIRCUM",
    email: "mendez.beach@circum.name",
    phone: "+1 (864) 508-2994",
    address: "219 Sands Street, Adelino, Utah, 6282",
  },
  {
    name: "Norris Fields",
    company: "ROUGHIES",
    email: "norris.fields@roughies.info",
    phone: "+1 (800) 591-3597",
    address: "411 Remsen Street, Vincent, South Carolina, 6877",
  },
  {
    name: "Viola Glass",
    company: "LYRICHORD",
    email: "viola.glass@lyrichord.co.uk",
    phone: "+1 (991) 463-2470",
    address: "948 Heath Place, Vicksburg, West Virginia, 505",
  },
  {
    name: "Rosetta Garza",
    company: "COREPAN",
    email: "rosetta.garza@corepan.ca",
    phone: "+1 (900) 457-3115",
    address: "263 Kane Street, Remington, District Of Columbia, 9881",
  },
];

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

const getInitials = (str: String) => {
  const arr = str.split(" ");
  return arr[0][0] + (arr[1] ? arr[1][0] : "");
};

export default function Test() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <CssBaseline />
      <Paper square className={classes.paper}>
        <List className={classes.list}>
          {messages.map(({ name, email, phone, address }, idx) => (
            <React.Fragment key={idx}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>{getInitials(name)}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={name} secondary={email} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="comments">
                    <CommentIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="open drawer">
            <MenuIcon />
          </IconButton>
          <Fab color="secondary" aria-label="add" className={classes.fabButton}>
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
    </React.Fragment>
  );
}
