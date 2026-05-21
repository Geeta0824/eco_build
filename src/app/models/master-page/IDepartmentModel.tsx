 export interface IDepartmentModel {
    departmentID: number
    departmentCode: string
    departmentName: string
    photoPath: string
    isActive: boolean
    ipAddress: string
  }
  export const departmentInitValues: IDepartmentModel = {
    departmentID: 0,
    departmentCode: '',
    departmentName: '',
    photoPath: '',
    isActive: false,
    ipAddress: ''
  }