import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import LoaderInTable from '../common-pages/LoaderInTable'
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../common-pages/ModelPopUpDelete'
import Header_Search_Add from '../../../components/table-header/Header_Search_Add'
import {ModelPopUpBHKMapWithQuoLevel} from './ModelPopUpBHKMapWithQuoLevel'
import {NewReadymadePackageCard} from './NewReadymadePackageCard'
import {
  IBhkMapModel,
  INewReadymadePkgModel,
  IProductMapModel,
} from '../../models/new-readymade-pkg/INewReadymadePkgModel'
import {
  deleteReadymadePackageType,
  getbhkListWithNewReadymadePkgTypeIDApi,
  getProductListWithNewReadymadePkgTypeIDApi,
  GetReadymadePackageTypeApi,
  isActive,
} from '../../modules/new-readymade-pkg-mst-page/NewReadymadePackageCRUD'
import {ModelPopUpIsActive} from '../common-pages/ModelPopUpIsActive'
import {ModelPopUpProductMapWithQuoLevel} from './ModelPopUpProductMapWithQuoLevel'

type Props = {}

interface INewReadymadePkg {
  loading: boolean
  newReadymadePkgData: INewReadymadePkgModel[]
  tmpNewReadymadePkgData: INewReadymadePkgModel[]
  bhkWithRdyMadePkgMapData: IBhkMapModel[]
  productWithRdyMadePkgMapData: IProductMapModel[]
  objReadymadePkgData: INewReadymadePkgModel
  searchText: string
  sequenceNo: number
  selReadymadeTypeID: number
  stageName: string
  amtPercentage: number
  NewReadymadePkgID: number
  activeID: any
  activeType: any
}

