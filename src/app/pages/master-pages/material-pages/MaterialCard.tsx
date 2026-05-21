import {useEffect} from 'react'

import {KTSVG} from '../../../../_Ecd/helpers'
import React from 'react'
import {Link} from 'react-router-dom'

import {IMaterialModel} from '../../../models/master-page/IMaterialModel'

type props = {
  data: IMaterialModel
  handleShow: (id: number) => void
  name: string
}
const MaterialCard: React.FC<props> = ({data, handleShow, name}) => {
  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])
  return (
    <>
      <tr key={data.materialInfoID}>
        <td className='text-dark text-hover-primary fs-6'>{data.materialName}</td>
        <td className='text-dark text-hover-primary fs-6'>{data.projectType}</td>
        <td className='text-dark text-hover-primary fs-6'>{data.specification}</td>
        <td className='text-dark text-hover-primary fs-6'>{data.doneby}</td>
        <td className='text-dark text-hover-primary fs-6'>{data.importantPoint}</td>
        <td>
          <div className='d-flex justify-content-end flex-shrink-0'>
            <Link
              to={{
                pathname: `/master/material/edit/${data.materialInfoID}`,
                state: {searchText: name},
              }}
              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
            >
              <KTSVG
                path='/media/icons/duotune/art/art005.svg'
                className='svg-icon-3 svg-icon-primary'
              />
            </Link>
            <div
              onClick={() => handleShow(data.materialInfoID)}
              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
            >
              <KTSVG
                path='/media/icons/duotune/general/gen027.svg'
                className='svg-icon-3 svg-icon-danger'
              />
            </div>
          </div>
        </td>
      </tr>
    </>
  )
}
export {MaterialCard}
