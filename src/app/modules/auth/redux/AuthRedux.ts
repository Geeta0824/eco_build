import {Action} from '@reduxjs/toolkit'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {put, takeLatest, select} from 'redux-saga/effects'
import {UserModel} from '../models/UserModel'
import {getUserByToken} from './AuthCRUD'

export interface ActionWithPayload<T> extends Action {
  payload?: T
}

export const actionTypes = {
  Login: '[Login] Action',
  Logout: '[Logout] Action',
  Register: '[Register] Action',
  UserRequested: '[Request User] Action',
  UserLoaded: '[Load User] Auth API',
  SetUser: '[Set User] Action',
}

const initialAuthState: IAuthState = {
  user: undefined,
  accessToken: undefined,
  responseModal: undefined,
  // secureToken:undefined
}

export interface IAuthState {
  user?: UserModel
  accessToken?: string
  responseModal?: UserModel
  // secureToken?:string
}

var strleftmenu = ''

export const reducer = persistReducer(
  {storage, key: 'user-info', whitelist: ['user']},
  (state: IAuthState = initialAuthState, action: ActionWithPayload<IAuthState>) => {
    switch (action.type) {
      case actionTypes.Login: {
        let responseData = action.payload?.responseModal
        // const accessToken = "MyToken88";
        // let configList = "My configs";
        // localStorage.setItem("configs", configList);
        return {user: responseData}
      }

      // case actionTypes.Register: {
      //   const accessToken = action.payload?.accessToken
      //   return {accessToken, user: undefined}
      // }

      case actionTypes.Logout: {
        return initialAuthState
      }

      case actionTypes.UserLoaded: {
        const user = action.payload?.user
        return {...state, user}
      }

      case actionTypes.SetUser: {
        const user = action.payload?.user
        return {...state, user}
      }

      default:
        return state
    }
  }
)

export const actions = {
  login: (responseModal: UserModel) => ({
    type: actionTypes.Login,
    payload: {responseModal},
  }),
  register: (accessToken: string) => ({
    type: actionTypes.Register,
    payload: {accessToken},
  }),
  logout: () => ({type: actionTypes.Logout}),
  requestUser: () => ({
    type: actionTypes.UserRequested,
  }),
  fulfillUser: (user: UserModel) => ({type: actionTypes.UserLoaded, payload: {user}}),
  setUser: (user: UserModel) => ({type: actionTypes.SetUser, payload: {user}}),
  store: () => ({type: 'def'}),
}

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    yield put(actions.requestUser())
  })

  yield takeLatest(actionTypes.UserRequested, function* userRequested() {
    // @ts-ignore
    const getToken = (state) => state.auth.accessToken
    // @ts-ignore
    let token = yield select(getToken)
    // alert("dispatch api:2")
    // const {data: user} = yield getUserByToken(token)
    // yield put(actions.fulfillUser(user))
  })
}
