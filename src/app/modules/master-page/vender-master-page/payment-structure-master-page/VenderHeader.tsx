import React, {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {useLocation} from 'react-router'

interface ICustomerEdit {
  loading: boolean
  newCustomerID: number
  selCustomerName: string
  cmpName: string
  action: string
}

const VenderHeader: React.FC = () => {
  const location = useLocation()

  const [state, setState] = useState<ICustomerEdit>({
    loading: false,
    newCustomerID: 0,
    selCustomerName: '',
    cmpName: '',
    action: 'Personal',
  })

  useEffect(() => {
    setTimeout(() => {
      let lc: any = location.state
      let customerName: any = lc.custName
      let companyName: any = lc.companyName
      getEmployeeData(customerName, companyName)
    }, 100)
  }, [])

  function getEmployeeData(selCustomerName: string, selCmpName: string) {
    setState({
      ...state,
      loading: false,
      selCustomerName: selCustomerName,
      cmpName: selCmpName,
    })
  }

  return (
    <div className='card mb-5 mb-xl-10'>
      <div className='card-body ps-8 py-3'>
        <div className='d-flex flex-wrap flex-sm-nowrap mb-1'>
          <div className='flex-grow-1'>
            <div className='d-flex align-items-center justify-content-center fs-4 '>
              <span className='col-6 text-dark fs-4 fw-bold me-1'>
                Company Name : &nbsp;&nbsp;&nbsp;
                <span className='text-primary text-hover-danger fs-3 fw-bold me-1'>
                  {state.cmpName}
                </span>
              </span>
              <span className='col-6 text-dark  fs-4 fw-bold me-1'>
                Contact Person : &nbsp;&nbsp;&nbsp;
                <span className='text-primary text-hover-danger fs-3 fw-bold me-1'>
                  {state.selCustomerName}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VenderHeader
