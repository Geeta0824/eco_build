import {useEffect} from 'react'
import {KTSVG} from '../../../../_Ecd/helpers'
import React from 'react'
import {Link} from 'react-router-dom'
import {PenaltyTypeModel} from '../../../models/master-page/PenaltyTypeModel'

type props = {
  data: PenaltyTypeModel
  name: string
  handleShow: (id: number) => void
}
const PenaltyTypeCard: React.FC<props> = ({data, handleShow, name}) => {
  useEffect(() => {
    return () => {}
  }, [data])
  return (
    <>
      <tr key={data.penaltyTypeID}>
        <td className='text-dark text-hover-primary fs-6'>{data.penaltyTypeName}</td>
        <td>
          <div className='d-flex justify-content-end flex-shrink-0'>
            <Link
              to={{
                pathname: `/master/penalty-type/edit/${data.penaltyTypeID}`,
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
              onClick={() => handleShow(data.penaltyTypeID)}
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
export {PenaltyTypeCard}
