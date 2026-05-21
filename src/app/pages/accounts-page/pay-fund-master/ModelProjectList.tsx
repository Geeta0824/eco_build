import React from 'react'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
type Props = {
  data: IProjectModel
  selectProject: (_data: IProjectModel) => void
}
const ModelProjectList: React.FC<Props> = ({data, selectProject}) => {
  return (
    <>
      <tr
        key={data.projectVendorID}
        className={data.isActive === false ? 'd-none' : 'bg-hover-light-primary text-hover-primary'}
        onClick={() => selectProject(data)}
      >
        <td>
          <span className='text-dark text-hover-primary d-block ps-1 mb-1 fs-6'>
            {data.projectName}
          </span>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
            {data.firstName + ' ' + data.lastName}
          </span>
        </td>

        <td>
          <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
            {data.projectCategoryName}
          </span>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
            {data.workName}
          </span>
        </td>
        <td className=''>
          <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
            {data.projectAmount}
          </span>
        </td>
        <td className=''>
          <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
            {data.paidAmount}
          </span>
        </td>
        <td className=''>
          <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
            {data.remainingAmount}
          </span>
        </td>
        <td className=''>
          <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
            {data.dueAmount}
          </span>
        </td>
        {/* <td className=''>
          <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
            {data.projectStatusName}
          </span>
        </td> */}
      </tr>
    </>
  )
}

export default ModelProjectList
