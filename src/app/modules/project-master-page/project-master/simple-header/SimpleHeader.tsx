import React, {useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {useLocation} from 'react-router'

interface ICustomerEdit {
  projectID: any
  loading: boolean
  newCustomerID: number
  cmpName: string
  projName: String
  customerName: String
  mainSearchText: String
  action: string
  projectAmount: number
  paidAmount: number
  remainingAmount: number
}

const SimpleHeader: React.FC = () => {
  const location = useLocation()
  const history = useHistory()

  const [state, setState] = useState<ICustomerEdit>({
    loading: false,
    newCustomerID: 0,
    cmpName: '',
    action: 'ProjInfo',
    projectID: 0,
    projName: '',
    customerName: '',
    mainSearchText: '',
    projectAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
  })

  useEffect(() => {
    setTimeout(() => {
      let lc: any = location.state
      let projName: any = lc.projName
      let customerName: any = lc.customerName
      let projectID: any = lc.projectID
      let projectAmount: any = lc.projectAmount
      let paidAmount: any = lc.paidAmount
      let remainingAmount: any = lc.remainingAmount
      var mainSearchText: any = ''
      if (lc != undefined) {
        mainSearchText = lc.searchText
      }
      getEmployeeData(
        projName,
        customerName,
        projectID,
        projectAmount,
        paidAmount,
        remainingAmount,
        mainSearchText
      )
    }, 100)
  }, [])

  function getEmployeeData(
    selprojName: string,
    customerName: string,
    projectID: number,
    projectAmount: number,
    paidAmount: number,
    remainingAmount: number,
    mainSearchText: string
  ) {
    setState({
      ...state,
      loading: false,
      projName: selprojName,
      customerName,
      projectID,
      projectAmount,
      paidAmount,
      remainingAmount,
      mainSearchText,
    })
  }
  return (
    <div className='card'>
      <div className='card-body pt-5 pb-0'>
        <div className='d-flex flex-wrap flex-sm-nowrap'>
          <div className='flex-grow-1'>
            <div className='d-flex justify-content-between align-items-start flex-wrap'>
              <div className='d-flex flex-column'>
                <div className='d-flex align-items-center'>
                  <span className='text-primary text-dark cursor-pointer fs-4 fw-bolder'>
                    Project Name : &nbsp;
                    <span className='text-primary text-hover-danger cursor-pointer fs-4 fw-bolder'>
                      {state.projName}
                    </span>
                  </span>
                  <span className='text-primary text-dark cursor-pointer fs-4 fw-bolder px-8'>
                    Customer Name : &nbsp;
                    <span className='text-primary text-hover-danger cursor-pointer fs-4 fw-bolder'>
                      {state.customerName}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            className='border border-dark btn btn-sm btn-primary bg-danger mb-1'
            onClick={() => {
              history.push({
                pathname: '/projects/project/list',
                state: {searchText: state.mainSearchText},
              })
            }}
          >
            <span title='Click Here Go To Project List Page' className='text-white'>
              Back To Main List
            </span>
          </button>
        </div>

        <div
          className={
            location.pathname === '/projects/project/add-ded/additional/list' ||
            location.pathname === '/projects/project/add-ded/additional/add' ||
            location.pathname === '/projects/project/add-ded/deduction/list' ||
            location.pathname === '/projects/project/add-ded/deduction/add'
              ? 'd-flex overflow-auto h-55px'
              : 'd-none'
          }
        >
          <ul
            className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw- 
           bolder flex-nowrap'
          >
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  ((location.pathname === `/projects/project/add-ded/additional/list` &&
                    'active') ||
                    (location.pathname === `/projects/project/add-ded/additional/add` && 'active'))
                }
                to={{
                  pathname: `/projects/project/add-ded/additional/list`,
                  state: {
                    projName: state.projName,
                    customerName: state.customerName,
                    projectID: state.projectID,
                    searchText: state.mainSearchText,
                  },
                }}
              >
                Additional Item 
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  ((location.pathname === `/projects/project/add-ded/deduction/list` && 'active') ||
                    (location.pathname === `/projects/project/add-ded/deduction/add` && 'active'))
                }
                to={{
                  pathname: `/projects/project/add-ded/deduction/list`,
                  state: {
                    projName: state.projName,
                    customerName: state.customerName,
                    projectID: state.projectID,
                    searchText: state.mainSearchText,
                  },
                }}
              >
                Reduction Item 
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SimpleHeader
