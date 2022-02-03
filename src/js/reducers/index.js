import { ADD_SHOP, DATA_USER, READ_MAIL, LOGGED_IN } from "../constants/action-types";
import { loginReducer } from './loginReducer';

const initialState = {
  products: [],
  readMail: false,
  user: [],
  isLoggedIn: false
};

function rootReducer(state = initialState, action) {
  if (action.type === READ_MAIL) {
    return Object.assign({}, state, {
      readMail: action.payload
    });
  }
  if (action.type === ADD_SHOP) {
    return Object.assign({}, state, {
      products: state.products.concat(action.payload)
    });
  }
  if (action.type === DATA_USER && !state.isLoggedIn) {
    return Object.assign({}, state, {
      user: state.user.concat(action.payload),
      isLoggedIn: true
    });
  }
  if (action.type === LOGGED_IN) {
    return rootReducer = combineReducers({
      loggedIn: loginReducer
    });
  }
  return state;
}

export default rootReducer;