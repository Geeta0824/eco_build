import {useEffect} from 'react'

import {KTSVG} from '../../../../_Ecd/helpers'
import React from 'react'
import {Link} from 'react-router-dom'
import {IExpenseHeadModel} from '../../../models/Accounts-page/expense-header/ExpenseHeaderModel'

type props = {
  data: IExpenseHeadModel
  handleShow: (id: number) => void
  name: string
  EmployeeID: number
}
const ExpenseHeaderCard: React.FC<props> = ({data, handleShow, name, EmployeeID}) => {
  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])
  return (
    <>
      <tr key={data.expenseHeadID}>
        <td className='text-dark text-hover-primary fs-6'>{data.expenseHeadName}</td>
        
          <td className='text-dark text-hover-primary fs-6'>{data.createByName}</td>
      
        <td>
          {EmployeeID === data.createBy ? (
            <div className='d-flex justify-content-center flex-shrink-0'>
              <Link
                to={{
                  pathname: `/accounts/expense-head/edit/${data.expenseHeadID}`,
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
                onClick={() => handleShow(data.expenseHeadID)}
                className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
              >
                <KTSVG
                  path='/media/icons/duotune/general/gen027.svg'
                  className='svg-icon-3 svg-icon-danger'
                />
              </div>
            </div>
          ) : (
            <span className='ms-5 d-flex text-muted justify-content-center flex-shrink-0 fs-6'>
              N.A
            </span>
          )}
        </td>
      </tr>
    </>
  )
}
export {ExpenseHeaderCard}
