import React from "react";
import { connect } from "react-redux";
import { useStyles } from "./styles";

const SignOut = props => {
  const classes = useStyles();

  const handleSignOut = () => {
    props.signOut();
  };

  return (
    <li className={`${classes.signupBtn} ${classes.loginBtnsLi}`} onClick={handleSignOut}>
      <span className={`${classes.loginBtnsAnchor} ${classes.UppercaseText} ${classes.signupBtnText}`}> Sign Out</span>
    </li>
  );
};

export default connect(
  null,
  mapDispatchToProps
)(SignOut);
