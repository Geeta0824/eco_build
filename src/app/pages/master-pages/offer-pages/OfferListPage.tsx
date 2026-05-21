import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import {Pagination} from 'antd'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {IBranchModelForOfferMap, IOfferModel} from '../../../models/master-page/IOfferModel'
import {
  GetBranchByOfferIDApi,
  deleteOfferDataApi,
  getOfferListApi,
} from '../../../modules/master-page/offer-master-page/OfferCRUD'
import {ModelPopUpBranch} from './ModelPopUpBranch'
import {OfferCard} from './OfferCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'

interface ICountry {
  loading: boolean
  offerData: IOfferModel[]
  tmpOfferData: IOfferModel[]
  selOfferObj: IOfferModel
  branchData: IBranchModelForOfferMap[]
  imageShow: string
  SearchText: string
  selOfferID: number
}

type Props = {}

const OfferListPage: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<ICountry>({
    loading: false,
    offerData: [] as IOfferModel[],
    tmpOfferData: [] as IOfferModel[],
    selOfferObj: {} as IOfferModel,
    branchData: [] as IBranchModelForOfferMap[],
    imageShow: '',
    SearchText: '',
    selOfferID: 0,
  })

  useEffect(() => {
    setState({...state, loading: false})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.search
      }
      getOfferData(mainSearch)
    }, 100)
  }, [])

  // ==================== Get Country API Call===================

  function getOfferData(mainSearch: string) {
    getOfferListApi()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user:any) => {
              return (
                user.offerTitle.toLowerCase().startsWith(mainSearch.toLowerCase()) ||
                user.offerDesc.toLowerCase().startsWith(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({...state, offerData: results, tmpOfferData: responseData, loading: false})
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              offerData: responseData,
              tmpOfferData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, offerData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, offerData: [], loading: false})
      })
  }

  // ====================Delete Model Function============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)

  const handleShow = (offerID: number) => {
    setState({
      ...state,
      selOfferID: offerID,
      loading: false,
    })
    setShow(true)
  }

  const deleteExpenseTypeItem = (offerID: number) => {
    deleteOfferDataApi(offerID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          toast.success('Deleted Successfully')
          getOfferData(state.SearchText)
          setShow(false)
        } else {
          toast.error(`${response.data.message}`)
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }

  const [areaMap, setAreaMap] = useState(false)
  const [showAreaMap, setShowAreaMap] = useState(false)
  const handleCloseArea = () => {
    setShowAreaMap(false)
    // setState({...state, areaMapData: [], loading: false})
  }

  // =====================Branch Api==========================
  function HandleShowBranchData(selOfferObj: IOfferModel) {
    setAreaMap(true)
    GetBranchByOfferIDApi(selOfferObj.offerID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({...state, branchData: responseData, selOfferObj: selOfferObj, loading: false})
          setAreaMap(false)
        } else {
          setState({...state, branchData: responseData, selOfferObj: selOfferObj, loading: false})
          toast.error(`${response.data.message}`)
          setAreaMap(false)
        }
      })
      .catch((error) => {
        setState({...state, branchData: [], selOfferObj: selOfferObj, loading: false})
        setAreaMap(false)
        toast.error(`${error}`)
      })
    setShowAreaMap(true)
  }

  const [name, setName] = useState('')
  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpOfferData.filter((user) => {
        return (
          user.offerTitle.toLowerCase().startsWith(keyword.toLowerCase()) ||
          user.offerDesc.toLowerCase().startsWith(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, offerData: results, loading: false})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, offerData: state.tmpOfferData, loading: false})
      // If the text field is empty, show all users
      setTotal(state.tmpOfferData.length)
      setPage(1)
    }

    setName(keyword)
  }

  // ----------------------pagination---------------------------------------------
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IOfferModel[] = state.offerData.slice(indexOfFirstPage, indexOfLastPage)

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/master/offer/add'}
          title='Click to add a Offer'
        />
        {/* <div className='card-header borde/master/offer/addr-0 py-2 bg-dark'>
          <div className='card-header border-0 pt-4 ps-0' id='kt_chat_contacts_header'>
            <span className='w-100 position-relative'>
              <KTSVG
                path='/media/icons/duotune/general/gen021.svg'
                className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
              />
              <input
                type='text'
                className='form-control form-control-solid px-15 bg-white'
                // name='search'
                placeholder='Search'
                onChange={filter}
                value={name}
              />
            </span>
          </div>

          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link
              to='/master/offer/add'
              className='btn btn-sm btn-light-primary bg-white'
              // data-bs-toggle='modal'
              // data-bs-target='#kt_modal_invite_friends'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div>
        </div> */}
        {/* end::Header */}
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-secondary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>Title</th>
                  <th className='min-w-40px'>Description</th>
                  <th className='min-w-40px'>IsPrice Effect</th>
                  <th className='min-w-40px'>Percentage</th>
                  <th className='min-w-40px text-center'>Branch</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
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
                      <OfferCard
                        data={data}
                        HandleShowBranchData={() => HandleShowBranchData(data)}
                        handleShow={() => handleShow(data.offerID)}
                        name={name}
                      />
                      // <tr key={index}>
                      //   <td className='text-dark text-hover-primary fs-6'>{data.offerTitle}</td>
                      //   <td className='text-dark text-hover-primary fs-6'>{data.offerDesc}</td>
                      //   {data.isPriceEffect === true ? (
                      //     <td className='text-dark text-hover-primary fs-6'>Yes</td>
                      //   ) : (
                      //     <td className='text-dark text-hover-primary fs-6'>No</td>
                      //   )}
                      //   {data.isPriceEffect === true ? (
                      //     <td className='text-dark text-hover-primary fs-6'>
                      //       {data.offerPercentage}%
                      //     </td>
                      //   ) : (
                      //     <td className='text-dark text-hover-primary fs-6'>N.A</td>
                      //   )}
                      //   <td className='text-center'>
                      //     <div
                      //       onClick={() => HandleShowBranchData(data)}
                      //       className='btn btn-icon btn-bg-light bg-hover-success text-hover-inverse-success btn-sm me-1'
                      //     >
                      //       <KTSVG
                      //         path='/media/icons/duotune/general/gen018.svg'
                      //         className='svg-icon-2x svg-icon-success'
                      //       />
                      //       {/* <span className='fa fa-map'></span> */}
                      //     </div>
                      //   </td>
                      //   <td>
                      //     <div className='d-flex justify-content-end flex-shrink-0'>
                      //       <Link
                      //         to={`/master/offer/edit/${data.offerID}`}
                      //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/art/art005.svg'
                      //           className='svg-icon-3 svg-icon-primary'
                      //         />
                      //       </Link>
                      //       <div
                      //         onClick={() => handleShow(data.offerID)}
                      //         className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/general/gen027.svg'
                      //           className='svg-icon-3 svg-icon-danger'
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
                  colSpan={15}
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
        id={state.selOfferID}
        pageName={'Offer'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteExpenseTypeItem(state.selOfferID)}
      />
      <ModelPopUpBranch
        show={showAreaMap}
        handleClose={handleCloseArea}
        branchData={state.branchData}
        offerID={state.selOfferObj.offerID}
        offerTitle={state.selOfferObj.offerTitle}
      />
    </>
  )
}

export default OfferListPage
