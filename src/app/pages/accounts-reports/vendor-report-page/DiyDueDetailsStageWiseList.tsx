import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {
  getCarpetryDIYDueAmountBreakupListApi,
  getDIYDueAmountOtherWorkBreakupListListApi,
} from '../../../modules/accounts-reports/vendor-report-master/VendortReportCRUD'
import {
  IOtherWorkReportModel,
  IPaymentDiyDueReportModel,
  IVendorReportModel,
} from '../../../models/accounts-reports/IVendorReportModel'

type Props = {}

interface IDesignation {
  loading: boolean
  paymentDiyDueData: IPaymentDiyDueReportModel[]
  otherVenWorkOdrDueData: IOtherWorkReportModel[]
  SearchText: string
  projectData: IVendorReportModel
  vendorID: number
  projectID: number
  companyName: string
  contactPerson: string
  vendorCost: number
  paidAmount: number
  remainingAmount: number
  startDate: string
  endDate: string
  totalTotalAmount: number
  totalPaidAmount: number
  totalDueAmount: number
  totalAmountPer: number
  totalOtherTotalAmount: number
  totalOtherPaidAmount: number
  totalOtherDueAmount: number
  selVendorTypeID: number
}

const DiyDueDetailsStageWiseList: React.FC<Props> = () => {
  const [modalLoader, setModalLoader] = useState(false)
  const location = useLocation()
  const [state, setState] = useState<IDesignation>({
    loading: false,
    paymentDiyDueData: [] as IPaymentDiyDueReportModel[],
    otherVenWorkOdrDueData: [] as IOtherWorkReportModel[],
    SearchText: '',
    projectData: {} as IVendorReportModel,
    vendorID: 0,
    projectID: 0,
    companyName: '',
    contactPerson: '',
    vendorCost: 0,
    paidAmount: 0,
    remainingAmount: 0,
    startDate: '',
    endDate: '',
    totalTotalAmount: 0,
    totalPaidAmount: 0,
    totalDueAmount: 0,
    totalAmountPer: 0,
    totalOtherTotalAmount: 0,
    totalOtherPaidAmount: 0,
    totalOtherDueAmount: 0,
    selVendorTypeID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    let lc: any = location.state
    let projectData = lc.projectData
    let vendorID = lc.vendorID
    let vendorTypeID = lc.vendorTypeID
    let companyName = lc.companyName
    let contactPerson = lc.contactPerson
    let vendorCost = lc.vendorCost
    let paidAmount = lc.paidAmount
    let remainingAmount = lc.remainingAmount
    setTimeout(() => {
      getStageWiseData(
        projectData,
        vendorID,
        vendorTypeID,
        companyName,
        contactPerson,
        vendorCost,
        paidAmount,
        remainingAmount
      )
    }, 100)
  }, [])

  function getStageWiseData(
    projectData: IVendorReportModel,
    vendorID: number,
    vendorTypeID: number,
    companyName: string,
    contactPerson: string,
    vendorCost: number,
    paidAmount: number,
    remainingAmount: number
  ) {
    getCarpetryDIYDueAmountBreakupListApi(projectData.projectID, vendorID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          let totalAmt: any = 0
          let paidTtlAmt: any = 0
          let dueTtlAmt: any = 0
          let ttlAmtPer: any = 0
          for (let key in responseData) {
            totalAmt = parseInt(totalAmt) + parseInt(responseData[key].stageWiseAmount)
            paidTtlAmt = parseInt(paidTtlAmt) + parseInt(responseData[key].stageWisePaidAmt)
            dueTtlAmt = parseInt(dueTtlAmt) + parseInt(responseData[key].staeWiseRemAmt)
            ttlAmtPer = parseInt(ttlAmtPer) + parseInt(responseData[key].amtPercentage)
          }
          setState({
            ...state,
            paymentDiyDueData: responseData,
            companyName: companyName,
            contactPerson: contactPerson,
            projectData: projectData,
            projectID: projectData.projectID,
            vendorCost: vendorCost,
            paidAmount: paidAmount,
            remainingAmount: remainingAmount,
            vendorID: vendorID,
            selVendorTypeID: vendorTypeID,
            totalTotalAmount: totalAmt,
            totalPaidAmount: paidTtlAmt,
            totalDueAmount: dueTtlAmt,
            totalAmountPer: ttlAmtPer,
          })
          setModalLoader(false)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, paymentDiyDueData: []})
          setModalLoader(false)
        }
      })
      .catch((error) => {
        setState({...state, paymentDiyDueData: []})
        setModalLoader(false)
        toast.error(`${error}`)
      })
  }

  function getTmpStageWiseData() {
    getCarpetryDIYDueAmountBreakupListApi(state.projectID, state.vendorID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            paymentDiyDueData: responseData,
            loading: false,
          })
          setModalLoader(false)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, paymentDiyDueData: []})
          setModalLoader(false)
        }
      })
      .catch((error) => {
        setState({...state, paymentDiyDueData: []})
        setModalLoader(false)
        toast.error(`${error}`)
      })
  }

  function getOtherWorkWiseData() {
    getDIYDueAmountOtherWorkBreakupListListApi(state.projectID, state.vendorID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          let totalAmt: any = 0
          let paidTtlAmt: any = 0
          let dueTtlAmt: any = 0
          for (let key in responseData) {
            totalAmt = parseInt(totalAmt) + parseInt(responseData[key].vendorCost)
            paidTtlAmt = parseInt(paidTtlAmt) + parseInt(responseData[key].paidAmount)
            dueTtlAmt = parseInt(dueTtlAmt) + parseInt(responseData[key].remainingAmount)
          }

          setState({
            ...state,
            otherVenWorkOdrDueData: responseData,
            totalOtherTotalAmount: totalAmt,
            totalOtherPaidAmount: paidTtlAmt,
            totalOtherDueAmount: dueTtlAmt,
          })
          setModalLoader(false)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, otherVenWorkOdrDueData: []})
          setModalLoader(false)
        }
      })
      .catch((error) => {
        setState({...state, otherVenWorkOdrDueData: []})
        setModalLoader(false)
        toast.error(`${error}`)
      })
  }

  // ================== Comman for tabbing======================
  const [tab, setTab] = useState(0)
  function handleChangeTab(type: number) {
    state.paymentDiyDueData = []
    state.otherVenWorkOdrDueData = []
    setModalLoader(true)
    if (type == 0) {
      getTmpStageWiseData()
    } else if (type == 1) {
      getOtherWorkWiseData()
    }
    setTab(type)
  }

  return (
    <>
      <div className='text-end'>
        <Link
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          to={{
            pathname:
              location.pathname == '/account-reports/vendor/diy-amount-due-details'
                ? '/account-reports/vendor/list'
                : '/account-reports/other-vendor/list',
            state: {vendorID: state.vendorID, vendorTypeID: state.selVendorTypeID},
          }}
        >
          Back To List
        </Link>
      </div>
      <div className={`card mb-2`}>
        {/* begin::Header */}
        <div className='d-flex' style={{backgroundColor: '#000000'}}>
          <div className='card-header border-0 py-2 row gx-xl-8 gx-sm-5 p-3'>
            {/* <div className='d-block '> */}
            <div className='d-flex'>
              <div className='col-lg-4 text-white cursor-pointer fs-6 d-flex'>
                Vendor Name : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.companyName}
                </div>
              </div>
              <div className='col-lg-4 text-white cursor-pointer fs-6 d-flex'>
                Contact Person : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.contactPerson}
                </div>
              </div>
              <div className='col-lg-4 text-white cursor-pointer fs-6 d-flex'>
                Customer Name : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.projectData.customerName}
                </div>
              </div>
            </div>
            <div className='d-flex'>
              <div className='col-lg-4 text-white cursor-pointer fs-6 d-flex'>
                Project Name : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.projectData.projectName}
                </div>
              </div>
              <div className='col-lg-4 text-white cursor-pointer fs-6 d-flex'>
                Project Category : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.projectData.projectCategoryName}
                </div>
              </div>
              <div className='col-lg-4 text-white cursor-pointer fs-6 d-flex'>
                Total Due Amount: &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.projectData.dueAmount}
                </div>
              </div>
            </div>
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
        </div>
        {/* end::Header */}
        <div className='card mb-2 border'>
          <div className='ms-5 pt-2 pb-1'>
            <div className='d-flex overflow-auto h-55px'>
              <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
                <li className='nav-item'>
                  <div
                    className={
                      `nav-link text-active-primary me-6 cursor-pointer ` +
                      (tab == 0 ? 'active' : '')
                    }
                    onClick={() => handleChangeTab(0)}
                  >
                    Agency Work
                  </div>
                </li>
                <li className='nav-item'>
                  <div
                    className={
                      `nav-link text-active-primary me-6 cursor-pointer ` +
                      (tab == 1 ? 'active' : '')
                    }
                    onClick={() => handleChangeTab(1)}
                  >
                    Other Work
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* begin::Body */}
        {tab == 0 ? (
          <div className='mt-1'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table table-bordered align-middle g-2'>
                {/* begin::Table head */}
                <thead style={{backgroundColor: '#9FA6B2'}}>
                  <tr className='fw-bolder fs-6'>
                    <th className='min-w-150px text-start'>Request Date</th>
                    <th className='min-w-150px text-start'>Agency Type Name</th>
                    <th className='min-w-200px text-start'>Stage Name</th>
                    <th className='min-w-100px text-start'>Stage Wise%</th>
                    <th className='min-w-100px text-start'>Amount</th>
                    <th className='min-w-100px text-start'>Paid Amount</th>
                    <th className='min-w-100px text-start'>Due Amount</th>
                    <th className='min-w-150px text-start'>Supervisor Name</th>
                    <th className='min-w-150px text-start'>Approve By</th>
                    <th className='min-w-150px text-start'>Approve Date</th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {/* =================== Api Data Blank ============== */}
                  {modalLoader ? (
                    <LoaderInTable loading={modalLoader} column={15} />
                  ) : (
                    <>
                      {state.paymentDiyDueData.length > 0 &&
                        state.paymentDiyDueData.map((data, index) => {
                          return (
                            <tr key={index}>
                              <td className='text-start'>
                                <span className='text-dark text-hover-primary mb-1 fs-6'>
                                  {data.stageCompleteDate}
                                </span>
                              </td>
                              <td className='text-start'>
                                <span className='text-dark text-hover-primary mb-1 fs-6'>
                                  {data.agencyTypeName}
                                </span>
                              </td>
                              <td className='text-start'>
                                <span className='text-dark text-hover-primary mb-1 fs-6'>
                                  {data.stageName}
                                </span>
                              </td>
                              <td className='text-start'>
                                <span className='text-dark text-hover-primary mb-1 fs-6'>
                                  {data.amtPercentage}%
                                </span>
                              </td>

                              <td className='text-start'>
                                <span className='text-info text-hover-primary mb-1 fs-6'>
                                  {data.stageWiseAmount}
                                </span>
                              </td>
                              <td className='text-start'>
                                <span className='text-success text-hover-primary mb-1 fs-6'>
                                  {data.stageWisePaidAmt}
                                </span>
                              </td>

                              <td className='text-start'>
                                <span className='text-danger text-hover-primary mb-1 fs-6'>
                                  {data.staeWiseRemAmt}
                                </span>
                              </td>
                              <td className='text-start'>
                                <span className='text-dark text-hover-primary mb-1 fs-6'>
                                  {data.supervisorName}
                                </span>
                              </td>
                              <td className='text-start'>
                                <span className='text-dark text-hover-primary mb-1 fs-6'>
                                  {data.approveByName}
                                </span>
                              </td>
                              <td className='text-start'>
                                <span className='text-dark text-hover-primary mb-1 fs-6'>
                                  {data.approveStagechangeDate === null
                                    ? 'N.A'
                                    : data.approveStagechangeDate}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      <tr className='text-dark'>
                        <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                          Total
                        </td>
                        <td className='text-start'></td>
                        <td className='text-start'></td>
                        <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                          {state.totalAmountPer}%
                        </td>
                        <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                          {state.totalTotalAmount}
                        </td>
                        <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                          {state.totalPaidAmount}
                        </td>
                        <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                          {state.totalDueAmount}
                        </td>
                        <td className='text-start' colSpan={5}></td>
                      </tr>
                    </>
                  )}
                  {/* =================== Loading get Api Data ============== */}
                  <BlankDataImageInTable
                    length={state.paymentDiyDueData.length}
                    loading={state.loading}
                    colSpan={9}
                  />
                </tbody>
              </table>
            </div>
          </div>
        ) : tab == 1 ? (
          <div className=''>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table table-bordered align-middle g-2'>
                {/* begin::Table head */}
                <thead style={{backgroundColor: '#9FA6B2'}}>
                  <tr className='fw-bolder fs-6'>
                    <th className='min-w-150px text-start'>Complete Date</th>
                    <th className='min-w-200px text-start'>Work Name</th>
                    <th className='min-w-100px text-start'>Work Amount</th>
                    <th className='min-w-100px text-start'>Paid Amount</th>
                    <th className='min-w-100px text-start'>Due Amount</th>
                    <th className='min-w-150px text-start'>Supervisor Name</th>
                    <th className='min-w-150px text-start'>Approve By</th>
                    <th className='min-w-150px text-start'>Approve Date</th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {/* =================== Api Data Blank ============== */}
                  {modalLoader ? (
                    <LoaderInTable loading={modalLoader} column={15} />
                  ) : (
                    <>
                      {state.otherVenWorkOdrDueData.length > 0 &&
                        state.otherVenWorkOdrDueData.map((data, index) => {
                          return (
                            <tr key={index}>
                              <td className='text-start'>
                                <span className='text-dark text-hover-primary mb-1 fs-6'>
                                  {data.stageCompleteDate}
                                </span>
                              </td>
                              <td className='text-start'>
                                <span className='text-dark text-hover-primary mb-1 fs-6'>
                                  {data.remarks}
                                </span>
                              </td>
                              <td className='text-start'>
                                <span className='text-info text-hover-primary mb-1 fs-6'>
                                  {data.vendorCost}
                                </span>
                              </td>
                              <td className='text-start'>
                                <span className='text-success text-hover-primary mb-1 fs-6'>
                                  {data.paidAmount}
                                </span>
                              </td>

                              <td className='text-start'>
                                <span className='text-danger text-hover-primary mb-1 fs-6'>
                                  {data.remainingAmount}
                                </span>
                              </td>
                              <td className='text-start'>
                                <span className='text-dark text-hover-primary mb-1 fs-6'>
                                  {data.supervisorName}
                                </span>
                              </td>
                              <td className='text-start'>
                                <span className='text-dark text-hover-primary mb-1 fs-6'>
                                  {data.approveByName}
                                </span>
                              </td>
                              <td className='text-start'>
                                <span className='text-dark text-hover-primary mb-1 fs-6'>
                                  {data.approveStageChangeDate === null
                                    ? 'N.A'
                                    : data.approveStageChangeDate}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      <tr className='text-dark'>
                        <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                          Total
                        </td>
                        <td className='text-start'></td>
                        <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                          {state.totalOtherTotalAmount}
                        </td>
                        <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                          {state.totalOtherPaidAmount}
                        </td>
                        <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                          {state.totalOtherDueAmount}
                        </td>
                        <td className='text-start' colSpan={5}></td>
                      </tr>
                    </>
                  )}
                  {/* =================== Loading get Api Data ============== */}
                  <BlankDataImageInTable
                    length={state.otherVenWorkOdrDueData.length}
                    loading={state.loading}
                    colSpan={9}
                  />
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}

export default DiyDueDetailsStageWiseList
