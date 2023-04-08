import React from "react";
import { connect } from "react-redux";

import { useStyles } from "./styles";
import NavBar from "./NavBar"; 
import { NavData } from "../../../utility/constants/Header";

const Header = ({ isLoggedIn, showNotification, onCloseClick }) => {
  const classes = useStyles();
  return (
    <div>
      <header className={classes.header}>
        <div className={classes.mainHeader}>
          <div className={classes.navigationSection}>
            <NavBar data={NavData} />
          </div>
        </div>
      </header>
    </div>
  );
};

const mapStateToProps = state => ({ isLoggedIn: true });

export default connect(mapStateToProps)(Header);
