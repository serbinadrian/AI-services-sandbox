import React from "react";
import Grid from "@material-ui/core/Grid";
import OutlinedTextArea from "../../common/OutlinedTextArea";
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";
import HoverIcon from "../../standardComponents/HoverIcon";
import { example_service } from "./example_service_pb_service";
import { metadata } from "./metadata";
import { useStyles } from "./styles";
import { withStyles } from "@material-ui/styles";

class ExampleService extends React.Component {
  constructor(props) {
    const { state } = metadata.configuration;
    super(props);
    this.submitAction = this.submitAction.bind(this);
    this.handleFormUpdate = this.handleFormUpdate.bind(this);
    this.inputHelperFunction = this.inputHelperFunction.bind(this);
    this.state = state;
  }

  canBeInvoked() {
    return false;
  }

  handleFormUpdate(event) {
    let data = event.target.value;
    this.setState({
      [event.target.name]: data,
    });
  }

  submitAction() {
    const { data } = this.state;
    const { service } = metadata.configuration;

    const methodDescriptor = example_service[service.method];
    const request = new methodDescriptor.requestType();

    request.setText(data.text);
    request.setNumbers(data.numbers);

    const props = {
      request,
      onEnd: (response) => {
        const { message, status, statusMessage } = response;
        if (status !== 0) {
          throw new Error(statusMessage);
        }
        this.setState({
          response: {
            data: message.getAnswer(),
          },
        });
      },
    };

    this.props.serviceClient.unary(methodDescriptor, props);
  }

  renderInfoBlock() {
    const { informationLinks } = this.state;
    const { information } = metadata.render.blocks;
    const { labels } = metadata.render;
    const links = Object.values(information);

    return (
      <Grid item xs container justify="flex-end">
        {links.map((link) => (
          <Grid item key={link}>
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

  inputHelperFunction(textLength, restriction) {
    const { labels } = metadata.render;
    const { restrictions } = metadata.configuration;
    return textLength + " / " + restrictions[restriction] + " " + labels.char;
  }

  createHandleConfiguration(meta) {
    const { handleKey, helperKey, restriction } = meta;
    let InputHandlerConfiguration = {};
    if (this[helperKey]) {
      //helper is const string for single render and it have to be constructed before used -> call()
      InputHandlerConfiguration["helperTxt"] = this[helperKey].call(
        this,
        this.state[meta.stateKey].length,
        restriction
      );
    }
    if (this[handleKey]) {
      InputHandlerConfiguration["onChange"] = this[handleKey];
    }
    return InputHandlerConfiguration ?? [];
  }

  renderTextArea(meta) {
    const { labels } = metadata.render;

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

  renderTextAreas(metaInputs) {
    const inputValues = Object.values(metaInputs);
    return inputValues.map((inputValue) => this.renderTextArea(inputValue));
  }

  renderInvokeButton() {
    const { classes } = this.props;
    const { labels } = metadata.render;

    return (
      <Grid item xs={12} className={classes.invokeButton}>
        <Button
          variant="contained"
          color="primary"
          onClick={this.submitAction}
          disabled={!this.canBeInvoked()}
        >
          {labels.invokeButton}
        </Button>
      </Grid>
    );
  }

  renderServiceInput() {
    const { input } = metadata.render.blocks;

    return (
      <Grid container direction="column" justify="center">
        {this.renderTextAreas(input)}
        {this.renderInfoBlock()}
        {this.renderInvokeButton()}
      </Grid>
    );
  }

  renderServiceOutput() {
    const { response } = this.state;
    const { output } = metadata.render.blocks;
    const { labels } = metadata.render;

    if (!response) {
      return <h4>{labels.noResponse}</h4>;
    }

    return (
      <Grid container direction="column" justify="center">
        {this.renderTextArea(output.serviceOutput)}
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
