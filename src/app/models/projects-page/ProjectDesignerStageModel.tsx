export interface IProjectDesignerStageChangeModel {
  projectDesignStageMapID: number
  designStageID: number
  projectID: number
  stageTitle: string
  isComplete: true
  stageChangeRequestDate: string
  isStageChangeRequestApprove: true
  approveBy: number
  apprveDate: string
  designerName: string
  approvalName: string
  isMember: number
}

export interface IDesignerStageChangeModel {
  projectDesignStageMapID: number
  projectID: number
  designerID: number
  approvalBy: number
  isCompleted: boolean
  isStageApprove: boolean
  stageName: string
  designerName: string
  stageCompleteDate: string
  projectName: string
  customerName: string
}
