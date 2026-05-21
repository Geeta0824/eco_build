import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Plan Ara URL=====================
export const Get_AreaSqft_List_ByBHKID = `${BASE_API_URL}/AreaPrice/GetAreaSqftList`
export const Get_AreaPrice_ListBy_AreaID = `${BASE_API_URL}/AreaPrice/GetAreaPriceListByAreaID`
export const AddArea_WisePrice_By_AreaID = `${BASE_API_URL}/AreaPrice/AddAreaWisePriceByAreaID`
export const Update_AreaPrice_By_AreaID = `${BASE_API_URL}/AreaPrice/UpdateAreaPriceByAreaID`
export const Get_Area_Price_By_AreaRateID = `${BASE_API_URL}/AreaPrice/GetAreaPriceByAreaRateID`

export function getPlanAreaByBhkIDAndProjectTypeIDAPI(projectTypeID: number, bhkID: number) {
  return axios.post(Get_AreaSqft_List_ByBHKID, {projectTypeID, bhkID})
}

export function getGetAreaPriceListByAreaIDAPI(areaID: number) {
  return axios.post(Get_AreaPrice_ListBy_AreaID, {areaID})
}

export function AddAreaWisePriceByAreaIDAPI(
  areaID: number,
  projectTypeID: number,
  bhkID: number,
  sqftAreaIDs: string,
  areaRate: number,
  createBy: number,
  ipAddress: string
) {
  return axios.post(AddArea_WisePrice_By_AreaID, {
    areaID,
    projectTypeID,
    bhkID,
    sqftAreaIDs,
    areaRate,
    createBy,
    ipAddress,
  })
}

export function UpdateAreaPriceByAreaIDAPI(
  areaRateID: number,
  areaRate: number,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(Update_AreaPrice_By_AreaID, {
    areaRateID,
    areaRate,
    updateBy,
    ipAddress,
  })
}

export function GetAreaPriceByAreaRateIDAPI(areaRateID: number) {
  return axios.post(Get_Area_Price_By_AreaRateID, {areaRateID})
}
