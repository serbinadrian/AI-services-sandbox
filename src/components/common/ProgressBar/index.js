import React from "react";
import { withStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import ProgressControl, { ProgressContolTypes } from "./ProgressControl";
import ProgressSection, { ProgressStatusList } from "./ProgressSection";
import { useStyles } from "./styles";

export const progressTabStatus = { SUCCESS: "SUCCESS" };

const ProgressBar = ({
  classes,
  activeSection,
  progressText,
  stateSwitchOptions,
  demoProgressStatus,
}) => {
  const computeProgressStatus = (
    progressNumber,
    activeSection,
    progressStatus
  ) => {
    if (
      progressNumber < activeSection ||
      progressStatus === progressTabStatus.SUCCESS
    ) {
      return ProgressStatusList.COMPLETED;
    }
    if (progressNumber === activeSection) {
      return ProgressStatusList.ACTIVE;
    }
    if (progressNumber > activeSection) {
      return ProgressStatusList.IDLE;
    }
  };

  return (
    <div className={classes.tabsContainer}>
      <div className={classes.controllStateButtons}>
      <ProgressControl
        type={ProgressContolTypes.BACK}
        activeSection={activeSection}
        demoProgressStatus={demoProgressStatus}
        stateSwitchOptions={stateSwitchOptions}
      />
      <ProgressControl
        type={ProgressContolTypes.FORWARD}
        activeSection={activeSection}
        demoProgressStatus={demoProgressStatus}
        stateSwitchOptions={stateSwitchOptions}
      />
      </div>
      <ul>
        {progressText.map((text, index) => (
          <ProgressSection
            progressNumber={index + 1}
            progressText={text.label}
            progressStatus={computeProgressStatus(
              index + 1,
              activeSection,
              text.status
            )}
            key={index.toString()}
          />
        ))}
      </ul>
    </div>
  );
};

ProgressBar.propTypes = {
  activeSection: PropTypes.number,
  progressText: PropTypes.arrayOf(PropTypes.string),
  stateSwitchOptions: PropTypes.objectOf(PropTypes.func),
  demoProgressStatus: PropTypes.object,
};

export default withStyles(useStyles)(ProgressBar);
