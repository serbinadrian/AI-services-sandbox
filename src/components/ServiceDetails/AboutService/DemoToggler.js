import React from "react";
import { withStyles } from "@material-ui/styles";
import StyledButton from "../../common/StyledButton";
import ServiceDemo from "./ServiceDemo";
import serviceOfflineImg from "../../../assets/images/Artboard.png";
import { useStyles } from "./styles";
import { useSelector } from "react-redux";

const DemoToggler = ({
  classes,
  showDemo,
  onClick,
  service,
  history,
  serviceAvailable,
  demoExampleRef,
  scrollToView,
  demoComponentRequired,
}) => {
  const freeCalls = useSelector(state => state.serviceDetailsReducer.freeCalls);

  if (!serviceAvailable) {
    return (
      <div className={classes.serviceOfflineContainer} ref={demoExampleRef}>
        <h2>Demo Example</h2>
        <div className={classes.serviceOffline}>
          <div className={classes.imgContainer}>
            <img
              src={serviceOfflineImg}
              title="Service Not Available"
              alt="Service Not Available due to poor connection "
              loading="lazy"
            />
            <p>Service temporary offline by provider.</p>
            <p>Please try again Later.</p>
            <span>If this error is continuing for some time, feel free to reach us.</span>
          </div>
          <div className={classes.btnContainer}>
            <StyledButton btnText="submit error" type="transparent" />
            <StyledButton btnText="contact support" type="transparent" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.demoContainer} ref={demoExampleRef}>
      <h2>Service Demo</h2>
      <ServiceDemo service={service} history={history} scrollToView={scrollToView} freeCallsRemaining={freeCalls.remaining} freeCallsAllowed={freeCalls.allowed}/>
    </div>
  );
};

export default withStyles(useStyles)(DemoToggler);
