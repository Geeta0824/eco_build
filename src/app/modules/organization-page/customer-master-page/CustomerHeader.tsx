/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {useLocation} from 'react-router'

interface ICustomerEdit {
  loading: boolean
  newCustomerID: number
  selCustomerName: string
  action: string
  mainBranchID: number
  mainSearch: string
}

const CustomerHeader: React.FC = () => {
  const location = useLocation()
  const {customerID} = useParams<{customerID: string}>()

  const [state, setState] = useState<ICustomerEdit>({
    loading: false,
    newCustomerID: 0,
    selCustomerName: '',
    action: 'Personal',
    mainBranchID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setTimeout(() => {
      let lc: any = location.state
      let customerName: any = lc.custName
      console.log(lc)
      var mainBranchID: number = 0
      var mainSearch: string = ''
      if (lc.mainBranchID == undefined || lc.mainSearch !== undefined) {
        mainBranchID = lc.mainBranchID
        mainSearch = lc.mainSearch
      }
      // let empName = localStorage.getItem('editCustomerName')!
      // let employeeName: string = JSON.parse(empName)
      getEmployeeData(customerName, mainBranchID, mainSearch)
    }, 100)
  }, [])

  function getEmployeeData(selCustomerName: string, mainBranchID: number, mainSearch: string) {
    setState({
      ...state,
      loading: false,
      newCustomerID: parseInt(customerID),
      selCustomerName: selCustomerName,
      mainBranchID,
      mainSearch,
    })
  }

  return (
    <>
      <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
            to={{
              pathname: '/organization/customer/list',
              state: {BranchID: state.mainBranchID, search: state.mainSearch},
            }}
          >
            Back To List
          </Link>
        </span>
      </div>
      <div className='card mb-5 mb-xl-10'>
        <div className='card-body pt-7 pb-0'>
          <div className='d-flex flex-wrap flex-sm-nowrap mb-1'>
            <div className='flex-grow-1'>
              <div className='d-flex justify-content-between align-items-start flex-wrap'>
                <div className='d-flex flex-column'>
                  <div className='d-flex align-items-center'>
                    <span className='text-primary text-hover-danger cursor-pointer fs-1 fw-bolder me-1'>
                      {state.selCustomerName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='d-flex overflow-auto h-55px'>
            {location.pathname === `/organization/customer/view/${state.newCustomerID}/personal` ||
            location.pathname === `/organization/customer/view/${state.newCustomerID}/address` ||
            location.pathname === `/organization/customer/view/${state.newCustomerID}/bank/list` ||
            location.pathname ===
              `/organization/customer/view/${state.newCustomerID}/education/list` ||
            location.pathname ===
              `/organization/customer/view/${state.newCustomerID}/terminal/list` ||
            location.pathname ===
              `/organization/customer/view/${state.newCustomerID}/document/list` ? (
              <ul
                className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw- 
             bolder flex-nowrap'
              >
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname ===
                        `/organization/customer/view/${state.newCustomerID}/personal` && 'active')
                    }
                    to={{pathname: `/organization/customer/view/${state.newCustomerID}/personal`}}
                  >
                    Personal
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname ===
                        `/organization/customer/view/${state.newCustomerID}/address` && 'active')
                    }
                    to={`/organization/customer/view/${state.newCustomerID}/address`}
                  >
                    Address
                  </Link>
                </li>
                {/* <li className='nav-item'>
                <Link
                  className={
                    `nav-link text-active-primary me-6 ` +
                    ((location.pathname ===
                      `/organization/customer/view/${state.newCustomerID}/bank/list` &&
                      'active') ||
                      (location.pathname ===
                        `/organization/customer/view/${state.newCustomerID}/bank/add` &&
                        'active'))
                  }
                  to={`/organization/customer/view/${state.newCustomerID}/bank/list`}
                >
                  Bank Details
                </Link>
              </li> 
              <li className='nav-item'>
                <Link
                  className={
                    `nav-link text-active-primary me-6 ` +
                    ((location.pathname ===
                      `/organization/customer/view/${state.newCustomerID}/document/list` &&
                      'active') ||
                      (location.pathname ===
                        `/organization/customer/view/${state.newCustomerID}/document/add` &&
                        'active'))
                  }
                  to={`/organization/customer/view/${state.newCustomerID}/document/list`}
                >
                  KYC Document Details
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  className={
                    `nav-link text-active-primary me-6 ` +
                    ((location.pathname ===
                      `/organization/customer/view/${state.newCustomerID}/terminal/list` &&
                      'active') ||
                      (location.pathname ===
                        `/organization/customer/view/${state.newCustomerID}/terminal/add` &&
                        'active'))
                  }
                  to={`/organization/customer/view/${state.newCustomerID}/terminal/list`}
                >
                  Terminal Details
                </Link>
              </li> */}
              </ul>
            ) : (
              <ul
                className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw- 
           bolder flex-nowrap'
              >
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname ===
                        `/organization/customer/edit/${state.newCustomerID}/personal` && 'active')
                    }
                    to={{
                      pathname: `/organization/customer/edit/${state.newCustomerID}/personal`,
                      state: {mainBranchID: state.mainBranchID, mainSearch: state.mainSearch},
                    }}
                  >
                    Personal
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname ===
                        `/organization/customer/edit/${state.newCustomerID}/address` && 'active')
                    }
                    to={{
                      pathname: `/organization/customer/edit/${state.newCustomerID}/address`,
                      state: {mainBranchID: state.mainBranchID, mainSearch: state.mainSearch},
                    }}
                  >
                    Address
                  </Link>
                </li>
                {/* <li className='nav-item'>
                <Link
                  className={
                    `nav-link text-active-primary me-6 ` +
                    ((location.pathname ===
                      `/organization/customer/edit/${state.newCustomerID}/bank/list` &&
                      'active') ||
                      (location.pathname ===
                        `/organization/customer/edit/${state.newCustomerID}/bank/add` &&
                        'active'))
                  }
                  to={`/organization/customer/edit/${state.newCustomerID}/bank/list`}
                >
                  Bank Details
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  className={
                    `nav-link text-active-primary me-6 ` +
                    ((location.pathname ===
                      `/organization/customer/edit/${state.newCustomerID}/document/list` &&
                      'active') ||
                      (location.pathname ===
                        `/organization/customer/edit/${state.newCustomerID}/document/add` &&
                        'active'))
                  }
                  to={`/organization/customer/edit/${state.newCustomerID}/document/list`}
                >
                  KYC Document Details
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  className={
                    `nav-link text-active-primary me-6 ` +
                    ((location.pathname ===
                      `/organization/customer/edit/${state.newCustomerID}/terminal/list` &&
                      'active') ||
                      (location.pathname ===
                        `/organization/customer/edit/${state.newCustomerID}/terminal/add` &&
                        'active'))
                  }
                  to={`/organization/customer/edit/${state.newCustomerID}/terminal/list`}
                >
                  Terminal Details
                </Link>
              </li> */}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export {CustomerHeader}
