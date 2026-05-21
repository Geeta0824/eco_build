import React, {useEffect, useState} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../../_Ecd/helpers'
import {toast} from 'react-toastify'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {RootState} from '../../../../../setup'
import Loader from '../../../common-pages/Loader'
import Search from 'antd/es/input/Search'
import {IProductCategoryModel} from '../../../../models/product-page/IProductCategoryModel'
import {Link, useParams} from 'react-router-dom'
import BlankDataImage from '../../../common-pages/BlankDataImage'
import {IModularTypeModel} from '../../../../models/modular-product-page/modular-product-category/IModularProductCategoryModel'
import {getModularTypeListApi} from '../../../../modules/modular-product-page/modular-product-category/ModularProductCategoryCRUD'
import {
  GetModularProductListForCartNewAPI,
  getModularProductCategoryApi,
} from '../../../../modules/modular-quotation-master-page/diy-quotation-master-page/ModularQuotationCRUD'
import {IModularAddonProductListModel} from '../../../../models/design-addon-page/IModularAddonModel'
import {GetSave_DesignAddon_ModularQuotaionDetail_API} from '../../../../modules/design-addon/modular-addon/ModularAddonCRUD'

type Props = {
  selQuotationId: number
  tmpQuotationDetailsID?: number
  pageName: string
  customerName: string
  bhkName: string
  carpetAreaName: string
  projectName: string
  projectNumber: string
  mainCustomerID: number
  modularTypeID: number
  mainEmployeeID: number
  mainSearch: string
}

interface IAddCart {
  loading: boolean
  productList: IModularAddonProductListModel[]
  modularTypeData: IModularTypeModel[]
  tmpProductList: IModularAddonProductListModel[]
  objProductList: IModularAddonProductListModel
  categoryData: IProductCategoryModel[]
  selQuotationID: number
  selCategoryID: number
  selModularTypeID: number
  SearchText: string
  customerName: string
  bhkName: string
  carpetAreaName: string
  projectName: string
  projectNumber: string
}

