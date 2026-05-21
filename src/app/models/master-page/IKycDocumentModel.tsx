export interface IKycDocumentModel {
    kycDocID: number
    documentName: string
    isActive: boolean
    createBy:number
    updateyBy:number
    ipAddress:string
  }
  
  export const kycDocumentInitValues: IKycDocumentModel = {
    kycDocID: 0,
    documentName: '',
    isActive: false,
    createBy:0,
    updateyBy:0,
    ipAddress:''
  }