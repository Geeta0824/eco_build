/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {IDIYProductListModel} from '../../../models/quotations-page/diy-quotation-page/IDIYQuotationModel'
import {IPlanAreaModel} from '../../../models/product-page/IPlanAreaModel'
import {toast} from 'react-toastify'
import Loader from '../../common-pages/Loader'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'
// import { increment } from '../../../modules/quotations-master-page/diy-quotation-master-page/DIYRedux'
import {RootState} from '../../../../setup'
import Search from 'antd/es/input/Search'
import {IProductCategoryModel} from '../../../models/product-page/IProductCategoryModel'
import {getAllPlanArea} from '../../../modules/product-master-page/plan-area-master-page/PlanAreaCRUD'
import {getAllProductCategoryApi} from '../../../modules/product-master-page/product-category-master-page/ProductCategoryCRUD'
import {Link, useLocation, useParams} from 'react-router-dom'
import BlankDataImage from '../../common-pages/BlankDataImage'
import {Button, Modal} from 'react-bootstrap-v5'
import {
  GetProductListForCartNewApi,
  UpdateQuotationDetailinCartApi,
  saveQuotationDetailinCartApi,
} from '../../../modules/customization-quotation-master-page/CustomizationQuotationsCRUD'

type Props = {
  selQuotationId: number
  // tmpplanAreaID?: number
  tmpQuotationDetailsID?: number
  pageName: string
  customerName: string
  bhkName: string
  carpetAreaName: string
  projectName: string
  projectNumber: string
  mainCustomerID: number
  mainEmployeeID: number
  mainSearch: string
  SearchInView: string
  SearchInAddCart: string
 selPlanAreaId: number
  selCategoryId: number
}

interface IAddCart {
  loading: boolean
  productList: IDIYProductListModel[]
  planAreaList: IPlanAreaModel[]
  tmpProductList: IDIYProductListModel[]
  objProductList: IDIYProductListModel
  categoryData: IProductCategoryModel[]
  selQuotationID: number
  selCategoryId: number
  selPlanAreaId: number
  searchText: string
  customerName: string
  bhkName: string
  carpetAreaName: string
  projectName: string
  projectNumber: string
}

