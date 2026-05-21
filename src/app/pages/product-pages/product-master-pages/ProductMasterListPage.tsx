import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import Search from 'antd/es/input/Search'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {
  IAreaProductModel,
  IAsseccoriesProductModel,
  IProductMasterModel,
} from '../../../models/product-page/IProductMasterModel'
import {
  GetAccessoriesWithProductIDApi,
  GetAreaWithProductIDApi,
  deleteProductMaster,
  exportExcelProductMasterDataApi,
  getProductListByFilter,
  isActiveProductMaster,
} from '../../../modules/product-master-page/product-master-page/ProductMasterCRUD'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import {Modal, Button, Container, Row, Col} from 'react-bootstrap-v5'
import {IProductCategoryModel} from '../../../models/product-page/IProductCategoryModel'
import {getAllProductCategoryApi} from '../../../modules/product-master-page/product-category-master-page/ProductCategoryCRUD'
import {IUnitModel} from '../../../models/master-page/IUnitModel'
import {getAllUnit} from '../../../modules/master-page/unit-master-page/UnitCRUD'
import * as XLSX from 'xlsx'
import moment from 'moment'
import {ModelPopUpPlanArea} from './ModelPopUpPlanArea'
import {ModelPopUpAccessories} from './ModelPopUpAccessories'

import {IBranchRateMapModel} from '../../../models/carpetry-page/ICarpetryPackageModel'
import {GetDNC_BranchRateMapList} from '../../../modules/master-page/branch-master-page/BranchCRUD'

type Props = {}

interface IProduct {
  loading: boolean
  excelproductMasterData: IProductMasterModel[]
  productMasterData: IProductMasterModel[]
  tmpProductMasterData: IProductMasterModel[]
  selObjProduct: IProductMasterModel
  productCategory: IProductCategoryModel[]
  unitData: IUnitModel[]
  areaMapData: IAreaProductModel[]
  accessoriesMapData: IAsseccoriesProductModel[]
  branchRateMapData: IBranchRateMapModel[]
  imageShow: string
  selproductID: number
  activeID: number
  activeType: any
  ProductCategoryID: number
  UnitID: number
  selPricePerSqFt: number
  searchText: string
  mainProductCategoryID: string
}

