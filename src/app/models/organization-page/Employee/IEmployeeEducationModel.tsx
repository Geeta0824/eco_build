export interface IEmployeeEducationModel {
    employeeEducationID: number
    employeeID: number
    eduDepartmentID: number
    eduCategoryID: number
    passingYear: string
    percentage: string
    instituteName: string
    subjectName: string
    firstName: string
    lastName: string
    employeeCode: string
    eduDepartmentName: string
    eduCategoryName: string
    isActive: boolean
    otherCategory: string
  }
  export const employeeEducationInitValue: IEmployeeEducationModel = {
    employeeEducationID: 0,
    employeeID: 0,
    eduDepartmentID: 0,
    eduCategoryID: 0,
    passingYear: '',
    percentage: '',
    instituteName: '',
    subjectName: '',
    firstName: '',
    lastName: '',
    employeeCode: '',
    eduDepartmentName: '',
    eduCategoryName: '',
    isActive: false,
    otherCategory: '',
  }
  