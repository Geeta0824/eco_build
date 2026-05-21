import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../_Ecd/helpers'
import LoaderInTable from '../common-pages/LoaderInTable'
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable'
import {ModelPopUpIsActive} from '../common-pages/ModelPopUpIsActive'
import {ModelPopUpDelete} from '../common-pages/ModelPopUpDelete'
import {
  deleteVenderDetails,
  getAgencyTypeWithVendorTypeID,
  getVenderWebList,
  updateVendorIsactive,
} from '../../modules/master-page/vender-master-page/VenderCRUD'
import Search from 'antd/es/transfer/search'
import {ModelPopUpProdCategoryMap} from '../product-pages/agency-type-pages/ModelPopUpProdCategoryMap'

import {GetProductCategoryWithAgencyTypeIDApi} from '../../modules/product-master-page/agency-type-master-page/AgencyTypeCRUD'
import {IRegistrationModel} from '../../models/registration-page/IRegistrationModel'
import {IAgencyTypeModel} from '../../models/product-page/IAgencyTypeModel'
import { getAllNewVendorRegistationListApi } from '../../modules/registration-master-page/RegistrationCRUD'
type Props = {}

interface IDesignation {
  loading: boolean
  vendorRegistrationData: IRegistrationModel[]
  temVendorRegistrationData: IRegistrationModel[]
  objVendorRegistrationData: IRegistrationModel
  SearchText: string
  mainSearch: string
  selVenderID: number
  activeID: number
  activeType: any
  agencyTypeID: number
  vendorTypeID: number
}

const RegistrationListPage: React.FC<Props> = () => {
  const location=useLocation( )
  const [state, setState] = useState<IDesignation>({
    loading: false,
    vendorRegistrationData: [] as IRegistrationModel[],
    temVendorRegistrationData: [] as IRegistrationModel[],
    objVendorRegistrationData: {} as IRegistrationModel,
    SearchText: '',
    mainSearch: '',
    vendorTypeID: 0,
    selVenderID: 0,
    activeID: 0,
    agencyTypeID: 0,
    activeType: false,
  })

  useEffect(() => {
    setState({...state, loading: false})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc !== undefined) {
        mainSearch = lc.search
      }
      getVenderRegistationData(mainSearch)
    }, 100)
  }, [])

  function getVenderRegistationData(mainSearch:string) {
    getAllNewVendorRegistationListApi()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.companyName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.contactPerson.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.vendorTypeName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.contactNumber.toLowerCase().includes(mainSearch.toLowerCase())
              )
            })

            setState({
              ...state,
              vendorRegistrationData: results,
              temVendorRegistrationData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              vendorRegistrationData: responseData,
              temVendorRegistrationData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        setState({...state, vendorRegistrationData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  // =================Is Active Function Model Call==============

  const [showActive, setShowActive] = useState(false)
  const handleCloseActive = () => setShowActive(false)

  function handleShowActive(event: any) {
    const Cid = event.target.id
    const tmpIsActive = event.target.checked
    setState({
      ...state,
      activeID: Cid,
      activeType: tmpIsActive,
      loading: false,
    })
    setShowActive(true)
  }

  function checkedFunction(temEmpId: number, temIsAct: boolean) {
    updateVendorIsactive(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess == true) {
          getVenderRegistationData(state.mainSearch)
          setShowActive(false)
        } else {
          toast.error(`${response.data.massege}`)
          setShowActive(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowActive(false)
      })
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.temVendorRegistrationData.filter((user) => {
        return (
          user.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactPerson.toLowerCase().includes(keyword.toLowerCase()) ||
          user.vendorTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactNumber.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, vendorRegistrationData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, vendorRegistrationData: state.temVendorRegistrationData})
      // If the text field is empty, show all users
      setTotal(state.temVendorRegistrationData.length)
      setPage(1)
    }

    setName(keyword)
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
  const currentPosts: IRegistrationModel[] = state.vendorRegistrationData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          
          <div className='mb-2 col-xl-3 col-sm-6'>
            <label className='form-label fw-bold text-white'>Search :</label>
            <Search placeholder='input search text' onChange={filter} value={name} />
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
                  <th className='min-w-150px'>Vendor Type Name</th>
                  <th className='min-w-150px'>Company Name</th>
                  <th className='min-w-150px'>Contact Person</th>
                  <th className='min-w-150px'>Contact Number</th>
                  <th className='min-w-140px'>View</th>
                  <th className='min-w-40px'>Active</th>
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
                            <div className='d-flex justify-content-start flex-column'>
                              <a href='#' className='text-dark text-hover-primary fs-6'>
                                {data.vendorTypeName}
                              </a>
                            </div>
                          </div>
                        </td>
                        <td>
                          {/* {data.vendorTypeID === 1 || data.vendorTypeID === 2 ? ( */}
                          <div className='d-flex align-items-center'>
                            <div className='text-dark text-hover-primary fs-6'>
                              {data.companyName}
                            </div>
                          </div>
                          {/* //   ) : (
                        //     <div className='text-dark text-hover-primary fs-6'>N.A</div>
                        //   )} */}
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <a href='#' className='text-dark text-hover-primary fs-6'>
                                {data.contactPerson}
                              </a>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <a href='#' className='text-dark text-hover-primary fs-6'>
                                {data.contactNumber}
                              </a>
                            </div>
                          </div>
                        </td>
                        <td className='text-center'>
                          <Link
                            to={{pathname:`/registration/vendor-reg-req/view/${data.vendorID}`,state:{mainSearch:name}}}
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='View Vendor'
                          >
                            <span className='fa fa-eye fs-2'></span>
                          </Link>
                        </td>
                        <td>
                          <div className='form-check form-switch'>
                            <input
                              id={`${data.vendorID}`}
                              className='form-check-input'
                              type='checkbox'
                              checked={data.isActive}
                              onChange={(e) => handleShowActive(e)}
                            />
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
      {/* /* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Vendor'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
    </>
  )
}

export default RegistrationListPage
