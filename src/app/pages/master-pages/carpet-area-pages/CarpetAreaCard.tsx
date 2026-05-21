import {useEffect} from 'react'
import {ICarpetAreaModel} from '../../../models/master-page/ICarpetAreaModel'
import {KTSVG} from '../../../../_Ecd/helpers'
import React from 'react'
import {Link} from 'react-router-dom'

type props = {
  data: ICarpetAreaModel
  handleShow: (id: number) => void
  name: string
}
const CarpetAreaCard: React.FC<props> = ({data, handleShow, name}) => {
  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])
  return (
    <>
      <tr key={data.carpetAreaID}>
        <td>
          <div className='d-flex align-items-center'>
            <div className='d-flex justify-content-start flex-column'>
              <span className='text-dark text-hover-primary fs-6'>{data.carpetArea}</span>
            </div>
          </div>
        </td>
        <td>
          <div className='d-flex justify-content-end flex-shrink-0'>
            <Link
              to={{
                pathname: `/master/carpetArea/edit/${data.carpetAreaID}`,
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
              onClick={() => handleShow(data.carpetAreaID)}
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
export default CarpetAreaCard
