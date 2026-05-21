import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================City URL=========================
export const GET_ALL_CITY = `${BASE_API_URL}/City/GetCityWebList` //Get City Page
export const POST_ALL_CITY = `${BASE_API_URL}/City/AddCityDetails` //Create City Page
export const CITY_DATA_BY_CITY_ID = `${BASE_API_URL}/City/GetCityByCityID` //Update City Page
export const UPDATE_CITY = `${BASE_API_URL}/City/UpdateCityDetails` //Update City Page
export const DELETE_CITY = `${BASE_API_URL}/City/PostDeleteCity` //Delete City Page
export const ISACTIVE_CITY = `${BASE_API_URL}/City/UpdateCityIsactive` //Is Active City Page
export const GET_CITY_BY_STATE_ID = `${BASE_API_URL}/City/GetCityByStateID` //Is Active City Page


export function getAllCity() {
    return axios.get(GET_ALL_CITY)
  }
  // ================CREATE CITY================
  export function createCity(
    // countryID: number,
    stateID: number,
    cityName: string,
    isActive: boolean,
    createBy: number,
    ipAddress: string
  ) {
    return axios.post(POST_ALL_CITY, {
      // countryID,
      stateID,
      cityName,
      isActive,
      createBy,
      ipAddress,
    })
  }
  // ================UPDATE CITY==============
  export function getCityByCityId(cityID: string) {
    return axios.post(CITY_DATA_BY_CITY_ID, {cityID})
  }
  export function updateCity(
    cityID: number,
    // countryID: number,
    stateID: number,
    cityName: string,
    isActive: boolean,
    updateBy: number,
    ipAddress: string
  ) {
    return axios.post(UPDATE_CITY, {
      cityID,
      // countryID,
      stateID,
      cityName,
      isActive,
      updateBy,
      ipAddress,
    })
  }
  // ================DELETE CITY==============
  export function deleteCity(cityId: number) {
    return axios.post(DELETE_CITY, {cityId})
  }
  // =======================ISACTIVE CITY==================
  export function isActiveCity(cityID: number, isActive: boolean) {
    return axios.post(ISACTIVE_CITY, {cityID, isActive})
  }
  
  export function getCityByStateId(stateID: number) {
    return axios.post(GET_CITY_BY_STATE_ID, {stateID})
  }