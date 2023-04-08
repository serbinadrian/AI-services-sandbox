import { combineReducers} from "redux";
import loaderReducer from "./LoaderReducer";
import serviceDetailsReducer from "./ServiceDetailsReducer"
import serviceReducer from "./ServiceReducer";

const rootReducer = combineReducers({
  loaderReducer,
  serviceReducer,
  serviceDetailsReducer
});

export default rootReducer;
