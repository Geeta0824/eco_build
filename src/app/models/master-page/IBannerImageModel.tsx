export interface IBannerImageModel {
  bannerID: number
  bannerTitle: string
  bannerPath: string
  isActive: boolean
  createBy: number
  updateBy: number
  ipAddress: string
}
export const bannerImageInitValues: IBannerImageModel = {
  bannerID: 0,
  bannerTitle: '',
  bannerPath: '',
  isActive: true,
  createBy:0,
  updateBy:0,
  ipAddress: '192.168.0.0',
}
