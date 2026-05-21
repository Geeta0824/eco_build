
      import {BooleanSupportOption} from 'prettier'
      
      export interface IKazulenciaItemModel {
       upGradeItemID: number,
      agencyTypeID: number,
      agencyTypeName: string,
      upGradeItemName: string,
      upGradePercentage: number

      }
      export const kazulenciaItemInitValue: IKazulenciaItemModel = {
        upGradeItemID: 0,
        agencyTypeID: 0,
        agencyTypeName: '',
        upGradeItemName: '',
        upGradePercentage: 0
      }
      