import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams, useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../../_Ecd/helpers'
import LoaderInTable from '../../../common-pages/LoaderInTable'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup'
import {
  GetCartListByQuotationIDApi,
  GetUpGradeItemListByQuoteIDKazuleciaApi,
  addDIYUpgradeItemApi,
  addDIYUpgradeKazulenciaItemApi,
  checkoutDIYQuotationApi,
  deleteDIYUpgradeItemByIDApi,
  deleteDIYUpgradeKazuItemByIDApi,
  deleteQuotationDetailIDApi,
  getUpdateQuotaionDetailObj,
  saveQuotationDetailinCartApi,
} from '../../../../modules/quotations-master-page/diy-quotation-master-page/DIYQuotationCRUD'
import {
  ICartLisyByQuotationModel,
  IDIYCheckOutModel,
  IDIYProductListModel,
  IDIYUpgradeItemModel,
  IUpgradeKazulenciaModel,
} from '../../../../models/quotations-page/diy-quotation-page/IDIYQuotationModel'
import Loader from '../../../common-pages/Loader'
import {ModelPopUpDelete} from '../../../common-pages/ModelPopUpDelete'
import BlankDataImage from '../../../common-pages/BlankDataImage'
import {Button, Modal} from 'react-bootstrap-v5'
import {EditCartDIYQuotationList} from './EditCartDIYQuotationList'
import {IPlanAreaModel} from '../../../../models/product-page/IPlanAreaModel'
import {getAllPlanArea} from '../../../../modules/product-master-page/plan-area-master-page/PlanAreaCRUD'
import {CheckOutList} from './CheckOutList'
import {IUpgradeItemModel} from '../../../../models/product-page/IUpgradeItemModel'
import {
  getAllUpgradeItem,
  getAllUpgradeItemByQuotationID,
} from '../../../../modules/product-master-page/upgrade-item-master-page/UpradeItemCRUD'
import {IKazulenciaItemModel} from '../../../../models/product-page/IKazulenciaItemModel'
type Props = {}

interface IDIY {
  loading: boolean
  cartListData: ICartLisyByQuotationModel[]
  temCartListData: ICartLisyByQuotationModel[]
  objCartListData: IDIYProductListModel[]
  planAreaData: IPlanAreaModel[]
  checkOutData: IDIYCheckOutModel[]
  upgradeItemData: IUpgradeItemModel[]
  upgradeItemList: IDIYUpgradeItemModel[]
  upgradeKazulenciaList: IUpgradeKazulenciaModel[]
  upgradeKazulenciaData: IKazulenciaItemModel[]
  SearchText: string
  selQuotationID: number
  tmpQuotationID: number
  selQuotationDetailID: number
  planAreaID: number
  customerName: string
  bhkName: string
  carpetAreaName: string
  projectName: string
  projectNumber: string
  selTitle: string
  selListTypeID: number
  selDiyUpgrageItemMapID: number
  mainEmployeeID: number
  mainCustomerID: number
  seltotalKazulecia: number
  quotationID: number
  selbranchWiseMinAmt: number
  seltotalKazuleciaqutation: number
  upgradeItemID: number
  selQutID: number
  IqutId: number
  mainSearch: string
}