const AddCartModularAddonList: React.FC<Props> = ({
  selQuotationId,
  tmpQuotationDetailsID,
  pageName,
  customerName,
  bhkName,
  carpetAreaName,
  projectName,
  projectNumber,
  modularTypeID,
  mainCustomerID,
  mainEmployeeID,
  mainSearch,
}) => {
  const {quotationID} = useParams<{quotationID: string}>()
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [cartLength, setCartLength] = useState<number>(0)
  const [selProductID, setSelProductID] = useState<number>(0)
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IAddCart>({
    loading: false,
    productList: [] as IModularAddonProductListModel[],
    modularTypeData: [] as IModularTypeModel[],
    tmpProductList: [] as IModularAddonProductListModel[],
    objProductList: {} as IModularAddonProductListModel,
    categoryData: [] as IProductCategoryModel[],
    selQuotationID: 0,
    selCategoryID: 0,
    selModularTypeID: 0,
    SearchText: '',
    customerName: '',
    bhkName: '',
    carpetAreaName: '',
    projectName: '',
    projectNumber: '',
  })

  useEffect(() => {
    let tmpCartLength = localStorage.getItem('totalCounts')!
    setCartLength(parseInt(tmpCartLength))
    setState({...state, loading: true})
    setTimeout(() => {
      getModularTypeData(state.selCategoryID, state.SearchText, state.selModularTypeID)
    }, 100)
  }, [])

  function getModularTypeData(selCategoryID: number, SearchText: string, selModularTypeID: number) {
    getModularTypeListApi()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          getProdCategoryData(responseData, selCategoryID, SearchText, selModularTypeID)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, modularTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, modularTypeData: [], loading: false})
      })
  }

  function getProdCategoryData(
    modularTypeData: IModularTypeModel[],
    selCategoryID: number,
    SearchText: string,
    selModularTypeID: number
  ) {
    getModularProductCategoryApi(selModularTypeID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          getAllDIYQuotationData(
            modularTypeData,
            selCategoryID,
            SearchText,
            selModularTypeID,
            responseData
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
    modularTypeData: IModularTypeModel[],
    selCategoryID: number,
    SearchText: string,
    selModularTypeID: number,
    categoryData: IProductCategoryModel[]
  ) {
    state.productList = []
    setSelProductIDLen('')
    setSelProductIDHei('')
    setSelProductIDUnit('')
    GetModularProductListForCartNewAPI(selModularTypeID, selCategoryID, SearchText)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            productList: responseData,
            modularTypeData: modularTypeData,
            selCategoryID: selCategoryID,
            selModularTypeID: selModularTypeID,
            SearchText: SearchText,
            categoryData: categoryData,
            selQuotationID: parseInt(quotationID),
            loading: false,
          })
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
  function getListbyCategoryIdValue(event: any) {
    const tmpCategoryId = event.target.value
    getModularTypeData(tmpCategoryId, state.SearchText, state.selModularTypeID)
  }

  // ===================PlanArea Filter Function===========
  function getListbyModularTypeIdValue(event: any) {
    const tmpModularTypeId = event.target.value
    getModularTypeData(state.selCategoryID, state.SearchText, tmpModularTypeId)
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState<string>('')
  //------------------- the search result-----------------
  const searchFilter = (value: string) => {
    const keyword = value
    if (keyword !== '') {
      getModularTypeData(state.selCategoryID, keyword, state.selModularTypeID)
    } else {
      getModularTypeData(state.selCategoryID, '', state.selModularTypeID)
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
      const Rows: IModularAddonProductListModel[] = state.productList
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
      const Rows: IModularAddonProductListModel[] = state.productList
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
      const Rows: IModularAddonProductListModel[] = state.productList
      for (let key in Rows) {
        if (Rows[key].productID == elementId) {
          Rows[key].noOfUnit = value
          setMainLoading(false)
          break
        }
      }
    }
  }

  function onAddToCart(objProductList: IModularAddonProductListModel) {
    setSelProductID(objProductList.productID)
    setMainLoading(true)
    GetSave_DesignAddon_ModularQuotaionDetail_API(
      user.employeeID,
      selQuotationId,
      objProductList.productCategoryID,
      objProductList.productID,
      objProductList.modularTypeID,
      objProductList.defaultUnitID,
      objProductList.length,
      objProductList.depth,
      objProductList.height,
      objProductList.noOfUnit
    )
      .then((response) => {
        const responseData = response.data
        if (responseData.isSuccess == true) {
          toast.success(`Product Added in Cart`, {autoClose: 1000})
          setCartLength(cartLength + 1)
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

  // ------------------------------reset button---------------------
  function resetFilter() {
    getAllDIYQuotationData(state.modularTypeData, 0, '', 0, state.categoryData)
    setName('')
  }

  return (
    <>
      <Loader loading={state.loading} />
      <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
        <div className='mb-2 col-xl-3 col-sm-4'>
          <label className='form-label fw-bold text-white'>Modular Type:</label>
          <select
            className='form-select form-select-white lineHeightByD'
            onChange={(e) => getListbyModularTypeIdValue(e)}
          >
            <option selected={state.selModularTypeID === 0 ? true : false} value={0}>
              Select Modular Type
            </option>
            {state.modularTypeData.length > 0 &&
              state.modularTypeData.map((data, index) => {
                return (
                  <option
                    key={index}
                    value={data.modularTypeID}
                    selected={state.selModularTypeID === data.modularTypeID ? true : false}
                  >
                    {data.modularTypeName}
                  </option>
                )
              })}
          </select>
        </div>

        <div className='mb-2 col-xl-3 col-sm-4'>
          <label className='form-label fw-bold text-white'>Category :</label>
          <select
            className='form-select form-select-white lineHeightByD'
            onChange={(e) => getListbyCategoryIdValue(e)}
          >
            <option selected={state.selCategoryID === 0 ? true : false} value={0}>
              Select Category
            </option>
            {state.categoryData.length > 0 &&
              state.categoryData.map((data, index) => {
                return (
                  <option
                    key={index}
                    value={data.productCategoryID}
                    selected={state.selCategoryID === data.productCategoryID ? true : false}
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
                pathname: `/design/modular-addon/view-cart/${state.selQuotationID}`,
                state: {
                  quotationID: state.selQuotationID,
                  customerName: customerName,
                  bhkName: bhkName,
                  carpetAreaName: carpetAreaName,
                  projectName: projectName,
                  projectNumber: projectNumber,
                  modularTypeID: modularTypeID,
                  mainCustomerID: mainCustomerID,
                  mainEmployeeID: mainEmployeeID,
                  mainSearch: mainSearch,
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
                  <div className='symbol symbol-100px symbol-2by3 text-center'>
                    {data.photoPath !== '' ? (
                      <img src={process.env.REACT_APP_API_URL + data.photoPath} alt='' />
                    ) : (
                      <img src={toAbsoluteUrl('/media/img/NoProductImage.png')} alt='' />
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
                        className='btn btn-sm btn-light-primary bg-white border border-primary text-center py-2 px-10 mt-2'
                        onClick={() => onAddToCart(data)}
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
                      <label className='text-muted fw-bold pt-1'>Modular Type Name : &nbsp;</label>
                      <span className='text-gray-800 fw-bolder text-hover-primary fs-5'>
                        {data.modularTypeName}
                      </span>
                    </span>
                    <span className='d-block'>
                      <label className='text-muted fw-bold pt-1'>Category Name : &nbsp;</label>
                      <span className='text-gray-800 fw-bolder text-hover-primary fs-5'>
                        {data.productCategoryName}
                      </span>
                    </span>
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
                          disabled
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
    </>
  )
}

export {AddCartModularAddonList}
