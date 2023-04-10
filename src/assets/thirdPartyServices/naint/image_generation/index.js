import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";
import InfoIcon from "@material-ui/icons/Info";
import Slider from "@material-ui/core/Slider";
import HoverIcon from "../../standardComponents/HoverIcon";
import OutlinedTextArea from "../../common/OutlinedTextArea";
import OutlinedDropDown from "../../common/OutlinedDropdown";
import { image_generation } from "./imagegen_pb_service";
import { useStyles } from "./styles";
import { withStyles } from "@material-ui/styles";

class NeuralImageGeneration extends React.Component {
  constructor(props) {
    super(props);
    this.submitAction = this.submitAction.bind(this);
    this.handleFormUpdate = this.handleFormUpdate.bind(this);
    this.handleModelParameterChange = this.handleModelParameterChange.bind(this);
    this.handleStyleParameterChange = this.handleStyleParameterChange.bind(this);

    this.state = {
      response: "",
      modelParametersList: [
        {
          label: "Stable Diffusion",
          value: 0,
        }, {
          label: "Stable Diffusion Anime",
          value: 1,
        }, {
          label: "Stable Diffusion Beksinski Art",
          value: 2,
        }, {
          label: "Stable Diffusion GuoHua",
          value: 3,
        }, {
          label: "Min-Dalle",
          value: 4,
        }],
      styleParametersList: [{
        label: "Not set",
        value: "not set",
      }, {
        label: "Detailed",
        value: "detailed",
      }, {
        label: "Portrait photography realistic",
        value: "portrait photography realistic",
      }, {
        label: "Animal",
        value: "animal",
      }, {
        label: "Interior",
        value: "interior",
      }, {
        label: "Postapocalyptic",
        value: "postapocalyptic",
      }, {
        label: "Steampunk",
        value: "steampunk",
      }, {
        label: "Nature from tales",
        value: "nature from tales",
      }, {
        label: "Cinematic",
        value: "cinematic",
      }, {
        label: "Cozy interior",
        value: "cozy interior",
      }],
      diffusionSliderParams: {
        seed: {
          min: 0,
          max: 15000,
          label: "Seed",
          step: 1
        },
        n_images: {
          min: 1,
          max: 10,
          label: "Images",
          step: 1
        },
        steps: {
          min: 20,
          max: 100,
          label: "Steps",
          step: 1
        },
        // width: {
        //   min: 256,
        //   max: 512,
        //   label: "Width",
        //   step: 32
        // },
        // height: {
        //   min: 256,
        //   max: 512,
        //   label: "Height",
        //   step: 32
        // }
      },
      formState: {
        text: "",
        selectedModelParameter: 0,
        selectedStyleParameter: "not set",
        rendered: false,
        isRegexMatch: false,
      },
      modelValues: {
        stableDiffusionValue: 0,
        stableDiffusionAnimeValue: 1,
        stableDiffusionBeksinskiArtValue: 2,
        stableDiffusionGuoHuaValue: 3,
        minDalleValue: 4,
      },
      informationLinks: {
        users_guide: "https://github.com/iktina/image-generation-2.0",
        code_repo: "https://github.com/iktina/image-generation-2.0",
        reference: "https://github.com/iktina/image-generation-2.0",
      },
      restrictions: {
        textRegex: /^[a-zA-Z\s]*$/,
        maxTextLength: 1000,
        minTextLength: 3,
      },
      modelConfiguration: {
        seed: 0,
        n_images: 3,
        steps: 50,
        width: 384,
        height: 384,
      }
    };
  }

  changeSlider(elementName, value) {
    const { modelConfiguration } = this.state;
    modelConfiguration[elementName] = value;
    this.setState({
      modelConfiguration: modelConfiguration
    });
  }

  handleFormUpdate(event) {
    const { textRegex } = this.state.restrictions;
    const { formState } = this.state;
    var isInputOk = textRegex.test(this.state.formState.text);
    formState[event.target.name] = event.target.value;
    formState.isRegexMatch = isInputOk;
    this.setState({
      formState: formState
    });
  }

  handleModelParameterChange(event) {
    const { formState } = this.state;
    let selectedOption = event.target.value;
    formState.selectedModelParameter = selectedOption;
    this.setState({
      formState: formState
    });
  }

