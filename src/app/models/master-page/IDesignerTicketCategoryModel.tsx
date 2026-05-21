import moment from 'moment'
export interface IDesignerTicketCategoryModel {
  designerTicketCategoryID: number
  designerTicketId: number
  title: string
  sequenceNo: number
  createDate: string
  // date: string
  createBy: number
  updateDate: string
  updateBy: number
  iPAddress: string
}
export const designerTicketCategoryInitValue: IDesignerTicketCategoryModel = {
  designerTicketCategoryID: 0,
  designerTicketId: 0,
  title: '',
  sequenceNo: 0,
  createDate: '',
  // date: moment(new Date()).format('YYYY-MM-DD'),
  createBy: 0,
  updateDate: '',
  updateBy: 0,
  iPAddress: '',
}
export interface IDesignerEmployeeModel {
  designerID: number
  designarName: string
}
