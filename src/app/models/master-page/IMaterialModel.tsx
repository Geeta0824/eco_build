export interface IMaterialModel {
    projectTypeID: number
    materialInfoID: number
    materialName: string
    specification: string
    doneby: string
    importantPoint: string
    projectType: string
    createBy: number
    updateBy: number
    isActive: boolean
    iPAddress: string
  }
  
  export const materialInitValues: IMaterialModel = {
    projectTypeID: 0,
    materialInfoID: 0,
    materialName: '',
    specification: '',
    doneby: '',
    importantPoint: '',
    projectType: '',
    isActive: false,
    createBy: 0,
    updateBy: 0,
    iPAddress: '',
  }
  