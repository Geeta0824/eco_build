// MaterialTable.tsx

import React from 'react'
import LoaderInTable from '../../../../common-pages/LoaderInTable'
import {KTSVG} from '../../../../../../_Ecd/helpers'
import {IMaterialInfoModel} from '../../../../../models/product-page/IMaterialInfoModel'

interface MaterialTableProps {
  loading: boolean
  materialData: IMaterialInfoModel[]
  onEdit: (data: IMaterialInfoModel) => void
  onDelete: (id: number) => void
}

const MaterialTable: React.FC<MaterialTableProps> = ({loading, materialData, onEdit, onDelete}) => (
  <div className='table-responsive'>
    <table className='table table-bordered align-middle g-2'>
      <thead className='bg-primary'>
        <tr className='fw-bolder fs-5 text-start'>
          <th className='min-w-300px text-start p-3'>Material Name</th>
          <th className='min-w-300px'>Material Company Name</th>
          <th className='min-w-75px text-center p-3'>Edit | Delete</th>
        </tr>
      </thead>
      <tbody className='text-start'>
        <LoaderInTable loading={loading} column={5} />
        {materialData.length > 0
          ? materialData.map((data) => (
              <tr key={data.agencyStageWiseMaterialID} className='fs-5 ps-2 text-start'>
                <td className='text-dark text-hover-primary'>{data.materialName}</td>
                <td className='text-dark text-hover-primary'>{data.materialCompanyName}</td>
                <td className='text-end'>
                  <div className='d-flex justify-content-end flex-shrink-0 mx-2'>
                    <span
                      className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                      onClick={() => onEdit(data)}
                    >
                      <KTSVG
                        path='/media/icons/duotune/art/art005.svg'
                        className='svg-icon-3 svg-icon-primary'
                      />
                    </span>
                    <span
                      onClick={() => onDelete(data.agencyStageWiseMaterialID)}
                      className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                    >
                      <KTSVG
                        path='/media/icons/duotune/general/gen027.svg'
                        className='svg-icon-3 svg-icon-danger'
                      />
                    </span>
                  </div>
                </td>
              </tr>
            ))
          : ''}
      </tbody>
    </table>
  </div>
)

export default MaterialTable
