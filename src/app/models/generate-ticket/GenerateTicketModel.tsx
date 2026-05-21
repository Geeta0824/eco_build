export interface IGenerateTicketModel {
  ticketID: number
  projectID: number
  categoryID: number
  assignTo: number
  dueDate: string
  ticketCategory: string
  customerName: string
  employeeName: string
  projectName: string
  photoPath: string
  ticketRemarks: string
}
export const generateTicketInitValue: IGenerateTicketModel = {
  ticketID: 0,
  projectID: 0,
  categoryID: 0,
  assignTo: 0,
  dueDate: '',
  ticketCategory: '',
  customerName: '',
  employeeName: '',
  projectName: '',
  photoPath: '',
  ticketRemarks: '',
}
