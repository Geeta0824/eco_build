import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams, useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'
import Search from 'antd/es/input/Search'
import {Button, Modal} from 'react-bootstrap-v5'
import {KTSVG, toAbsoluteUrl} from '../../../../../_Ecd/helpers'
import LoaderInTable from '../../../common-pages/LoaderInTable'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup'
import Loader from '../../../common-pages/Loader'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'
import {IPlanAreaModel} from '../../../../models/product-page/IPlanAreaModel'
import {
  GetCartListFromPackageIDApi,
  GetProductAsAddonListForCarpetryListApi,
  deleteCarpentryQueAreaByIDApi,
  deleteCarpentryQueOfferByIDApi,
} from '../../../../modules/carpetry-master-page/carpetry-quotation-master-page/CarpetryQuotationCRUD'
import {
  ICartLisyByQuotationModel,
  IDIYCheckOutModel,
  IDIYProductListModel,
  IOfferListQuotationModel,
} from '../../../../models/carpetry-page/IDIYQuotationModel'
import {IAddonMasterModel} from '../../../../models/carpetry-page/IAddonMasterModel'
import {getAddonItemApi} from '../../../../modules/carpetry-master-page/addon-master-page/AddonMasterCRUD'
import {ModelPopUpDelete} from '../../../common-pages/ModelPopUpDelete'
import BlankDataImage from '../../../common-pages/BlankDataImage'
import {IOfferModel} from '../../../../models/master-page/IOfferModel'
import {IUpgradeItemModel} from '../../../../models/product-page/IUpgradeItemModel'
import {IDIYUpgradeItemModel} from '../../../../models/quotations-page/diy-quotation-page/IDIYQuotationModel'
import {
  AddAgain_ReadyMade_Addon_CarpentryQueProductByIDApi,
  deleteReadyMade_AddonCarpentryQueProductByIDApi,
  SaveAddOnTurnkeyQuotaionDetailinCart_AddonItem_ReadyMadeAPI,
} from '../../../../modules/design-addon/ready-made-addon/ReadyMadeCRUD'

type Props = {}

interface IDIY {
  loading: boolean
  cartListData: ICartLisyByQuotationModel[]
  offerquotationListData: IOfferListQuotationModel[]
  temCartListData: ICartLisyByQuotationModel[]
  objCartListData: IDIYProductListModel[]
  planAreaData: IPlanAreaModel[]
  checkOutData: IDIYCheckOutModel[]
  offerData: IOfferModel[]
  tmpOfferData: IOfferModel[]
  upgradeItemData: IUpgradeItemModel[]
  upgradeItemList: IDIYUpgradeItemModel[]
  SearchText: string
  selQuotationID: number
  selPackageID: number
  selPackageTypeID: number
  selQuotationDetailID: number
  planAreaID: number
  customerName: string
  bhkName: string
  carpetAreaName: string
  projectName: string
  projectNumber: string
  selTitle: string
  selListTypeID: number
  selQuteID: number
  selPlanAreaID: number
  addonItemData: IAddonMasterModel[]
  temAddonDataData: IAddonMasterModel[]
  productList: IDIYProductListModel[]
  tmpProductList: IDIYProductListModel[]
  selPlanAreaId: number
  selOfferID: number
  selProjectTypeID: number
  selDiyUpgrageItemMapID: number
  mainEmployeeID: number
  mainCustomerID: number
  mainSearch: string
}

