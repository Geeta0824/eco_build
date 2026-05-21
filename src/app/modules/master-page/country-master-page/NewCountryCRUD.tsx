import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================Country URL======================
export const GET_ALL_COUNTRY = `${BASE_API_URL}/Country_New/GetCountryWebList` //Get Country Page
export const GET_DROPDOWN_COUNTRY_LIST = `${BASE_API_URL}/Country_New/GetDropDownCountryList` //Get Country Page
export const POST_ALL_COUNTRY = `${BASE_API_URL}/Country_New/AddCountryDetails` //Create Country Page
export const COUNTRY_DATA_BY_COUNTRY_ID = `${BASE_API_URL}/Country_New/GetCountryByCountryID` //Update Country Page
export const UPDATE_COUNTRY = `${BASE_API_URL}/Country_New/UpdateCountryDetails` //Update Country Page
export const DELETE_COUNTRY = `${BASE_API_URL}/Country_New/PostDeleteCountry` //Delete Country Page
export const ISACTIVE_COUNTRY = `${BASE_API_URL}/Country_New/UpdateCountryIsactive` // Is Active Country Page

// =========GET COUNTRY=================================
export function getAllCountry() {
    return axios.get(GET_ALL_COUNTRY)
  }
  
  export function getDropDownCountryList() {
    return axios.get(GET_DROPDOWN_COUNTRY_LIST)
  }
  
  // =====================CREATE COUNTRY===================
  export function postCountry(encodedReq: string
  ) {
    return axios.post(POST_ALL_COUNTRY, {encodedReq
    })
  }
  // =======================UPDATE COUNTRY==================
  export function getCountry(encodedReq: string) {
    return axios.post(COUNTRY_DATA_BY_COUNTRY_ID, {encodedReq})
  }
  
  export function updateCountry(encodedReq: string
  ) {
    return axios.post(UPDATE_COUNTRY, {encodedReq
    })
  }
  // =======================DELETE COUNTRY==================
  export function deleteCountry(encodedReq: string) {
    return axios.post(DELETE_COUNTRY, {encodedReq})
  }
  // =======================ISACTIVE COUNTRY==================
  export function isActiveCountry(encodedReq: string) {
    return axios.post(ISACTIVE_COUNTRY, {encodedReq})
  }