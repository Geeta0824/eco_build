import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const Get_ALL_DNC_Type_List = `${BASE_API_URL}/DNCType/GetDNCTypeList`
export const Get_DNC_Type_By_DNC_Type_ID = `${BASE_API_URL}/DNCType/GetDNCTypeByDNCTypeID`
export const Update_DNC_Type_Details = `${BASE_API_URL}/DNCType/UpdateDNCTypeDetails`



export function getAllDNCTypeList() {
    return axios.get(Get_ALL_DNC_Type_List)
}

export function getDNCTypeByDNCTypeEditID(dncTypeID: string) {
    return axios.post(Get_DNC_Type_By_DNC_Type_ID, { dncTypeID })
}
export function UpdateDNCTypeApi(
    dncTypeID: number,
    dncTypeName: string,
    amountPerSqft: number,
) {
    return axios.post(Update_DNC_Type_Details, {
        dncTypeID,
        dncTypeName,
        amountPerSqft,
    })
}