const CartListReadyMadeAddon: React.FC<Props> = () => {
  const {quotationID} = useParams<{quotationID: string}>()
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [selProductID, setSelProductID] = useState<number>(0)
  const location = useLocation()
  const history = useHistory()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [cartLength, setCartLength] = useState<number>(0)

  const [state, setState] = useState<IDIY>({
    loading: false,
    cartListData: [] as ICartLisyByQuotationModel[],
    offerquotationListData: [] as IOfferListQuotationModel[],
    temCartListData: [] as ICartLisyByQuotationModel[],
    objCartListData: [] as IDIYProductListModel[],
    planAreaData: [] as IPlanAreaModel[],
    checkOutData: [] as IDIYCheckOutModel[],
    offerData: [] as IOfferModel[],
    tmpOfferData: [] as IOfferModel[],
    upgradeItemData: [] as IUpgradeItemModel[],
    upgradeItemList: [] as IDIYUpgradeItemModel[],
    SearchText: '',
    selQuotationID: 0,
    selQuotationDetailID: 0,
    selPackageID: 0,
    selPackageTypeID: 0,
    planAreaID: 0,
    customerName: '',
    bhkName: '',
    carpetAreaName: '',
    projectName: '',
    projectNumber: '',
    selTitle: '',
    selListTypeID: 0,
    selQuteID: 0,
    selPlanAreaID: 0,
    addonItemData: [] as IAddonMasterModel[],
    temAddonDataData: [] as IAddonMasterModel[],
    productList: [] as IDIYProductListModel[],
    tmpProductList: [] as IDIYProductListModel[],
    selPlanAreaId: 0,
    selOfferID: 0,
    selProjectTypeID: 0,
    selDiyUpgrageItemMapID: 0,
    mainEmployeeID: 0,
    mainCustomerID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      var lc: any = location.state
      console.log(lc)
      var selPackageID = lc.packageID
      var selPackageTypeID = lc.packageTypeID
      var customerName = lc.customerName
      var bhkName = lc.bhkName
      var carpetAreaName = lc.carpetAreaName
      var projectName = lc.projectName
      var projectNumber = lc.projectNumber
      var bhkid = lc.bhkid
      var carpetAreaID = lc.carpetAreaID
      var projectTypeID = lc.projectTypeID
      var mainEmployeeID = lc.mainEmployeeID
      var mainCustomerID = lc.mainCustomerID
      var mainSearch = lc.mainSearch
      getAllAddonItemData(
        selPackageID,
        selPackageTypeID,
        customerName,
        bhkName,
        carpetAreaName,
        projectName,
        projectNumber,
        projectTypeID,
        mainEmployeeID,
        mainCustomerID,
        mainSearch
      )
    }, 100)
  }, [])

  function getAllAddonItemData(
    selPackageID: number,
    selPackageTypeID: number,
    customerName: string,
    bhkName: string,
    carpetAreaName: string,
    projectName: string,
    projectNumber: string,
    projectTypeID: number,
    mainEmployeeID: number,
    mainCustomerID: number,
    mainSearch: string
  ) {
    getAddonItemApi()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          getAllDIYQuotationData(
            selPackageID,
            selPackageTypeID,
            customerName,
            bhkName,
            carpetAreaName,
            projectName,
            projectNumber,
            projectTypeID,
            mainEmployeeID,
            mainCustomerID,
            mainSearch,
            responseData
          )
          setState({
            ...state,
            addonItemData: responseData,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, addonItemData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, addonItemData: [], loading: false})
      })
  }

  function getAllDIYQuotationData(
    selPackageID: number,
    selPackageTypeID: number,
    customerName: string,
    bhkName: string,
    carpetAreaName: string,
    projectName: string,
    projectNumber: string,
    projectTypeID: number,
    mainEmployeeID: number,
    mainCustomerID: number,
    mainSearch: string,
    addonItemData: IAddonMasterModel[]
  ) {
    GetCartListFromPackageIDApi(parseInt(quotationID), selPackageID, selPackageTypeID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          const respofferData = response.data.offerList
          let prvTmpAreaID: number = 0
          const temRows = []
          const Rows: ICartLisyByQuotationModel[] = responseData
          const OfferRows: IOfferListQuotationModel[] = respofferData

          for (let key in Rows) {
            if (Rows[key] == Rows[0]) {
              Rows[key].titleAreaName = Rows[key].areaName
              Rows[key].titleAreaID = 0
              prvTmpAreaID = Rows[key].planAreaID
            } else {
              if (prvTmpAreaID == Rows[key].planAreaID) {
                Rows[key].titleAreaName = ''
                Rows[key].titleAreaID = 1
              } else {
                Rows[key].titleAreaName = Rows[key].areaName
                Rows[key].titleAreaID = 0
                prvTmpAreaID = Rows[key].planAreaID
              }
            }
            temRows.push(Rows[key])
          }
          setState({
            ...state,
            cartListData: temRows,
            offerquotationListData: OfferRows,
            temCartListData: temRows,
            selQuotationID: parseInt(quotationID),
            selPackageID: selPackageID,
            customerName: customerName,
            bhkName: bhkName,
            carpetAreaName: carpetAreaName,
            projectName: projectName,
            projectNumber: projectNumber,
            selProjectTypeID: projectTypeID,
            mainEmployeeID,
            mainCustomerID,
            mainSearch,
            selQuotationDetailID: 0,
            addonItemData: addonItemData,
            temAddonDataData: addonItemData,
            loading: false,
          })
          setCartLength(responseData.length)
          localStorage.setItem('totalCounts', responseData.length)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, cartListData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, cartListData: [], loading: false})
      })
  }

  // ==================Delete Model Function===============
  const [showDeleteArea, setShowDeleteArea] = useState(false)
  const handleCloseDeleteArea = () => setShowDeleteArea(false)
  const handleShowDeleteAreaItem = (temPlanAreaID: number) => {
    setState({
      ...state,
      selPlanAreaID: temPlanAreaID,
      loading: false,
    })
    setShowDeleteArea(true)
  }

  // -------------------------  Pending -------------------------
  function deleteCarpentryQuoeAreaItem(temPlanAreaID: number) {
    deleteCarpentryQueAreaByIDApi(parseInt(quotationID), temPlanAreaID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllDIYQuotationData(
            state.selPackageID,
            state.selPackageTypeID,
            state.customerName,
            state.bhkName,
            state.carpetAreaName,
            state.projectName,
            state.projectNumber,
            state.selProjectTypeID,
            state.mainEmployeeID,
            state.mainCustomerID,
            state.mainSearch,
            state.addonItemData
          )
          setShowDeleteArea(false)
        } else {
          toast.error(`${response.data.massege}`)
          setShowDeleteArea(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowDeleteArea(false)
      })
  }

  // ==================Delete Model Function===============
  const [showDeleteProduct, setShowDeleteProduct] = useState(false)
  const handleCloseDeleteProduct = () => setShowDeleteProduct(false)
  const handleShowDeleteProductItem = (temQueDetailID: number) => {
    setState({
      ...state,
      selQuotationDetailID: temQueDetailID,
      loading: false,
    })
    setShowDeleteProduct(true)
  }

  // -------------------------  Pending -------------------------
  function deleteCarpentryQuaeProductItem(temQuotationDtlID: number) {
    deleteReadyMade_AddonCarpentryQueProductByIDApi(temQuotationDtlID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllDIYQuotationData(
            state.selPackageID,
            state.selPackageTypeID,
            state.customerName,
            state.bhkName,
            state.carpetAreaName,
            state.projectName,
            state.projectNumber,
            state.selProjectTypeID,
            state.mainEmployeeID,
            state.mainCustomerID,
            state.mainSearch,
            state.addonItemData
          )
          setShowDeleteProduct(false)
        } else {
          toast.error(`${response.data.massege}`)
          setShowDeleteProduct(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowDeleteProduct(false)
      })
  }

  // ------------------------------------  Add Again Item API ------------------------
  function AddAgainCarpentryQuaeProductItem(temQuotationDtlID: number) {
    AddAgain_ReadyMade_Addon_CarpentryQueProductByIDApi(temQuotationDtlID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Item Add Successfully')
          getAllDIYQuotationData(
            state.selPackageID,
            state.selPackageTypeID,
            state.customerName,
            state.bhkName,
            state.carpetAreaName,
            state.projectName,
            state.projectNumber,
            state.selProjectTypeID,
            state.mainEmployeeID,
            state.mainCustomerID,
            state.mainSearch,
            state.addonItemData
          )
        } else {
          toast.error(`${response.data.massege}`)
          setMainLoading(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setMainLoading(false)
      })
  }
  // ============================================== New Changes ==========================================================

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

  // ================== AddOn PopUp =====================
  const [show, setShow] = useState(false)
  function handleCloseAddOnItem() {
    getAllDIYQuotationData(
      state.selPackageID,
      state.selPackageTypeID,
      state.customerName,
      state.bhkName,
      state.carpetAreaName,
      state.projectName,
      state.projectNumber,
      state.selProjectTypeID,
      state.mainEmployeeID,
      state.mainCustomerID,
      state.mainSearch,
      state.addonItemData
    )
    GetProductAsAddonListForCarpetryListData((state.selQuteID = 0), (state.SearchText = ''))
    setName('')
    setSelProductIDLen('')
    setShow(false)
  }

  function GetProductAsAddonListForCarpetryListData(temqueID: number, SearchText: string) {
    GetProductAsAddonListForCarpetryListApi(SearchText)
      .then((response) => {
        if (response.data.isSuccess === true) {
          const responseDate = response.data.responseObject
          setState({
            ...state,
            productList: responseDate,
            selQuteID: temqueID,
            SearchText: SearchText,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
    setShow(true)
  }

  // ==================Delete Model Function===============
  // const [showDeleteOffer, setShowDeleteOffer] = useState(false)
  // const handleCloseDeleteOffer = () => setShowDeleteOffer(false)
  // const handleShowDeleteOffer = (temOfferID: number) => {
  //   setState({
  //     ...state,
  //     selOfferID: temOfferID,
  //     loading: false,
  //   })
  //   setShowDeleteOffer(true)
  // }

  // function deleteCarpentryQuoeOfferItem(temOfferID: number) {
  //   deleteCarpentryQueOfferByIDApi(temOfferID)
  //     .then((response) => {
  //       if (response.data.isSuccess == true) {
  //         toast.success('Deleted Successfully')
  //         getAllDIYQuotationData(
  //           state.selPackageID,
  //           state.selPackageTypeID,
  //           state.customerName,
  //           state.bhkName,
  //           state.carpetAreaName,
  //           state.projectName,
  //           state.projectNumber,
  //           state.selProjectTypeID,
  //           state.mainEmployeeID,
  //           state.mainCustomerID,
  //           state.mainSearch,
  //           state.addonItemData
  //         )
  //         setShowDeleteOffer(false)
  //       } else {
  //         toast.error(`${response.data.massege}`)
  //         setShowDeleteOffer(false)
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setShowDeleteOffer(false)
  //     })
  // }

  // ======================================== End Offer Block =========================
  const searchFilter = (value: string) => {
    const keyword = value
    if (keyword !== '') {
      GetProductAsAddonListForCarpetryListData(state.selQuteID, keyword)
    } else {
      GetProductAsAddonListForCarpetryListData(state.selQuteID, '')
    }
  }

  // ===========================Add  AddOn Items Function =====================
  function addOnAddToCart(productList: IDIYProductListModel) {
    setSelProductID(productList.productID)
    setMainLoading(true)
    SaveAddOnTurnkeyQuotaionDetailinCart_AddonItem_ReadyMadeAPI(
      state.selQuteID,
      productList.productCategoryID,
      productList.productID,
      0,
      productList.defaultUnitID,
      productList.length,
      productList.depth,
      productList.height,
      productList.noOfUnit,
      '',
      user.employeeID
    )
      .then((response) => {
        if (response.data.isSuccess === true) {
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

  const [name, setName] = useState('')
  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.temCartListData.filter((user) => {
        return (
          user.productName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.unitName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.noOfUnit.toLowerCase().includes(keyword.toLowerCase()) ||
          user.length.toLowerCase().includes(keyword.toLowerCase()) ||
          user.height.toLowerCase().includes(keyword.toLowerCase()) ||
          user.depth.toLowerCase().includes(keyword.toLowerCase()) ||
          user.areaName.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, cartListData: results})
    } else {
      setState({...state, cartListData: state.temCartListData})
    }
    setName(keyword)
  }

  return (
    <>
      <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
            to={{
              pathname: '/design/readymade-addon/list',
              state: {
                projectTypeID: state.selProjectTypeID,
                employeeID: state.mainEmployeeID,
                customerID: state.mainCustomerID,
                mainSearch: state.mainSearch,
              },
            }}
          >
            Back To List
          </Link>
        </span>
      </div>
      <Loader loading={state.loading} />
      <div className={state.loading === true ? 'd-none' : `card`}>
        <div className='card-header align-items-center border-0 m-1'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='fw-bold text-muted mt-1 fs-5'>
              Customer : <span className='text-dark fw-bolder'>{state.customerName}</span>
            </span>
            <span className='fw-bold text-muted mt-1 fs-5'>
              Project :{' '}
              <span className='text-dark fw-bolder'>
                {state.projectName}({state.projectNumber})
              </span>
            </span>
          </h3>
          <h6 className='card-title align-items-start flex-column'>
            <span className='fw-bold text-muted mt-1 fs-5'>
              BHK : <span className='text-dark fw-bolder'>{state.bhkName}</span>
            </span>
            <span className='fw-bold text-muted mt-1 fs-5'>
              Carpet Area : <span className='text-dark fw-bolder'>{state.carpetAreaName}</span>
            </span>
          </h6>
          <div className='card-toolbar'></div>
        </div>
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='border-0 p-2' id=''>
            <form className='w-100 position-relative' autoComplete='off'>
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
            </form>
          </div>
          <div
            className='card-toolbar border border-primary rounded'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
          >
            <span
              className='btn btn-sm btn-light-primary bg-white fs-5'
              onClick={() =>
                GetProductAsAddonListForCarpetryListData(parseInt(quotationID), state.SearchText)
              }
            >
              Addon Item
            </span>
          </div>
        </div>
        {/* begin::Body */}
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered table-rounded align-middle border g-4'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-75px text-center'>Name</th>
                  <th className='min-w-75px text-center'>Description</th>
                  <th className='w-5px text-center'>Unit</th>
                  <th className='w-5px text-center'>L</th>
                  <th className='w-5px text-center'>H</th>
                  <th className='w-5px text-center'>D</th>
                  <th className='w-5px text-center'>Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                <LoaderInTable loading={state.loading} column={15} />
                {state.cartListData.length > 0 &&
                  state.cartListData.map((data, index) => {
                    return (
                      <>
                        <tr
                          className={data.titleAreaID === 0 ? '' : 'd-none'}
                          key={data.quotationDetailID}
                        >
                          <td
                            colSpan={6}
                            className='text-primary text-center text-hover-primary fw-bolder fs-4'
                          >
                            {data.titleAreaName}
                          </td>

                          <td>
                            {data.isAreaMandatory === true ? (
                              <div className='d-none'></div>
                            ) : (
                              <div
                                onClick={() => handleShowDeleteAreaItem(data.planAreaID)}
                                className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                              >
                                <KTSVG
                                  path='/media/icons/duotune/general/gen027.svg'
                                  className='ssvg-icon-3 svg-icon-danger'
                                />
                              </div>
                            )}
                          </td>
                        </tr>
                        <tr
                          className={
                            data.isRemovedByDesigner === true
                              ? 'border-bottom bg-danger'
                              : 'border-bottom'
                          }
                        >
                          <td>
                            <div className='d-flex align-items-center'>
                              <div className='symbol symbol-45px me-5 cursor-pointer'>
                                {data.photoPath !== '' ? (
                                  <img
                                    src={process.env.REACT_APP_API_URL + data.photoPath}
                                    alt=''
                                  />
                                ) : (
                                  <img
                                    src={toAbsoluteUrl('/media/img/NoProductImage.png')}
                                    alt=''
                                  />
                                )}
                              </div>
                              <div className='d-flex justify-content-start flex-column'>
                                <a href='#' className='text-dark text-hover-primary fs-6'>
                                  {data.productName}
                                </a>
                              </div>
                            </div>
                          </td>
                          <td className='text-dark mb-1 fs-6'>
                            {data.description == '' || data.description == null
                              ? ''
                              : data.description}
                          </td>
                          <td className='text-dark text-center mb-1 fs-6'>{data.unitName}</td>
                          <td className='text-dark mb-1 fs-6 text-end'>{data.length}</td>
                          <td className='text-dark mb-1 fs-6 text-end'>{data.height}</td>
                          <td className='text-dark mb-1 fs-6 text-end'>{data.depth}</td>
                          <td>
                            {data.isProductMandatory === true ? (
                              <div className='d-none'></div>
                            ) : data.isRemovedByDesigner === false ? (
                              <div
                                onClick={() => handleShowDeleteProductItem(data.quotationDetailID)}
                                className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                              >
                                <KTSVG
                                  path='/media/icons/duotune/general/gen027.svg'
                                  className='ssvg-icon-3 svg-icon-danger'
                                />
                              </div>
                            ) : (
                              <td>
                                <div
                                  onClick={() =>
                                    AddAgainCarpentryQuaeProductItem(data.quotationDetailID)
                                  }
                                  className='btn btn-icon btn-bg-success bg-hover-primary text-hover-inverse-white btn-sm'
                                >
                                  <span className='text-white'>Add</span>
                                </div>
                              </td>
                            )}
                          </td>
                        </tr>
                      </>
                    )
                  })}
                {/* =================== Image no data ============== */}
                <BlankDataImageInTable
                  colSpan={13}
                  length={state.cartListData.length}
                  loading={state.loading}
                />
              </tbody>
            </table>
          </div>
        </div>
        {/* ====================================== For Offer Display =======================*/}
        <div className={state.offerquotationListData.length > 0 ? 'py-0 ' : 'py-0 d-none'}>
          <div className='table-responsive'>
            <table className='table table-bordered table-rounded align-middle border g-4'>
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5 bg-white'>
                  <th
                    colSpan={3}
                    className='text-primary text-center text-hover-primary fw-bolder fs-4'
                  >
                    Offer List
                  </th>
                </tr>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>Title</th>
                  <th className='min-w-150px'>Description</th>
                  {/* <th className='w-5px text-end'>Delete</th> */}
                </tr>
              </thead>

              <tbody className="border-bottom">
                <LoaderInTable loading={state.loading} column={3} />
                {state.offerquotationListData.length > 0 &&
                  state.offerquotationListData.map((data, index) => {
                    return (
                      <>
                        <tr key={data.turnekyQutationOfferID}>
                          <td className='text-dark fs-4'>{data.offerTitle}</td>
                          <td className='text-dark fs-6'>{data.offerDesc}</td>

                          {/* <td className='text-end fs-2'>
                            <div
                              onClick={() => handleShowDeleteOffer(data.turnekyQutationOfferID)}
                              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                            >
                              <KTSVG
                                path='/media/icons/duotune/general/gen027.svg'
                                className='ssvg-icon-3 svg-icon-danger'
                              />
                            </div>
                          </td> */}
                        </tr>
                      </>
                    )
                  })}
                {/* =================== Image no data ============== */}
                <BlankDataImageInTable
                  colSpan={13}
                  length={state.offerquotationListData.length}
                  loading={state.loading}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ----------------------------Customer Selection Model---------------------- */}
      <Modal size='xl' scrollable={true} show={show} onHide={handleCloseAddOnItem}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Addon Item Data</Modal.Title>
            <div className='border-0 pt-0' id='kt_chat_contacts_header'>
              <label className='form-label fw-bold text-white'>Search :</label>
              <Search
                placeholder='input search text'
                value={name}
                allowClear
                onChange={(e) => setName(e.target.value)}
                onSearch={(value) => searchFilter(value)}
              />
            </div>
          </Modal.Header>
        </div>
        <Modal.Body>
          {state.loading ? (
            <LoaderInTable loading={state.loading} column={15} />
          ) : (
            <div className='card-body p-0 m-0 overflow-auto h-100'>
              {state.productList.length > 0 &&
                state.productList.map((data, index) => {
                  return (
                    <div key={data.productID} className='d-flex p-5 mb-4 shadow-sm'>
                      <div className='d-block align-items-center'>
                        <div className='symbol symbol-50px symbol-2by3 text-center'>
                          {data.photoPath !== '' ? (
                            <img src={process.env.REACT_APP_API_URL + data.photoPath} alt='' />
                          ) : (
                            <div
                              className='symbol-label'
                              style={{
                                backgroundImage: `url(${toAbsoluteUrl(
                                  '/media/img/NoProductImage.png'
                                )})`,
                              }}
                            ></div>
                          )}
                        </div>
                        <div className='card-toolbar rounded text-center mt-0'>
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
                              className='btn btn-sm btn-light-primary bg-white border border-primary text-center py-2 px-3'
                              onClick={() => addOnAddToCart(data)}
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
                                type='text'
                                id={`${data.productID}`}
                                value={
                                  selProductIDLen == `txtLen${data.productID}`
                                    ? valueLen
                                    : data.length
                                }
                                onChange={(e) => handleLengthChange(e)}
                                className='text-center w-60px h-30px bg-light-primary border-0 rounded'
                              />
                            </span>
                            <span className='text-muted fw-bold ps-4'>
                              H : &nbsp;
                              <input
                                type='text'
                                id={`${data.productID}`}
                                disabled={!data.isHeightChange}
                                value={
                                  selProductIDHei == `txthei${data.productID}`
                                    ? valueHei
                                    : data.height
                                }
                                onChange={(e) => handleHeightChange(e)}
                                className='text-center w-60px h-30px bg-light-primary border-0 rounded'
                              />
                            </span>
                            <span className='text-muted fw-bold ps-4'>
                              D : &nbsp;
                              <input
                                type='text'
                                disabled
                                value={data.depth}
                                className='text-center w-60px h-30px bg-light-primary border-0 rounded'
                              />
                            </span>
                            <span className='text-muted fw-bold ps-4'>
                              No Of Unit : &nbsp;
                              <input
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
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseAddOnItem}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =====================Delete Area Item =============== */}
      <ModelPopUpDelete
        id={state.selPlanAreaID}
        pageName={'Carpentry Quotation Area Item'}
        show={showDeleteArea}
        handleClose={handleCloseDeleteArea}
        deleteData={() => deleteCarpentryQuoeAreaItem(state.selPlanAreaID)}
      />
      {/* =====================Delete Product Item =============== */}
      <ModelPopUpDelete
        id={state.selQuotationDetailID}
        pageName={'Carpentry Quotation Product Item'}
        show={showDeleteProduct}
        handleClose={handleCloseDeleteProduct}
        deleteData={() => deleteCarpentryQuaeProductItem(state.selQuotationDetailID)}
      />
      {/* =====================Delete Offer Item =============== */}
      {/* <ModelPopUpDelete
        id={state.selOfferID}
        pageName={'Offer Item'}
        show={showDeleteOffer}
        handleClose={handleCloseDeleteOffer}
        deleteData={() => deleteCarpentryQuoeOfferItem(state.selOfferID)}
      /> */}
    </>
  )
}

export default CartListReadyMadeAddon
