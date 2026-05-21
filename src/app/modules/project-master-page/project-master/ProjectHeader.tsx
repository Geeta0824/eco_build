import React, {useEffect, useState} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'
import {useLocation} from 'react-router'

interface ICustomerEdit {
  projectID: any
  loading: boolean
  newCustomerID: number
  cmpName: string
  projName: String
  customerName: String
  projectCategoryName: String
  mainSearchText: String
  action: string
  projectAmount: number
  finalAmount: number
  additionalAmount: number
  reductionAmount: number
  projectCategoryID: number
}
const ProjectHeader: React.FC = () => {
  const {projectID} = useParams<{projectID: string}>()
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
    projectCategoryName: '',
    mainSearchText: '',
    projectAmount: 0,
    finalAmount: 0,
    additionalAmount: 0,
    reductionAmount: 0,
    projectCategoryID: 0,
  })

  useEffect(() => {
    setTimeout(() => {
      let lc: any = location.state
      let projName: any = lc.projName
      let customerName: any = lc.customerName
      let projectCategoryName: any = lc.projectCategoryName
      let projectID: any = lc.projectID
      let projectCategoryID: any = lc.projectCategoryID
      let projectAmount: any = lc.projectAmount
      let finalAmount: any = lc.finalAmount
      let additionalAmount: any = lc.additionalAmount
      let reductionAmount: any = lc.reductionAmount
      var mainSearchText: any = ''
      console.log('ad', lc.additionalAmount)
      if (lc != undefined) {
        mainSearchText = lc.searchText
      }
      getEmployeeData(
        projName,
        customerName,
        projectCategoryName,
        projectID,
        projectAmount,
        finalAmount,
        additionalAmount,
        reductionAmount,
        mainSearchText,
        projectCategoryID
      )
    }, 100)
  }, [])

  function getEmployeeData(
    selprojName: string,
    customerName: string,
    projectCategoryName: string,
    projectID: number,
    projectAmount: number,
    finalAmount: number,
    additionalAmount: number,
    reductionAmount: number,
    mainSearchText: string,
    projectCategoryID: number
  ) {
    setState({
      ...state,
      loading: false,
      projName: selprojName,
      customerName: customerName,
      projectCategoryName: projectCategoryName,
      projectID: projectID,
      projectAmount,
      finalAmount,
      additionalAmount,
      reductionAmount,
      mainSearchText,
      projectCategoryID: projectCategoryID,
    })
  }
  // console.log(state.customerName)
  // <span className='col-4 text-dark fs-2 fw-bold me-1'>
  return (
    <div className='card mb-5 mb-xl-10'>
      <div className='card-body pt-5 pb-0'>
        <div className='d-flex flex-wrap flex-sm-nowrap mb-1'>
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
                  <span className='text-primary text-dark cursor-pointer fs-4 fw-bolder me-1 px-5'>
                    Project Category Name : &nbsp;
                    <span className='text-primary text-hover-danger cursor-pointer fs-4 fw-bolder me-1'>
                      {state.projectCategoryName}
                    </span>
                  </span>
                  <span className='text-primary text-dark cursor-pointer fs-5 fw-bolder px-8  ms-1'>
                    <button
                      className='border border-dark btn btn-sm btn-primary  bg-danger'
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
                  </span>
                </div>

                <div className='d-flex align-items-center mt-2'>
                  {/* <span className='text-primary text-dark cursor-pointer fs-4 fw-bolder me-1'>
                    Project Amount : &nbsp;
                    <span className='text-primary text-hover-danger cursor-pointer fs-4 fw-bolder me-1'>
                      {state.projectAmount}
                    </span>
                  </span> */}
                  <span className='text-primary text-dark cursor-pointer fs-4 fw-bolder'>
                    Customer Name : &nbsp;
                    <span className='text-primary text-hover-danger cursor-pointer fs-4 fw-bolder'>
                      {state.customerName}
                    </span>
                  </span>{' '}
                  <span className='text-primary text-dark cursor-pointer fs-4 fw-bolder me-1 mx-5'>
                    Final Amount : &nbsp;
                    <span className='text-primary text-hover-danger cursor-pointer fs-4 fw-bolder me-1'>
                      {state.finalAmount}
                    </span>
                  </span>
                  <span className='text-primary text-dark cursor-pointer fs-4 fw-bolder me-1 mx-5'>
                    Additional Amount : &nbsp;
                    <span className='text-primary text-hover-danger cursor-pointer fs-4 fw-bolder me-1'>
                      {state.additionalAmount}
                    </span>
                  </span>
                  <span className='text-primary text-dark cursor-pointer fs-4 fw-bolder me-1 mx-5'>
                    Reduction Amount : &nbsp;
                    <span className='text-primary text-hover-danger cursor-pointer fs-4 fw-bolder me-1'>
                      {state.reductionAmount}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='d-flex overflow-auto h-55px'>
          <ul
            className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw- 
           bolder flex-nowrap'
          >
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === `/projects/project/edit/${state.projectID}/edit` &&
                    'active')
                }
                to={`/projects/project/edit/${state.projectID}/edit`}
              >
                Project Info
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  ((location.pathname ===
                    `/projects/project/edit/${state.projectID}/paymentstructure/list` &&
                    'active') ||
                    (location.pathname ===
                      `/projects/project/edit/${state.projectID}/paymentstructure/add` &&
                      'active'))
                }
                to={{
                  pathname: `/projects/project/edit/${state.projectID}/paymentstructure/list`,
                  state: {
                    projName: state.projName,
                    customerName: state.customerName,
                  },
                }}
              >
                Payment Structure
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  ((location.pathname === `/projects/project/edit/${state.projectID}/vendor/list` &&
                    'active') ||
                    (location.pathname === `/projects/project/edit/${state.projectID}/vendor/add` &&
                      'active'))
                }
                to={{
                  pathname: `/projects/project/edit/${state.projectID}/vendor/list`,
                  state: {
                    projName: state.projName,
                    customerName: state.customerName,
                    projectCategoryID: state.projectCategoryID,
                  },
                }}

                // to={`/projects/project/edit/${state.projectID}/vendor/list`}
              >
                Vendor
              </Link>
            </li>
            {/* <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  ((location.pathname ===
                    `/projects/project/edit/${state.projectID}/imp-remarks/list` &&
                    'active') ||
                    (location.pathname ===
                      `/projects/project/edit/${state.projectID}/imp-remarks/add` &&
                      'active'))
                }
                to={{
                  pathname: `/projects/project/edit/${state.projectID}/imp-remarks/list`,
                  state: {
                    projName: state.projName,
                    customerName: state.customerName,
                    projectCategoryID: state.projectCategoryID,
                  },
                }}

                // to={`/projects/project/edit/${state.projectID}/imp-remarks/list`}
              >
                IMP Remaks
              </Link>
            </li> */}
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  ((location.pathname ===
                    `/projects/project/edit/${state.projectID}/stage-info/list` &&
                    'active') ||
                    (location.pathname ===
                      `/projects/project/edit/${state.projectID}/stage-info/details` &&
                      'active'))
                }
                to={{
                  pathname: `/projects/project/edit/${state.projectID}/stage-info/list`,
                  state: {
                    projName: state.projName,
                    customerName: state.customerName,
                    projectID: state.projectID,
                    projectCategoryID: state.projectCategoryID,
                  },
                }}
              >
                Stage Info
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ProjectHeader
