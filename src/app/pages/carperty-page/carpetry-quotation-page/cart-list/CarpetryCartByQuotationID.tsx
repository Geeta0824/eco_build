import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import {IDIYProductListModel} from '../../../../models/quotations-page/diy-quotation-page/IDIYQuotationModel'
import {IProductCategoryModel} from '../../../../models/product-page/IProductCategoryModel'
import {IPlanAreaModel} from '../../../../models/product-page/IPlanAreaModel'
import {GetCartListFromPackageIDApi} from '../../../../modules/carpetry-master-page/carpetry-quotation-master-page/CarpetryQuotationCRUD'
import {toast} from 'react-toastify'
import Loader from '../../../common-pages/Loader'
import {AddCartDIYCarpetryQuotation} from './AddCartDIYCarpetryQuotation'

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
  mainEmployeeID: number
  mainCustomerID: number
  mainSearch: string
}

const CarpetryCartByQuotationID = () => {
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
    mainEmployeeID: 0,
    mainCustomerID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      var lc: any = location.state
      var selPackageID = lc.packageID
      var customerName = lc.customerName
      var bhkName = lc.bhkName
      var carpetAreaName = lc.carpetAreaName
      var projectName = lc.projectName
      var projectNumber = lc.projectNumber
      var mainEmployeeID = lc.mainEmployeeID
      var mainCustomerID = lc.mainCustomerID
      var mainSearch = lc.mainSearch
      getProdCategoryData(
        selPackageID,
        customerName,
        bhkName,
        carpetAreaName,
        projectName,
        projectNumber,
        mainEmployeeID,
        mainCustomerID,
        mainSearch,
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
    mainEmployeeID: number,
    mainCustomerID: number,
    mainSearch: string,
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
            mainEmployeeID,
            mainCustomerID,
            mainSearch,
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
        <AddCartDIYCarpetryQuotation
          selQuotationId={state.selQuotationID}
          pageName={'Add'}
          customerName={state.customerName}
          bhkName={state.bhkName}
          carpetAreaName={state.carpetAreaName}
          projectName={state.projectName}
          projectNumber={state.projectNumber}
          mainEmployeeID={state.mainEmployeeID}
          mainCustomerID={state.mainCustomerID}
          mainSearch={state.mainSearch}
        />
        {/* end::Item */}
      </div>
    </>
  )
}

export default CarpetryCartByQuotationID
