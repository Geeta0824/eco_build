import {useEffect} from 'react'

import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import React from 'react'
import {Link} from 'react-router-dom'
import {IQuotationLevelModel} from '../../../models/master-page/IQuotationLevelModel'

type props = {
  data: IQuotationLevelModel
  name: string
  handleShow: (id: number) => void
  handleShowEmpMap: (data: IQuotationLevelModel) => void
}
const QuotationLevelCard: React.FC<props> = ({data, handleShow, name, handleShowEmpMap}) => {
  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])
  return (
    <>
      <tr key={data.quotationLevelID}>
        <td className='text-dark text-hover-primary fs-6'>{data.quotationLevelName}</td>

        {/* <td className='text-dark text-hover-primary fs-6'>{data.amtPercentage} %</td> */}

        <td className='text-dark text-hover-primary fs-6 text-center'>
          {' '}
          <span
            className={
              // user.roleID === 2 || user.designationID === 4 || user.designationID === 1008
              //   ?
              'btn btn-icon btn-bg-light pulse2-grow-on-hover mb-3 text-primary bg-hover-primary text-hover-inverse-primary btn-sm me-2'
              // : 'd-none'
            }
            title='Employee Map'
            onClick={() => handleShowEmpMap(data)}
          >
            <span className='fa fa-users fa-2x'></span>
          </span>
        </td>

        <td>
          <div className='d-flex justify-content-end flex-shrink-0'>
            <Link
              to={{
                pathname: `/master/quotation-level/edit/${data.quotationLevelID}`,
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
              onClick={() => handleShow(data.quotationLevelID)}
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
export {QuotationLevelCard}