const ProductMasterListPage: React.FC<Props> = () => {
  const location = useLocation()
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [state, setState] = useState<IProduct>({
    loading: false,
    excelproductMasterData: [] as IProductMasterModel[],
    productMasterData: [] as IProductMasterModel[],
    tmpProductMasterData: [] as IProductMasterModel[],
    selObjProduct: {} as IProductMasterModel,
    productCategory: [] as IProductCategoryModel[],
    unitData: [] as IUnitModel[],
    areaMapData: [] as IAreaProductModel[],
    accessoriesMapData: [] as IAsseccoriesProductModel[],
    branchRateMapData: [] as IBranchRateMapModel[],
    imageShow: '',
    selproductID: 0,
    activeID: 0,
    activeType: false,
    ProductCategoryID: 0,
    UnitID: 0,
    selPricePerSqFt: 0,
    searchText: '',
    mainProductCategoryID: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainProductCategoryID: number = 0
      var mainUnitID: number = 0
      var mainSearch: string = ''
      if (lc !== undefined) {
        mainProductCategoryID = lc.ProductCategoryID
        mainUnitID = lc.unitID
        mainSearch = lc.search
      }
      getAllProductCategory(mainProductCategoryID, mainUnitID, mainSearch)
    }, 100)
  }, [])

  function getAllProductCategory(
    mainProductCategoryID: number,
    mainUnitID: number,
    mainSearch: string
  ) {
    getAllProductCategoryApi()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          getAllUnitData(responseData, mainProductCategoryID, mainUnitID, mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, productCategory: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, productCategory: [], loading: false})
      })
  }

  function getAllUnitData(
    productCategory: IProductCategoryModel[],
    mainProductCategoryID: number,
    mainUnitID: number,
    mainSearch: string
  ) {
    getAllUnit()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          getAllproductMasterData(
            productCategory,
            responseData,
            mainProductCategoryID,

            mainUnitID,
            mainSearch
          )
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, unitData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, unitData: [], loading: false})
      })
  }

  function getAllproductMasterData(
    productCategory: IProductCategoryModel[],
    unitData: IUnitModel[],
    ProductCategoryID: number,
    UnitID: number,
    searchText: string
  ) {
    getProductListByFilter(ProductCategoryID, UnitID, searchText)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            productCategory: productCategory,
            unitData: unitData,
            ProductCategoryID,
            UnitID: UnitID,
            searchText: searchText,
            productMasterData: responseData,
            tmpProductMasterData: responseData,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            productCategory: [],
            unitData: [],
            productMasterData: [],
            tmpProductMasterData: [],
            ProductCategoryID: 0,
            UnitID: 0,
            searchText: '',
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          productCategory: [],
          unitData: [],
          productMasterData: [],
          tmpProductMasterData: [],
          ProductCategoryID: 0,
          UnitID: 0,
          searchText: '',
          loading: false,
        })
      })
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (productID: number) => {
    setState({
      ...state,
      selproductID: productID,
      loading: false,
    })
    setShow(true)
  }

  function deleteProductMasterItem(temproductID: number) {
    deleteProductMaster(temproductID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllproductMasterData(
            state.productCategory,
            state.unitData,
            state.ProductCategoryID,
            state.UnitID,
            state.searchText
          )
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
    isActiveProductMaster(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess == true) {
          getAllproductMasterData(
            state.productCategory,
            state.unitData,
            state.ProductCategoryID,
            state.UnitID,
            state.searchText
          )
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
  // ====================Images Flag============
  const [showFlag, setShowFlag] = useState(false)
  const handleCloseFlag = () => {
    setState({...state, imageShow: '', loading: false})
    setShowFlag(false)
  }
  const handleShowFlag = (selImg: string) => {
    setState({...state, imageShow: process.env.REACT_APP_API_URL + selImg, loading: false})
    setShowFlag(true)
  }

  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.productMasterData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IProductMasterModel[] = state.productMasterData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  // =================== ProductCategory Filter Function===========
  function getProductCategoryIdValue(event: any) {
    const tmpProCateId = event.target.value
    getAllproductMasterData(
      state.productCategory,
      state.unitData,
      tmpProCateId,
      state.UnitID,
      state.searchText
    )
  }
  // =================== Unit Filter Function===========
  function getUnitDataIdValue(event: any) {
    const tmpUnitId = event.target.value
    getAllproductMasterData(
      state.productCategory,
      state.unitData,
      state.ProductCategoryID,
      tmpUnitId,
      state.searchText
    )
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  const searchFilter = (value: string) => {
    const keyword = value
    if (keyword !== '') {
      getAllproductMasterData(
        state.productCategory,
        state.unitData,
        state.ProductCategoryID,
        state.UnitID,
        keyword
      )
    } else {
      getAllproductMasterData(
        state.productCategory,
        state.unitData,
        state.ProductCategoryID,
        state.UnitID,
        ''
      )
    }
  }

  function exportExcelData() {
    exportExcelProductMasterDataApi(state.ProductCategoryID, state.UnitID, state.searchText)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            // excelproductMasterData: responseData,
            loading: false,
          })
          const worksheet = XLSX.utils.json_to_sheet(responseData)
          const workbook = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
          XLSX.writeFile(workbook, `ProductMaster_${moment(new Date()).format('YYYYMMDD')}.xlsx`)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            // productCategory: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          // productCategory: [],
          loading: false,
        })
      })
  }

  const [areaMap, setAreaMap] = useState(false)
  const [showAreaMap, setShowAreaMap] = useState(false)
  const handleCloseArea = () => {
    setShowAreaMap(false)
    setState({...state, areaMapData: [], loading: false})
  }

  function handleShowAreaMap(objProduct: IProductMasterModel) {
    setAreaMap(true)
    GetAreaWithProductIDApi(objProduct.productID)
      .then((response) => {
        const resAreaMapData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            areaMapData: resAreaMapData,
            selObjProduct: objProduct,
            loading: false,
          })
          setAreaMap(false)
        } else {
          setState({
            ...state,
            areaMapData: resAreaMapData,
            selObjProduct: objProduct,
            loading: false,
          })
          toast.error(`${response.data.message}`, {position: 'top-center'})
          setAreaMap(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setAreaMap(false)
        setState({...state, areaMapData: [], selObjProduct: objProduct, loading: false})
      })
    setShowAreaMap(true)
  }

  const [accessoriesMap, setAccessoriesMap] = useState(false)
  const [showAccessoriesMap, setShowAccessoriesMap] = useState(false)
  const handleCloseAccessories = () => {
    setShowAccessoriesMap(false)
    setState({...state, accessoriesMapData: [], loading: false})
  }

  function handleShowAccessoriesMap(objProduct: IProductMasterModel) {
    setAccessoriesMap(true)
    GetAccessoriesWithProductIDApi(objProduct.productID)
      .then((response) => {
        const resAccessoriesMapData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            accessoriesMapData: resAccessoriesMapData,
            selObjProduct: objProduct,
            loading: false,
          })
          setAccessoriesMap(false)
        } else {
          setState({
            ...state,
            accessoriesMapData: resAccessoriesMapData,
            selObjProduct: objProduct,
            loading: false,
          })
          toast.error(`${response.data.message}`, {position: 'top-center'})
          setAccessoriesMap(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setAccessoriesMap(false)
        setState({...state, accessoriesMapData: [], selObjProduct: objProduct, loading: false})
      })
    setShowAccessoriesMap(true)
  }
  // -------------------------------------Unit Price Model--------------------------------------

  const [totalAmount, setTotalAmount] = useState<number>(0)

  const [showPriceModal, setShowPriceModal] = useState(false)
  const handleCloseUnitPrice = () => {
    setShowPriceModal(false)
  }

  const handlePriceShow = (pricePerSqFt: number) => {
    GetDNC_BranchRateMapList()
      .then((response) => {
        if (response.data.isSuccess === true) {
          let responseData = response.data.responseObject
          setState({
            ...state,
            branchRateMapData: responseData,
            selPricePerSqFt: pricePerSqFt,
          })

          if (responseData.length > 0) {
            const firstBranchRate = responseData[0].percentage // Assuming this is the percentage
            const calculatedTotal =
              firstBranchRate > 0 ? (pricePerSqFt * firstBranchRate) / 100 +pricePerSqFt : pricePerSqFt // If percentage is 0, use the current amount
            setTotalAmount(calculatedTotal)
          }
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, branchRateMapData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, branchRateMapData: [], loading: false})
      })
    setShowPriceModal(true)
  }

  // ------------------------------reset button---------------------
  function resetFilter() {
    setMainLoading(true)
    setName('')
    getAllproductMasterData(state.productCategory, state.unitData, 0, 0, '')
  }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div
          className='card-header border-0 d-flex py-2 bg_dark'
          style={{backgroundColor: '#000000'}}
        >
          <div className='card-header row border-0 pt-4 ps-0 pe-0' id='kt_chat_contacts_header'>
            <div className='mb-3 col-xl-3 col-sm-6'>
              <label className='form-label fw-bold text-white'>Product Category :</label>
              <select
                className='form-select form-select-white lineHeightByD'
                onChange={(e) => getProductCategoryIdValue(e)}
              >
                <option selected value={0}>
                  Product Category
                </option>
                {state.productCategory.length > 0 &&
                  state.productCategory.map((data, index) => {
                    return (
                      <option
                        key={index}
                        value={data.productCategoryID}
                        selected={state.ProductCategoryID == data.productCategoryID ? true : false}
                      >
                        {data.productCategoryName}
                      </option>
                    )
                  })}
              </select>
            </div>
            <div className='mb-3 col-xl-3 col-sm-6 ps-5'>
              <label className='form-label fw-bold text-white'>Unit :</label>
              <select
                className='form-select form-select-white lineHeightByD'
                onChange={(e) => getUnitDataIdValue(e)}
              >
                <option selected value={0}>
                  Unit
                </option>
                {state.unitData.length > 0 &&
                  state.unitData.map((data, index) => {
                    return (
                      <option
                        key={index}
                        value={data.unitID}
                        selected={state.UnitID == data.unitID ? true : false}
                      >
                        {data.unitName}
                      </option>
                    )
                  })}
              </select>
            </div>

            <div
              className='text-center col-xl-3 col-sm-6 mt-6'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='Click to add a Product'
            >
              <Link
                to={{
                  pathname: '/p-product/products/add',
                  state: {
                    mainProductCategoryID: state.ProductCategoryID,
                    mainUnitID: state.UnitID,
                    mainSearch: state.searchText,
                  },
                }}
                className='btn btn-sm btn-light-primary bg-white'
              >
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
                Add New
              </Link>
            </div>

            <span
              className='text-end col-xl-3 col-sm-6 mt-6'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='Click to add a product by Excel'
            >
              <Link
                to={{
                  pathname: '/p-product/products/excel',
                  state: {
                    mainProductCategoryID: state.ProductCategoryID,
                    mainUnitID: state.UnitID,
                    mainSearch: state.searchText,
                  },
                }}
                className='btn btn-sm btn-light-primary bg-white'
              >
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
                Upload Excel
              </Link>
            </span>

            <div className='mb-3 col-xl-6 col-sm-6 ps-5'>
              <label className='form-label fw-bold text-white'>Search :</label>
              <Search
                placeholder='input search text'
                value={name}
                allowClear
                onChange={(e) => setName(e.target.value)}
                onSearch={(value: any) => searchFilter(value)}
              />
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

            <span
              className='text-end col-xl-3 col-sm-6 mt-6'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='Click to export Excel sheet'
            >
              <span
                className='btn btn-sm btn-light-primary bg-white'
                onClick={() => exportExcelData()}
              >
                <KTSVG path='/media/icons/duotune/files/fil002.svg' className='svg-icon-3' />
                Export Excel
              </span>
            </span>
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
                  <th className='min-w-125px ps-3'>Product Name</th>
                  <th className='min-w-150px'>Category Name</th>
                  <th className='min-w-150px'>Description</th>
                  <th className='min-w-75px text-center fw-bold'>
                    <span className='text-success'>Length</span>
                    <span className='d-block text-info'>Height</span>
                    <span className='text-primary'>Depth</span>
                  </th>
                  <th className='min-w-100px text-center fw-bold'>
                    <span className='text-success'>Unit</span>
                    <span className='d-block text-info'>No of Unit</span>
                    <span className='text-primary'>Unit Price</span>
                  </th>
                  <th className='min-w-100px text-center fw-bold'>
                    <span className='text-success d-block mb-1'>Agency Type</span>
                    <span className='text-info'>Price</span>
                  </th>
                  <th className='min-w-100px text-center fw-bold'>
                    <span className='text-success d-block mb-1'>Admin Price</span>
                    <span className='text-info'>Profit</span>
                  </th>
                  <th className='min-w-25px text-center fw-bold'>
                    <span className='d-block text-success mb-1'>Area</span>
                    <span className='text-info'>Accs.</span>
                  </th>
                  <th className='min-w-25px text-center fw-bold'>
                    <span className='d-block text-success mb-1'>Active</span>
                    <span className='text-info'>Edit</span>
                  </th>
                  {/* <th className='w-25px'>Area</th>
                  <th className='w-25px'>Accessories</th> */}
                  {/* <th className='w-25px'>Active</th>
                  <th className='min-w-125px text-end'>Edit | Delete</th> */}
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div
                              className='symbol symbol-45px me-5 cursor-pointer'
                              onClick={() => handleShowFlag(data.photoPath)}
                            >
                              {data.photoPath !== '' ? (
                                <img src={process.env.REACT_APP_API_URL + data.photoPath} alt='' />
                              ) : (
                                <img src={toAbsoluteUrl('/media/img/NoProductImage.png')} alt='' />
                              )}
                            </div>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary'>
                                {data.productName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary'>
                            {data.productCategoryName}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary'>{data.description}</span>
                        </td>
                        <td className='text-center'>
                          <span className='text-success d-block'>{data.length}</span>
                          <span className='text-info d-block'>{data.height}</span>
                          <span className='text-primary d-block'>{data.depth}</span>
                        </td>
                        <td className='text-center'>
                          <span className='text-success d-block'>{data.unitName}</span>
                          <span className='text-info d-block'>{data.sqft}</span>
                          {/* <span className='text-primary d-block'>{data.pricePerSqFt}</span> */}
                          <span className='text-center'>
                            <span
                              className=' cursor-pointer text-primary text-hover-warning d-block'
                              onClick={() => handlePriceShow(data.pricePerSqFt)}
                            >
                              {data.pricePerSqFt}
                            </span>
                          </span>
                        </td>
                        {/* <td>
                          <span className='text-dark text-hover-primary'>
                            {data.pricePerSqFt}
                          </span>
                        </td> */}
                        <td className='text-center'>
                          <span className='text-success'>{data.agencyTypeName}</span>
                          <span className='text-info d-block'>{data.agnecyPrice}</span>
                        </td>
                        <td className='text-center'>
                          <span className='text-success'>{data.sqft * data.pricePerSqFt}</span>
                          <span className='text-info d-block'>
                            {(data.sqft * data.pricePerSqFt - data.agnecyPrice).toFixed(2)}
                          </span>
                        </td>
                        <td className='text-center'>
                          <div
                            onClick={() => handleShowAreaMap(data)}
                            className='btn btn-icon btn-bg-light bg-hover-success text-hover-inverse-success btn-sm m-1'
                          >
                            <KTSVG
                              path='/media/icons/duotune/maps/map002.svg'
                              className='svg-icon-2 svg-icon-success'
                            />
                          </div>
                          <div className='d-block'>
                            <div
                              onClick={() => handleShowAccessoriesMap(data)}
                              className='btn btn-icon btn-bg-light bg-hover-info text-hover-inverse-info btn-sm me-1'
                            >
                              <KTSVG
                                path='/media/icons/duotune/social/soc005.svg'
                                className='svg-icon-2 svg-icon-info'
                              />
                            </div>
                          </div>
                        </td>
                        <td className='text-center'>
                          <div className='form-check form-switch mb-2'>
                            <input
                              id={`${data.productID}`}
                              className='form-check-input'
                              type='checkbox'
                              checked={data.isActive}
                              onChange={(e) => handleShowActive(e)}
                            />
                          </div>
                          <div className='d-block'>
                            <Link
                              to={{
                                pathname: `/p-product/products/edit/${data.productID}`,
                                state: {
                                  mainProductCategoryID: state.ProductCategoryID,
                                  mainUnitID: state.UnitID,
                                  mainSearch: state.searchText,
                                },
                              }}
                              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                            >
                              <KTSVG
                                path='/media/icons/duotune/art/art005.svg'
                                className='svg-icon-2 svg-icon-primary'
                              />
                            </Link>
                          </div>
                        </td>
                        {/* <td className='text-center'>
                          <div
                            onClick={() => handleShowAreaMap(data)}
                            className='btn btn-icon btn-bg-light bg-hover-success text-hover-inverse-success btn-sm me-1'
                          >
                            <KTSVG
                              path='/media/icons/duotune/maps/map002.svg'
                              className='svg-icon-2x svg-icon-success'
                            />
                          </div>
                        </td>
                        <td className='text-center'>
                          <div
                            onClick={() => handleShowAccessoriesMap(data)}
                            className='btn btn-icon btn-bg-light bg-hover-info text-hover-inverse-info btn-sm me-1'
                          >
                            <KTSVG
                              path='/media/icons/duotune/social/soc005.svg'
                              className='svg-icon-2x svg-icon-info'
                            />
                          </div>
                        </td> */}
                        {/* <td>
                          <div className='form-check form-switch'>
                            <input
                              id={`${data.productID}`}
                              className='form-check-input'
                              type='checkbox'
                              checked={data.isActive}
                              onChange={(e) => handleShowActive(e)}
                            />
                          </div>
                        </td>
                        <td>
                          <div className='d-flex justify-content-end flex-shrink-0'>
                            <Link
                              to={`/p-product/products/edit/${data.productID}`}
                              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                            >
                              <KTSVG
                                path='/media/icons/duotune/art/art005.svg'
                                className='svg-icon-3 svg-icon-primary'
                              />
                            </Link>
                            <div
                              onClick={() => handleShow(data.productID)}
                              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                            >
                              <KTSVG
                                path='/media/icons/duotune/general/gen027.svg'
                                className='ssvg-icon-3 svg-icon-danger'
                              />
                            </div>
                          </div>
                        </td> */}
                      </tr>
                    )
                  })}
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={5}
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
              // itemRender={itemRender}
              showTotal={(total) => `Total ${total} items`}
            ></Pagination>
          </div>
        </div>
      </div>
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selproductID}
        pageName={'ProductMaster'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteProductMasterItem(state.selproductID)}
      />

      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Product'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
      {/* =====================Image Model=================== */}
      <Modal
        size='lg'
        show={showFlag}
        onHide={handleCloseFlag}
        backdrop='true'
        keyboard={false}
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Product Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-5'>
            <img
              alt='image not found'
              className='img-fluid'
              src={
                state.imageShow == ''
                  ? toAbsoluteUrl('/media/img/NoProductImage.png')
                  : toAbsoluteUrl(`${state.imageShow}`)
              }
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseFlag}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ===================Area Model===================== */}
      <ModelPopUpPlanArea
        show={showAreaMap}
        handleClose={handleCloseArea}
        areaMapData={state.areaMapData}
        ProductID={state.selObjProduct.productID}
        productName={state.selObjProduct.productName}
      />

      {/* ===================Accessories Model===================== */}
      <ModelPopUpAccessories
        show={showAccessoriesMap}
        handleClose={handleCloseAccessories}
        accessoriesMapData={state.accessoriesMapData}
        ProductID={state.selObjProduct.productID}
        productName={state.selObjProduct.productName}
      />

      {/* ===================Unit Price Model===================== */}
      <Modal
        fullscreen='md-down'
        show={showPriceModal}
        onHide={handleCloseUnitPrice}
        keyboard={false}
      >
        <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
          <Modal.Title className='text-white'>Unit Price : {state.selPricePerSqFt}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={`card `}>
            {/* begin::Body */}
            <div className='py-3'>
              {/* begin::Table container */}
              <div className='table-responsive'>
                {/* begin::Table */}
                <table className='table table-bordered align-middle g-2'>
                  {/* begin::Table head */}
                  <thead className='bg-secondary'>
                    <tr className='fw-bolder fs-5'>
                      <th className='min-w-150px'>Branch </th>
                      <th className='min-w-150px'> (%)</th>
                      <th className='min-w-150px'>Total Price</th>
                    </tr>
                  </thead>
                  {/* end::Table head */}
                  {/* begin::Table body */}
                  <tbody className="border-bottom">
                    <LoaderInTable loading={state.loading} column={5} />
                    {state.branchRateMapData.length > 0 &&
                      state.branchRateMapData.map((data, index) => {
                        const totalForBranch = (state.selPricePerSqFt * data.percentage) / 100+state.selPricePerSqFt
                        return (
                          <tr>
                            <td className='text-dark fs-6'>{data.branchName} </td>
                            {/* <td className='text-dark fs-6'>{data.branchCode}</td> */}
                            <td className='text-dark fs-6'>({data.percentage} %)</td>
                            <td className='text-dark fs-6'>
                              {data.percentage === 0
                                ? state.selPricePerSqFt.toFixed(2)
                                : totalForBranch.toFixed(2)}
                            </td>
                          </tr>
                        )
                      })}
                    <BlankDataImageInTable
                      length={state.branchRateMapData.length}
                      loading={state.loading}
                      colSpan={5}
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal.Body>
       
      </Modal>
    </>
  )
}

export default ProductMasterListPage
