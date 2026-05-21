export interface ITerminalTypeWebModel {
  terminalTypeID: number
  terminalTypeName: string
  terminalCode: string
  isActive: boolean
  createBy: number
  updateBy: number,
  ipAddress: string
}
export const terminalTypeInitValue: ITerminalTypeWebModel = {
  terminalTypeID: 0,
  terminalTypeName: '', 
  terminalCode: '', 
  isActive: false,
  createBy: 0,
  updateBy: 0,
  ipAddress: '',
}
