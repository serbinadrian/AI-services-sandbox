import React from "react";
import Grid from "@material-ui/core/Grid";
import OutlinedTextArea from "../../common/OutlinedTextArea";
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";
import HoverIcon from "../../standardComponents/HoverIcon";
import AlertBox, { alertTypes } from "../../../../components/common/AlertBox";
import { example_service } from "./example_service_pb_service";
import { MODEL, BLOCKS, LABELS } from "./metadata";
import { useStyles } from "./styles";
import { withStyles } from "@material-ui/styles";

const { rangeRestrictions, valueRestrictions } = MODEL.restrictions;
const onlyNumbersRegex = new RegExp(valueRestrictions.ONLY_NUMBERS_REGEX.value);
const onlyLatinsRegex = new RegExp(valueRestrictions.ONLY_LATINS_REGEX.value);

const EMPTY_STRING = "";
const OK_CODE = 0;
const SPACE = " ";
const SPACED_SLASH = " / ";

const outlinedTextAreaAdditionalProps = {
  HELPER: "helperTxt",
  ON_CHANGE: "onChange",
  CHAR_LIMIT: "charLimit",
};

class ExampleService extends React.Component {
  constructor(props) {
    const { state } = MODEL;
    super(props);
    this.submitAction = this.submitAction.bind(this);
    this.handleTextInput = this.handleTextInput.bind(this);
    this.inputMaxLengthHelperFunction = this.inputMaxLengthHelperFunction.bind(
      this
    );
    this.state = state;
  }

  getErrorMessageByKey(errorKey) {
    const { errors } = LABELS;
    return errors[errorKey];
  }

  getValidationMetaByTargetName(targetName) {
    const { inputBlocks } = BLOCKS;

    switch (targetName) {
      case inputBlocks.NUMBERS_INPUT.name: {
        const errorKey = valueRestrictions.ONLY_NUMBERS_REGEX.errorKey;
        return {
          regex: onlyNumbersRegex,
          errorKey: errorKey,
        };
      }
      case inputBlocks.TEXT_INPUT.name: {
        const errorKey = valueRestrictions.ONLY_LATINS_REGEX.errorKey;
        return {
          regex: onlyLatinsRegex,
          errorKey: errorKey,
        };
      }
      default: {
        return null;
      }
    }
  }

  isValidInput(regex, text) {
    return regex.exec(text);
  }

  validateInput(targetName, targetValue) {
    const { errors } = this.state.status;
    const { regex, errorKey } = this.getValidationMetaByTargetName(targetName);
    let isAllRequirementsMet = true;

    if (!this.isValidInput(regex, targetValue)) {
      const errorMessage = this.getErrorMessageByKey(errorKey);
      errors.set(errorKey, errorMessage);
    } else {
      errors.delete(errorKey);
    }

    if (errors.size > 0) {
      isAllRequirementsMet = false;
    }

    this.setState({
      status: {
        errors: errors,
        isAllRequirementsMet: isAllRequirementsMet,
      },
    });
  }

  canBeInvoked() {
    const { status, textInputValue, numberInputValue } = this.state;
    const { isAllRequirementsMet } = status;

    return (
      isAllRequirementsMet &&
      textInputValue !== EMPTY_STRING &&
      numberInputValue !== EMPTY_STRING
    );
  }

  isOk(status) {
    return status === OK_CODE;
  }

  handleTextInput(event) {
    const targetName = event.target.name;
    const targetValue = event.target.value;

    this.validateInput(targetName, targetValue);

    this.setState({
      [targetName]: targetValue,
    });
  }

  parseResponse(response) {
    const { message, status, statusMessage } = response;

    if (!this.isOk(status)) {
      throw new Error(statusMessage);
    }

    //In some project, servise response is array of objects,

    this.setState({
      response: message.getAnswer(),
    });
  }

  submitAction() {
    const { textInputValue, numbersInputValue } = this.state;
    const { service } = MODEL;

    const methodDescriptor = example_service[service.METHOD];
    const request = new methodDescriptor.requestType();

    request.setText(textInputValue);
    request.setNumbers(numbersInputValue);

    const props = {
      request,
      onEnd: (response) => this.parseResponse(response),
    };

    this.props.serviceClient.unary(methodDescriptor, props);
  }

  inputMaxLengthHelperFunction(textLengthValue, restrictionKey) {
    const { labels } = LABELS;

    return (
      textLengthValue +
      SPACED_SLASH +
      rangeRestrictions[restrictionKey].max +
      SPACE +
      labels.CHARS
    );
  }