  handleStyleParameterChange(event) {
    const { formState } = this.state;
    let selectedOption = event.target.value;
    formState.selectedStyleParameter = selectedOption;
    this.setState({
      formState: formState
    });
  }

  canBeInvoked() {
    return this.state.formState.text !== "" && this.state.formState.isRegexMatch;
  }

  selectRequestModel(request, selectedModel) {
    const { modelValues } = this.state;
    switch (selectedModel) {
      case modelValues.stableDiffusionAnimeValue:
        request.setWaifu(true);
        break;
      case modelValues.stableDiffusionBeksinskiArtValue:
        request.setBeksinski(true);
        break;
      case modelValues.stableDiffusionGuoHuaValue:
        request.setGuohua(true);
        break;
      default:
        break;
    }
  }

  fixNulledSeedValue(seedValue) {
    return seedValue ?? parseInt(0);
  }

  submitAction() {
    const { text, selectedModelParameter, selectedStyleParameter } = this.state.formState;
    const { modelConfiguration, modelValues } = this.state;
    const methodDescriptor = image_generation["Gen"];
    const request = new methodDescriptor.requestType();

    request.setSentence(text);
    if (selectedModelParameter === modelValues.minDalleValue) {
      request.setDalle(true);
    } else {
      this.selectRequestModel(request, selectedModelParameter);
      request.setSeedval(this.fixNulledSeedValue(modelConfiguration.seed));
      request.setNImages(modelConfiguration.n_images);
      request.setSteps(modelConfiguration.steps);
      request.setH(modelConfiguration.height);
      request.setW(modelConfiguration.width);
      request.setPromptStyle(selectedStyleParameter);
    }
    console.log("request: ", request);

    const props = {
      request,
      onEnd: response => {
        const { message, status, statusMessage } = response;
        if (status !== 0) {
          throw new Error(statusMessage);
        }
        this.setState({
          response: {
            data: message.getImage1()
          },
        });
      },
    };

    this.props.serviceClient.unary(methodDescriptor, props);
  }

  renderForm() {
    const { classes } = this.props;
    return (
      <React.Fragment>

        <Grid container spacing={2} justify="flex-start">
          <Grid item xs={8} container spacing={2}>
            <Grid item xs>
              <OutlinedDropDown
                id="params"
                name="params"
                label="Model"
                fullWidth={true}
                list={this.state.modelParametersList}
                value={this.state.formState.selectedModelParameter}
                onChange={this.handleModelParameterChange}
              />
            </Grid>
            <Grid item xs className={classes.dropDownEmptyGrid}>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item xs={12} container justify="center" className={classes.imageGenerationTextArea}>
            <OutlinedTextArea
              id="text"
              name="text"
              label="Description"
              charLimit={this.state.restrictions.maxTextLength}
              helperTxt={this.state.formState.text.length + " / " + this.state.restrictions.maxTextLength + " char "}
              fullWidth={true}
              value={this.state.formState.text}
              rows={5}
              onChange={this.handleFormUpdate}
            />
          </Grid>

          {this.StableDiffusionConfigurator()}

          <Grid item xs container justify="flex-end">
            <Grid item>
              <HoverIcon text="View code on Github" href={this.state.informationLinks.code_repo}>
                <SvgIcon>
                  <path // Github Icon
                    d="M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z"
                  />
                </SvgIcon>
              </HoverIcon>
            </Grid>
            <Grid item>
              <HoverIcon text="User's guide" href={this.state.informationLinks.users_guide}>
                <InfoIcon />
              </HoverIcon>
            </Grid>
            <Grid item>
              <HoverIcon text="View original project" href={this.state.informationLinks.reference}>
                <SvgIcon>
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 11.701c0 2.857-1.869 4.779-4.5 5.299l-.498-1.063c1.219-.459 2.001-1.822 2.001-2.929h-2.003v-5.008h5v3.701zm6 0c0 2.857-1.869 4.779-4.5 5.299l-.498-1.063c1.219-.459 2.001-1.822 2.001-2.929h-2.003v-5.008h5v3.701z" />
                </SvgIcon>
              </HoverIcon>
            </Grid>
          </Grid>

          <Grid item xs={12} container justify="center">
            <Button variant="contained" color="primary" onClick={this.submitAction} disabled={!this.canBeInvoked()}>
              Invoke
            </Button>
          </Grid>

          {!this.state.formState.isRegexMatch && this.state.formState.text.length > this.state.restrictions.minTextLength && (
            <p className={classes.imageDescriptionWarning}>
              Please provide an image description using <b>latin letters</b>!
            </p>)
          }
        </Grid>
      </React.Fragment>
    );
  }

