export interface IAgencyWorkStageModel {
  agencyWorkStageID: number
  stageName: string
  workDetails: string
  percentage: number
  seqNo: number
  agencyTypeName: string
  isActive: boolean
}
export const agencyWorkStageInitValue: IAgencyWorkStageModel = {
  agencyWorkStageID: 0,
  stageName: '',
  workDetails: '',
  percentage: 0,
  seqNo: 0,
  agencyTypeName: '',
  isActive: false,
}
