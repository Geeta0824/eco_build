export interface IAgencyRemarksModel {
    agencyRemarksID: number,
    agencyTypeID: number,
    remarksTypeID: number,
    remarks: string,
    agencyTypeName: string,
    remarksTypeName: string
    isActive:boolean
}

export const agencyRemarksInitValue: IAgencyRemarksModel = {
    agencyRemarksID: 0,
    agencyTypeID: 0,
    remarksTypeID: 0,
    remarks: '',
    agencyTypeName: '',
    remarksTypeName: '',
    isActive:false
}

export interface IRemarkTypeModel {
    remarksTypeID: number,
    remarksTypeName: string
}
