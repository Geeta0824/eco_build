import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {
  getDIYStageWiseDataByVendorIDAndProjectIDApi,
  getModularStageWiseDataByVendorIDAndProjectIDApi,
  getStageWiseDataByVendorIDAndProjectIDApi,
} from '../../../modules/accounts-reports/vendor-report-master/VendortReportCRUD'
import {
  IStageWiseReportModel,
  IVendorReportModel,
} from '../../../models/accounts-reports/IVendorReportModel'

type Props = {}

interface IDesignation {
  loading: boolean
  stageWiseData: IStageWiseReportModel[]
  objStageWiseData: IStageWiseReportModel
  SearchText: string
  projectData: IVendorReportModel
  vendorID: number
  projectID: number
  companyName: string
  contactPerson: string
  vendorCost: number
  paidAmount: number
  remainingAmount: number
  selProjectCategoryID: number
  selProjectCategoryName: string
  startDate: string
  endDate: string
}

const ViewStageWiseReportView: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IDesignation>({
    loading: false,
    stageWiseData: [] as IStageWiseReportModel[],
    objStageWiseData: {} as IStageWiseReportModel,
    SearchText: '',
    projectData: {} as IVendorReportModel,
    vendorID: 0,
    projectID: 0,
    companyName: '',
    contactPerson: '',
    vendorCost: 0,
    paidAmount: 0,
    remainingAmount: 0,
    selProjectCategoryID: 0,
    selProjectCategoryName: '',
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    let lc: any = location.state
    let project = lc.projectData
    let vendorID = lc.vendorID
    let companyName = lc.companyName
    let contactPerson = lc.contactPerson
    let vendorCost = lc.vendorCost
    let paidAmount = lc.paidAmount
    let remainingAmount = lc.remainingAmount
    let projectCategoryID = lc.projectCategoryID
    let projectCategoryName = lc.projectCategoryName
    setTimeout(() => {
      getStageWiseData(
        project,
        vendorID,
        companyName,
        contactPerson,
        vendorCost,
        paidAmount,
        remainingAmount,
        projectCategoryID,
        projectCategoryName
      )
    }, 100)
  }, [])

  function getStageWiseData(
    projectData: IVendorReportModel,
    vendorID: number,
    companyName: string,
    contactPerson: string,
    vendorCost: number,
    paidAmount: number,
    remainingAmount: number,
    projectCategoryID: number,
    projectCategoryName: string
  ) {
    if (projectCategoryID == 1) {
      getStageWiseDataByVendorIDAndProjectIDApi(projectData.projectID, vendorID)
        .then((response) => {
          const responseData = response.data.responseObject
          if (response.data.isSuccess == true) {
            setState({
              ...state,
              stageWiseData: responseData,
              objStageWiseData: response.data,
              companyName: companyName,
              contactPerson: contactPerson,
              projectData: projectData,
              projectID: projectData.projectID,
              vendorCost: vendorCost,
              paidAmount: paidAmount,
              remainingAmount: remainingAmount,
              selProjectCategoryID: projectCategoryID,
              selProjectCategoryName: projectCategoryName,
              vendorID: vendorID,
              loading: false,
            })
          } else {
            toast.error(`${response.data.message}`)
          }
        })
        .catch((error) => {
          setState({...state, stageWiseData: [], loading: false})
          toast.error(`${error}`)
        })
    } else if (projectCategoryID == 2) {
      getDIYStageWiseDataByVendorIDAndProjectIDApi(projectData.projectID, vendorID)
        .then((response) => {
          const responseData = response.data.responseObject
          if (response.data.isSuccess == true) {
            setState({
              ...state,
              stageWiseData: responseData,
              objStageWiseData: response.data,
              companyName: companyName,
              contactPerson: contactPerson,
              projectData: projectData,
              projectID: projectData.projectID,
              vendorCost: vendorCost,
              paidAmount: paidAmount,
              remainingAmount: remainingAmount,
              selProjectCategoryID: projectCategoryID,
              selProjectCategoryName: projectCategoryName,
              vendorID: vendorID,
              loading: false,
            })
          } else {
            toast.error(`${response.data.message}`)
          }
        })
        .catch((error) => {
          setState({...state, stageWiseData: [], loading: false})
          toast.error(`${error}`)
        })
    } else if (
      projectCategoryID == 3 ||
      projectCategoryID == 8 ||
      projectCategoryID == 9 ||
      projectCategoryID == 10
    ) {
      getModularStageWiseDataByVendorIDAndProjectIDApi(projectData.projectID, vendorID)
        .then((response) => {
          const responseData = response.data.responseObject
          if (response.data.isSuccess == true) {
            setState({
              ...state,
              stageWiseData: responseData,
              objStageWiseData: response.data,
              companyName: companyName,
              contactPerson: contactPerson,
              projectData: projectData,
              projectID: projectData.projectID,
              vendorCost: vendorCost,
              paidAmount: paidAmount,
              remainingAmount: remainingAmount,
              selProjectCategoryID: projectCategoryID,
              selProjectCategoryName: projectCategoryName,
              vendorID: vendorID,
              loading: false,
            })
          } else {
            toast.error(`${response.data.message}`)
          }
        })
        .catch((error) => {
          setState({...state, stageWiseData: [], loading: false})
          toast.error(`${error}`)
        })
    } else {
      setState({...state, stageWiseData: [], loading: false})
      return toast.error(`Project CategoryID is 0`)
    }
  }

  return (
    <>
      <div className='text-end'>
        <Link
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          to={{pathname: '/account-reports/vendor/list', state: {vendorID: state.vendorID}}}
        >
          Back To List
        </Link>
      </div>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='d-flex' style={{backgroundColor: '#000000'}}>
          <div className='card-header border-0 py-2 row gx-xl-8 gx-sm-5 p-3'>
            {/* <div className='d-block '> */}
            <div className='d-flex'>
              <div className='col-lg-6 text-white cursor-pointer fs-6 d-flex'>
                Vendor Name : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.companyName}
                </div>
              </div>
              <div className='col-lg-6 text-white cursor-pointer fs-6 d-flex'>
                Contact Person : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.contactPerson}
                </div>
              </div>
            </div>

            <div className='d-flex'>
              <div className='col-lg-4 text-white cursor-pointer fs-6 d-flex'>
                Project Name : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.projectData.projectName}
                </div>
              </div>{' '}
              <div className='col-lg-5 text-white cursor-pointer fs-6 d-flex'>
                Project Category : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.projectData.projectCategoryName}
                </div>
              </div>
              <div className='col-lg-3 text-white cursor-pointer fs-6 d-flex'>
                Customer : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.projectData.customerName}
                </div>
              </div>
            </div>
            {/* <div className='d-flex'>
              <div className='col-lg-6 text-white cursor-pointer fs-6 d-flex'>
                Project Name : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.projectData.projectName}
                </div>
              </div>
              <div className='col-lg-6 text-white cursor-pointer fs-6 d-flex'>
                Project Category : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.selProjectCategoryName}
                </div>
              </div>
              <div className='col-lg-6 text-white cursor-pointer fs-6 d-flex'>
                Customer Name : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.projectData.customerName}
                </div>
              </div>
            </div> */}
            <div className='d-flex'>
              <div className='col-lg-4 text-white cursor-pointer fs-6 d-flex'>
                Vendor Cost : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.vendorCost}
                </div>
              </div>
              <div className='col-lg-4 text-white cursor-pointer fs-6 d-flex'>
                Paid Amount : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.paidAmount}
                </div>
              </div>
              <div className='col-lg-4 text-white cursor-pointer fs-6 d-flex'>
                Remaining Amount : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.remainingAmount}
                </div>
              </div>
            </div>
          </div>
          <div className='flex-shrink-1 p-2 text-center' style={{backgroundColor: '#000000'}}>
            <div className='justify-content-center text-center my-5'>
              <Link
                to={{
                  pathname: `/account-reports/vendor/download-stage-wise-report/${state.vendorID}`,
                  state: {
                    vendorID: state.vendorID,
                    projectID: state.projectData.projectID,
                    contactPerson: state.contactPerson,
                  },
                }}
                className='symbol symbol-30px cursor-pointer d-block justify-content-center text-center'
                data-bs-toggle='tooltip'
                data-bs-placement='top'
                data-bs-trigger='hover'
                title='View PDF'
              >
                <img src={toAbsoluteUrl('/media/img/download.png')} alt='' />
              </Link>
            </div>
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className=''>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-6'>
                  {state.selProjectCategoryID !== 1 && <th className='min-w-125px'>Agency Name</th>}
                  <th className='min-w-250px'>Stage Name</th>
                  <th className='min-w-150px text-end'>Stage Wise %</th>
                  <th className='min-w-150px text-end'>Amount</th>
                  <th className='min-w-150px text-end'>Paid Amount</th>
                  <th className='min-w-200px text-end'>Remaining Amount</th>
                  <th className='min-w-150px text-end'>Paid Date</th>
                </tr>
              </thead>

              {/* Table body */}
              <tbody className="border-bottom">
                {state.loading ? (
                  <LoaderInTable loading={state.loading} column={15} />
                ) : (
                  <>
                    {state.stageWiseData.length > 0 ? (
                      state.stageWiseData.map((data, index) => {
                        const txtColor = data.isStageApprove ? 'text-success' : 'text-dark'
                        return (
                          <tr key={index} className={txtColor}>
                            {state.selProjectCategoryID !== 1 && (
                              <td>
                                <span
                                  className={
                                    data.isStageApprove
                                      ? 'text-success text-hover-primary mb-1 fs-6'
                                      : 'text-hover-primary mb-1 fs-6'
                                  }
                                >
                                  {data.agencyTypeName}
                                </span>
                              </td>
                            )}
                            <td>
                              <span
                                className={
                                  data.isStageApprove
                                    ? 'text-success text-hover-primary mb-1 fs-6'
                                    : 'text-hover-primary mb-1 fs-6'
                                }
                              >
                                {data.stageName}
                              </span>
                            </td>
                            <td className='text-end'>
                              <span
                                className={
                                  data.isStageApprove
                                    ? 'text-success text-hover-primary mb-1 fs-6'
                                    : 'text-hover-primary mb-1 fs-6'
                                }
                              >
                                {data.amtPercentage}%
                              </span>
                            </td>
                            <td className='text-end'>
                              <span
                                className={
                                  data.isStageApprove
                                    ? 'text-success text-hover-primary mb-1 fs-6'
                                    : 'text-hover-primary mb-1 fs-6'
                                }
                              >
                                {data.stageWiseAmount}
                              </span>
                            </td>
                            <td className='text-end'>
                              <span
                                className={
                                  data.isStageApprove
                                    ? 'text-success text-hover-primary mb-1 fs-6'
                                    : 'text-hover-primary mb-1 fs-6'
                                }
                              >
                                {data.stageWisePaidAmt}
                              </span>
                            </td>
                            <td className='text-end'>
                              <span
                                className={
                                  data.isStageApprove
                                    ? 'text-success text-hover-primary mb-1 fs-6'
                                    : 'text-hover-primary mb-1 fs-6'
                                }
                              >
                                {data.staeWiseRemAmt}
                              </span>
                            </td>
                            <td className='text-end'>
                              <span
                                className={
                                  data.isStageApprove
                                    ? 'text-success text-hover-primary mb-1 fs-6'
                                    : 'text-hover-primary mb-1 fs-6'
                                }
                              >
                                {data.paidDate ?? 'N.A'}
                              </span>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <BlankDataImageInTable
                        length={state.stageWiseData.length}
                        loading={state.loading}
                        colSpan={9}
                      />
                    )}

                    {/* Total row */}
                    <tr className='text-dark'>
                      <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                        Total
                      </td>
                      {state.selProjectCategoryID !== 1 && (
                        <td className='border-top border-bottom border-dark fw-bolder fs-6 text-end'></td>
                      )}
                      {state.selProjectCategoryID === 1 ? (
                        <td className='border-top border-bottom border-dark fw-bolder fs-6 text-end'>
                          {state.objStageWiseData.amtPercentage}%
                        </td>
                      ) : (
                        <td className='border-top border-bottom border-dark fw-bolder fs-6 text-end'></td>
                      )}
                      <td className='border-top border-bottom border-dark fw-bolder fs-6 text-end'>
                        {state.objStageWiseData.stageWiseAmount}
                      </td>
                      <td className='border-top border-bottom border-dark fw-bolder fs-6 text-end'>
                        {state.objStageWiseData.stageWisePaidAmt}
                      </td>
                      <td className='border-top border-bottom border-dark fw-bolder fs-6 text-end'>
                        {state.objStageWiseData.staeWiseRemAmt}
                      </td>
                      <td className='border-top border-bottom border-dark fw-bolder fs-6 text-end'></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default ViewStageWiseReportView