  createHandleConfiguration(meta) {
    const { handleFunctionKey, helperFunctionKey, rangeRestrictionKey } = meta;

    let InputHandlerConfiguration = {};

    if (this[helperFunctionKey]) {
      //helper is const string for single render and it have to be constructed before used -> call()
      InputHandlerConfiguration[outlinedTextAreaAdditionalProps.HELPER] = this[
        helperFunctionKey
      ].call(this, this.state[meta.stateKey].length, rangeRestrictionKey);
    }
    if (this[handleFunctionKey]) {
      InputHandlerConfiguration[
        outlinedTextAreaAdditionalProps.ON_CHANGE
      ] = this[handleFunctionKey];
    }
    if (rangeRestrictions[meta.rangeRestrictionKey].max) {
      InputHandlerConfiguration[outlinedTextAreaAdditionalProps.CHAR_LIMIT] =
        rangeRestrictions[meta.rangeRestrictionKey].max;
    }
    return InputHandlerConfiguration;
  }

  renderTextArea(meta) {
    const { labels } = LABELS;

    let InputHandlerConfiguration = [];

    if (meta.edit) {
      InputHandlerConfiguration = this.createHandleConfiguration(meta);
    }

    return (
      <Grid item xs={12} container justify="center">
        <OutlinedTextArea
          fullWidth={true}
          id={meta.id}
          name={meta.name}
          rows={meta.rows}
          label={labels[meta.labelKey]}
          value={this.state[meta.stateKey]}
          {...InputHandlerConfiguration}
        />
      </Grid>
    );
  }

  //If you need rendered block_set for service output:
  // renderOutputLine(outputKey) {
  //   const { classes } = this.props;
  //   const { response } = this.state;

  //   return (
  //     <Grid
  //       className={classes.outputLine}
  //       item
  //       xs={12}
  //       container
  //       justify="flex-start"
  //       key={outputKey}
  //     >
  //       <Grid className={classes.responseCategory} item xs={3}>
  //         {outputKey}
  //       </Grid>
  //       <Grid item xs={9}>
  //         {response[outputKey]}
  //       </Grid>
  //     </Grid>
  //   );
  // }

  // renderOutputBlockSet() {
  //   const { labels } = LABELS;
  //   const { classes } = this.props;
  //   const { response } = this.state;
  //   const outputKeysArray = Object.keys(response);

  //   return (
  //     <Grid item xs={12} container justify="flex-start">
  //       <span className={classes.outputLabel}>{labels.SERVICE_OUTPUT}</span>
  //       {outputKeysArray.map((outputKey) => this.renderOutputLine(outputKey))}
  //     </Grid>
  //   );
  // }

  renderInfoBlock() {
    const { informationLinks } = MODEL;
    const { informationBlocks } = BLOCKS;
    const { labels } = LABELS;

    const links = Object.values(informationBlocks);

    return (
      <Grid item xs container justify="flex-end">
        {links.map((link) => (
          <Grid item key={link.linkKey}>
            <HoverIcon
              text={labels[link.labelKey]}
              href={informationLinks[link.linkKey]}
            >
              <SvgIcon>
                <path d={link.svgPath} />
              </SvgIcon>
            </HoverIcon>
          </Grid>
        ))}
      </Grid>
    );
  }

  renderInvokeButton() {
    const { classes } = this.props;
    const { labels } = LABELS;

    return (
      <Grid item xs={12} className={classes.invokeButton}>
        <Button
          variant="contained"
          color="primary"
          onClick={this.submitAction}
          disabled={!this.canBeInvoked()}
        >
          {labels.INVOKE_BUTTON}
        </Button>
      </Grid>
    );
  }

  renderValidationStatusBlocks(errors) {
    const { classes } = this.props;

    const errorKeysArray = Array.from(errors.keys());

    return (
      <Grid item xs={12} container className={classes.alertsContainer}>
        {errorKeysArray.map((arrayErrorKey) => (
          <AlertBox
            type={alertTypes.ERROR}
            message={errors.get(arrayErrorKey)}
            className={classes.alertMessage}
            key={arrayErrorKey}
          />
        ))}
      </Grid>
    );
  }

  renderServiceInput() {
    const { inputBlocks } = BLOCKS;
    const { errors } = this.state.status;

    return (
      <Grid container direction="column" justify="center">
        {this.renderTextArea(inputBlocks.NUMBERS_INPUT)}
        {this.renderTextArea(inputBlocks.TEXT_INPUT)}
        {this.renderInfoBlock()}
        {this.renderInvokeButton()}
        {errors.size ? this.renderValidationStatusBlocks(errors) : null}
      </Grid>
    );
  }

  renderServiceOutput() {
    const { response } = this.state;
    const { outputBlocks } = BLOCKS;
    const { status } = LABELS;

    if (!response) {
      return <h4>{status.NO_RESPONSE}</h4>;
    }

    return (
      <Grid container direction="column" justify="center">
        {this.renderTextArea(outputBlocks.USER_NUMBER_INPUT)}
        {this.renderTextArea(outputBlocks.USER_TEXT_INPUT)}
        {this.renderTextArea(outputBlocks.SERVICE_OUTPUT)}
        {this.renderInfoBlock()}
      </Grid>
    );
  }

  render() {
    if (!this.props.isComplete) {
      return this.renderServiceInput();
    } else {
      return this.renderServiceOutput();
    }
  }
}

export default withStyles(useStyles)(ExampleService);
