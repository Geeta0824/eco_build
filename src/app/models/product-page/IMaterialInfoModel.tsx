export interface IMaterialInfoModel {
    agencyTypeID: number
    agencyWorkStageID: number
    agencyStageWiseMaterialID: number
    materialName: string
    materialCompanyName: string
    isActive: boolean
    createBy: number
    updateBy: number
    iPAddress: string
}
export const materialInfoInitValue: IMaterialInfoModel = {
    agencyTypeID: 0,
    agencyWorkStageID: 0,
    agencyStageWiseMaterialID: 0,
    materialName: '',
    materialCompanyName: '',
    isActive: false,
    createBy: 0,
    updateBy: 0,
    iPAddress: '',
}
export interface IPMCMaterialInfoModel {
    pmcWorkStageID: number
    turnkeyProjectStageMaterialID: number
    materialName: string
}
export interface IPMCMaterialMapModel {
    turnkeyProjectStageMaterialID: number
    projectType: string
    isMember: number
    projectTypeID: number
    materialCompanyName: string
  }
  