import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================DesignStage URL=====================
export const GetPenaltyTypeWebList = `${BASE_API_URL}/PenaltyType/GetPenaltyTypeWebList`
export const GetPenaltyTypeByPenaltyTypeID = `${BASE_API_URL}/PenaltyType/GetPenaltyTypeByPenaltyTypeID`
export const DeletePenaltyType = `${BASE_API_URL}/PenaltyType/DeletePenaltyType`
export const UpdatePenaltyTypeDetails = `${BASE_API_URL}/PenaltyType/UpdatePenaltyTypeDetails`
export const AddPenaltyTypeDetails = `${BASE_API_URL}/PenaltyType/AddPenaltyTypeDetails`

export function getAllPenaltyTypeList() {
  return axios.get(GetPenaltyTypeWebList)
}

export function getPenaltyTypeByPenaltyTypeID(penaltyTypeID: number) {
  return axios.post(GetPenaltyTypeByPenaltyTypeID, {penaltyTypeID})
}
export function deletePenaltyTypeDetails(penaltyTypeID: number) {
  return axios.post(DeletePenaltyType, {penaltyTypeID})
}
export function updatePenaltyType(
  penaltyTypeID: number,
  penaltyTypeName: string,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UpdatePenaltyTypeDetails, {
    penaltyTypeID,
    penaltyTypeName,
    updateBy,
    ipAddress,
  })
}
export function AddPenaltyTypeAPI(penaltyTypeName: string, createBy: number, ipAddress: string) {
  return axios.post(AddPenaltyTypeDetails, {
    penaltyTypeName,
    createBy,
    ipAddress,
  })
}
