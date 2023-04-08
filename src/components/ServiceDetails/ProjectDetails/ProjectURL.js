import React from "react";
import PropTypes from "prop-types";
import LaunchIcon from "@material-ui/icons/Launch";
import { withStyles } from "@material-ui/styles";

import { useStyles } from "./styles";
import Row from "./Row";

const ProjectURL = ({ URL, classes }) => {
  const link = () => {
    if (!URL) {
      return "error";
    } else {
      return URL;
    }
  }

  return (
    <Row
      className={classes.projectURLContainer}
      content={
        <React.Fragment>
          {URL ? <LaunchIcon /> : ""}
          <a href={link()} target="_blank" rel="noopener noreferrer" alt="URL">
            {link()}
          </a>
        </React.Fragment>
      }
    />
  );
};

ProjectURL.propTypes = {
  URL: PropTypes.string,
};

export default withStyles(useStyles)(ProjectURL);
