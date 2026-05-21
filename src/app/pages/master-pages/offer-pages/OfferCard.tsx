import {useEffect} from 'react'

import {KTSVG} from '../../../../_Ecd/helpers'
import React from 'react'
import {Link} from 'react-router-dom'

import {INationalityWebModel} from '../../../models/master-page/INationalityModel'
import {IOfferModel} from '../../../models/master-page/IOfferModel'

type props = {
  data: IOfferModel
  HandleShowBranchData: (data: IOfferModel) => void
  handleShow: (id: number) => void
  name: string
}
const OfferCard: React.FC<props> = ({data, HandleShowBranchData, handleShow, name}) => {
  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])
  return (
    <>
      <tr key={data.offerID}>
        <td className='text-dark text-hover-primary fs-6'>{data.offerTitle}</td>
        <td className='text-dark text-hover-primary fs-6'>{data.offerDesc}</td>
        {data.isPriceEffect === true ? (
          <td className='text-dark text-hover-primary fs-6'>Yes</td>
        ) : (
          <td className='text-dark text-hover-primary fs-6'>No</td>
        )}
        {data.isPriceEffect === true ? (
          <td className='text-dark text-hover-primary fs-6'>{data.offerPercentage}%</td>
        ) : (
          <td className='text-dark text-hover-primary fs-6'>N.A</td>
        )}
        <td className='text-center'>
          <div
            onClick={() => HandleShowBranchData(data)}
            className='btn btn-icon btn-bg-light bg-hover-success text-hover-inverse-success btn-sm me-1'
          >
            <KTSVG
              path='/media/icons/duotune/general/gen018.svg'
              className='svg-icon-2x svg-icon-success'
            />
            {/* <span className='fa fa-map'></span> */}
          </div>
        </td>
        <td>
          <div className='d-flex justify-content-end flex-shrink-0'>
            <Link
              to={{pathname: `/master/offer/edit/${data.offerID}`, state: {searchText: name}}}
              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
            >
              <KTSVG
                path='/media/icons/duotune/art/art005.svg'
                className='svg-icon-3 svg-icon-primary'
              />
            </Link>
            <div
              onClick={() => handleShow(data.offerID)}
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
export {OfferCard}
