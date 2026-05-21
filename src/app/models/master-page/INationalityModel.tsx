export interface INationalityWebModel {
  nationalityID: number
  nationalityName: string
  isActive: boolean
}
export const nationalityInitValue: INationalityWebModel = {
  nationalityID: 0,
  nationalityName: '',
  isActive: false,
}
