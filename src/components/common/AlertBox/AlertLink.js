import React from "react";

const AlertLink = ({ link }) => {
  if (link) {
    return (
      // eslint-disable-next-line
      <a href="#" title="demo">
        {link}
      </a>
    );
  }
  return null;
};

export default AlertLink;
