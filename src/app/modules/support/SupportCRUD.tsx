import axios from 'axios'
// const HRMS_API_URL = process.env.HRMS_PROJECT_API_URL
export const HRMS_API_URL = 'https://myhrms.anantayitsolutions.com'

//=====================Customer URL======================
export const Get_ProjectTask_Filter_List = `${HRMS_API_URL}/ProjectTask/GetProjectTaskFilterList`
export const Add_ProjectTask_Details_OuterProj = `${HRMS_API_URL}/ProjectTask/AddProjectTaskDetails_Outer_WithProj`

// *************************===========list================*******************************************
export function GetProjectTaskFilterList(ProjectID: number, ProjectTypeID: number) {
  return axios.post(Get_ProjectTask_Filter_List, {ProjectID, ProjectTypeID})
}
// *************************===========Add================*******************************************
export function AddProjectTaskDetails_Outer_WithProjApi(
  projectID: number,
  projectTypeID: number,
  taskName: string,
  description: string,
  taskStatDateTime: any,
  taskEndDateTime: any,
  employeeID: number,
  statusID: number,
  priorityID: number,
  reMarks: string,
  // mediaTypeID: number,
  documentPath: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(Add_ProjectTask_Details_OuterProj, {
    projectID,
    projectTypeID,
    taskName,
    description,
    taskStatDateTime,
    taskEndDateTime,
    employeeID,
    statusID,
    priorityID,
    reMarks,
    // mediaTypeID,
    documentPath,
    isActive,
    createBy,
    ipAddress,
  })
}
