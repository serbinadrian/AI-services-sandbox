import React from "react";
import Grid from "@material-ui/core/Grid";
import OutlinedTextArea from "../../common/OutlinedTextArea";
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";
import HoverIcon from "../../standardComponents/HoverIcon";
import AlertBox from "../../../../components/common/AlertBox"
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

class ExampleService extends React.Component {
  constructor(props) {
    const { state } = MODEL;
    super(props);
    this.submitAction = this.submitAction.bind(this);
    this.handleTextInput = this.handleTextInput.bind(this);
    this.inputMaxLengthHelperFunction = this.inputMaxLengthHelperFunction.bind(this);
    this.state = state;
  }

  makeErrors(errorKeys) {
    const { errors } = LABELS;
    let errorMessages = [];

    errorKeys.forEach(errorKey => {
      const errorMessage = errors[errorKey];
      if (!errorMessages.includes(errorMessage)) {
        errorMessages.push(errorMessage);
      }
    });

    return errorMessages;
  }

  getValidationMetaByTargetName(targetName) {
    const { inputBlocks } = BLOCKS;

    console.log('targetName', targetName);

    switch (targetName) {
      case inputBlocks.NUMBERS_INPUT.name: {
        const errorKey = valueRestrictions.ONLY_NUMBERS_REGEX.errorKey
        return {
          regex: onlyNumbersRegex,
          errorKey: errorKey
        };
      }
      case inputBlocks.TEXT_INPUT.name: {
        const errorKey = valueRestrictions.ONLY_LATINS_REGEX.errorKey
        return {
          regex: onlyLatinsRegex,
          errorKey: errorKey
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
    const { errors } = this.state.status
    let errorKeys = [];
    let isAllRequirementsMet = true;
    const { regex, errorKey } = this.getValidationMetaByTargetName(targetName);

    if (!this.isValidInput(regex, targetValue)) {
      errorKeys.push(errorKey)
    }

    if (errorKeys.length > 0 || errors.length > 0) {
      isAllRequirementsMet = false;
    }

    const newErrors = this.makeErrors(errorKeys);

    this.setState({
      status: {
        errors: newErrors,
        isAllRequirementsMet: isAllRequirementsMet
      }
    });
  }

  canBeInvoked() {
    const { status, textInputValue, numberInputValue } = this.state;
    const { isAllRequirementsMet } = status;
    return isAllRequirementsMet &&
      textInputValue !== EMPTY_STRING &&
      numberInputValue !== EMPTY_STRING
  }

  isOk(status) {
    return status === OK_CODE;
  }

  handleTextInput(event) {
    const targetName = event.target.name, targetValue = event.target.value;
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
    const { common } = LABELS;

    return textLengthValue + SPACED_SLASH + rangeRestrictions[restrictionKey].max + SPACE + common.CHARS;
  }

  createHandleConfiguration(meta) {
    const { handleFunctionKey, helperFunctionKey, rangeRestrictionKey } = meta;

    let InputHandlerConfiguration = {};

    if (this[helperFunctionKey]) {
      //helper is const string for single render and it have to be constructed before used -> call()
      InputHandlerConfiguration["helperTxt"] = this[helperFunctionKey].call(
        this,
        this.state[meta.stateKey].length,
        rangeRestrictionKey
      );
    }
    if (this[handleFunctionKey]) {
      InputHandlerConfiguration["onChange"] = this[handleFunctionKey];
    }
    return InputHandlerConfiguration ?? [];
  }

  renderTextArea(meta) {
    const { common } = LABELS;

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
          label={common[meta.labelKey]}
          value={this.state[meta.stateKey]}
          charLimit={rangeRestrictions[meta.rangeRestrictionKey].max}
          {...InputHandlerConfiguration}
        />
      </Grid>
    );
  }

  renderInfoBlock() {
    const { informationLinks } = MODEL;
    const { informationBlocks } = BLOCKS;
    const { common } = LABELS;
    const links = Object.values(informationBlocks);

    return (
      <Grid item xs container justify="flex-end">
        {links.map((link) => (
          <Grid item key={link.linkKey} >
            <HoverIcon
              text={common[link.labelKey]}
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
    const { common } = LABELS;

    return (
      <Grid item xs={12} className={classes.invokeButton}>
        <Button
          variant="contained"
          color="primary"
          onClick={this.submitAction}
          disabled={!this.canBeInvoked()}
        >
          {common.INVOKE_BUTTON}
        </Button>
      </Grid>
    );
  }

  renderValidationStatusBlock(errors) {
    const { classes } = this.props;

    return (
      <Grid item xs={12} container className={classes.alertsContainer}>
        {errors.map(errorMessage => (
          <AlertBox message={errorMessage} className={classes.alertMessage} key={errorMessage} />
        ))}
      </Grid>
    )
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
        {errors.length ? this.renderValidationStatusBlock(errors) : null}
      </Grid>
    );
  }

  renderServiceOutput() {
    const { response } = this.state;
    const { outputBlocks } = BLOCKS;
    const { status } = LABELS;

    if (!response) {
      return (
        <h4>
          {status.NO_RESPONSE}
        </h4>
      );
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
