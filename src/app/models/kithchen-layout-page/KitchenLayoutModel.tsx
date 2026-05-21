export interface IKitchenLayoutModel {
  customerID: number
  customerName: string
  email: string
  mobileNumber: string
  kitchenLayoutID: number
  wallA: number
  wallB: number
  wallC: number
  wallD: number
}
export const kitchenLayoutInitValues: IKitchenLayoutModel = {
  customerID: 0,
  customerName: '',
  email: '',
  mobileNumber: '',
  kitchenLayoutID: 0,
  wallA: 0,
  wallB: 0,
  wallC: 0,
  wallD: 0,
}
