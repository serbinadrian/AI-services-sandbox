import React from "react";
import { NavLink } from "react-router-dom";
import { useStyles } from "./styles";

const NavItem = ({ title, link }) => {
  const classes = useStyles();
  const isActive = (pathname) => {
    return pathname === link;
  };

  return (
    <li className={classes.navLinks}>
      <NavLink to={link} className={classes.navLinksAnchor} activeClassName={classes.activeTab} isActive={isActive}>
        {title}
      </NavLink>
    </li>
  );
};

NavItem.defaultProps = {
  link: "#",
};

export default NavItem;
