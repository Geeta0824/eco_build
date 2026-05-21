import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import LoaderInTable from '../common-pages/LoaderInTable'
import {ModelPopUpDelete} from '../common-pages/ModelPopUpDelete'
import {I3dImagesModel} from '../../models/projects-page/I3dImagesModel'
import {Button, Modal} from 'react-bootstrap-v5'
import {
  deleteProjectProject3dImageByID,
  getProjectProject3dImageList,
} from '../../modules/project-master-page/project-master/_3d-photos-master-pages/_3DPhotosCRUD'
import {
  ICustomerComplainModel,
  IViewCustomerComplainDetailsModel,
} from '../../models/Customer-Complain/ICustomerComplainModel'
import {
  ViewCustomerComplainStatusPMCAPI,
  getCustomerComplainByPMCApi,
} from '../../modules/customer-complain-master-page/CustomerComplainCRUD'
import {toast} from 'react-toastify'
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable'
import {KTSVG} from '../../../_Ecd/helpers'

type Props = {}

interface I3dImage {
  viewComplainData: IViewCustomerComplainDetailsModel[]
  loading: boolean
  imageShow: string
  customerName: string
  projectName: string
  mainSearch: string
  selCusComMainID: number
}

const ViewCustomerComplain: React.FC<Props> = () => {
  const location = useLocation()
  const [loading, setLoading] = useState<boolean>(false)
  const history = useHistory()
  const [state, setState] = useState<I3dImage>({
    viewComplainData: [] as IViewCustomerComplainDetailsModel[],
    loading: false,
    imageShow: '',
    customerName: '',
    projectName: '',
    mainSearch: '',
    selCusComMainID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let customerName: any = lc.customerName
      let projectName: any = lc.projectName
      let customerComplainMainID: any = lc.customerComplainMainID

      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      getAllProject3dImageData(customerName, projectName, customerComplainMainID, mainSearch)
    }, 100)
  }, [])

  function getAllProject3dImageData(
    customerName: string,
    projectName: string,
    customerComplainMainID: number,
    mainSearch: string
  ) {
    ViewCustomerComplainStatusPMCAPI(customerComplainMainID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            viewComplainData: responseData,
            customerName: customerName,
            projectName: projectName,
            selCusComMainID: customerComplainMainID,
            mainSearch,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, viewComplainData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, viewComplainData: [], loading: false})
      })
  }

  // ====================Pagination==============
  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IViewCustomerComplainDetailsModel[] = state.viewComplainData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  const complainClose = (customerComplainCloseID: number) => {
    getCustomerComplainByPMCApi(customerComplainCloseID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Complain Close Successfull')
          setLoading(false)
        } else {
          toast.error(`${response.data.message}`)
          setLoading(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setLoading(false)
      })
  }
  return (
    <>
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-7 mb-2 btn btn-rounded'
          title='Complain List'
          onClick={() =>
            history.push({pathname: `/cust-complaint/list`, state: {search: state.mainSearch}})
          }
        >
          Back To List
        </span>
      </div>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='col-8 text-start'>
            <label className='text-white fs-5 mt-1 fw-bold '>Project Name : &nbsp;</label>
            <span className='text-primary fw-bold  fs-5 '>{state.projectName}</span>
          </div>
          <div className='col-8 text-start'>
            <label className='text-white fs-5 mt-1 fw-bold '>Customer Name : &nbsp;</label>
            <span className='text-primary fw-bold  fs-5 '>{state.customerName}</span>
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>
                    <span className='d-flex'>Assign Date</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-flex'>Vendor Name</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-flex'>Agency Name</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-flex'>Shedule Date</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-flex'>Done By Agency Date</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-flex'>Customer Approve Date</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-flex'>Complaint Close</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-flex'>Complaint Close Date</span>
                  </th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Api Data Blank ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <div className='d-flex align-items-center'>
                            {/* <div className='d-flex justify-content-center flex-column'> */}
                            {data.statusID > 1 ? (
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.assingDate}
                              </span>
                            ) : (
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                N.A
                              </span>
                            )}
                          </div>
                          {/* </div> */}
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            {/* <div className='d-flex justify-content-start flex-column'> */}
                            <span className='text-dark text-hover-primary fs-6'>
                              {data.vendorName}
                            </span>
                            {/* </div> */}
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            {data.statusID > 1 ? (
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.agencyName}
                              </span>
                            ) : (
                              <span className='text-dark text-hover-primary fs-6'>N.A</span>
                            )}
                          </div>
                        </td>
                        <td className=''>
                          <div className='d-flex align-items-center'>
                            {data.statusID > 2 ? (
                              <span className='text-dark text-hover-primary fs-6 text-end'>
                                {data.scheduleDate}
                              </span>
                            ) : (
                              <span className='text-dark text-hover-primary fs-6 text-end'>
                                N.A
                              </span>
                            )}
                          </div>
                        </td>
                        <td className=''>
                          <div className='d-flex align-items-center'>
                            {data.statusID > 4 ? (
                              <span className='text-dark text-hover-primary fs-6 text-end'>
                                {data.doneByAgencyDate}
                              </span>
                            ) : (
                              <span className='text-dark text-hover-primary fs-6 text-end'>
                                N.A
                              </span>
                            )}
                          </div>
                        </td>
                        <td className=''>
                          <div className='d-flex align-items-center'>
                            {data.statusID > 5 ? (
                              <span className='text-dark text-hover-primary fs-6 text-end'>
                                {data.approveByCustomerDate}
                              </span>
                            ) : (
                              <span className='text-dark text-hover-primary fs-6 text-end'>
                                N.A
                              </span>
                            )}
                          </div>
                        </td>
                        <td className=''>
                          <div className='d-flex align-items-center'>
                            {data.statusID === 5 || data.statusID === 6 ? (
                              <span
                                className='text-dark text-hover-primary fs-6 text-end badge badge-light '
                                onClick={() => complainClose(data.customerComplainMainID)}
                              >
                                <KTSVG
                                  path='/media/icons/duotune/general/gen024.svg'
                                  className='svg-icon-4 svg-icon-primary'
                                />
                              </span>
                            ) : (
                              <span className='text-dark text-hover-primary fs-6 text-end'>
                                N.A
                              </span>
                            )}
                          </div>
                        </td>
                        <td className=''>
                          <div className='d-flex align-items-center'>
                            {data.statusID > 6 ? (
                              <span className='text-dark text-hover-primary fs-6 text-end'>
                                {data.closeDate}
                              </span>
                            ) : (
                              <span className='text-dark text-hover-primary fs-6 text-end'>
                                N.A
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                {/* =================== Loading get Api Data ============== */}
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={9}
                />
              </tbody>
            </table>
          </div>
          <div className='text-center'>
            <Pagination
              onChange={(value: any) => setPage(value)}
              pageSize={postPerPage}
              total={total}
              current={page}
              showSizeChanger
              showQuickJumper
              onShowSizeChange={onShowSizeChange}
              showTotal={(total) => `Total ${total} items`}
            ></Pagination>
          </div>
        </div>
      </div>
    </>
  )
}

export {ViewCustomerComplain}
