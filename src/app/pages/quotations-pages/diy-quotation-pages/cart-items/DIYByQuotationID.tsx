import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import {IProductCategoryModel} from '../../../../models/product-page/IProductCategoryModel'
import {IDIYProductListModel} from '../../../../models/quotations-page/diy-quotation-page/IDIYQuotationModel'
import {getAllProductCategoryApi} from '../../../../modules/product-master-page/product-category-master-page/ProductCategoryCRUD'
import {toast} from 'react-toastify'
import {IPlanAreaModel} from '../../../../models/product-page/IPlanAreaModel'
import {AddCartDIYQuotationList} from './AddCartDIYQuotationList'
import Loader from '../../../common-pages/Loader'

interface IDIY {
  loading: boolean
  diyProductListData: IDIYProductListModel[]
  categoryData: IProductCategoryModel[]
  planAreaData: IPlanAreaModel[]
  searchText: string
  selQuotationID: number
  tmpQuotationID: number
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

const DIYByQuotationID = () => {
  const {quotationID} = useParams<{quotationID: string}>()
  const location = useLocation()

  // const totalCount: number = useSelector<RootState>(
  //   ({counterReducer}) => counterReducer.counter,
  //   shallowEqual
  // ) as number

  const [state, setState] = useState<IDIY>({
    loading: false,
    diyProductListData: [] as IDIYProductListModel[],
    categoryData: [] as IProductCategoryModel[],
    planAreaData: [] as IPlanAreaModel[],
    searchText: '',
    selQuotationID: 0,
    tmpQuotationID: 0,
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
      console.log(lc)
      var tmpQuotationID = lc.quotationID
      var customerName = lc.customerName
      var bhkName = lc.bhkName
      var carpetAreaName = lc.carpetAreaName
      var projectName = lc.projectName
      var projectNumber = lc.projectNumber

      var mainEmployeeID: number = 0
      var mainCustomerID: number = 0
      var mainSearch: string = ''
      if (
        lc.mainEmployeeID !== undefined ||
        lc.mainCustomerID !== undefined ||
        lc.mainSearch !== undefined
      ) {
        mainEmployeeID = lc.mainEmployeeID
        mainCustomerID = lc.mainCustomerID
        mainSearch = lc.mainSearch
      }
      getProdCategoryData(
        tmpQuotationID,
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
    tmpQuotationID: number,
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
    getAllProductCategoryApi()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            categoryData: responseData,
            selQuotationID: parseInt(quotationID),
            tmpQuotationID: tmpQuotationID,
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
      {/* <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
            to={{
              pathname: '/quotations/diy-quotation/list',
              state: {
                employeeID: state.mainEmployeeID,
                customerID: state.mainCustomerID,
                mainSearch: state.mainSearch,
              },
            }}
          >
            Back To List
          </Link>
        </span>
      </div> */}
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
          <div className='card-toolbar'>
            {/* begin::Menu */}
            {/* <button
              type='button'
              className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary border'
              data-kt-menu-trigger='click'
              data-kt-menu-placement='bottom-end'
              data-kt-menu-flip='top-end'
              // onClick={()=>()}
            >
              <Link
                to={{
                  pathname: `/quotations/diy-quotation/view-cart/${state.selQuotationID}`,
                  state: {
                    quotationID: state.selQuotationID,
                    customerName: state.customerName,
                    bhkName: state.bhkName,
                    carpetAreaName: state.carpetAreaName,
                    projectName: state.projectName,
                    projectNumber: state.projectNumber,
                  },
                }}
              >
                <KTSVG path='/media/icons/duotune/ecommerce/ecm001.svg' className='svg-icon-2x' />
                {0} 
              </Link>
            </button> */}
            {/* <Dropdown1 /> */}
            {/* end::Menu */}
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Item */}
        <AddCartDIYQuotationList
          selQuotationId={state.selQuotationID}
          // tmpCartLength={state.tmpCartLength}
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

export default DIYByQuotationID