const CartListDIYQuotation: React.FC<Props> = () => {
  const {quotationID} = useParams<{quotationID: string}>()
  const location = useLocation()
  const history = useHistory()
  const dispatch = useDispatch()
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [cartLength, setCartLength] = useState<number>(0)
  const [state, setState] = useState<IDIY>({
    loading: false,
    cartListData: [] as ICartLisyByQuotationModel[],
    temCartListData: [] as ICartLisyByQuotationModel[],
    objCartListData: [] as IDIYProductListModel[],
    planAreaData: [] as IPlanAreaModel[],
    checkOutData: [] as IDIYCheckOutModel[],
    upgradeItemData: [] as IUpgradeItemModel[],
    upgradeItemList: [] as IDIYUpgradeItemModel[],
    upgradeKazulenciaList: [] as IUpgradeKazulenciaModel[],
    upgradeKazulenciaData: [] as IKazulenciaItemModel[],
    SearchText: '',
    selQuotationID: 0,
    tmpQuotationID: 0,
    selQuotationDetailID: 0,
    planAreaID: 0,
    customerName: '',
    bhkName: '',
    carpetAreaName: '',
    projectName: '',
    projectNumber: '',
    selTitle: '',
    selListTypeID: 0,
    selDiyUpgrageItemMapID: 0,
    mainEmployeeID: 0,
    mainCustomerID: 0,
    seltotalKazulecia: 0,
    quotationID: 0,
    selbranchWiseMinAmt: 0,
    seltotalKazuleciaqutation: 0,
    upgradeItemID: 0,
    selQutID: 0,
    IqutId: 0,
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

      getAllDIYQuotationData(
        // quotationID,
        tmpQuotationID,
        customerName,
        bhkName,
        carpetAreaName,
        projectName,
        projectNumber,
        mainEmployeeID,
        mainCustomerID,
        mainSearch
      )
    }, 100)
  }, [])

  function getAllDIYQuotationData(
    // quotationID: number,
    tmpQuotationID: number,
    customerName: string,
    bhkName: string,
    carpetAreaName: string,
    projectName: string,
    projectNumber: string,
    mainEmployeeID: number,
    mainCustomerID: number,
    mainSearch: string
  ) {
    GetCartListByQuotationIDApi(parseInt(quotationID))
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          const responseUpgradeData = response.data.upGradeItemList
          const responseUpgradeKazuData = response.data.kazulenciaUpGradeItemList ?? []
          const tmptoralkazulencia = response.data.totalKazulencia

          setState({
            ...state,
            cartListData: responseData,
            temCartListData: responseData,
            upgradeItemList: responseUpgradeData,
            upgradeKazulenciaList: responseUpgradeKazuData,
            seltotalKazuleciaqutation: tmptoralkazulencia,
            selQuotationID: parseInt(quotationID),
            tmpQuotationID: tmpQuotationID,
            customerName,
            bhkName,
            carpetAreaName,
            projectName,
            projectNumber,
            mainEmployeeID,
            mainCustomerID,
            mainSearch,
            loading: false,
          })

          setCartLength(responseData.length)
          localStorage.setItem('totalCounts', responseData.length.toString())
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
  const [showDelete, setShowDelete] = useState(false)
  const handleCloseDelete = () => setShowDelete(false)
  const handleShowDelete = (quotationDetailID: number) => {
    setState({
      ...state,
      selQuotationDetailID: quotationDetailID,
    })
    setShowDelete(true)
  }

  function deletePlanAreaItem(temQuotationDetailID: number) {
    deleteQuotationDetailIDApi(temQuotationDetailID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllDIYQuotationData(
            state.selQuotationID,
            state.customerName,
            state.bhkName,
            state.carpetAreaName,
            state.projectName,
            state.projectNumber,
            state.mainEmployeeID,
            state.mainCustomerID,
            state.mainSearch
          )
          setShowDelete(false)
        } else {
          toast.error(`${response.data.message}`)
          getAllDIYQuotationData(
            state.selQuotationID,
            state.customerName,
            state.bhkName,
            state.carpetAreaName,
            state.projectName,
            state.projectNumber,
            state.mainEmployeeID,
            state.mainCustomerID,
            state.mainSearch
          )
          setShowDelete(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        getAllDIYQuotationData(
          state.selQuotationID,
          state.customerName,
          state.bhkName,
          state.carpetAreaName,
          state.projectName,
          state.projectNumber,
          state.mainEmployeeID,
          state.mainCustomerID,
          state.mainSearch
        )
        setShowDelete(false)
      })
  }

  // ==================Edit Model Function===============
  const [showEdit, setShowEdit] = useState(false)
  const handleCloseEdit = () => {
    getAllDIYQuotationData(
      state.selQuotationID,
      state.customerName,
      state.bhkName,
      state.carpetAreaName,
      state.projectName,
      state.projectNumber,
      state.mainEmployeeID,
      state.mainCustomerID,
      state.mainSearch
    )
    setShowEdit(false)
  }

  const handleShowEdit = (quotationDetailID: number) => {
    // console.log('Call Api')
    getAllPlanArea()
      .then((response) => {
        if (response.data.isSuccess == true) {
          let resData = response.data.responseObject
          getUpdateQuotaionDetailObjFun(quotationDetailID, resData)
        } else {
          toast.error(`${response.data.message}`)
          setShowEdit(true)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        // setShowEdit(true)
      })
  }

  const getUpdateQuotaionDetailObjFun = (
    quotationDetailID: number,
    planAreaData: IPlanAreaModel[]
  ) => {
    // console.log('Call Api')
    getUpdateQuotaionDetailObj(quotationDetailID)
      .then((responses) => {
        if (responses.data.isSuccess == true) {
          let resDatas = responses.data.responseObject
          // console.log(resDatas)
          setState({
            ...state,
            planAreaData,
            objCartListData: resDatas,
            selQuotationDetailID: quotationDetailID,
            planAreaID: resDatas[0].planAreaID,
          })
          setShowEdit(true)
        } else {
          toast.error(`${responses.data.message}`)
          setState({
            ...state,
            selQuotationDetailID: quotationDetailID,
          })
          setShowEdit(true)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          selQuotationDetailID: quotationDetailID,
        })
        setShowEdit(true)
      })
  }

  // ==================Check Out Model Function===============
  const [showCheckOut, setShowCheckOut] = useState(false)
  const handleCloseCheckOut = () => {
    setShowCheckOut(false)
  }
  const handleCheckOut = (quotationID: number) => {
    checkoutDIYQuotationApi(quotationID, 0)
      .then((response) => {
        const tmpRowData: IDIYCheckOutModel[] = []
        if (response.data.isSuccess == true) {
          history.push({
            pathname: `/quotations/diy-quotation/backpdf/${quotationID}`,
            state: {
              isDownload: 0,
              customerName: state.customerName,
              bhkName: state.bhkName,
              carpetAreaName: state.carpetAreaName,
              projectName: state.projectName,
              projectNumber: state.projectNumber,
              mainEmployeeID: state.mainEmployeeID,
              mainCustomerID: state.mainCustomerID,
              mainSearch: state.mainSearch,
            },
          })
        } else if (response.data.isSuccess == false) {
          const responseData = response.data.responseObject
          for (let k in responseData) {
            let tmpAllData: IDIYCheckOutModel = {
              primaryID: parseInt(k + 1),
              productID: responseData[k]['productID'],
              productName: responseData[k]['productName'],
              description: responseData[k]['description'],
              areaName: responseData[k]['areaName'],
              productCategoryName: responseData[k]['productCategoryName'],
              unitName: responseData[k]['unitName'],
              parentName: responseData[k]['parentName'],
              planAreaID: responseData[k]['planAreaID'],
              productCategoryID: responseData[k]['productCategoryID'],
              length: responseData[k]['length'],
              pricePerSqFt: responseData[k]['pricePerSqFt'],
              depth: responseData[k]['depth'],
              height: responseData[k]['height'],
              noOfUnit: responseData[k]['noOfUnit'],
              photoPath: responseData[k]['photoPath'],
              defaultUnitID: responseData[k]['defaultUnitID'],
              isHeightChange: responseData[k]['isHeightChange'],
            }
            tmpRowData.push(tmpAllData)
          }
          if (response.data.listType == 2) {
            toast.error(`${response.data.message}`)
            setState({
              ...state,
              checkOutData: tmpRowData,
              selListTypeID: 2,
              selTitle: response.data.message,
              loading: false,
            })
          } else if (response.data.listType == 3) {
            toast.warning(`${response.data.message}`)
            setState({
              ...state,
              checkOutData: tmpRowData,
              selListTypeID: 3,
              selTitle: response.data.message,
              loading: false,
            })
          } else if (response.data.listType == 4) {
            toast.warning(`${response.data.message}`)
            setState({
              ...state,
              checkOutData: tmpRowData,
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
  //  // ================== Offer PopUp Start Offer Block =====================
  const [showUpGrade, setShowUpGrade] = useState(false)
  function handleCloseUpGrade() {
    getAllDIYQuotationData(
      state.selQuotationID,
      state.customerName,
      state.bhkName,
      state.carpetAreaName,
      state.projectName,
      state.projectNumber,
      state.mainEmployeeID,
      state.mainCustomerID,
      state.mainSearch
    )
    setShowUpGrade(false)
  }

  // ========================== For Add UpGrade ====================

  function getUpgradeItemdata() {
    getAllUpgradeItemByQuotationID(state.selQuotationID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            upgradeItemData: responseData,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, upgradeItemData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, upgradeItemData: [], loading: false})
      })
    setShowUpGrade(true)
  }

  // ========================== For Add UpGrade API ====================
  function onAddToUpgrade(tmpUpgradeId: number) {
    setMainLoading(true)
    addDIYUpgradeItemApi(parseInt(quotationID), tmpUpgradeId)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success(` Upgrade Item Add Successfull`)
          getUpgradeItemdata()
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

  // ==================Delete UpGrade Model Function===============
  const [showDeletUpgrade, setShowDeletUpgrade] = useState(false)

  const handleCloseDeletUpgrade = () => setShowDeletUpgrade(false)

  const handleShowDeletUpgrade = (diyUpgrageItemMapID: number) => {
    setState({
      ...state,
      selDiyUpgrageItemMapID: diyUpgrageItemMapID,
      loading: false,
    })
    setShowDeletUpgrade(true)
  }

  function deleteUpgradeItem(diyUpgrageItemMapID: number) {
    deleteDIYUpgradeItemByIDApi(diyUpgrageItemMapID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllDIYQuotationData(
            state.selQuotationID,
            state.customerName,
            state.bhkName,
            state.carpetAreaName,
            state.projectName,
            state.projectNumber,
            state.mainEmployeeID,
            state.mainCustomerID,
            state.mainSearch
          )
          setShowDeletUpgrade(false)
        } else {
          toast.error(`${response.data.massege}`)
          setShowDeletUpgrade(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowDeletUpgrade(false)
      })
  }
  // =======================Upgrade Kazulencia===============================
  const [showUpGradeKazu, setShowUpGradeKazu] = useState(false)

  function handleCloseUpGradeKazu() {
    getAllDIYQuotationData(
      state.selQuotationID,
      state.customerName,
      state.bhkName,
      state.carpetAreaName,
      state.projectName,
      state.projectNumber,
      state.mainEmployeeID,
      state.mainCustomerID,
      state.mainSearch
    )
    setShowUpGradeKazu(false)
  }

  function getUpgradeKazuItemdata() {
    GetUpGradeItemListByQuoteIDKazuleciaApi(state.selQuotationID)
      .then((response) => {
        let responseData = response.data.responseObject
        let tmptotalKazulecia = response.data.totalKazulecia
        let tmpbranchWiseMinAmt = response.data.branchWiseMinAmt
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            upgradeKazulenciaData: responseData,
            seltotalKazulecia: tmptotalKazulecia,
            selbranchWiseMinAmt: tmpbranchWiseMinAmt,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, upgradeItemData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, upgradeItemData: [], loading: false})
      })
    setShowUpGradeKazu(true)
  }

  // =================== For Accessories ==========================
  function UpgradeKazu(tech: IKazulenciaItemModel[]) {
    let tmpTech = tech
    let strSelTechid: string = ''
    for (let k in tmpTech) {
      if (strSelTechid === '') {
        strSelTechid = `${tmpTech[k].upGradeItemID}`
      } else {
        strSelTechid = strSelTechid + ',' + `${tmpTech[k].upGradeItemID}`
      }
    }
    onAddToUpgradeKazu(strSelTechid)
  }

  // ========================== For Add UpGrade Kazu ====================
  function onAddToUpgradeKazu(upGradeItemIDs: string) {
    setMainLoading(true)
    addDIYUpgradeKazulenciaItemApi(parseInt(quotationID), upGradeItemIDs)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success(` Upgrade Kazulencia Item Add Successfull`)
          // getUpgradeKazuItemdata()
          getAllDIYQuotationData(
            state.selQuotationID,
            state.customerName,
            state.bhkName,
            state.carpetAreaName,
            state.projectName,
            state.projectNumber,
            state.mainEmployeeID,
            state.mainCustomerID,
            state.mainSearch
          )
          setShowUpGradeKazu(false)
          setMainLoading(false)
        } else {
          toast.error(`${response.data.message}`)
          setMainLoading(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setMainLoading(false)
        setShowUpGradeKazu(false)
      })
  }

  // =====================deleteUpgradeKazu===========================
  const [showDeletUpgradeKazu, setShowDeletUpgradeKazu] = useState(false)
  const handleCloseDeletUpgradekazu = () => setShowDeletUpgradeKazu(false)
  const handleShowDeletUpgradekazu = () => {
    setState({
      ...state,
      selQutID: parseInt(quotationID),
      loading: false,
    })
    setShowDeletUpgradeKazu(true)
  }
  function deleteUpgradeKazu(quotationID: number) {
    deleteDIYUpgradeKazuItemByIDApi(quotationID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllDIYQuotationData(
            state.selQuotationID,
            state.customerName,
            state.bhkName,
            state.carpetAreaName,
            state.projectName,
            state.projectNumber,
            state.mainEmployeeID,
            state.mainCustomerID,
            state.mainSearch
          )
          setShowDeletUpgradeKazu(false)
        } else {
          toast.error(`${response.data.massege}`)
          setShowDeletUpgradeKazu(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowDeletUpgradeKazu(false)
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
      {state.loading ? (
        <Loader loading={state.loading} />
      ) : (
        <div className={`card`}>
          <div
            className='card-header border-0 py-2 '
            style={{
              backgroundColor: '#000000',
              position: 'sticky',
              top: 120,
              zIndex: 1000,
            }}
          >
            <div
              className='card-toolbar'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='Back to Item'
            >
              <Link
                to={{
                  pathname: `/quotations/diy-quotation/add-cart/${state.selQuotationID}`,
                  state: {
                    quotationID: state.selQuotationID,
                    customerName: state.customerName,
                    bhkName: state.bhkName,
                    carpetAreaName: state.carpetAreaName,
                    projectName: state.projectName,
                    projectNumber: state.projectNumber,
                    mainEmployeeID: state.mainEmployeeID,
                    mainCustomerID: state.mainCustomerID,
                    mainSearch: state.mainSearch,
                  },
                }}
                className='btn btn-sm btn-light-primary bg-white'
              >
                <KTSVG path='/media/icons/duotune/arrows/arr002.svg' className='svg-icon-3' />
                Back to Add Item list
              </Link>
            </div>
            <div className='border-0 p-2' id=''>
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
            <div className='card-toolbar' data-bs-toggle='tooltip' data-bs-placement='top'>
              <span
                className='btn btn-sm btn-primary bg-info fs-5'
                onClick={() => getUpgradeItemdata()}
              >
                UpGrade Item
              </span>
            </div>
            <div className='card-toolbar' data-bs-toggle='tooltip' data-bs-placement='top'>
              <span
                className='btn btn-sm btn-warning bg-primary fs-5'
                onClick={() => getUpgradeKazuItemdata()}
              >
                UpGrade Kazulencia
              </span>
            </div>

            <div className='ms-2 card-toolbar' data-bs-toggle='tooltip' data-bs-placement='top'>
              <span
                className='btn btn-sm btn-light-primary bg-white fs-5'
                onClick={() => handleCheckOut(parseInt(quotationID))}
              >
                Check out
              </span>
              {/* <Link
              to={`/quotations/diy-quotation/pdf/${parseInt(quotationID)}`}
              className='btn btn-sm btn-light-primary bg-white fs-5'
              // onClick={() => onAddToCart(data, data.planAreaID)}
            >
              Check out
            </Link> */}
            </div>
            <span>
              <Link
                className='ms-2 mt-2 btn btn-sm btn-light-primary bg-success text-white fs-5 btn btn-rounded'
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
          </div>
          {/* begin::Body */}
          {state.loading ? (
            <LoaderInTable loading={state.loading} column={15} />
          ) : (
            <>
              {state.cartListData.length > 0 &&
                state.cartListData.map((data, index) => {
                  return (
                    <>
                      <div
                        key={data.quotationDetailID}
                        className='d-flex align-items-sm-center p-3 mb-4 shadow-sm'
                      >
                        {/* begin::Symbol */}
                        <div className='d-block justify-content-center align-items-center text-center'>
                          <div className='symbol symbol-75px symbol-2by3 text-center'>
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
                          <div className='d-flex justify-content-evenly'>
                            <div
                              className='card-toolbar border border-primary rounded m-1'
                              data-bs-toggle='tooltip'
                              data-bs-placement='top'
                              title='Edit'
                            >
                              <span
                                className='btn btn-sm btn-light-primary bg-white fs-6 p-2'
                                onClick={() => handleShowEdit(data.quotationDetailID)}
                              >
                                <KTSVG
                                  path='/media/icons/duotune/art/art005.svg'
                                  className='svg-icon-2 me-0'
                                />
                              </span>
                            </div>
                            <div
                              className='card-toolbar border border-danger rounded m-1'
                              data-bs-toggle='tooltip'
                              data-bs-placement='top'
                              title='Delete'
                            >
                              <span
                                className='btn btn-sm btn-light-danger bg-white fs-6 p-2'
                                onClick={() => handleShowDelete(data.quotationDetailID)}
                              >
                                <KTSVG
                                  path='/media/icons/duotune/general/gen027.svg'
                                  className='svg-icon-2 me-0'
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* end::Symbol */}
                        {/* begin::Content */}
                        <div className='d-flex flex-row-fluid align-items-center flex-wrap my-lg-0 me-2'>
                          {/* begin::Title */}
                          <div className='flex-grow-1 my-lg-0 my-2 m-2'>
                            <span className='d-block'>
                              <label className='text-muted fw-bold pt-1'>Area Name : &nbsp;</label>
                              <span className='text-gray-800 fw-bolder text-hover-primary fs-5'>
                                {data.areaName}
                              </span>
                            </span>
                            <span className='d-block'>
                              <label className='text-muted fw-bold pt-1'>
                                Product Name : &nbsp;
                              </label>
                              <span className='text-gray-800 fw-bolder text-hover-primary fs-5'>
                                {data.productName}
                              </span>
                            </span>
                            {/* <span className='d-block'>
                        <label className='text-muted fw-bold pt-1'>Unit Name : &nbsp;</label>
                        <span className='text-gray-800 fw-bolder text-hover-primary fs-5'>
                          {data.unitName}
                        </span>
                      </span> */}
                            <span className='text-muted fw-bold d-block pt-2'>
                              <span className='text-muted fw-bold'>
                                <label className='text-muted fw-bold'>L : &nbsp;</label>
                                <span className='text-gray-800 fw-bolder text-hover-primary fs-5'>
                                  {data.length}
                                </span>
                              </span>
                              <span className='ps-4'>
                                <label className='text-muted fw-bold'>H : &nbsp;</label>
                                <span className='text-gray-800 fw-bolder text-hover-primary fs-5'>
                                  {data.height}
                                </span>
                              </span>
                              <span className='ps-4'>
                                <label className='text-muted fw-bold'>D : &nbsp;</label>
                                <span className='text-gray-800 fw-bolder text-hover-primary fs-5'>
                                  {data.depth}
                                </span>
                              </span>
                              <span className='ps-4'>
                                <label className='text-muted fw-bold'>Unit Number : &nbsp;</label>
                                <span className='text-gray-800 fw-bolder text-hover-primary fs-5'>
                                  {data.noOfUnit}
                                </span>
                              </span>
                              <span className='ps-4'>
                                <label className='text-muted fw-bold'>Unit : &nbsp;</label>
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
                          {/* end::Title */}
                        </div>
                        {/* end::Content */}
                      </div>
                    </>
                  )
                })}
            </>
          )}
          {/* ======================================Add Upgrade List======================================== */}
          <div className={state.upgradeItemList.length > 0 ? 'py-0 ' : 'py-0 d-none'}>
            <div className='d-flex align-items-sm-center p-4 mb-4 shadow-sm'>
              {/* <div className='d-flex flex-row-fluid align-items-center flex-wrap my-lg-0 me-2'> */}
              <div className='flex-grow-1 my-lg-0 my-2 m-2'>
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

                    <tbody className='border-bottom'>
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
                        })}
                      {/* =================== Image no data ============== */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {/* ======================================Add Upgrade kazulencia List======================================== */}
          <div className={state.upgradeKazulenciaList.length > 0 ? 'py-0' : 'py-0 d-none'}>
            <div className='d-flex align-items-sm-center p-4 mb-4 shadow-sm'>
              {/* <div className='d-flex flex-row-fluid align-items-center flex-wrap my-lg-0 me-2'> */}
              <div className='flex-grow-1 my-lg-0 my-2 m-2'>
                <div className='table-responsive '>
                  <table className='table table-bordered table-rounded align-middle border g-4'>
                    <thead className='bg-light-primary'>
                      {/* Delete Button Row */}

                      {/* Total Display Row */}
                      <tr className='fw-bolder fs-5 bg-white'>
                        <th colSpan={3}>
                          <div className='d-flex justify-content-between align-items-center'>
                            <span className='text-primary text-center fw-bolder fs-4 w-100'>
                              Upgrade Kazulencia : ₹ {state.seltotalKazuleciaqutation}
                            </span>
                            <button
                              onClick={() => handleShowDeletUpgradekazu()}
                              className='btn btn-icon bg-hover-danger text-hover-inverse-danger btn-sm'
                              title='Delete All'
                            >
                              <KTSVG
                                path='/media/icons/duotune/general/gen027.svg'
                                className='svg-icon-3 svg-icon-danger'
                              />
                            </button>
                          </div>
                        </th>
                      </tr>

                      {/* Column Headers */}
                      <tr className='fw-bolder fs-5'>
                        <th className='min-w-100px text-center'>Agency Name</th>
                        <th className='min-w-100px text-center '>Upgrade Item Name</th>
                      </tr>
                    </thead>

                    <tbody className='border-bottom'>
                      <LoaderInTable loading={state.loading} column={3} />
                      {state.upgradeKazulenciaList.length > 0 &&
                        state.upgradeKazulenciaList.map((data, index) => (
                          <tr key={data.upGradeItemID}>
                            <td className='text-dark fs-4 text-center'>{data.agencyTypeName}</td>
                            <td className='text-dark fs-6 text-center'>{data.upGradeItemName}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}

          {/* ========================================UpGrade Item Model================================= */}
          <Modal
            size='xl'
            show={showUpGrade}
            onHide={handleCloseUpGrade}
            backdrop='true'
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>UpGrade List</Modal.Title>
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
                          <th className='min-w-150px'>Agency Type</th>
                          <th className='min-w-40px'>UpGrade Item Name</th>
                          <th className='min-w-40px'>UpGrade Cost</th>
                          <th className='min-w-100px text-end'>Add UpGrade</th>
                        </tr>
                      </thead>
                      {/* end::Table head */}
                      {/* begin::Table body */}
                      <tbody className='border-bottom'>
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
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='secondary' onClick={() => handleCloseUpGrade()}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          {/* ========================================UpGrade Kazulencia Model================================= */}
          <Modal
            size='xl'
            show={showUpGradeKazu}
            onHide={handleCloseUpGradeKazu}
            backdrop='true'
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Upgrade Kazulencia List</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='card'>
                <div className='py-3'>
                  <div className='table-responsive'>
                    <table className='table table-bordered align-middle g-2'>
                      <thead className='bg-secondary'>
                        <tr className='fw-bolder fs-5 '>
                          <th className='min-w-100px text-center'>Agency Type</th>
                          <th className='min-w-100px text-center'>Upgrade Item Name</th>
                        </tr>
                      </thead>
                      <tbody className='border-bottom'>
                        {state.upgradeKazulenciaData.length > 0 &&
                          state.upgradeKazulenciaData.map((data, index) => (
                            <tr key={index}>
                              <td className='text-dark text-hover-primary fs-6 text-center'>
                                {data.agencyTypeName}
                              </td>
                              <td className='text-dark text-hover-primary fs-6 text-center'>
                                {data.upGradeItemName}
                              </td>
                            </tr>
                          ))}
                        {/* <tr className='text-dark'>
                          <td className='text-start fw-bolder fs-6'>Total</td>
                          <td className='text-start'></td>
                          <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                            ₹ {state.seltotalKazulecia}
                          </td>

                          <td className='text-start' colSpan={5}></td>
                        </tr> */}
                        {/* Total row */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Modal.Body>
            
            <Modal.Footer>
            {/* <table>
              <tbody className="border-bottom">
          
              </tbody>
            </table> */}
              {/* Wrap both buttons in a flex row with spacing */}
              <div className='d-flex gap-3'>
              <tr className='text-dark'>
                  <td className='text-center  mr-4'></td>
                  <td className='border-top border-dark text-start fw-bolder fs-5'>Total :</td>
                  <td className='border-top border-dark text-end text-danger fw-bolder fs-6'>
                    {state.seltotalKazulecia}
                  </td>
                  <td className='text-start' colSpan={5}></td>
                </tr>
                {Number(state.seltotalKazulecia) >= Number(state.selbranchWiseMinAmt) ? (
                  <Button
                    variant='primary'
                    onClick={() => UpgradeKazu(state.upgradeKazulenciaData)}
                  >
                    Submit
                  </Button>
                ) : (
                  <div className='text-danger small mt-2 align-self-center'>
                    {/* Total must be at least {state.selbranchWiseMinAmt} to submit */}
                  </div>
                )}

                <Button variant='secondary' onClick={handleCloseUpGradeKazu}>
                  Close
                </Button>
              </div>
            </Modal.Footer>
          </Modal>

          {/* =================== Image no data ============== */}
          <BlankDataImage length={state.cartListData.length} loading={state.loading} />
        </div>
      )}
      {/* <div className='text-center'>
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
      </div> */}
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selQuotationDetailID}
        pageName={'Quotation Item'}
        show={showDelete}
        handleClose={handleCloseDelete}
        deleteData={() => deletePlanAreaItem(state.selQuotationDetailID)}
      />
      {/* =====================Delete UpGrade Item =============== */}
      <ModelPopUpDelete
        id={state.selDiyUpgrageItemMapID}
        pageName={'UpGrade Item'}
        show={showDeletUpgrade}
        handleClose={handleCloseDeletUpgrade}
        deleteData={() => deleteUpgradeItem(state.selDiyUpgrageItemMapID)}
      />
      {/* =====================Delete UpGrade Kazulencia =============== */}
      <ModelPopUpDelete
        id={state.selDiyUpgrageItemMapID}
        pageName={'UpGrade Kazulencia'}
        show={showDeletUpgradeKazu}
        handleClose={handleCloseDeletUpgradekazu}
        deleteData={() => deleteUpgradeKazu(state.selQutID)}
      />
      {/* =========================Edit Model============================ */}
      <Modal size='xl' scrollable={true} show={showEdit} onHide={handleCloseEdit}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Quotation Data</Modal.Title>
          </Modal.Header>
        </div>
        <Modal.Body>
          <div className='card-body p-0 m-0'>
            <EditCartDIYQuotationList
              productList={state.objCartListData}
              planAreaList={state.planAreaData}
              selQuotationId={state.selQuotationID}
              tmpplanAreaID={state.planAreaID}
              tmpQuotationDetailsID={state.selQuotationDetailID}
              pageName={'Edit'}
              loading={state.loading}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseEdit}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <CheckOutList
        checkOutList={state.checkOutData}
        title={state.selTitle}
        show={showCheckOut}
        listTypeID={state.selListTypeID}
        quotationID={parseInt(quotationID)}
        handleClose={handleCloseCheckOut}
        handleCheckOut={() => handleCheckOut(state.selQuotationID)}
        getAllAddonItemData={() =>
          getAllDIYQuotationData(
            state.selQuotationID,
            state.customerName,
            state.bhkName,
            state.carpetAreaName,
            state.projectName,
            state.projectNumber,
            state.mainEmployeeID,
            state.mainCustomerID,
            state.mainSearch
          )
        }
        customerName={state.customerName}
        bhkName={state.bhkName}
        carpetAreaName={state.carpetAreaName}
        projectName={state.projectName}
        projectNumber={state.projectNumber}
        mainEmployeeID={state.mainEmployeeID}
        mainCustomerID={state.mainCustomerID}
        mainSearch={state.mainSearch}
      />
    </>
  )
}

export default CartListDIYQuotation
