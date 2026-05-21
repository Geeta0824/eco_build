export interface IStageInfoModel {
  stageID: number
  projectID: number
  vendorID: number
  stageName: string
  seqNo: number
  isCompleted: boolean
  supervisorID: number
  approvalBy: number
  stageCompleteDate: string
  isStageApprove: boolean
  approveStageChangeDate: string
  approveByName: string
  supervisorName: string
  targetDate: string
  targetDateApproveDate: string
  isTargetDateApprove: boolean
  isTargetDate: boolean
}

export interface IStagePhotoModel {
  proStagePhotoID: number
  photoPath: string
  photoTitle: string
}

export interface IStageMaterialModel {
  projStageMaterialID: number
  stageID: number
  materialID: number
  photoPath: string
  materialName: string
  montodorMaterialName: string
  pmcMaterialName: string
}

export interface IStageInformationModel {
  projectStageImpInfoID: number
  impInformation: string
}

export interface IStageDocumentModel {
  projectStageWiseDocID: number
  documentTitle: string
  documentPath: string
}

export interface IStageRemarksModel {
  projectStageReamrksID: number
  remarks: string
}
