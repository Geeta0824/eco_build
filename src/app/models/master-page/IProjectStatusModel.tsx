export interface IProjectStageModel {
  pmcWorkStageID: number
  stageName: string
}
export interface IProjectStatusModel {
  projectStatusID: number
  projectStatusName: string
  seqNo: number
  createBy: number
  updateBy: number
  ipAddress: string
}
export const projStatusInitValue: IProjectStatusModel = {
  projectStatusID: 0,
  projectStatusName: '',
  seqNo: 0,
  createBy: 0,
  updateBy: 0,
  ipAddress: '',
}
