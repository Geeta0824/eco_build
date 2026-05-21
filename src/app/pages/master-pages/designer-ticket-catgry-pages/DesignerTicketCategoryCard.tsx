import {useEffect} from 'react'

import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import React from 'react'
import {Link} from 'react-router-dom'
import { IDesignerTicketCategoryModel} from '../../../models/master-page/IDesignerTicketCategoryModel'


type props = {
  data: IDesignerTicketCategoryModel
  name: string
  handleShow: (id: number) => void
}
const DesignerTicketCategoryCard: React.FC<props> = ({data, handleShow, name}) => {
  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])
  return (
    <>
      <tr key={data.designerTicketCategoryID}>
        <td className='text-dark text-hover-primary fs-6'>{data.title}</td>

        {/* <td className='text-dark text-hover-primary fs-6'>{data.amtPercentage} %</td> */}

        <td className='text-dark text-hover-primary fs-6'>{data.sequenceNo}</td>

        <td>
          <div className='d-flex justify-content-end flex-shrink-0'>
            <Link
              to={{
                pathname: `/master/designer-ticket-catgry/edit/${data.designerTicketCategoryID}`,
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
              onClick={() => handleShow(data.designerTicketCategoryID)}
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
export {DesignerTicketCategoryCard}
