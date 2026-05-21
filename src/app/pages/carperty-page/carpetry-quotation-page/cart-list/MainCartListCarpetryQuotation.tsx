import {Drawer, DrawerProps, Pagination, Space} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams, useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'
import Search from 'antd/es/input/Search'
import {Button, Modal, ToastHeader} from 'react-bootstrap-v5'
import {KTSVG, toAbsoluteUrl} from '../../../../../_Ecd/helpers'
import LoaderInTable from '../../../common-pages/LoaderInTable'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup'
import Loader from '../../../common-pages/Loader'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'
import {IPlanAreaModel} from '../../../../models/product-page/IPlanAreaModel'
import {CheckOutList} from './CheckOutList'
import {DrawerChangeProduct} from './DrawerChangeProduct'
import {
  AddAgainCarpentryQueProductByIDApi,
  AddOfferTurnkeyCustomQuotationAPI,
  CheckoutTurnkeyQuotationApi,
  GetCartListFromPackageIDApi,
  GetProductAsAddonListForCarpetryListApi,
  SaveAddOnTurnkeyQuotaionDetailinCartApi,
  deleteCarpentryQueAreaByIDApi,
  deleteCarpentryQueOfferByIDApi,
  deleteCarpentryQueProductByIDApi,
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
import {getOfferListByBranchIDAPI} from '../../../../modules/master-page/offer-master-page/OfferCRUD'
import {getAllUpgradeItemByQuotationID} from '../../../../modules/product-master-page/upgrade-item-master-page/UpradeItemCRUD'
import {IUpgradeItemModel} from '../../../../models/product-page/IUpgradeItemModel'
import {
  addDIYUpgradeItemApi,
  deleteDIYUpgradeItemByIDApi,
} from '../../../../modules/quotations-master-page/diy-quotation-master-page/DIYQuotationCRUD'
import {IDIYUpgradeItemModel} from '../../../../models/quotations-page/diy-quotation-page/IDIYQuotationModel'

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
  // selQuotationID: number
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

const MainCartListCarpetryQuotation: React.FC<Props> = () => {
  const {quotationID} = useParams<{quotationID: string}>()
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [selProductID, setSelProductID] = useState<number>(0)
  const [display, setDisplay] = useState<number>(0)
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
    // selQuotationID: 0,
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
          GetProductAsAddonListForCarpetryListData(
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
            responseData,
            state.SearchText
          )
          // setState({
          //   ...state,
          //   addonItemData: responseData,
          //   loading: false,
          // })
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

  function GetProductAsAddonListForCarpetryListData(
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
    addonItemData: IAddonMasterModel[],
    temSearchText: string
  ) {
    GetProductAsAddonListForCarpetryListApi(temSearchText)
      .then((response) => {
        if (response.data.isSuccess === true) {
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
            addonItemData,
            responseData,
            temSearchText
          )
          // setState({
          //   ...state,
          //   productList: responseDate,
          //   selQuotationID: temqueID,
          //   SearchText: SearchText,
          //   loading: false,
          // })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
    // setShow(true)
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
    addonItemData: IAddonMasterModel[],
    productList: IDIYProductListModel[],
    temSearchText: string
  ) {
    GetCartListFromPackageIDApi(parseInt(quotationID), selPackageID, selPackageTypeID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          const respofferData = response.data.offerList
          // const responseUpgradeData = response.data.upGradeItemList
          let prvTmpAreaID: number = 0
          const temRows = []
          const Rows: ICartLisyByQuotationModel[] = responseData
          const OfferRows: IOfferListQuotationModel[] = respofferData
          // const upgradeRows: IDIYUpgradeItemModel[] = responseUpgradeData

          for (let key in Rows) {
            if (Rows[key] == Rows[0]) {
              Rows[key].titleAreaName = Rows[key].areaName
              Rows[key].titleAreaID = 0
              prvTmpAreaID = Rows[key].planAreaID
            } else {
              if (prvTmpAreaID == Rows[key].planAreaID) {
                Rows[key].titleAreaName = ''
                Rows[key].titleAreaID = 1
                // temRows.push(Rows[key])
              } else {
                Rows[key].titleAreaName = Rows[key].areaName
                Rows[key].titleAreaID = 0
                prvTmpAreaID = Rows[key].planAreaID
                // temRows.push(Rows[key])
              }
            }
            temRows.push(Rows[key])
          }
          setState({
            ...state,
            cartListData: temRows,
            offerquotationListData: OfferRows,
            // upgradeItemList: upgradeRows,
            temCartListData: temRows,
            // upgradeItemList: responseUpgradeData,
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
            productList: productList,
            SearchText: temSearchText,
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

  // ==================Check Out Model Function===============
  const [showCheckOut, setShowCheckOut] = useState(false)
  const handleCloseCheckOut = () => {
    setShowCheckOut(false)
  }

  const handleCheckOut = (quotationID: number) => {
    CheckoutTurnkeyQuotationApi(quotationID, 0)
      .then((response) => {
        if (response.data.isSuccess == true) {
          history.push({
            pathname: `/quotations/ready-made-quotation/outpdf/${quotationID}`,
            state: {
              isDownload: 0,
              packageID: state.selPackageID,
              packageTypeID: state.selPackageTypeID,
              customerName: state.customerName,
              bhkName: state.bhkName,
              carpetAreaName: state.carpetAreaName,
              projectName: state.projectName,
              projectNumber: state.projectNumber,
              projectTypeID: state.selProjectTypeID,
              mainCustomerID: state.mainCustomerID,
              mainEmployeeID: state.mainEmployeeID,
              mainSearch: state.mainSearch,
            },
          })
        } else if (response.data.isSuccess == false) {
          const responseData = response.data.responseObject
          if (response.data.listType == 2) {
            toast.error(`${response.data.message}`)
            setState({
              ...state,
              checkOutData: responseData,
              selListTypeID: 2,
              selTitle: response.data.message,
              loading: false,
            })
          } else if (response.data.listType == 3) {
            toast.warning(`${response.data.message}`)
            setState({
              ...state,
              checkOutData: responseData,
              selListTypeID: 3,
              selTitle: response.data.message,
              loading: false,
            })
          } else if (response.data.listType == 4) {
            toast.warning(`${response.data.message}`)
            setState({
              ...state,
              checkOutData: responseData,
              selListTypeID: 4,
              selTitle: response.data.message,
              loading: false,
            })
          }
          setShowCheckOut(true)
        } else {
          toast.error(`${response.data.message}`)
          setShowCheckOut(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowCheckOut(false)
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
          GetProductAsAddonListForCarpetryListData(
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
            state.addonItemData,
            state.SearchText
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
  function deleteCarpentryQuaeProductItem(projectID: number) {
    deleteCarpentryQueProductByIDApi(projectID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          GetProductAsAddonListForCarpetryListData(
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
            state.addonItemData,
            state.SearchText
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
  function AddAgainCarpentryQuaeProductItem(projectID: number) {
    AddAgainCarpentryQueProductByIDApi(projectID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Item Add Successfully')
          GetProductAsAddonListForCarpetryListData(
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
            state.addonItemData,
            state.SearchText
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
    GetProductAsAddonListForCarpetryListData(
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
      state.addonItemData,
      state.SearchText
    )
    // GetProductAsAddonListForCarpetryListData((state.selQuotationID = 0), (state.SearchText = ''))
    setName('')
    setSelProductIDLen('')
    setShow(false)
  }

  function HandleShowProductAddonList() {
    // GetProductAsAddonListForCarpetryListApi(SearchText)
    //   .then((response) => {
    //     if (response.data.isSuccess === true) {
    //       const responseDate = response.data.responseObject
    //       setState({
    //         ...state,
    //         productList: responseDate,
    //         selQuotationID: temqueID,
    //         SearchText: SearchText,
    //         loading: false,
    //       })
    //     } else {
    //       toast.error(`${response.data.message}`)
    //       setState({...state, loading: false})
    //     }
    //   })
    //   .catch((error) => {
    //     toast.error(`${error}`)
    //     setState({...state, loading: false})
    //   })
    setShow(true)
  }

  // ================== Offer PopUp Start Offer Block =====================
  const [showOffer, setShowOffer] = useState(false)
  function handleCloseOffer() {
    GetProductAsAddonListForCarpetryListData(
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
      state.addonItemData,
      state.SearchText
    )
    setShowOffer(false)
  }

  // ========================== For Add Offer ====================
  function GetOfferListForOfferAdd(temqueID: number, SearchText: string) {
    getOfferListByBranchIDAPI(user.branchID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            offerData: responseData,
            tmpOfferData: responseData,
            selQuotationID: temqueID,
            SearchText: SearchText,
            loading: false,
          })
          // setTotal(responseData.length)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, offerData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, offerData: [], loading: false})
      })
    setShowOffer(true)
  }

  // ========================== For Add Offer API ====================
  function onAddToOffer(tmpOfferID: number) {
    setMainLoading(true)
    AddOfferTurnkeyCustomQuotationAPI(parseInt(quotationID), tmpOfferID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success(`Offer Add Successfull`)
          GetOfferListForOfferAdd(state.selQuotationID, state.SearchText)
          GetProductAsAddonListForCarpetryListData(
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
            state.addonItemData,
            state.SearchText
          )
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

  // ==================Delete Model Function===============
  const [showDeleteOffer, setShowDeleteOffer] = useState(false)
  const handleCloseDeleteOffer = () => setShowDeleteOffer(false)
  const handleShowDeleteOffer = (temOfferID: number) => {
    setState({
      ...state,
      selOfferID: temOfferID,
      loading: false,
    })
    setShowDeleteOffer(true)
  }

  function deleteCarpentryQuoeOfferItem(temOfferID: number) {
    deleteCarpentryQueOfferByIDApi(temOfferID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          GetProductAsAddonListForCarpetryListData(
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
            state.addonItemData,
            state.SearchText
          )
          setShowDeleteOffer(false)
        } else {
          toast.error(`${response.data.massege}`)
          setShowDeleteOffer(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowDeleteOffer(false)
      })
  }

  // ======================================== End Offer Block =========================
  const searchFilter = (value: string) => {
    const keyword = value
    if (keyword !== '') {
      GetProductAsAddonListForCarpetryListData(
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
        state.addonItemData,
        keyword
      )
    } else {
      GetProductAsAddonListForCarpetryListData(
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
        state.addonItemData,
        ''
      )
    }
  }

  // ===========================Add  AddOn Items Function =====================
  function addOnAddToCart(productList: IDIYProductListModel) {
    setSelProductID(productList.productID)
    setMainLoading(true)
    SaveAddOnTurnkeyQuotaionDetailinCartApi(
      parseInt(quotationID),
      productList.productCategoryID,
      productList.productID,
      0,
      productList.defaultUnitID,
      productList.length,
      productList.depth,
      productList.height,
      productList.noOfUnit,
      ''
    )
      .then((response) => {
        if (response.data.isSuccess === true) {
          toast.success(`Product Added in Cart`, {autoClose: 1000})
          setCartLength(cartLength + 1)
          setSelProductID(0)
          GetProductAsAddonListForCarpetryListData(
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
            state.addonItemData,
            state.SearchText
          )
          // GetProductAsAddonListForCarpetryListData(
          //   (state.selQuotationID = 0),
          //   (state.SearchText = '')
          // )
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
  // ==================Upgrade=====================
  // const [showUpGrade, setShowUpGrade] = useState(false)
  // function handleCloseUpGrade() {
  //   GetProductAsAddonListForCarpetryListData(
  //     state.selPackageID,
  //     state.selPackageTypeID,
  //     state.customerName,
  //     state.bhkName,
  //     state.carpetAreaName,
  //     state.projectName,
  //     state.projectNumber,
  //     state.selProjectTypeID,
  //     state.mainEmployeeID,
  //     state.mainCustomerID,
  //     state.mainSearch,
  //     state.addonItemData
  //   )
  // setShowUpGrade(false)
  // }
  // ========================== For Add UpGrade ====================

  // function getUpgradeItemdata() {
  //   getAllUpgradeItemByQuotationID(state.selQuotationID)
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       if (response.data.isSuccess === true) {
  //         setState({
  //           ...state,
  //           upgradeItemData: responseData,
  //           loading: false,
  //         })
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, upgradeItemData: [], loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, upgradeItemData: [], loading: false})
  //     })
  //   setShowUpGrade(true)
  // }

  // ========================== For Add UpGrade API ====================
  // function onAddToUpgrade(tmpUpgradeId: number) {
  //   setMainLoading(true)
  //   addDIYUpgradeItemApi(parseInt(quotationID), tmpUpgradeId)
  //     .then((response) => {
  //       if (response.data.isSuccess == true) {
  //         toast.success(` Upgrade Item Add Successfull`)
  //         getUpgradeItemdata()
  //         setMainLoading(false)
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setMainLoading(false)
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setMainLoading(false)
  //     })
  // }

  // ==================Delete UpGrade Model Function===============
  // const [showDeletUpgrade, setShowDeletUpgrade] = useState(false)
  // const handleCloseDeletUpgrade = () => setShowDeletUpgrade(false)
  // const handleShowDeletUpgrade = (diyUpgrageItemMapID: number) => {
  //   setState({
  //     ...state,
  //     selDiyUpgrageItemMapID: diyUpgrageItemMapID,
  //     loading: false,
  //   })
  //   setShowDeletUpgrade(true)
  // }

  // function deleteUpgradeItem(diyUpgrageItemMapID: number) {
  //   deleteDIYUpgradeItemByIDApi(diyUpgrageItemMapID)
  //     .then((response) => {
  //       if (response.data.isSuccess == true) {
  //         toast.success('Deleted Successfully')
  //         GetProductAsAddonListForCarpetryListData(
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
  //         setShowDeletUpgrade(false)
  //       } else {
  //         toast.error(`${response.data.massege}`)
  //         setShowDeletUpgrade(false)
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setShowDeletUpgrade(false)
  //     })
  // }

  //------------------- the value of the search field----------------
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

  //------------------- Drawer-----------------
  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState<DrawerProps['placement']>('right')
  const showDrawer = (quotationDetailID: number) => {
    setState({...state, selQuotationDetailID: quotationDetailID})
    setOpen(true)
  }
  const onClose = () => {
    getAllAddonItemData(
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
      state.mainSearch
    )
    setOpen(false)
  }

  return (
    <>
      {/* <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
            to={{
              pathname: '/quotations/ready-made-quotation/list',
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
      </div> */}
      <Loader loading={state.loading} />
      <div className={state.loading === true ? 'd-none' : `card`}>
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
        <div
          className='card-header border-0 py-2'
          style={{
            backgroundColor: '#000000',
            position: 'sticky',
            top: 120,
            zIndex: 1000,
          }}
        >
          {/* ----------- Back to Add Item list Hide By Sir  */}
          {/* <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Back to Item'
          >
            <Link
              to={{
                pathname: `/quotations/ready-made-quotation/add-cart/${state.selQuotationID}`,
                state: {
                  quotationID: state.selQuotationID,
                  customerName: state.customerName,
                  bhkName: state.bhkName,
                  carpetAreaName: state.carpetAreaName,
                  projectName: state.projectName,
                  projectNumber: state.projectNumber,
                },
              }}
              className='btn btn-sm btn-light-primary bg-white'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr002.svg' className='svg-icon-3' />
              Back to Add Item list
            </Link>
          </div> */}
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
              onClick={() => HandleShowProductAddonList()}
            >
              Addon Item
            </span>
          </div>

          <div className='card-toolbar rounded' data-bs-toggle='tooltip' data-bs-placement='top'>
            <span
              className='btn btn-sm btn-primary bg-info fs-5'
              onClick={() => GetOfferListForOfferAdd(parseInt(quotationID), state.SearchText)}
            >
              Add Offer
            </span>
          </div>
          {/* <div
            className='card-toolbar border border-primary rounded'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
          >
            <span
              className='btn btn-sm btn-success bg-dark fs-5'
              onClick={() => getUpgradeItemdata()}
            >
              UpGrade Item
            </span>
          </div> */}

          <div className='card-toolbar rounded' data-bs-toggle='tooltip' data-bs-placement='top'>
            <span
              className='btn btn-sm btn-light-primary bg-white fs-5'
              onClick={() => handleCheckOut(parseInt(quotationID))}
            >
              Check out
            </span>
          </div>
          <span>
            <Link
              className='btn btn-sm btn-light-primary bg-success text-white fs-5 mt-2 btn btn-rounded'
              to={{
                pathname: '/quotations/ready-made-quotation/list',
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
                    // console.log(data)
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
                            data.isdelete === true ? 'border-bottom bg-danger' : 'border-bottom'
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
                            {
                              data.description == '' || data.description == null
                                ? ''
                                : data.description
                              // : data.description.length <= 50
                              // ? data.description.substring(0, 50)
                              // : `${data.description.substring(0, 50)}...`
                            }
                          </td>
                          <td className='text-dark text-center mb-1 fs-6'>{data.unitName}</td>
                          <td className='text-dark mb-1 fs-6 text-end'>{data.length}</td>
                          <td className='text-dark mb-1 fs-6 text-end'>{data.height}</td>
                          <td className='text-dark mb-1 fs-6 text-end'>{data.depth}</td>
                          <td>
                            {data.isProductMandatory === true ? (
                              <div className='d-none'></div>
                            ) : data.isdelete === false ? (
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
                  <th className='w-5px text-end'>Delete</th>
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

                          <td className='text-end fs-2'>
                            <div
                              onClick={() => handleShowDeleteOffer(data.turnekyQutationOfferID)}
                              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                            >
                              <KTSVG
                                path='/media/icons/duotune/general/gen027.svg'
                                className='ssvg-icon-3 svg-icon-danger'
                              />
                            </div>
                          </td>
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

        {/* ======================================Add Upgrade List======================================== */}
        {/* <div className={state.upgradeItemList.length > 0 ? 'py-0 ' : 'py-0 d-none'}>
          <div className='table-responsive'>
            <table className='table table-bordered table-rounded align-middle border g-4'>
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5 bg-white'>
                  <th
                    colSpan={3}
                    className='text-primary text-center text-hover-primary fw-bolder fs-4'
                  >
                    UpGrade Item
                  </th>
                </tr>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>Agency Name</th>
                  <th className='min-w-150px'>UpGrade Item Name</th>
                  <th className='min-w-150px'>UpGrade Cost</th>
                  <th className='w-5px text-end'>Delete</th>
                </tr>
              </thead>

              <tbody className="border-bottom">
                <LoaderInTable loading={state.loading} column={3} />
                {state.upgradeItemList.length > 0 &&
                  state.upgradeItemList.map((data, index) => {
                    return (
                      <>
                        <tr key={data.upGradeItemID}>
                          <td className='text-dark fs-4'>{data.agencyTypeName}</td>
                          <td className='text-dark fs-6'>{data.upGradeItemName}</td>
                          <td className='text-dark fs-6'>{data.upGradePercentage}</td>

                          <td className='text-end fs-2'>
                            <div
                              onClick={() => handleShowDeletUpgrade(data.diyUpgrageItemMapID)}
                              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                            >
                              <KTSVG
                                path='/media/icons/duotune/general/gen027.svg'
                                className='ssvg-icon-3 svg-icon-danger'
                              />
                            </div>
                          </td>
                        </tr>
                      </>
                    )
                  })} */}
        {/* =================== Image no data ============== */}
        {/* </tbody>
            </table>
          </div>
        </div> */}
      </div>

      {/* -----------------Check Out --------------- */}
      <CheckOutList
        checkOutList={state.checkOutData}
        title={state.selTitle}
        show={showCheckOut}
        listTypeID={state.selListTypeID}
        quotationID={parseInt(quotationID)}
        handleClose={handleCloseCheckOut}
        handleCheckOut={() => handleCheckOut(state.selQuotationID)}
        getAllAddonItemData={() =>
          getAllAddonItemData(
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
            state.mainSearch
          )
        }
        packageID={state.selPackageID}
        packageTypeID={state.selPackageTypeID}
        customerName={state.customerName}
        bhkName={state.bhkName}
        carpetAreaName={state.carpetAreaName}
        projectName={state.projectName}
        projectNumber={state.projectNumber}
        projectTypeID={state.selProjectTypeID}
        mainCustomerID={state.mainCustomerID}
        mainEmployeeID={state.mainEmployeeID}
        mainSearch={state.mainSearch}
      />

      {/* -----------------Design Drawer--------------- */}
      {open === false ? (
        <></>
      ) : (
        <Drawer
          headerStyle={{backgroundColor: '#f28675'}}
          title='Change Product'
          placement={placement}
          width={`65%`}
          onClose={onClose}
          open={open}
        >
          <DrawerChangeProduct quotationDetailID={state.selQuotationDetailID} onClose={onClose} />
        </Drawer>
      )}

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
                        {/* begin::Symbol */}
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
                                // type='number'
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
      <ModelPopUpDelete
        id={state.selOfferID}
        pageName={'Offer Item'}
        show={showDeleteOffer}
        handleClose={handleCloseDeleteOffer}
        deleteData={() => deleteCarpentryQuoeOfferItem(state.selOfferID)}
      />
      {/* =====================Delete UpGrade Item =============== */}
      {/* <ModelPopUpDelete
        id={state.selDiyUpgrageItemMapID}
        pageName={'UpGrade Item'}
        show={showDeletUpgrade}
        handleClose={handleCloseDeletUpgrade}
        deleteData={() => deleteUpgradeItem(state.selDiyUpgrageItemMapID)}
      /> */}
      {/* ============================ Offer Model =============================== */}
      <Modal size='xl' show={showOffer} onHide={handleCloseOffer} backdrop='true' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Offer List</Modal.Title>
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
                  <thead className='bg-light-primary'>
                    <tr className='fw-bolder fs-5'>
                      <th className='min-w-150px'>Title</th>
                      <th className='min-w-150px'>Description</th>
                      <th className='min-w-125px text-end'>Add Offer</th>
                    </tr>
                  </thead>
                  {/* end::Table head */}
                  {/* begin::Table body */}
                  <tbody className="border-bottom">
                    {state.offerData.length > 0 &&
                      state.offerData.map((data, index) => {
                        return (
                          <tr key={index}>
                            <td className='text-dark text-hover-primary mb-1 fs-6'>
                              {data.offerTitle}
                            </td>
                            <td className='text-dark text-hover-primary mb-1 fs-6'>
                              {data.offerDesc}
                            </td>
                            <td className='text-end'>
                              <span
                                className='btn btn-sm btn-light-primary bg-white border border-primary text-center py-2 px-5'
                                onClick={() => onAddToOffer(data.offerID)}
                              >
                                <KTSVG
                                  path='/media/icons/duotune/arrows/arr075.svg'
                                  className='svg-icon-2'
                                />
                                Add
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => handleCloseOffer()}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ========================================UpGrade Item Model================================= */}
      {/* <Modal
        size='xl'
        show={showUpGrade}
        onHide={handleCloseUpGrade}
        backdrop='true'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>UpGrade List</Modal.Title>
        </Modal.Header>
        <Modal.Body> */}
      {/* <div className={`card `}> */}
      {/* begin::Body */}
      {/* <div className='py-3'> */}
      {/* begin::Table container */}
      {/* <div className='table-responsive'> */}
      {/* begin::Table */}
      {/* <table className='table table-bordered align-middle g-2'> */}
      {/* begin::Table head */}
      {/* <thead className='bg-secondary'>
                    <tr className='fw-bolder fs-5'>
                      <th className='min-w-150px'>Agency Type</th>
                      <th className='min-w-40px'>UpGrade Item Name</th>
                      <th className='min-w-40px'>UpGrade Cost</th>
                      <th className='min-w-100px text-end'>Add UpGrade</th>
                    </tr>
                  </thead> */}
      {/* end::Table head */}
      {/* begin::Table body */}
      {/* <tbody className="border-bottom">
                    {state.upgradeItemData.length > 0 &&
                      state.upgradeItemData.map((data, index) => {
                        return (
                          <tr key={index}>
                            <td className='text-dark text-hover-primary fs-6'>
                              {data.agencyTypeName}
                            </td>
                            <td className='text-dark text-hover-primary fs-6'>
                              {data.upGradeItemName}
                            </td>

                            <td className='text-dark text-hover-primary fs-6'>
                              {data.upGradePercentage}
                            </td>
                            <td className='text-end'>
                              <span
                                className='btn btn-sm btn-light-primary bg-white border border-primary text-center py-2 px-5'
                                onClick={() => onAddToUpgrade(data.upGradeItemID)}
                              >
                                <KTSVG
                                  path='/media/icons/duotune/arrows/arr075.svg'
                                  className='svg-icon-2'
                                />
                                Add
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody> */}
      {/* </table>
              </div>
            </div>
          </div> */}
      {/* </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => handleCloseUpGrade()}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  )
}

export default MainCartListCarpetryQuotation
