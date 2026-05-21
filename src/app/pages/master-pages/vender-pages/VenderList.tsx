import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {IAgencyTypeModel, IVenderModel} from '../../../models/master-page/IVenderModel'
import {
  deleteVenderDetails,
  getAgencyTypeWithVendorTypeID,
  getVenderWebList,
  updateVendorIsactive,
} from '../../../modules/master-page/vender-master-page/VenderCRUD'
import Search from 'antd/es/transfer/search'
import {ModelPopUpAgencyType} from './ModelPopUpAgencyType'
import {VenderCard} from './VenderCard'
type Props = {}

interface IDesignation {
  loading: boolean
  vendorData: IVenderModel[]
  temVendorDataData: IVenderModel[]
  objVendorData: IVenderModel
  objAgencyTypeData: IAgencyTypeModel[]
  SearchText: string
  selVenderID: number
  activeID: number
  activeType: any
  agencyTypeID: number
  vendorTypeID: number
}

const VenderList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IDesignation>({
    loading: false,
    vendorData: [] as IVenderModel[],
    temVendorDataData: [] as IVenderModel[],
    objVendorData: {} as IVenderModel,
    objAgencyTypeData: [] as IAgencyTypeModel[],
    SearchText: '',
    vendorTypeID: 0,
    selVenderID: 0,
    activeID: 0,
    agencyTypeID: 0,
    activeType: false,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.search
      }
      getVenderData(mainSearch)
    }, 100)
  }, [])

  function getVenderData(mainSearch: string) {
    getVenderWebList()
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
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              vendorData: results,
              temVendorDataData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              vendorData: responseData,
              temVendorDataData: responseData,
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
        setState({...state, vendorData: [], loading: false})
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
          getVenderData(state.SearchText)
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

  const [AgencyType, setAgencyType] = useState(false)
  const [showAgencyType, setShowAgencyType] = useState(false)
  const handleCloseAgencyType = () => {
    setShowAgencyType(false)
    setState({...state, loading: false})
  }

  function handleShowAgencyType(objAgency: IVenderModel) {
    setAgencyType(true)
    getAgencyTypeWithVendorTypeID(objAgency.vendorID)
      .then((response) => {
        const resAgencyTypeData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            objAgencyTypeData: resAgencyTypeData,
            objVendorData: objAgency,
            loading: false,
          })
          setAgencyType(false)
        } else {
          setState({
            ...state,
            loading: false,
          })
          toast.error(`${response.data.message}`, {position: 'top-center'})
          setAgencyType(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setAgencyType(false)
        setState({...state, loading: false})
      })
    setShowAgencyType(true)
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (vendorID: number) => {
    setState({
      ...state,
      selVenderID: vendorID,
      loading: false,
    })
    setShow(true)
  }

  function deleteDesigantion(vendorID: number) {
    deleteVenderDetails(vendorID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getVenderData(state.SearchText)
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
  // ========Reset Button==============
  function resetFilter() {
    getVenderData(state.SearchText)
  }
  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.temVendorDataData.filter((user) => {
        return (
          user.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactPerson.toLowerCase().includes(keyword.toLowerCase()) ||
          user.vendorTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactNumber.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, vendorData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, vendorData: state.temVendorDataData})
      // If the text field is empty, show all users
      setTotal(state.temVendorDataData.length)
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
  const currentPosts: IVenderModel[] = state.vendorData.slice(indexOfFirstPage, indexOfLastPage)

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          {/* <div className='mb-3 col-xl-3 col-sm-6'>
            <label className='form-label fw-bold text-white'>Vendor Type :</label>
            <select
              className='form-select form-select-white lineHeightByD'
              onChange={(e) => getProductCategoryIdValue(e)}
            >
              <option selected value={0}>
                Select Vendor Type
              </option>
              {venderTypeData.length > 0 &&
                    venderTypeData.map((data, index) => {
                      return (
                        <option
                          key={index}
                          value={data.vendorTypeID}
                          selected={state.selVenderId == data.vendorTypeID ? true : false}
                        >
                          {data.vendorTypeName}
                        </option>
                      )
                    })}
            </select>
          </div> */}

          <div className='mb-2 col-xl-3 col-sm-6'>
            <label className='form-label fw-bold text-white'>Search :</label>
            <Search placeholder='input search text' onChange={filter} value={name} />
          </div>

          <div className='text-center col-xl-3 col-sm-6 d-flex align-content-around flex-wrap justify-content-center'>
            <button
              className='btn btn-md btn-danger fs-6'
              type='button'
              title='Reset'
              onClick={resetFilter}
            >
              <span className='symbol symbol-20px pe-3'>
                <img src={toAbsoluteUrl('/media/img/reset_white.png')} alt='' />
              </span>
              Reset
            </button>
          </div>
          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link
              to={{pathname: '/vender/add', state: {mainSearch: name}}}
              className='btn btn-sm btn-light-primary bg-white'
              // data-bs-toggle='modal'
              // data-bs-target='#kt_modal_invite_friends'
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
                  <th className='min-w-125px'>Vendor Type</th>
                  <th className='min-w-100px'>Company</th>
                  <th className='min-w-150px'>Contact Person</th>
                  <th className='min-w-100px'>Mobile</th>
                  <th className='min-w-175px text-center'>Change Pwd</th>
                  {/* <th className='min-w-140px'>Payment Structure</th> */}
                  {/* <th className='min-w-125px'>Agency Type</th> */}
                  {/* <th className='min-w-100px'>Agency List</th> */}
                  <th className='min-w-25px'>Active</th>
                  <th className='min-w-25px'>View</th>
                  <th className='min-w-125px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className='border-bottom'>
                {/* =================== Api Data Blank ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <VenderCard
                        data={data}
                        handleShowAgencyType={(e) => handleShowAgencyType(data)}
                        handleShowActive={(e) => handleShowActive(e)}
                        handleShow={() => handleShow(data.vendorID)}
                        name={name}
                      />
                      // <tr key={index}>
                      //   <td>
                      //     <div className='d-flex align-items-center'>
                      //       <div className='d-flex justify-content-start flex-column'>
                      //         <a href='#' className='text-dark text-hover-primary fs-6'>
                      //           {data.vendorTypeName}
                      //         </a>
                      //       </div>
                      //     </div>
                      //   </td>
                      //   <td>
                      //     {data.vendorTypeID === 1 || data.vendorTypeID === 2 ? (
                      //       <div className='d-flex align-items-center'>
                      //         <div className='text-dark text-hover-primary fs-6'>
                      //           {data.companyName}
                      //         </div>
                      //       </div>
                      //     ) : (
                      //       <div className='text-dark text-hover-primary fs-6'>N.A</div>
                      //     )}
                      //   </td>
                      //   <td>
                      //     <div className='d-flex align-items-center'>
                      //       <div className='d-flex justify-content-start flex-column'>
                      //         <a href='#' className='text-dark text-hover-primary fs-6'>
                      //           {data.contactPerson}
                      //         </a>
                      //       </div>
                      //     </div>
                      //   </td>
                      //   <td>
                      //     <div className='d-flex align-items-center'>
                      //       <div className='d-flex justify-content-start flex-column'>
                      //         <a href='#' className='text-dark text-hover-primary fs-6'>
                      //           {data.contactNumber}
                      //         </a>
                      //       </div>
                      //     </div>
                      //   </td>
                      //   {/* <td className='text-center'>
                      //     {data.vendorTypeID === 1 ? (
                      //       <Link
                      //         to={{
                      //           pathname: `/master/vender/pay-str/${data.vendorID}/list`,
                      //           state: {
                      //             custName: data.contactPerson,
                      //             companyName: data.companyName,
                      //           },
                      //         }}
                      //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                      //         data-bs-toggle='tooltip'
                      //         data-bs-placement='top'
                      //         title='View'
                      //       >
                      //         <span className='fa fa-eye fs-2'></span>
                      //       </Link>
                      //     ) : (
                      //       <div className='text-dark text-hover-primary text-center fs-6'>N.A</div>
                      //     )}
                      //   </td> */}

                      //   <td className='text-center'>
                      //     {data.vendorTypeID === 1 ? (
                      //       <div
                      //         onClick={() => handleShowAgencyType(data)}
                      //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/social/soc005.svg'
                      //           className='svg-icon-2x svg-icon-primary'
                      //         />
                      //       </div>
                      //     ) : (
                      //       <div className='text-dark text-hover-primary text-center fs-6'>N.A</div>
                      //     )}
                      //   </td>
                      //   <td className='text-center'>
                      //     {data.vendorTypeID === 1 ? (
                      //       <Link
                      //         to={{
                      //           pathname: `/master/vender/agency-list/${data.vendorID}`,
                      //           state: {
                      //             vendorID: data.vendorID,
                      //             custName: data.contactPerson,
                      //             companyName: data.companyName,
                      //           },
                      //         }}
                      //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'

                      //         title='Agency'
                      //       >
                      //          <KTSVG
                      //           path='/media/icons/duotune/communication/com014.svg'
                      //           className='svg-icon-4 svg-icon-danger'
                      //         />
                      //       </Link>
                      //     ) : (
                      //       <div className='text-dark text-hover-primary text-center fs-6'>N.A</div>
                      //     )}
                      //   </td>
                      //   <td>
                      //     <div className='form-check form-switch'>
                      //       <input
                      //         id={`${data.vendorID}`}
                      //         className='form-check-input'
                      //         type='checkbox'
                      //         checked={data.isActive}
                      //         onChange={(e) => handleShowActive(e)}
                      //       />
                      //     </div>
                      //   </td>
                      //   <td className='text-center'>
                      //     <Link
                      //       to={`/master/vender/view/${data.vendorID}`}
                      //       className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                      //       data-bs-toggle='tooltip'
                      //       data-bs-placement='top'
                      //       title='View Vendor'
                      //     >
                      //       <span className='fa fa-eye fs-2'></span>
                      //     </Link>
                      //   </td>
                      //   <td>
                      //     <div className='d-flex justify-content-end flex-shrink-0'>
                      //       <Link
                      //         to={{
                      //           pathname: `/master/vender/edit/${data.vendorID}/edit`,
                      //           state: {
                      //             vendorID: data.vendorID,
                      //             companyName: data.companyName,
                      //           },
                      //         }}
                      //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/art/art005.svg'
                      //           className='svg-icon-3 svg-icon-primary'
                      //         />
                      //       </Link>
                      //       <div
                      //         onClick={() => handleShow(data.vendorID)}
                      //         className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/general/gen027.svg'
                      //           className='ssvg-icon-3 svg-icon-danger'
                      //         />
                      //       </div>
                      //     </div>
                      //   </td>
                      // </tr>
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
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selVenderID}
        pageName={'Vendor'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteDesigantion(state.selVenderID)}
      />

      {/* /* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Vendor'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />

      {/* ===================Agency Type Model=====================  */}

      <ModelPopUpAgencyType
        show={showAgencyType}
        handleClose={handleCloseAgencyType}
        AgencyTypeData={state.objAgencyTypeData}
        ProductID={state.objVendorData.vendorID}
        productName={state.objVendorData.contactPerson}
      />
    </>
  )
}

export default VenderList
