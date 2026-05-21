export interface IProjectReportsmodel {
  customerID: number,
  projectID: number,
  projectStageID: number,
  projectName: string,
  projectAmount: number,
  projectCategoryName: string,
  projectType: string,
  projectNumber: string,
  createDate: string,
  projectStatusName: string,
  additionalAmount: number,
  finalAmount: number,
  paidAmount: number,
  remainingAmount: number,
  projectFilePath: string,
  quetFilePath: string,
  bhkName: string,
  carpetArea: string,
  stageName: string,
  description: string,
  pmcWorkStageID:number
  customerName:string
   
  }
  export const projectReportsInitValues: IProjectReportsmodel = {
    customerID: 0,
    projectID: 0,
    projectStageID: 0,
    projectName: '',
    projectAmount: 0,
    projectCategoryName: '',
    projectType: '',
    projectNumber: '',
    createDate: '',
    projectStatusName: '',
    additionalAmount: 0,
    finalAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    projectFilePath: '',
    quetFilePath: '',
    bhkName: '',
    carpetArea: '',
    stageName: '',
    description: '',
    pmcWorkStageID:0,
    customerName:''
   
  }
  