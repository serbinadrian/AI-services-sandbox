import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import isEmpty from "lodash/isEmpty";
import AboutService from "./AboutService";
import { useStyles } from "./styles";
import NotificationBar, { notificationBarTypes } from "../common/NotificationBar";
import { loaderActions } from "../../Redux/actionCreators";
import { pricing, serviceDetails, groupInfo } from "../../Redux/reducers/ServiceDetailsReducer";
import ErrorBox from "../common/ErrorBox";
import SeoMetadata from "../common/SeoMetadata";
import CardImg from "../../assets/images/SnetDefaultServiceImage.png";
import { WebServiceClient as ServiceClient } from "snet-sdk-web";
import { LoaderContent } from "../../utility/constants/LoaderContent";
import AlertBox, { alertTypes } from "../common/AlertBox";
export const HERO_IMG = "hero_image";

class ServiceDetails extends Component {
  constructor(props) {
    super(props);
    this.demoExampleRef = React.createRef();
    this.lastActiveTab = 0;
    this.state = {
      activeTab: 0,
      alert: {},
      offlineNotication: {
        type: notificationBarTypes.WARNING,
        message: "Service temporarily offline by the provider. Please check back later.",
      },
      createModelCalled: "new",
      modelDetailsOnEdit: undefined,
    };
  }

  initializeService = async () => {
    const { org_id, service_id } = this.props.service;
    //const sdk = await initSdk();
    this.serviceClient = new ServiceClient(null, org_id, service_id, null, {}, this.props.groupInfo);
  };

  componentDidMount() {
    return;
  }

  fetchTrainingModel = async () => {
    const {
      fetchTrainingModel,
      match: {
        params: { orgId, serviceId },
      },
    } = this.props;
    await fetchTrainingModel(orgId, serviceId);
  };

  fetchServiceDetails = async () => {
    const {
      fetchServiceDetails,
      match: {
        params: { orgId, serviceId },
      },
    } = this.props;
    try {
      await fetchServiceDetails(orgId, serviceId);
      this.initializeService();
    } catch (error) {
      this.setState({ error: true });
    }
  };

  handleTabChange = activeTab => {
    if (window.location.href.indexOf("#demo") > -1) {
      const currentUrl = this.props.location.pathname;
      this.props.history.push(currentUrl);
    }
    this.lastActiveTab = activeTab;
    this.setState({ activeTab, createModelCalled: "new", modelDetailsOnEdit: undefined, alert: {} });
  };

  scrollToView = () => {
    if (this.demoExampleRef.current) {
      this.demoExampleRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  handleDemoClick = () => {
    const { history } = this.props;
    const { activeTab } = this.state;
    history.push({ ...history.location, hash: "#demo" });
    if (activeTab !== 0) {
      this.setState({ activeTab: 0 }, () => {
        this.scrollToView();
      });
      return;
    }
    this.scrollToView();
  };

  editModel = model => {
    this.setState({
      activeTab: 2,
      createModelCalled: "edit",
      modelDetailsOnEdit: model,
    });
  };

  onCancelEditModel = () => {
    this.setState({
      activeTab: this.lastActiveTab,
      createModelCalled: "new",
      modelDetailsOnEdit: undefined,
      alert: {},
    });
  };

  onUpdateModel = async updateModelParams => {
    const { startUpdateLoader, stopLoader, wallet } = this.props;
    this.setState({ alert: {} });
    try {
      const { modelDetailsOnEdit } = this.state;
      startUpdateLoader();
      const params = {
        modelId: modelDetailsOnEdit.modelId,
        address: wallet.address,
        method: modelDetailsOnEdit.methodName,
        name: modelDetailsOnEdit.serviceName,
        modelName: updateModelParams.trainingModelName,
        description: updateModelParams.trainingModelDescription,
        publicAccess: updateModelParams.enableAccessModel,
        addressList: !updateModelParams.enableAccessModel ? updateModelParams.ethAddress : [],
        status: modelDetailsOnEdit.status,
        updatedDate: modelDetailsOnEdit.updatedDate,
      };
      await this.serviceClient.updateModel(params);
      stopLoader();
      this.onCancelEditModel();
    } catch (error) {
      this.setState({ alert: { type: alertTypes.ERROR, message: "Unable to update model. Please try again" } });
      stopLoader();
    }
  };

  deleteModel = async () => {
    const { startDeleteLoader, stopLoader, wallet } = this.props;
    this.setState({ alert: {} });
    try {
      const { modelDetailsOnEdit } = this.state;
      startDeleteLoader();
      const params = {
        modelId: modelDetailsOnEdit.modelId,
        address: wallet.address,
        method: modelDetailsOnEdit.methodName,
        name: modelDetailsOnEdit.serviceName,
      };
      await this.serviceClient.deleteModel(params);
      stopLoader();
      this.onCancelEditModel();
    } catch (error) {
      this.setState({ alert: { type: alertTypes.ERROR, message: "Unable to Delete model. Please try again" } });
      stopLoader();
    }
  };

  render() {
    const { classes, service, loading, error, history, match, training } = this.props;
    const { offlineNotication } = this.state;
    const {
      params: { orgId, serviceId },
    } = match;
    if (isEmpty(service) || error) {
      if (loading) {
        return null;
      }
      return (
        <Grid container spacing={24} className={classes.serviceDetailContainer}>
          <ErrorBox />
        </Grid>
      );
    }

    const seoURL = `${process.env.REACT_APP_BASE_URL}/servicedetails/org/${orgId}/service/${serviceId}`;

    return (
      <div>
        <SeoMetadata
          title={service.display_name}
          description={service.short_description}
          image={service.org_assets_url ? service.org_assets_url.hero_image : CardImg}
          url={seoURL}
          keywords={service.tags}
        />
        <Grid container spacing={24} className={classes.serviceDetailContainer}>
          <div className={classes.notificationBar}>
            <NotificationBar
              type={offlineNotication.type}
              showNotification={!service.is_available}
              icon={ErrorOutlineIcon}
              message={offlineNotication.message}
            />
          </div>
          <div className={classes.TopSection}>
          </div>
          <AboutService
            service={service}
            history={history}
            serviceAvailable={service.is_available}
            demoExampleRef={this.demoExampleRef}
            scrollToView={this.scrollToView}
            demoComponentRequired={!!service.demo_component_required}
            training={training}
            editModel={this.editModel}
          />
          <div className={classes.alertBox}>
            <AlertBox type={this.state.alert.type} message={this.state.alert.message} />
          </div>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { orgId, serviceId },
    },
  } = ownProps;

  return {
    service: serviceDetails(state, orgId, serviceId),
    groupInfo: groupInfo(state),
    pricing: pricing(state),
    loading: state.loaderReducer.app.loading,
    training: state.serviceDetailsReducer.detailsTraining,
    isLoggedIn: true,
  };
};

const mapDispatchToProps = dispatch => ({
  //fetchServiceDetails: (orgId, serviceId) => dispatch(serviceDetailsActions.fetchServiceDetails(orgId, serviceId)),
  //fetchTrainingModel: (orgId, serviceId) => dispatch(fetchTrainingModel(orgId, serviceId)),
  startUpdateLoader: () => dispatch(loaderActions.startAppLoader(LoaderContent.UPDATE_MODEL)),
  startDeleteLoader: () => dispatch(loaderActions.startAppLoader(LoaderContent.DELETE_MODEL)),
  stopLoader: () => dispatch(loaderActions.stopAppLoader),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(ServiceDetails));
