import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================DesignerTicketCategory URL=====================
export const GET_ALL_Designer_Ticket_Category = `${BASE_API_URL}/DesignerTicketCategory/GetDesignerTicketCategoryWebList`
export const GET_Designer_Ticket_Category_BY_Designer_Ticket_Category_ID = `${BASE_API_URL}/DesignerTicketCategory/GetDesignerTicketCategoryByDesignerTicketID`
export const DELETE_Designer_Ticket_Category_DETAILS = `${BASE_API_URL}/DesignerTicketCategory/DeleteDesignerTicketCategory`
export const UPDATE_Designer_Ticket_Category = `${BASE_API_URL}/DesignerTicketCategory/UpdateDesignerTicketCategoryDetails`
export const ADD_Designer_Ticket_Category = `${BASE_API_URL}/DesignerTicketCategory/AddDesignerTicketCategoryDetails`

export function getAllDesignerTicketCategory() {
  return axios.get(GET_ALL_Designer_Ticket_Category)
}

export function getDesignerTicketByDesignerTicketId(designerTicketCategoryID: number) {
  return axios.post(GET_Designer_Ticket_Category_BY_Designer_Ticket_Category_ID, {
    designerTicketCategoryID,
  })
}
export function deleteDesignerTicketCategoryDetails(designerTicketCategoryID: number) {
  return axios.post(DELETE_Designer_Ticket_Category_DETAILS, {designerTicketCategoryID})
}
export function updateDesignerTicketCategory(
  designerTicketCategoryID: number,
  title: string,
  sequenceNo: number,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_Designer_Ticket_Category, {
    designerTicketCategoryID,
    title,
    sequenceNo,
    updateBy,
    ipAddress,
  })
}
export function AddDesignerTicketCategoryAPI(
  title: string,
  sequenceNo: number,
  createBy: number,
  ipAddress: string
) {
  return axios.post(ADD_Designer_Ticket_Category, {
    title,
    sequenceNo,
    createBy,
    ipAddress,
  })
}
