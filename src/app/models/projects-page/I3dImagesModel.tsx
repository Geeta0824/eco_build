export interface I3dImagesModel {
  projectID: number
  projectImageID: number
  photoTitle: string
  filePath: string
  photoPath: string
  updateBy: number
  createBy:number
}

export const _3dImagesModelInitValues: I3dImagesModel = {
  projectID: 0,
  projectImageID: 0,
  photoTitle: '',
  filePath: '',
  photoPath: '',
  updateBy:0,
  createBy:0,
}
