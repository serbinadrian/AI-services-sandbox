import React from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { useStyles } from "./styles";
import DemoToggler from "./DemoToggler";
import ProjectDetails from "../ProjectDetails";

const AboutService = ({
  classes,
  isLoggedIn,
  service,
  history,
  serviceAvailable,
  demoExampleRef,
  scrollToView,
  demoComponentRequired,
  training,
  editModel
}) => {

  return (
    <Grid container spacing={24} className={classes.aboutContainer}>
      <Grid item xs={12} sm={12} md={8} lg={8} className={classes.leftSideSection}>
        <DemoToggler
          showDemo={isLoggedIn}
          classes={classes}
          service={service}
          history={history}
          serviceAvailable={serviceAvailable}
          demoExampleRef={demoExampleRef}
          scrollToView={scrollToView}
          demoComponentRequired={demoComponentRequired}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={4} lg={4} className={classes.rightSideSection}>
        <ProjectDetails
          projectURL={service.url}
          contributors={service.contributors}
          orgId={service.org_id}
          serviceId={service.service_id}
        />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = state => ({
  isLoggedIn: true,
});

export default connect(mapStateToProps)(withStyles(useStyles)(AboutService));
