import React from "react";
import Grid from "@material-ui/core/Grid";
import OutlinedTextArea from "../../common/OutlinedTextArea";
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";
import HoverIcon from "../../standardComponents/HoverIcon";
import { example_service } from "./example_service_pb_service";
import {
  informationLinks,
  restrictions,
  textInputPrototype,
  numbersInputPrototype,
  serviceAnswerPrototype,
  inscription,
} from "./metadata";
import { useStyles } from "./styles";
import { withStyles } from "@material-ui/styles";

class ExampleService extends React.Component {
  constructor(props) {
    super(props);
    this.submitAction = this.submitAction.bind(this);
    this.handleFormUpdate = this.handleFormUpdate.bind(this);

    this.state = {
      response: {
        data: "",
      },
      data: {
        text: "",
        numbers: "",
      },
    };
  }

  canBeInvoked() {
    return false;
  }

  handleFormUpdate(event) {
    const { data } = this.state;
    data[event.target.name] = event.target.value;
    this.setState({
      data: data,
    });
  }

  submitAction() {
    const { data } = this.state;
    const methodDescriptor = example_service["example_service"];
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
    return (
      <Grid item xs container justify="flex-end">
        {this.renderInfoBlockItems()}
      </Grid>
    );
  }

  renderInfoBlockItems() {
    return (
      <React.Fragment>
        {informationLinks.map((informationLink) => (
          <Grid item>
            <HoverIcon text={informationLink.label} href={informationLink.link}>
              <SvgIcon>
                <path d={informationLink.svgPath} />
              </SvgIcon>
            </HoverIcon>
          </Grid>
        ))}
      </React.Fragment>
    );
  }

  helperText(textLength, maxTextLength) {
    return textLength + " / " + maxTextLength + " char ";
  }

  renderTextInput() {
    const { text } = this.state.data;
    const textRestriction = this.helperText(
      text.length,
      restrictions[textInputPrototype.restriction]
    );
    return (
      <Grid item xs={12} container justify="center">
        <OutlinedTextArea
          id={textInputPrototype.id}
          name={textInputPrototype.name}
          label={textInputPrototype.label}
          charLimit={restrictions.maxTextLength}
          helperTxt={textRestriction}
          fullWidth={true}
          value={text}
          rows={textInputPrototype.rows}
          onChange={this.handleFormUpdate}
        />
      </Grid>
    );
  }

  renderNumbersInput() {
    const { numbers } = this.state.data;
    const textRestriction = this.helperText(
      numbers.length,
      restrictions[numbersInputPrototype.restriction]
    );
    return (
      <Grid item xs={12} container justify="center">
        <OutlinedTextArea
          id={numbersInputPrototype.id}
          name={numbersInputPrototype.name}
          label={numbersInputPrototype.label}
          charLimit={restrictions.maxNumbersLength}
          helperTxt={textRestriction}
          fullWidth={true}
          value={numbers}
          rows={numbersInputPrototype.rows}
          onChange={this.handleFormUpdate}
        />
      </Grid>
    );
  }

  renderServiceForm() {
    return (
      <React.Fragment>
        <Grid container spacing={2} justify="flex-start">
          {this.renderTextInput()}
          {this.renderNumbersInput()}
        </Grid>
        {this.renderInfoBlock()}
        <Grid item xs={12} container justify="center">
          <Button
            variant="contained"
            color="primary"
            onClick={this.submitAction}
            disabled={!this.canBeInvoked()}
          >
            {inscription.invokeButton}
          </Button>
        </Grid>
      </React.Fragment>
    );
  }

  serviceAnswer() {
    return (
      <React.Fragment>
        <Grid container spacing={2} justify="flex-start">
          <OutlinedTextArea
            id={serviceAnswerPrototype.id}
            name={serviceAnswerPrototype.name}
            label={serviceAnswerPrototype.label}
            fullWidth={true}
            value={this.state.response.data}
            rows={serviceAnswerPrototype.rows}
          />
        </Grid>
      </React.Fragment>
    );
  }

  render() {
    if (this.props.isComplete) {
      return <>{this.serviceAnswer()}</>;
    }
    return <>{this.renderServiceForm()}</>;
  }
}

export default withStyles(useStyles)(ExampleService);
