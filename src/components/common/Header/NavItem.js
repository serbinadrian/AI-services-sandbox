import React from "react";
import AnchorLink from "../AnchorLink";
import { useStyles } from "./styles";

const NavItem = ({ title, link, newTab }) => {
  const classes = useStyles();

  return (
    <li className={classes.navLinks}>
      <AnchorLink label={title} href={link} newTab={newTab} />
    </li>
  );
};

NavItem.defaultProps = {
  link: "#",
};

export default NavItem;
