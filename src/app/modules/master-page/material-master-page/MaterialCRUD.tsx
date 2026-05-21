import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================Material Info URL======================

export const GET_ALL_Material_Info_list = `${BASE_API_URL}/MaterialInfo/GetMaterialInfoList` //Get Material Info Page
export const ADD_ALL_Material_Info = `${BASE_API_URL}/MaterialInfo/AddMaterialInfoDetails` //Create Material Info Page
export const Material_Info_BY_Material_Info_ID = `${BASE_API_URL}/MaterialInfo/GetMaterialInfoByID` //Update Material Info Page
export const UPDATE_Material_Info = `${BASE_API_URL}/MaterialInfo/UpdateMaterialInfoDetails` //Update Material Info Page
export const DELETE_Material_Info = `${BASE_API_URL}/MaterialInfo/DeleteMaterialInfo` //Dropdown Material Info Page

// ========= GET Material Info =================================
export function getAllMaterialInfoApi() {
  return axios.get(GET_ALL_Material_Info_list)
}
// ===================== CREATE Material Info ===================
export function addMaterialInfoApi(
  projectTypeID: number,
  materialName: string,
  specification: string,
  doneby: string,
  importantPoint: string,
  createBy: number,
  ipAddress: string
) {
  return axios.post(ADD_ALL_Material_Info, {
    projectTypeID,
    materialName,
    specification,
    doneby,
    importantPoint,
    createBy,
    ipAddress,
  })
}
// =======================UPDATE Material Info==================
export function getMaterialInfoDataByMaterialInfoID(materialInfoID: number) {
  return axios.post(Material_Info_BY_Material_Info_ID, {
    materialInfoID,
  })
}

// ======================================================
export function updateMaterialInfoApi(
  materialInfoID: number,
  projectTypeID: number,
  materialName: string,
  specification: string,
  doneby: string,
  importantPoint: string,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_Material_Info, {
    materialInfoID,
    projectTypeID,
    materialName,
    specification,
    doneby,
    importantPoint,
    updateBy,
    ipAddress,
  })
}
// =======================DELETE Material Info==================
export function deleteMaterialInfoApi(materialInfoID: number) {
  return axios.post(DELETE_Material_Info, {materialInfoID})
}