  renderSliders() {
    const { classes } = this.props;
    const sliderParamsKeys = Object.keys(this.state.diffusionSliderParams);
    return (sliderParamsKeys.map(sliderParameterKey => {
      const sliderParameter = this.state.diffusionSliderParams[sliderParameterKey];

      return (<Grid item xs={12} sm={12} md={12} lg={12} className={classes.progressBarContainer} key={sliderParameter.label}>
        <Grid item xs={12} sm={12} md={2} lg={2}>
          <InfoIcon className={classes.infoIcon} />
          <span className={classes.title}>{sliderParameter.label}</span>
        </Grid>
        <Grid item xs={12} sm={12} md={10} lg={10} className={classes.sliderContainer}>
          <span className={classes.startEndNumber}>{sliderParameter.min}</span>
          <Slider
            name="modelSeed"
            value={this.state.modelConfiguration[sliderParameterKey]}
            max={sliderParameter.max}
            min={sliderParameter.min}
            aria-labelledby="discrete-slider-always"
            step={sliderParameter.step}
            valueLabelDisplay="on"
            onChange={(e, value) => this.changeSlider(sliderParameterKey, value)}
          />
          <span className={classes.startEndNumber}>{sliderParameter.max}</span>
        </Grid>
      </Grid>)
    }));
  }

  StableDiffusionConfigurator() {
    const { classes } = this.props;
    return this.state.formState.selectedModelParameter !== this.state.modelValues.minDalleValue && (
      <Grid container spacing={2} className={classes.formStateContainer}>
        <Grid item xs={8} container spacing={2}>
          <Grid item xs>
            <OutlinedDropDown
              id="model-style"
              name="model-style"
              label="Style"
              fullWidth={true}
              list={this.state.styleParametersList}
              value={this.state.formState.selectedStyleParameter}
              onChange={this.handleStyleParameterChange}
            />
          </Grid>
          <Grid item xs className={classes.dropDownEmptyGrid}>
          </Grid>
        </Grid>

        {this.renderSliders()}
      </Grid>
    )
  }

createImageContainer(index) {
  const { classes } = this.props;
  const container = document.createElement('div');
  const openImageInNewTabButton = document.createElement('a');
  openImageInNewTabButton.innerHTML = "Open in new tab";
  openImageInNewTabButton.classList.add(classes.newTabImageButton);
  container.classList.add(classes.imageFrame);
  container.appendChild(openImageInNewTabButton);
  return container;
}

  componentDidUpdate() {
    if (this.props.isComplete) {
      const { response } = this.state;

      if(!response) {
        return;
      }

      const images = JSON.parse(response.data)?.images;

      if (!this.state.formState.rendered) {

        const imageContainer = document.getElementById("image-container");

        for (var i = 0; i < images.length; i++) {

          const byteCharacters = atob(images[i]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          const blob = new Blob([byteArray]);
          const picture = document.createElement("img");
          const imageFrame = this.createImageContainer(i);
          picture.src = window.URL.createObjectURL(blob);
          imageFrame.appendChild(picture);
          imageContainer.appendChild(imageFrame);
        }
      }
      // eslint-disable-next-line
      this.state.formState.rendered = true;
    }
  }


  render() {
    const { classes } = this.props;
    if (this.props.isComplete) {
      return (
        <div>
          <p className={[classes.labelImageGeneration, classes.labelImageGenerationTextArea]}>
            Input:
          </p>

          <Grid item xs={12} container justify="center" className={classes.imageGenerationTextArea}>
            <OutlinedTextArea
              id="serviceInput"
              name="serviceInput"
              fullWidth={true}
              value={this.state.formState.text}
              rows={5}
            />
          </Grid>

          <p className={[classes.labelImageGeneration, classes.labelImageGenerationContainer]}>
            Result:
          </p>
          <div className={classes.imageGenerationContainer} id="image-container">
          </div>
        </div>)
    }
    else {
      return (
        <>
          {this.renderForm()}
        </>
      );
    }
  }
}

export default withStyles(useStyles)(NeuralImageGeneration);