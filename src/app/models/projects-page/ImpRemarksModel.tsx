export interface ImpRemarksModel {
  bhkid: number
  bhkName: string
  isActive: boolean
  createBy: number
  iPAddress: string
}
export const impRemarksInitValue: ImpRemarksModel = {
  bhkid: 0,
  bhkName: '',
  isActive: false,
  createBy: 0,
  iPAddress: '',
}

export interface IDesignerRemarkModel {
  projectDesignerRemarkID: number
  projectID: number
  projectDesignerRemark: string
}
