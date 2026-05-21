import {useEffect} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../_Ecd/helpers'
import React from 'react'
import {Link} from 'react-router-dom'
import {INewReadymadePkgModel} from '../../models/new-readymade-pkg/INewReadymadePkgModel'

type props = {
  data: INewReadymadePkgModel
  name: string
  handleShow: (id: number) => void
  handleShowBHKMap: (data: INewReadymadePkgModel) => void
  handleShowItemMap: (data: INewReadymadePkgModel) => void
  handleShowActive: (e: any) => void
}
const NewReadymadePackageCard: React.FC<props> = ({data, handleShow, name, handleShowBHKMap,handleShowItemMap,handleShowActive}) => {
  useEffect(() => {
    return () => {}
  }, [data])
  return (
    <>
      <tr key={data.readymadeTypeID}>
        <td className='text-dark text-hover-primary fs-6'>{data.readymadeTypeName}</td>
        <td className='text-dark text-hover-primary fs-6 '>{data.perSqft}</td>
        <td className='text-dark text-hover-primary fs-6'>
          {' '}
          <span
            className={
              'btn btn-icon btn-bg-light pulse2-grow-on-hover mb-3 text-primary bg-hover-primary text-hover-inverse-primary btn-sm me-2'
            }
            title='BHK Map'
            onClick={() => handleShowBHKMap(data)}
          >
            <span className='fa fa-home fa-2x text-success'></span>
          </span>
        </td>
        
      
        <td className='text-dark text-hover-primary fs-6'>
          {' '}
          <span
            className={
              'btn btn-icon btn-bg-light pulse2-grow-on-hover mb-3 text-primary bg-hover-primary text-hover-inverse-warning btn-sm me-2'
            }
            title='Item Map'
            onClick={() => handleShowItemMap(data)}
          >
            <span className='fa fa-list fa-2x text-info'></span>
          </span>
        </td>
        <td className='text-dark text-hover-primary fs-6'>
          <div className='form-check form-switch'>
            <input
              id={`${data.readymadeTypeID}`}
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
              to={{
                pathname: `/readymade-pkg/new-readymade-pkg/edit/${data.readymadeTypeID}`,
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
              onClick={() => handleShow(data.readymadeTypeID)}
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
export {NewReadymadePackageCard}
