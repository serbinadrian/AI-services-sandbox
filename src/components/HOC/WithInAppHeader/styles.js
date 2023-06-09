import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(theme => ({
  scrollableContent: {
    width: "100%",
    height: "calc(100vh - 70px)",
    position: "absolute",
    top: 50,
    overflowY: "scroll",
    backgroundColor: theme.palette.text.offWhiteColor,
  },
  increaseTopSpace: {
    height: "calc(100vh - 110px)",
    top: 110,
  },
}));
