export interface SupportModel {
  projectTaskID: number
  projectID: number
  projectName: string
  taskName: string
  description: string
  taskStatDateTime: string
  taskEndDateTime: string
  taskStatDate: string
  taskEndDate: string
  taskStatTime: string
  taskEndTime: string
  employeeID: number
  fullName: string
  statusID: number
  priorityID: number
  reMarks: string
  statusName: string
  priorityName: string
  isActive: boolean
  documentPath: string
}

export const SupportModelInitValues: SupportModel = {
    projectTaskID: 0,
    projectID: 0,
    projectName: '',
    taskName:'',
    description: '',
    taskStatDateTime: '',
    taskEndDateTime: '',
    taskStatDate: '',
    taskEndDate: '',
    taskStatTime: '',
    taskEndTime: '',
    employeeID: 0,
    fullName: '',
    statusID: 0,
    priorityID: 0,
    reMarks: '',
    statusName: '',
    priorityName: '',
    documentPath: '',
    isActive: true
  }

