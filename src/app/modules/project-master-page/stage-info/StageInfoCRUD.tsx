import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Department URL=====================
export const GetPMCWorkStageListForSupByProjID_CatID = `${BASE_API_URL}/ProjectStageWise_Mobile/GetPMCWorkStageListForSupByProjID_CatID`
export const GetProjectStageWise_Photos_For_SuperVisor = `${BASE_API_URL}/ProjectStageWise_Mobile/GetProjectStageWise_Photos_For_SuperVisor`
export const GetProjectStageWise_MaterialInfo_For_SuperVisor_ForWeb = `${BASE_API_URL}/ProjectStageWise_Mobile/GetProjectStageWise_MaterialInfo_For_SuperVisor_ForWeb`
export const GetProjectStageWise_Imp_Info_For_SuperVisor = `${BASE_API_URL}/ProjectStageWise_Mobile/GetProjectStageWise_Imp_Info_For_SuperVisor`
export const GetProjectStageWise_Document_For_SuperVisor = `${BASE_API_URL}/ProjectStageWise_Mobile/GetProjectStageWise_Document_For_SuperVisor`
export const GetProjectStageWise_Remarks_For_SuperVisor = `${BASE_API_URL}/ProjectStageWise_Mobile/GetProjectStageWise_Remarks_For_SuperVisor`

export function getGetProjectStageInfo_List_ForAdminAPI(
  employeeID: number,
  projectID: number,
  projectCategoryID: number
) {
  return axios.post(GetPMCWorkStageListForSupByProjID_CatID, {
    employeeID,
    projectID,
    projectCategoryID,
  })
}

export function GetProjectStageWise_MaterialInfo_For_SuperVisorAPI(
  stageID: number,
  projectID: number,
  projectCategoryID: number
) {
  return axios.post(GetProjectStageWise_MaterialInfo_For_SuperVisor_ForWeb, {
    stageID,
    projectID,
    projectCategoryID,
  })
}

export function GetProjectStageWise_Imp_Info_For_SuperVisorAPI(
  stageID: number,
  projectID: number,
  projectCategoryID: number
) {
  return axios.post(GetProjectStageWise_Imp_Info_For_SuperVisor, {
    stageID,
    projectID,
    projectCategoryID,
  })
}

export function GetProjectStageWise_Remarks_For_SuperVisorAPI(
  stageID: number,
  projectID: number,
  projectCategoryID: number
) {
  return axios.post(GetProjectStageWise_Remarks_For_SuperVisor, {
    stageID,
    projectID,
    projectCategoryID,
  })
}

export function GetProjectStageWise_Document_For_SuperVisorAPI(
  stageID: number,
  projectID: number,
  projectCategoryID: number
) {
  return axios.post(GetProjectStageWise_Document_For_SuperVisor, {
    stageID,
    projectID,
    projectCategoryID,
  })
}

export function getProjectStageWise_Photos_For_SuperVisorAPI(
  stageID: number,
  projectID: number,
  projectCategoryID: number
) {
  return axios.post(GetProjectStageWise_Photos_For_SuperVisor, {
    stageID,
    projectID,
    projectCategoryID,
  })
}
