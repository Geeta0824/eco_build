import {useEffect} from 'react'

import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import React from 'react'
import {Link} from 'react-router-dom'

import {ITurnkeyPaymentStructureModel} from '../../../models/master-page/ITurnkeyPaymentStructureModel'
import {IUnitModel} from '../../../models/master-page/IUnitModel'

type props = {
  data: IUnitModel
  handleShowActive: (e: any) => void
  handleShow: (id: number) => void
  name: string
}
const UnitCard: React.FC<props> = ({data, handleShowActive, handleShow, name}) => {
  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])
  return (
    <>
      <tr key={data.unitID}>
        <td>
          <div className='d-flex align-items-center'>
            <div className='d-flex justify-content-start flex-column'>
              <span className='text-dark text-hover-primary fs-6'>{data.unitName}</span>
            </div>
          </div>
        </td>
        <td>
          <div className='form-check form-switch'>
            <input
              className='form-check-input'
              type='checkbox'
              id={`${data.unitID}`}
              checked={data.isActive}
              onChange={(e) => handleShowActive(e)}
            />
          </div>
        </td>
        <td>
          <div className='d-flex justify-content-end flex-shrink-0'>
            <Link
              to={{pathname: `/master/unit/edit/${data.unitID}`, state: {searchText: name}}}
              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
            >
              <KTSVG
                path='/media/icons/duotune/art/art005.svg'
                className='svg-icon-3 svg-icon-primary'
              />
            </Link>
            <div
              onClick={() => handleShow(data.unitID)}
              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
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
export {UnitCard}
