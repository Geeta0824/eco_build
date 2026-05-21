import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================Country URL======================
export const GET_ALL_COUNTRY = `${BASE_API_URL}/Country/GetCountryWebList` //Get Country Page
export const GET_DROPDOWN_COUNTRY_LIST = `${BASE_API_URL}/Country/GetDropDownCountryList` //Get Country Page
export const POST_ALL_COUNTRY = `${BASE_API_URL}/Country/AddCountryDetails` //Create Country Page
export const COUNTRY_DATA_BY_COUNTRY_ID = `${BASE_API_URL}/Country/GetCountryByCountryID` //Update Country Page
export const UPDATE_COUNTRY = `${BASE_API_URL}/Country/UpdateCountryDetails` //Update Country Page
export const DELETE_COUNTRY = `${BASE_API_URL}/Country/PostDeleteCountry` //Delete Country Page
export const ISACTIVE_COUNTRY = `${BASE_API_URL}/Country/UpdateCountryIsactive` // Is Active Country Page

// =========GET COUNTRY=================================
export function getAllCountry() {
    return axios.get(GET_ALL_COUNTRY)
  }
  
  export function getDropDownCountryList() {
    return axios.get(GET_DROPDOWN_COUNTRY_LIST)
  }
  
  // =====================CREATE COUNTRY===================
  export function postCountry(
    countryCode: string,
    countryName: string,
    flagPath: string,
    isActive: boolean,
    createBy: number,
    ipAddress: string
  ) {
    return axios.post(POST_ALL_COUNTRY, {
      countryCode,
      countryName,
      flagPath,
      isActive,
      createBy,
      ipAddress,
    })
  }
  // =======================UPDATE COUNTRY==================
  export function getCountry(countryId: string) {
    return axios.post(COUNTRY_DATA_BY_COUNTRY_ID, {countryId})
  }
  
  export function updateCountry(
    countryID: number,
    countryCode: string,
    countryName: string,
    flagPath: string,
    isActive: boolean,
    updateBy: number,
    ipAddress: string
  ) {
    return axios.post(UPDATE_COUNTRY, {
      countryID,
      countryCode,
      countryName,
      flagPath,     
      isActive,
      updateBy,
      ipAddress,
    })
  }
  // =======================DELETE COUNTRY==================
  export function deleteCountry(countryId: number) {
    return axios.post(DELETE_COUNTRY, {countryId})
  }
  // =======================ISACTIVE COUNTRY==================
  export function isActiveCountry(countryID: number, isActive: boolean) {
    return axios.post(ISACTIVE_COUNTRY, {countryID, isActive})
  }