import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../../../_Ecd/helpers'
import LoaderInTable from '../../../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../../../common-pages/ModelPopUpDelete'

import {IVenderModel} from '../../../../../models/master-page/IVenderModel'
import {IReductionServiceModel} from '../../../../../models/projects-page/IReductionServiceModel'
import {getProjectVendorListAPI} from '../../../../../modules/project-master-page/vendor-Master-page/ProjectVendorCRUD'
import { deleteProjectReductionDataAPI, getAllProjectReductionListAPI } from '../../../../../modules/project-master-page/project-master/DeductionItemServiceCRUD'

type Props = {}

interface IProjectVendor {
  loading: boolean
  reductionItemServiceData: IReductionServiceModel[]
  tmpreductionItemServiceData: IReductionServiceModel[]
  selProjectReductionItemID: number
  activeID: number
  activeType: any
  imageShow: string
  selvendorTypeID: number
  projName: string
  customerName: string
  projectID: number
  selTotalDeductionAmount: number
}

const DeductionItemServiceList: React.FC<Props> = () => {
  const {projectReductionItemID} = useParams<{projectReductionItemID: string}>()
  const location = useLocation()
  const history = useHistory()
  const [state, setState] = useState<IProjectVendor>({
    loading: false,
    reductionItemServiceData: [] as IReductionServiceModel[],
    tmpreductionItemServiceData: [] as IReductionServiceModel[],
    selProjectReductionItemID: 0,
    activeID: 0,
    activeType: false,
    imageShow: '',
    selvendorTypeID: 0,
    projName: '',
    customerName: '',
    projectID: 0,
    selTotalDeductionAmount: 0,
  })

  useEffect(() => {
    setState({...state, loading: false})
    setTimeout(() => {
      let lc: any = location.state
      let projName: any = lc.projName
      let projectID: any = lc.projectID
      let customerName: any = lc.customerName
      getAllReductionItemData(projName, customerName, projectID)
    }, 100)
  }, [])

  function getAllReductionItemData(projName: string, customerName: string, projectID: number) {
    getAllProjectReductionListAPI(projectID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            reductionItemServiceData: responseData,
            tmpreductionItemServiceData: responseData,
            projName: projName,
            customerName: customerName,
            projectID: projectID,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            reductionItemServiceData: [],
            tmpreductionItemServiceData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          reductionItemServiceData: [],
          tmpreductionItemServiceData: [],
          loading: false,
        })
      })
  }

  //==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (projectReductionItemID: number) => {
    setState({
      ...state,
      selProjectReductionItemID: projectReductionItemID,
      loading: false,
    })
    setShow(true)
  }

  // ==================Delete Api ============================
  function deleteDedictionItem(projectReductionItemID: number) {
    deleteProjectReductionDataAPI(projectReductionItemID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllReductionItemData(state.projName, state.customerName, state.projectID)
          setShow(false)
        } else {
          toast.error(`${response.data.massege}`)
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }

  // ====================Pagination==============
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(0) //  length

  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IReductionServiceModel[] = state.reductionItemServiceData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='row card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='text-end mt-3 col-12'>
            <Link
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='Click to add a user'
              to={{
                pathname: `/projects/project/add-ded/deduction/add`,
                state: {
                  projectID: state.projectID,
                  customerName: state.customerName,
                  projName: state.projName,
                },
              }}
              className='btn btn-sm btn-light-primary bg-white'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
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
                    <span className='d-block mb-1'>Reduction Item</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-flex mb-1'>Amount</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-flex mb-1'>Date</span>
                  </th>
                  <th className='min-w-125px text-end'>Edit | Delete</th>
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
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.reductionItemDescription}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.reductionAmount}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.createDate}
                          </span>
                        </td>
                        <td>
                          <div className='d-flex justify-content-end flex-shrink-0'>
                            <Link
                              to={{
                                pathname: `/projects/project/add-ded/deduction/edit/${data.projectReductionlItemID}`,
                                state: {
                                  projectID: state.projectID,
                                  customerName: state.customerName,
                                  projName: state.projName,
                                },
                              }}
                              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                            >
                              <KTSVG
                                path='/media/icons/duotune/art/art005.svg'
                                className='svg-icon-3 svg-icon-primary'
                              />
                            </Link>
                            <div
                              onClick={() => handleShow(data.projectReductionlItemID)}
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
                    )
                  })}
                  {/* <tr className='text-dark'>
                  <td className='text-start fw-bolder fs-6'>Total</td>
                 
                  <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                    {state.selTotalDeductionAmount}
                  </td>
                 
                  <td className='text-start' colSpan={2}></td>
                </tr> */}
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
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selProjectReductionItemID}
        pageName={'Reduction Item'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteDedictionItem(state.selProjectReductionItemID)}
      />
    </>
  )
}

export {DeductionItemServiceList}
