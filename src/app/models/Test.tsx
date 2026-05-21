export interface ITestModel {
    _id: number
    name: string
    email: string
    gender: string
    number: number
    imagePath: string
}

export const TestInitValues: ITestModel = {
    _id: 0,
    name: '',
    email: '',
    gender: '',
    number: 0,
    imagePath: '',
}