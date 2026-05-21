import {useEffect} from 'react'

import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import React from 'react'
import {Link} from 'react-router-dom'
import {ITalukaModel} from '../../../models/master-page/ITalukaModel'

type props = {
  data: ITalukaModel
  handleShowActive: (e: any) => void
  handleShow: (id: number) => void
  name: string
  selDistrictID: number
}
const TalukaCard: React.FC<props> = ({data, handleShowActive, handleShow, name, selDistrictID}) => {
  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])
  return (
    <>
      <tr key={data.talukaID}>
        <td>
          <span className='text-dark text-hover-primary d-block fs-6'>{data.talukaName}</span>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block fs-6'>{data.districtName}</span>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block fs-6'>{data.stateName}</span>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block fs-6'>{data.countryName}</span>
        </td>
        <td>
          <div className='form-check form-switch'>
            <input
              id={`${data.talukaID}`}
              className='form-check-input'
              type='checkbox'
              checked={data.isActive}
              // onChange={(e) => checkedFunction(e)}
              onChange={(e) => handleShowActive(e)}
            />
          </div>
        </td>
        <td>
          <div className='d-flex justify-content-end flex-shrink-0'>
            <Link
              to={{
                pathname: `/master/taluka/edit/${data.talukaID}`,
                state: {searchText: name, mainCityID: selDistrictID},
              }}
              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
            >
              <KTSVG
                path='/media/icons/duotune/art/art005.svg'
                className='svg-icon-3 svg-icon-primary'
              />
            </Link>
            <span
              onClick={() => handleShow(data.talukaID)}
              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
            >
              <KTSVG
                path='/media/icons/duotune/general/gen027.svg'
                className='ssvg-icon-3 svg-icon-danger'
              />
            </span>
          </div>
        </td>
      </tr>
    </>
  )
}
export {TalukaCard}
