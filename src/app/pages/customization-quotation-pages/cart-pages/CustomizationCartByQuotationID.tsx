import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import {IProductCategoryModel} from '../../../models/product-page/IProductCategoryModel'
import {IDIYProductListModel} from '../../../models/quotations-page/diy-quotation-page/IDIYQuotationModel'
import {getAllProductCategoryApi} from '../../../modules/product-master-page/product-category-master-page/ProductCategoryCRUD'
import {toast} from 'react-toastify'
import {IPlanAreaModel} from '../../../models/product-page/IPlanAreaModel'
import {AddCartDIYQuotationList} from './AddCartDIYQuotationList'
import Loader from '../../common-pages/Loader'
import {GetCartListFromPackageIDApi} from '../../../modules/customization-quotation-master-page/CustomizationQuotationsCRUD'

interface IDIY {
  loading: boolean
  diyProductListData: IDIYProductListModel[]
  categoryData: IProductCategoryModel[]
  planAreaData: IPlanAreaModel[]
  searchText: string
  selQuotationID: number
  selPackageID: number
  tmpCartLength: number
  selCategoryId: number
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
  addCartPlanAreaId: number
  addCartCategoryId: number
}

const CustomizationCartByQuotationID = () => {
  const {quotationID} = useParams<{quotationID: string}>()
  const location = useLocation()

  const [state, setState] = useState<IDIY>({
    loading: false,
    diyProductListData: [] as IDIYProductListModel[],
    categoryData: [] as IProductCategoryModel[],
    planAreaData: [] as IPlanAreaModel[],
    searchText: '',
    selQuotationID: 0,
    selPackageID: 0,
    tmpCartLength: 0,
    selCategoryId: 0,
    customerName: '',
    bhkName: '',
    carpetAreaName: '',
    projectName: '',
    projectNumber: '',
    mainCustomerID: 0,
    mainEmployeeID: 0,
    mainSearch: '',
    SearchInView: '',
    SearchInAddCart: '',
    addCartPlanAreaId: 0,
    addCartCategoryId: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
     let lc: any = location.state
      console.log(lc)
     let selPackageID = lc.packageID
     let customerName = lc.customerName
     let bhkName = lc.bhkName
     let carpetAreaName = lc.carpetAreaName
     let projectName = lc.projectName
     let projectNumber = lc.projectNumber
     let mainEmployeeID = lc.mainEmployeeID
     let mainCustomerID = lc.mainCustomerID
     let mainSearch = lc.mainSearch
     let SearchInView = lc.SearchInView
     let SearchInAddCart = lc.SearchInAddCart
     let addCartPlanAreaId = lc.selPlanAreaId
     let addCartCategoryId = lc.selCategoryId

      // if (
      //   lc.mainEmployeeID !== undefined ||
      //   lc.mainCustomerID !== undefined ||
      //   lc.mainSearch !== undefined
      // ) {
      //   mainEmployeeID = lc.mainEmployeeID
      //   mainCustomerID = lc.mainCustomerID
      //   mainSearch = lc.mainSearch
      // }
      getProdCategoryData(
        selPackageID,
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
        addCartPlanAreaId,
        addCartCategoryId,
        state.tmpCartLength
      )
    }, 100)
  }, [])

  function getProdCategoryData(
    selPackageID: number,
    customerName: string,
    bhkName: string,
    carpetAreaName: string,
    projectName: string,
    projectNumber: string,
    mainCustomerID: number,
    mainEmployeeID: number,
    mainSearch: string,
    SearchInView: string,
    SearchInAddCart: string,
    addCartPlanAreaId: number,
    addCartCategoryId: number,
    tmpCount: number
  ) {
    GetCartListFromPackageIDApi(parseInt(quotationID), selPackageID, 2)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            categoryData: responseData,
            selQuotationID: parseInt(quotationID),
            selPackageID: selPackageID,
            tmpCartLength: tmpCount,
            customerName: customerName,
            bhkName: bhkName,
            carpetAreaName: carpetAreaName,
            projectName: projectName,
            projectNumber: projectNumber,
            mainCustomerID,
            mainEmployeeID,
            mainSearch,
            SearchInView,
            SearchInAddCart,
            addCartPlanAreaId:addCartPlanAreaId,
            addCartCategoryId:addCartCategoryId,
            loading: false,
          })
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

  return (
    <>
      <Loader loading={state.loading} />
      <div className={state.loading === true ? 'd-none' : 'card card-xl-stretch mb-5 mb-xl-8'}>
        {/* begin::Header */}
        <div className='card-header align-items-center border-0 m-1'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='fw-bolder text-dark'>Customer : {state.customerName}</span>
            <span className='fw-bold text-muted mt-1 fs-5'>
              Project : {state.projectName}({state.projectNumber})
            </span>
          </h3>
          <h6 className='card-title align-items-start flex-column'>
            <span className='fw-bold text-muted mt-1 fs-5'>BHK : {state.bhkName}</span>
            <span className='fw-bold text-muted mt-1 fs-5'>
              Carpet Area : {state.carpetAreaName}
            </span>
          </h6>
          <div className='card-toolbar'></div>
        </div>
        {/* end::Header */}
        {/* begin::Item */}
        <AddCartDIYQuotationList
          selQuotationId={state.selQuotationID}
          pageName={'Add'}
          customerName={state.customerName}
          bhkName={state.bhkName}
          carpetAreaName={state.carpetAreaName}
          projectName={state.projectName}
          projectNumber={state.projectNumber}
          mainCustomerID={state.mainCustomerID}
          mainEmployeeID={state.mainEmployeeID}
          mainSearch={state.mainSearch}
          SearchInView={state.SearchInView}
          SearchInAddCart={state.SearchInAddCart}
          selPlanAreaId={state.addCartPlanAreaId}
          selCategoryId={state.addCartCategoryId}
        />
        {/* end::Item */}
      </div>
    </>
  )
}

export default CustomizationCartByQuotationID
