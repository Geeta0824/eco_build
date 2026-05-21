export interface ICustomerTerminalModel {
    customerID: number
    terminalTypeID: number
    terminalCode: string
  }
  export const customerTerminalInitValues: ICustomerTerminalModel = {
    customerID: 0,
    terminalTypeID: 0,
    terminalCode: '',
  }
  