import {persistReducer} from 'redux-persist'
import {IDIYReduxModel} from '../../../models/quotations-page/diy-quotation-page/IDIYQuotationModel'
import storage from 'redux-persist/lib/storage'
import {Action} from '@reduxjs/toolkit'

export const INCREMENT = 'INCREMENT'
export const DECREMENT = 'DECREMENT'
export const SETCOUNT = 'SETCOUNT'

export interface ActionWithPayload<T> extends Action {
  payload?: T
}
export const actionTypes = {
  increments: '[Set Increments] Action',
  decrements: '[Set Decrements] Action',
  setCounts: '[Set SetCounts] Action',
}
const initialAuthState: IAuthState = {
  countValues: undefined,
}
export interface IAuthState {
  countValues?: IDIYReduxModel
}

export const actions = {
  increment: (counter: number, quotation: number) => ({
    type: actions.increment,
    payload: {counter, quotation},
  }),
  decrement: (counter: number, quotation: number) => ({
    type: actions.decrement,
    payload: {counter, quotation},
  }),
  setCount: (counter: number, quotation: number) => ({
    type: actions.setCount,
    payload: {counter, quotation},
  }),
}

export const reducers = persistReducer(
  {storage, key: 'user-infos', whitelist: ['users']},
  (state: IAuthState = initialAuthState, action: any) => {
    switch (action.type) {
      case actions.setCount: {
        const countValuesId = action.payload?.quotation
        const countValues = action.payload?.counter
        return {...state, countValues, countValuesId}
      }
      case actions.increment: {
        const countValuesId = action.payload?.quotation
        const countValues = action.payload?.counter + 1
        return {...state, countValues, countValuesId}
      }
      case actions.decrement: {
        const countValuesId = action.payload?.quotation
        const countValues = action.payload?.counter - 1
        return {...state, countValues, countValuesId}
      }

      default:
        return state
    }
  }
)
// export const increment = (count: number, quotationId: number) => {
//   return {
//     type: INCREMENT,
//     payload: {count, quotationId}, // Use quotationId instead of quotationID
//   }
// }

// export const decrement = (count: number, quotationId: number) => {
//   return {
//     type: DECREMENT,
//     payload: {count, quotationId}, // Use quotationId instead of quotationID
//   }
// }

// export const setCount = (count: number, quotationId: number) => {
////  console.log(count)
////  console.log(quotationId)
//   return {
//     type: SETCOUNT,
//     payload: {count, quotationId}, // Use quotationId instead of quotationID
//   }
// }

// const initialState = {
//   counter: 0,
//   quotation: 0,
// }

// export const counterReducer = (state = initialState, action: any) => {
//   switch (action.type) {
//     case INCREMENT:
//       if (initialState.quotation === state.quotation) {
//         return {
//           ...state,
//           counter: state.counter + 1,
//         }
//       } else {
//         return {
//           ...state,
//           counter: state.counter + 1,
//         }
//       }
//     case DECREMENT:
//       if (initialState.quotation === state.quotation) {
//         return {
//           ...state,
//           counter: state.counter - 1,
//         }
//       } else {
//         return {
//           ...state,
//           counter: state.counter - 1,
//         }
//       }
//     case SETCOUNT:
//    //  console.log(state)
//       return state
//     default:
//       return state
//   }
// }