const AddCartDIYQuotationList: React.FC<Props> = ({
  selQuotationId,
  // tmpplanAreaID,
  tmpQuotationDetailsID,
  pageName,
  customerName,
  bhkName,
  carpetAreaName,
  projectName,
  projectNumber,
  mainCustomerID,
  mainEmployeeID,
  mainSearch,
  SearchInView,
  SearchInAddCart,
 selPlanAreaId,
  selCategoryId,
}) => {
  const {quotationID} = useParams<{quotationID: string}>()
  const dispatch = useDispatch()
  const location = useLocation()
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [cartLength, setCartLength] = useState<number>(0)
  const [selProductID, setSelProductID] = useState<number>(0)

  const [state, setState] = useState<IAddCart>({
    loading: false,
    productList: [] as IDIYProductListModel[],
    planAreaList: [] as IPlanAreaModel[],
    tmpProductList: [] as IDIYProductListModel[],
    objProductList: {} as IDIYProductListModel,
    categoryData: [] as IProductCategoryModel[],
    selQuotationID: 0,
    selCategoryId: 0,
    selPlanAreaId: 0,
    searchText: '',
    customerName: '',
    bhkName: '',
    carpetAreaName: '',
    projectName: '',
    projectNumber: '',
  })
  // const totalCount: number = useSelector<RootState>(
  //   ({}) => counterReducer.counter,
  //   shallowEqual
  // ) as number

  useEffect(() => {
    // setSelAreaValue(tmpplanAreaID)
    let tmpCartLength = localStorage.getItem('totalCounts')!
    setCartLength(parseInt(tmpCartLength))
    setState({...state, loading: true})
    setTimeout(() => {
      getProdCategoryData(parseInt(quotationID))
    }, 100)
  }, [])

  function getProdCategoryData(tmpQuotationID: number) {
    getAllProductCategoryApi()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          getPlanAreaData(tmpQuotationID, responseData)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, categoryData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, categoryData: [], loading: false})
      })
  }

  function getPlanAreaData(tmpQuotationID: number, categoryData: IProductCategoryModel[]) {
    getAllPlanArea()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          getAllDIYQuotationData(
            tmpQuotationID,
            categoryData,
            responseData,
            selCategoryId,
            SearchInAddCart,
            selPlanAreaId
            // state.selCategoryId,
            // state.searchText,
            // state.selPlanAreaId
          )
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, categoryData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, categoryData: [], loading: false})
      })
  }

  function getAllDIYQuotationData(
    tmpQuotationID: number,
    categoryData: IProductCategoryModel[],
    planAreaList: IPlanAreaModel[],
    selCategoryId: number,
    selSearchText: string,
    selPlanAreaId: number
  ) {
    state.productList = []
    setSelProductIDLen('')
    setSelProductIDHei('')
    setSelProductIDUnit('')
    GetProductListForCartNewApi(selPlanAreaId, selCategoryId, selSearchText)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            productList: responseData,
            categoryData: categoryData,
            planAreaList: planAreaList,
            selCategoryId: selCategoryId,
            selPlanAreaId: selPlanAreaId,
            searchText: selSearchText,
            selQuotationID: tmpQuotationID,
            loading: false,
          })
          setName(selSearchText)
          // dispatch(setCount(0, state.selQuotationID))
          // setTotal(responseData.length)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, productList: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, productList: [], loading: false})
      })
  }

  // ===================Category Filter Function===========
  function getlistbyCategoryIdValue(event: any) {
    const tmpCategoryId = event.target.value
    // setMainLoading(true)
    getAllDIYQuotationData(
      state.selQuotationID,
      state.categoryData,
      state.planAreaList,
      tmpCategoryId,
      state.searchText,
      state.selPlanAreaId
    )
  }

  // ===================PlanArea Filter Function===========
  function getlistbyPlanAreaIdValue(event: any) {
    const tmpPlanAreaId = event.target.value
    getAllDIYQuotationData(
      state.selQuotationID,
      state.categoryData,
      state.planAreaList,
      state.selCategoryId,
      state.searchText,
      tmpPlanAreaId
    )
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState<string>('')
  //------------------- the search result-----------------
  const searchFilter = (value: string) => {
    const keyword = value
    //  console.log(keyword)
    // setMainLoading(true)
    if (keyword !== '') {
      getAllDIYQuotationData(
        state.selQuotationID,
        state.categoryData,
        state.planAreaList,
        state.selCategoryId,
        keyword,
        state.selPlanAreaId
      )
    } else {
      getAllDIYQuotationData(
        state.selQuotationID,
        state.categoryData,
        state.planAreaList,
        state.selCategoryId,
        '',
        state.selPlanAreaId
      )
    }
  }

  const [valueLen, setValueLen] = useState<number>()
  const [selProductIDLen, setSelProductIDLen] = useState<string>()
  function handleLengthChange(event: any) {
    if (!isNaN(event.target.value)) {
      setMainLoading(true)
      const value = event.target.value
      const elementId = event.target.id
      const textBox = 'txtLen'
      setSelProductIDLen(textBox + elementId)
      setValueLen(value)
      const Rows: IDIYProductListModel[] = state.productList
      for (let key in Rows) {
        if (Rows[key].productID == elementId) {
          let tmpNoOfUnit = (value * Rows[key].height * Rows[key].depth).toFixed(2)
          Rows[key].length = value
          Rows[key].noOfUnit = parseFloat(tmpNoOfUnit)
          setMainLoading(false)
          break
        }
      }
    }
  }

  const [valueHei, setValueHei] = useState<number>()
  const [selProductIDHei, setSelProductIDHei] = useState<string>()
  function handleHeightChange(event: any) {
    if (!isNaN(event.target.value)) {
      setMainLoading(true)
      const value = event.target.value
      const elementId = event.target.id
      const textBox = 'txtHei'
      setSelProductIDHei(textBox + elementId)
      setValueHei(value)
      const Rows: IDIYProductListModel[] = state.productList
      for (let key in Rows) {
        if (Rows[key].productID == elementId) {
          let tmpNoOfUnit = (value * Rows[key].length * Rows[key].depth).toFixed(2)
          Rows[key].height = value
          Rows[key].noOfUnit = parseFloat(tmpNoOfUnit)
          setMainLoading(false)
          break
        }
      }
    }
  }

  const [valueUnit, setValueUnit] = useState<number>()
  const [selProductIDUnit, setSelProductIDUnit] = useState<string>()
  function handleUnitChange(event: any) {
    if (!isNaN(event.target.value)) {
      setMainLoading(true)
      const value = event.target.value
      const elementId = event.target.id
      const textBox = 'txtUnit'
      setSelProductIDUnit(textBox + elementId)
      setValueUnit(value)
      const Rows: IDIYProductListModel[] = state.productList
      for (let key in Rows) {
        if (Rows[key].productID == elementId) {
          Rows[key].noOfUnit = value
          setMainLoading(false)
          break
        }
      }
    }
  }

  // const [selAreaValue, setSelAreaValue] = useState<number>()
  // const [selAreaId, setSelAreaId] = useState<string>()
  // function handleOnChange(event: any) {
  //   if (!isNaN(event.target.value)) {
  //     setMainLoading(true)
  //     const value = event.target.value
  //     const elementId = parseInt(event.target.id)
  //     const textBox = 'txtUnit'
  //     setSelAreaId(textBox + elementId)
  //     setSelAreaValue(elementId)
  //     const Rows: IDIYProductListModel[] = state.productList
  //     for (let key in Rows) {
  //       if (Rows[key].productID == elementId) {
  //         Rows[key].planAreaID = value
  //         setMainLoading(false)
  //         break
  //       }
  //     }
  //   }
  // }

  function onAddToCart(objProductList: IDIYProductListModel, tmpPlanAreaID: number) {
    // if (objProductList.planAreaID == 0 || tmpPlanAreaID == undefined || tmpPlanAreaID == 0) {
    //   return toast.error(`Please Select Area.`, {autoClose: 1000})
    // }
    setSelProductID(objProductList.productID)
    setMainLoading(true)
    saveQuotationDetailinCartApi(
      selQuotationId,
      objProductList.productCategoryID,
      objProductList.productID,
      // objProductList.planAreaID,
      state.selPlanAreaId,
      objProductList.defaultUnitID,
      objProductList.length,
      objProductList.depth,
      objProductList.height,
      objProductList.noOfUnit
    )
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data
          toast.success(`Product Added in Cart`, {autoClose: 1000})
          setCartLength(cartLength + 1)
          // dispatch(increment(1,selQuotationId))
          setSelProductID(0)
          setMainLoading(false)
        } else {
          toast.error(`${response.data.message}`)
          setMainLoading(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setMainLoading(false)
      })
  }

  // -----------------Modal clas Select-------------------
  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }
  function handleShow(objData: IDIYProductListModel) {
    setState({...state, objProductList: objData})
    setShow(true)
  }

  // ------------------------------reset button---------------------
  function resetFilter() {
    getAllDIYQuotationData(state.selQuotationID, state.categoryData, state.planAreaList, 0, '', 0)
    setName('')
  }

  return (
    <>
      <Loader loading={state.loading} />
      <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
        <div className='mb-2 col-xl-3 col-sm-4'>
          <label className='form-label fw-bold text-white'>Plan Area :</label>
          <select
            className='form-select form-select-white lineHeightByD'
            onChange={(e) => getlistbyPlanAreaIdValue(e)}
          >
            <option selected={state.selPlanAreaId === 0 ? true : false} value={0}>
              Select Plan Area
            </option>
            {state.planAreaList.length > 0 &&
              state.planAreaList.map((data, index) => {
                return (
                  <option
                    key={index}
                    value={data.planAreaID}
                    selected={state.selPlanAreaId == data.planAreaID ? true : false}
                  >
                    {data.areaName}
                  </option>
                )
              })}
          </select>
        </div>

        <div className='mb-2 col-xl-3 col-sm-4'>
          <label className='form-label fw-bold text-white'>Category :</label>
          <select
            className='form-select form-select-white lineHeightByD'
            onChange={(e) => getlistbyCategoryIdValue(e)}
          >
            <option selected={state.selCategoryId === 0 ? true : false} value={0}>
              Select Category
            </option>
            {state.categoryData.length > 0 &&
              state.categoryData.map((data, index) => {
                return (
                  <option
                    key={index}
                    value={data.productCategoryID}
                    selected={state.selCategoryId == data.productCategoryID ? true : false}
                  >
                    {data.productCategoryName}
                  </option>
                )
              })}
          </select>
        </div>

        <div className='mb-2 col-xl-3 col-sm-6'>
          <label className='form-label fw-bold text-white'>Search :</label>
          <Search
            placeholder='input search text'
            value={name}
            allowClear
            onChange={(e) => setName(e.target.value)}
            onSearch={(value) => searchFilter(value)}
          />
        </div>
        <div className=' mt-3 col-xl-1 col-sm-4 d-flex align-content-around flex-wrap justify-content-center'>
          <button className='btn btn-sm btn-danger' type='button' onClick={resetFilter}>
            Reset
          </button>
        </div>
        <div className='card-toolbar'>
          {/* begin::Menu */}
          <button
            type='button'
            className='btn btn-lg btn-icon bg-light btn-color-primary btn-active-primary border'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <Link
              to={{
                pathname: `/customization-quotations/view-cart/${state.selQuotationID}`,
                state: {
                  packageID: 0,
                  packageTypeID: 2,
                  customerName: customerName,
                  bhkName: bhkName,
                  carpetAreaName: carpetAreaName,
                  projectName: projectName,
                  projectNumber: projectNumber,
                  mainCustomerID: mainCustomerID,
                  mainEmployeeID: mainEmployeeID,
                  mainSearch: mainSearch,
                  SearchInView: SearchInView,
                  SearchInAddCart: name,
                  addCartPlanAreaId: state.selPlanAreaId,
                  addCartCategoryId: state.selCategoryId,
                },
              }}
              className='d-flex text-dark text-hover-light '
            >
              <KTSVG
                path='/media/icons/duotune/ecommerce/ecm001.svg'
                className='svg-icon-2x pt-3'
              />
              <span className='fs-4 m-0 p-0 fs-bold'>{cartLength}</span>
            </Link>
          </button>
          {/* end::Menu */}
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body p-0 m-0 overflow-auto h-100'>
        {state.productList.length > 0 &&
          state.productList.map((data, index) => {
            return (
              <div key={data.productID} className='d-flex p-5 mb-4 shadow-sm'>
                <div className='d-block align-items-center'>
                  {/* begin::Symbol */}
                  <div className='symbol symbol-75px symbol-2by3 text-center'>
                    {data.photoPath !== '' ? (
                      <img src={process.env.REACT_APP_API_URL + data.photoPath} alt='' />
                    ) : (
                      <div
                        className='symbol-label'
                        style={{
                          backgroundImage: `url(${toAbsoluteUrl('/media/img/NoProductImage.png')})`,
                        }}
                      ></div>
                    )}
                  </div>
                  <div className='card-toolbar rounded text-center mt-2'>
                    {mainLoading === true && data.productID === selProductID ? (
                      <span className='btn btn-sm btn-light-primary bg-white px-10 text-center'>
                        <span
                          className='spinner-border'
                          style={{width: '1rem', height: '1rem'}}
                          role='status'
                        >
                          <span className='visually-hidden'>Loading...</span>
                        </span>
                      </span>
                    ) : (
                      <span
                        className='btn btn-sm btn-light-primary bg-white border border-primary text-center py-2 px-5'
                        onClick={() => onAddToCart(data, data.planAreaID)}
                      >
                        <KTSVG
                          path='/media/icons/duotune/arrows/arr075.svg'
                          className='svg-icon-2'
                        />
                        Add
                      </span>
                    )}
                  </div>
                </div>
                {/* end::Symbol */}
                {/* begin::Content */}
                <div className='d-flex flex-row-fluid align-items-center flex-wrap my-lg-0 me-2'>
                  {/* begin::Center */}
                  <div className='flex-grow-1 my-lg-0 my-2 m-2'>
                    <span className='d-block'>
                      <label className='text-muted fw-bold pt-1'>Product Name : &nbsp;</label>
                      <span className='text-gray-800 fw-bolder text-hover-primary fs-5'>
                        {data.productName}
                      </span>
                    </span>
                    <span className='text-muted fw-bold d-block pt-2'>
                      <span className='text-muted fw-bold'>
                        L : &nbsp;
                        <input
                          // type='number'
                          type='text'
                          id={`${data.productID}`}
                          value={
                            selProductIDLen == `txtLen${data.productID}` ? valueLen : data.length
                          }
                          onChange={(e) => handleLengthChange(e)}
                          className='text-center w-60px h-30px bg-light-primary border-0 rounded'
                        />
                      </span>
                      <span className='text-muted fw-bold ps-4'>
                        H : &nbsp;
                        <input
                          // type='number'
                          type='text'
                          id={`${data.productID}`}
                          disabled={!data.isHeightChange}
                          value={
                            selProductIDHei == `txthei${data.productID}` ? valueHei : data.height
                          }
                          onChange={(e) => handleHeightChange(e)}
                          className='text-center w-60px h-30px bg-light-primary border-0 rounded'
                        />
                      </span>
                      <span className='text-muted fw-bold ps-4'>
                        D : &nbsp;
                        <input
                          // type='number'
                          type='text'
                          disabled
                          value={data.depth}
                          className='text-center w-60px h-30px bg-light-primary border-0 rounded'
                        />
                      </span>
                      <span className='text-muted fw-bold ps-4'>
                        No Of Unit : &nbsp;
                        <input
                          // type='number'
                          type='text'
                          id={`${data.productID}`}
                          value={
                            selProductIDUnit == `txtUnit${data.productID}`
                              ? valueUnit
                              : data.noOfUnit
                          }
                          onChange={(e) => handleUnitChange(e)}
                          className='text-center w-90px h-30px bg-light-primary border-0 rounded'
                        />
                      </span>
                      <span className='text-muted fw-bold ps-4'>
                        <label className='pt-1'>Unit : &nbsp;</label>
                        <span className='text-gray-800 fw-bolder text-hover-primary fs-5'>
                          {data.unitName}
                        </span>
                      </span>
                    </span>
                    <span className='d-block pt-2'>
                      <label className='text-muted fw-bold'>Description : &nbsp;</label>
                      <span className='text-hover-primary fs-6'>{data.description}</span>
                    </span>
                  </div>
                  {/* end::Center */}
                </div>
                {/* end::Content */}
              </div>
            )
          })}
        <BlankDataImage length={state.productList.length} loading={state.loading} />
      </div>

      {/* ----------------------------------------------- */}
      {/* <Modal size='lg' centered scrollable={true} show={show} onHide={handleClose}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}> {state.objProductList.productName}</Modal.Title>
          </Modal.Header>
        </div>
        <Modal.Body>
          <span className='d-block'>
            {/* <label className='text-muted fw-bold pt-1'>Description : &nbsp;</label>
            <span className='text-gray-800 fw-bolder text-hover-primary fs-5'>
              {state.objProductList.description}
            </span>
          </span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  )
}

export {AddCartDIYQuotationList}
