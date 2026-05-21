import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================PMCWork Type URL=====================
export const GET_ALL_Turnkey_Project_Stage_Material = `${BASE_API_URL}/TurnkeyProjectStageMaterial/GetTurnkeyProjectStageMaterialList`
export const CREATE_Turnkey_Project_Stage_Material = `${BASE_API_URL}/TurnkeyProjectStageMaterial/AddTurnkeyProjectStageMaterialDetails`
export const GET_Turnkey_Project_Stage_Material_BY_Turnkey_Project_Stage_Material_ID = `${BASE_API_URL}/TurnkeyProjectStageMaterial/GetTurnkeyProjectStageMaterialGetByID`
export const UPDATE_Turnkey_Project_Stage_Material = `${BASE_API_URL}/TurnkeyProjectStageMaterial/UpdateTurnkeyProjectStageMaterialDetails`
export const DELETE_Turnkey_Project_Stage_Material = `${BASE_API_URL}/TurnkeyProjectStageMaterial/PostDeleteTurnkeyProjectStageMaterial`
export const Turnkey_Project_Stage_Material_For_Material_Name_Map_Project_Stage_MaterialID = `${BASE_API_URL}/TurnkeyProjectStageMaterial/GetTurnkeyProjectTypeListForMatrialCompanyMapWithMatrial` //MaterialName
export const Add_Turnkey_Project_Stage_Material_Company_Map = `${BASE_API_URL}/TurnkeyProjectStageMaterial/TurnkeyProjectStage_MaterialCompanyNameMapWith_MaterialName` //MaterialName


// ==========================Material Map List==========================================
export function getPMCStageMatrialCompanyNameByMaterialIDForMaterialNameMap(turnkeyProjectStageMaterialID: number) {
    return axios.post(Turnkey_Project_Stage_Material_For_Material_Name_Map_Project_Stage_MaterialID, { turnkeyProjectStageMaterialID })
}


export function createPMCStageMaterialCompanyName_MapWithMaterialWiseApi(
    turnkeyProjectStageMaterialID: number,
    projectTypeIDs: string,
    materialCompanyNames: string,
    createBy: number,   
    ipAddress: string
) {
    return axios.post(Add_Turnkey_Project_Stage_Material_Company_Map, {
        turnkeyProjectStageMaterialID,
        projectTypeIDs,
        materialCompanyNames,
        createBy,
        ipAddress,
    })
}

//   ============================ Material ==============
export function getAllTurnkeyProjectStageMaterial(pmcWorkStageID:number) {
    return axios.post(GET_ALL_Turnkey_Project_Stage_Material,{pmcWorkStageID})
}

export function createTurnkeyProjectStageMaterialApi(
    pmcWorkStageID: number,
    materialName: string,
    createBy: number,
) {
    return axios.post(CREATE_Turnkey_Project_Stage_Material, {
        pmcWorkStageID,
        materialName,
        createBy,
    })
}

export function getTurnkeyProjectStageMaterialByStageMaterialId(turnkeyProjectStageMaterialID: number) {
    return axios.post(GET_Turnkey_Project_Stage_Material_BY_Turnkey_Project_Stage_Material_ID, { turnkeyProjectStageMaterialID })
}

export function updateTurnkeyProjectStageMaterial(
    turnkeyProjectStageMaterialID: number,
    pmcWorkStageID: number,
    materialName: string,
) {
    return axios.post(UPDATE_Turnkey_Project_Stage_Material, {
        turnkeyProjectStageMaterialID,
        pmcWorkStageID,
        materialName,
    })
}

export function deleteTurnkeyProjectStageMaterial(turnkeyProjectStageMaterialID: number) {
    return axios.post(DELETE_Turnkey_Project_Stage_Material, { turnkeyProjectStageMaterialID })
}