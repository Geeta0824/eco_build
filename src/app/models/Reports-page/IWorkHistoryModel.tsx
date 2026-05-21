export interface IWorkHistoryModel {
  historyID: number
  moduleName: string
  historyDescription: string
  action: string
  actionBy: string
  historyDate: string
}
export const workHistoryInitValues: IWorkHistoryModel = {
  historyID: 0,
  moduleName: '',
  historyDescription: '',
  action: '',
  actionBy: '',
  historyDate: '',
}

export interface IProjectMaterialModel {
  stageID: number;
  stageName: string;
  materials: Material[];
}

export interface Material {
  materialID: number;
  materialName: string;
  montodorMaterialName: string;
  pmcMaterialName: string;
  photoPath: string;
}