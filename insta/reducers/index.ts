import { combineReducers } from "redux"
import authReducers from './auth'
import postReducer from './post'

export default combineReducers({
  auth: authReducers,
  post: postReducer,
})