const NewReadymadePackageList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<INewReadymadePkg>({
    loading: false,
    newReadymadePkgData: [] as INewReadymadePkgModel[],
    tmpNewReadymadePkgData: [] as INewReadymadePkgModel[],
    bhkWithRdyMadePkgMapData: [] as IBhkMapModel[],
    productWithRdyMadePkgMapData: [] as IProductMapModel[],
    objReadymadePkgData: {} as INewReadymadePkgModel,
    searchText: '',
    sequenceNo: 0,
    selReadymadeTypeID: 0,
    stageName: '',
    amtPercentage: 0,
    NewReadymadePkgID: 0,
    activeID: 0,
    activeType: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.search
      }
      getNewReadymadePkgTypeData()
    }, 100)
  }, [])

  // ===============GET API CALL=============

  function getNewReadymadePkgTypeData() {
    GetReadymadePackageTypeApi()
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        let responseData = resp.responseObject
        if (resp.isSuccess == true) {
          setState({
            ...state,
            newReadymadePkgData: responseData,
            tmpNewReadymadePkgData: responseData,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.massege}`)
          setState({...state, newReadymadePkgData: [], loading: true})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, newReadymadePkgData: [], loading: false})
      })
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (readymadeTypeID: number) => {
    setState({
      ...state,
      selReadymadeTypeID: readymadeTypeID,
      loading: false,
    })
    setShow(true)
  }

  function deleteItem(temBHKId: number) {
    let value = {readymadeTypeid: temBHKId}
    var temBHKID = btoa(JSON.stringify(value))
    // console.log(temBHKID)
    deleteReadymadePackageType(`${temBHKID}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          toast.success('Deleted Successfully')
          getNewReadymadePkgTypeData()
          setShow(false)
        } else {
          toast.error(`${resp.message}`)
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }
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
    let value = {readymadeTypeid: temEmpId, isActive: temIsAct}
    var objBHK = btoa(JSON.stringify(value))
    isActive(`${objBHK}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          getNewReadymadePkgTypeData()
          setShowActive(false)
        } else {
          toast.error(`${resp.message}`)
          setShowActive(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowActive(false)
      })
  }
  //====================bhk=========================

  const [empMap, setBhkMap] = useState(false)
  const [showBhkMap, setShowBhkMap] = useState(false)
  const handleCloseBhk = () => {
    setShowBhkMap(false)
    setState({...state, loading: false,   bhkWithRdyMadePkgMapData:[] ,
      objReadymadePkgData:  {} as  INewReadymadePkgModel,})
  }
  function handleShowBhkMap(objReadymadePkgMdl: INewReadymadePkgModel) {
    setBhkMap(true)
    getbhkListWithNewReadymadePkgTypeIDApi(objReadymadePkgMdl.readymadeTypeID)
      .then((response) => {
        const BhkWithQuoLevelMapData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            bhkWithRdyMadePkgMapData: BhkWithQuoLevelMapData,
            objReadymadePkgData: objReadymadePkgMdl,
            loading: false,
          })
          setBhkMap(false)
        } else {
          setState({
            ...state,
            loading: false,
          })
          toast.error(`${response.data.message}`, {position: 'top-center'})
          setBhkMap(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setBhkMap(false)
        setState({...state, loading: false})
      })
    setShowBhkMap(true)
  }
  //====================bhk=========================

  const [ProductMap, setProductMap] = useState(false)
  const [showProductMap, setShowProductMap] = useState(false)
  const handleCloseProduct = () => {
    setShowProductMap(false)
    setState({
      ...state,
      loading: false,
      productWithRdyMadePkgMapData: [],
      objReadymadePkgData: {} as INewReadymadePkgModel,
    })
  }
  function handleShowItemMap(objReadymadePkgMdl: INewReadymadePkgModel) {
    setProductMap(true)
    getProductListWithNewReadymadePkgTypeIDApi(objReadymadePkgMdl.readymadeTypeID)
      .then((response) => {
        const ProductWithQuoLevelMapData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            productWithRdyMadePkgMapData: ProductWithQuoLevelMapData,
            objReadymadePkgData: objReadymadePkgMdl,
            loading: false,
          })
          setProductMap(false)
        } else {
          setState({
            ...state,
            loading: false,
          })
          toast.error(`${response.data.message}`, {position: 'top-center'})
          setProductMap(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setProductMap(false)
        setState({...state, loading: false})
      })
    setShowProductMap(true)
  }
  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpNewReadymadePkgData.filter((user) => {
        return user.readymadeTypeName.toLowerCase().includes(keyword.toLowerCase())
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, newReadymadePkgData: results, searchText: keyword})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, newReadymadePkgData: state.tmpNewReadymadePkgData, searchText: keyword})
      // If the text field is empty, show all users
      setTotal(state.tmpNewReadymadePkgData.length)
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
  const currentPosts: INewReadymadePkgModel[] = state.newReadymadePkgData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/readymade-pkg/new-readymade-pkg/add'}
          title='Click to add Quotation Level'
        />

        {/* end::Header */}
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-striped align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>Type</th>
                  <th className='min-w-150px'>Price Per Sqft</th>
                  <th className='min-w-100px'>BHK</th>
                  <th className='min-w-100px'>Items</th>
                  <th className='min-w-100px '>Is Active</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody>
                {/* =================== Loading ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <NewReadymadePackageCard
                        data={data}
                        handleShow={() => handleShow(data.readymadeTypeID)}
                        name={name}
                        handleShowBHKMap={() => handleShowBhkMap(data)}
                        handleShowItemMap={() => handleShowItemMap(data)}
                        handleShowActive={(e) => handleShowActive(e)}
                      />
                      // <tr key={index}>
                      //   <td className='text-dark text-hover-primary fs-6'>{data.stageName}</td>

                      //   <td className='text-dark text-hover-primary fs-6'>{data.amtPercentage} %</td>

                      //   <td className='text-dark text-hover-primary fs-6'>{data.sequenceNo}</td>

                      //   <td>
                      //     <div className='d-flex justify-content-end flex-shrink-0'>
                      //       <Link
                      //         to={`/master/pmc-work-stage/edit/${data.NewReadymadePkgTypeID}`}
                      //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/art/art005.svg'
                      //           className='svg-icon-3 svg-icon-primary'
                      //         />
                      //       </Link>
                      //       <div
                      //         onClick={() => handleShow(data.NewReadymadePkgTypeID)}
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
                {/* =================== Image no data ============== */}
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
        id={state.selReadymadeTypeID}
        pageName={'Readymade Package Type'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteItem(state.selReadymadeTypeID)}
      />
      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Readymade Package Type'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
      {/* ===================bhk Model=====================  */}
      <ModelPopUpBHKMapWithQuoLevel
        show={showBhkMap}
        handleClose={handleCloseBhk}
        BhkMapData={state.bhkWithRdyMadePkgMapData}
        readymadeTypeID={state.objReadymadePkgData.readymadeTypeID}
        ReadymadePackageType={state.objReadymadePkgData.readymadeTypeName}
      />
      {/* ==================Product Model=====================  */}
      <ModelPopUpProductMapWithQuoLevel
        show={showProductMap}
        handleClose={handleCloseProduct}
        productMapData={state.productWithRdyMadePkgMapData}
        readymadeTypeID={state.objReadymadePkgData.readymadeTypeID}
        ReadymadePackageType={state.objReadymadePkgData.readymadeTypeName}
      />
    </>
  )
}

export default NewReadymadePackageList
