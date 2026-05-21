/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'
import {ICountryModel} from '../../../models/master-page/ICountryModel'
import {Link} from 'react-router-dom'
import {KTSVG} from '../../../../_Ecd/helpers'
import {IStateModel} from '../../../models/master-page/IStateModel'

type Props = {
  data: IStateModel
  //  handleShowFlag: (path: string) => void
  handleShowActive: (e: any) => void
  handleShow: (id: number) => void
  name: string
  selCountryID:number
}

const StateCard: React.FC<Props> = ({data, handleShowActive, handleShow, name,selCountryID}) => {
  const pathUrl = process.env.REACT_APP_API_URL
console.log('card',selCountryID)
  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])

  return (
    <>
      <tr key={data.stateID}>
        <td>
          <div className='d-flex align-items-center'>
            <div className='d-flex justify-content-start flex-column'>
              <a href='#' className='text-dark text-hover-primary fs-6'>
                {data.stateMaster}
              </a>
            </div>
          </div>
        </td>
        <td>
          <a href='#' className='text-dark text-hover-primary d-block fs-6'>
            {data.countryName}
          </a>
        </td>
        <td>
          <div className='form-check form-switch'>
            <input
              id={`${data.stateID}`}
              className='form-check-input'
              type='checkbox'
              checked={data.isActive}
              onChange={(e) => handleShowActive(e)}
            />
          </div>
        </td>
        <td>
          <div className='d-flex justify-content-end flex-shrink-0'>
            <Link
              to={{pathname: `/master/state/edit/${data.stateID}`, state: {searchText: name,mainCountryID:selCountryID}}}
              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
            >
              <KTSVG
                path='/media/icons/duotune/art/art005.svg'
                className='svg-icon-3 svg-icon-primary'
              />
            </Link>
            <a
              onClick={() => handleShow(data.stateID)}
              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
            >
              <KTSVG
                path='/media/icons/duotune/general/gen027.svg'
                className='svg-icon-3 svg-icon-danger'
              />
            </a>
          </div>
        </td>
      </tr>
    </>
  )
}

export {StateCard}
