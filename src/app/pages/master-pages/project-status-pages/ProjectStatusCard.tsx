import {useEffect} from 'react'

import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import React from 'react'
import {Link} from 'react-router-dom'

import {IProjectStatusModel} from '../../../models/master-page/IProjectStatusModel'

type props = {
  data: IProjectStatusModel
name:string
  handleShow: (id: number) => void
}
const ProjectStatusCard: React.FC<props> = ({data, handleShow,name}) => {
  useEffect(() => {
 //  console.log('Use Effect Call')
    return () => {}
  }, [data])
  return (
    <>
      <tr key={data.projectStatusID}>
        <td>
          <div className='d-flex align-items-center'>
            <div className='d-flex justify-content-start flex-column'>
              <a href='#' className='text-dark text-hover-primary fs-6'>
                {data.projectStatusName}
              </a>
            </div>
          </div>
        </td>
        <td>
          <a href='#' className='text-dark text-hover-primary d-block fs-6'>
            {data.seqNo}
          </a>
        </td>
        <td>
          <div className='d-flex justify-content-end flex-shrink-0'>
            <Link
              to={{pathname:`/master/projectstatus/edit/${data.projectStatusID}`,state:{searchText:name}}}
              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
            >
              <KTSVG
                path='/media/icons/duotune/art/art005.svg'
                className='svg-icon-3 svg-icon-primary'
              />
            </Link>
            <div
              onClick={() => handleShow(data.projectStatusID)}
              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
            >
              <KTSVG
                path='/media/icons/duotune/general/gen027.svg'
                className='ssvg-icon-3 svg-icon-danger'
              />
            </div>
          </div>
        </td>
      </tr>
    </>
  )
}
export {ProjectStatusCard}
