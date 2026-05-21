import {useEffect} from 'react'

import {KTSVG} from '../../../../_Ecd/helpers'
import React from 'react'
import {Link} from 'react-router-dom'

import {IExpenseModel} from '../../../models/master-page/IExpenseTypeMode'

type props = {
  data: IExpenseModel
  handleShowActive: (e: any) => void
  handleShow: (id: number) => void
  name: string
  EmployeeID: number
}
const ExpenseTypeCard: React.FC<props> = ({
  data,
  handleShowActive,
  handleShow,
  name,
  EmployeeID,
}) => {
  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])
  return (
    <>
      <tr key={data.expenseTypeID}>
        <td className='text-dark text-hover-primary fs-6'>{data.expenseTypeName}</td>
        <td className='text-dark text-hover-primary fs-6'>{data.expenseHeadName}</td>
       
          <td className='text-dark text-hover-primary fs-6'>{data.createByName}</td>
      
        <td>
          <div className='form-check form-switch'>
            <input
              id={`${data.expenseTypeID}`}
              className='form-check-input'
              type='checkbox'
              checked={data.isActive}
              onChange={(e) => handleShowActive(e)}
            />
          </div>
        </td>
        <td>
          {EmployeeID === data.createBy ? (
            <div className='d-flex justify-content-end flex-shrink-0'>
              <Link
                to={{
                  pathname: `/accounts/expenseType/edit/${data.expenseTypeID}`,
                  state: {mainSearch: name},
                }}
                className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
              >
                <KTSVG
                  path='/media/icons/duotune/art/art005.svg'
                  className='svg-icon-3 svg-icon-primary'
                />
              </Link>
              <div
                onClick={() => handleShow(data.expenseTypeID)}
                className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
              >
                <KTSVG
                  path='/media/icons/duotune/general/gen027.svg'
                  className='svg-icon-3 svg-icon-danger'
                />
              </div>
            </div>
          ) : (
            <span className='me-5 d-flex text-muted justify-content-end flex-shrink-0 fs-6'>
              N.A
            </span>
          )}
        </td>
      </tr>
    </>
  )
}
export {ExpenseTypeCard}
