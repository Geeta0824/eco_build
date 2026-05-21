import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams, useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../../_Ecd/helpers'
import LoaderInTable from '../../../common-pages/LoaderInTable'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup'
import Loader from '../../../common-pages/Loader'
import {ModelPopUpDelete} from '../../../common-pages/ModelPopUpDelete'
import BlankDataImage from '../../../common-pages/BlankDataImage'
import {Button, Modal} from 'react-bootstrap-v5'
import {EditCartModularQuotationList} from './EditCartModularQuotationList'
import {ModularCheckOutList} from './ModularCheckOutList'
import {
  ICartLisyByQuotationModel,
  IModularCheckOutModel,
  IModularProductListModel,
} from '../../../../models/modular-quotation-page/IModularQuotationModel'
import {
  AddModularUpgradeItemsDetails,
  GetModularCartListByQuotationIDAPI,
  ModularCheckoutQutationApi,
  deleteDeleteModularQuotationDetailApi,
  getModularQuotaionDetailByIDAPI,
  DeleteModularUpgradeItem,
} from '../../../../modules/modular-quotation-master-page/diy-quotation-master-page/ModularQuotationCRUD'
import {IModularTypeModel} from '../../../../models/modular-product-page/modular-product-category/IModularProductCategoryModel'
import {getModularTypeListApi} from '../../../../modules/modular-product-page/modular-product-category/ModularProductCategoryCRUD'
import {getAllModularProductUpGradeItemListByQuoteID} from '../../../../modules/product-master-page/upgrade-item-master-page/UpradeItemCRUD'

import {IDIYUpgradeItemModel} from '../../../../models/quotations-page/diy-quotation-page/IDIYQuotationModel'
import {IUpgradeItemModel} from '../../../../models/product-page/IUpgradeItemModel'
type Props = {}

interface IDIY {
  loading: boolean
  cartListData: ICartLisyByQuotationModel[]
  temCartListData: ICartLisyByQuotationModel[]
  objCartListData: IModularProductListModel[]
  modularTypeData: IModularTypeModel[]
  checkOutData: IModularCheckOutModel[]
  upgradeItemData: IUpgradeItemModel[]
  upgradeItemList: IDIYUpgradeItemModel[]
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
  selModularTypeID: number
  selModularUpgrageItemMapID: number
  mainCustomerID: number
  mainEmployeeID: number
  mainSearch: string
}

const CartListModularQuotation: React.FC<Props> = () => {
  const {quotationID} = useParams<{quotationID: string}>()
  const location = useLocation()
  const history = useHistory()
  const dispatch = useDispatch()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [cartLength, setCartLength] = useState<number>(0)
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [state, setState] = useState<IDIY>({
    loading: false,
    cartListData: [] as ICartLisyByQuotationModel[],
    temCartListData: [] as ICartLisyByQuotationModel[],
    objCartListData: [] as IModularProductListModel[],
    modularTypeData: [] as IModularTypeModel[],
    checkOutData: [] as IModularCheckOutModel[],
    upgradeItemData: [] as IUpgradeItemModel[],
    upgradeItemList: [] as IDIYUpgradeItemModel[],
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
    selModularTypeID: 0,
    selModularUpgrageItemMapID: 0,
    mainCustomerID: 0,
    mainEmployeeID: 0,
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
      var modularTypeID = lc.modularTypeID
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
      var main
      getAllDIYQuotationData(
        tmpQuotationID,
        customerName,
        bhkName,
        carpetAreaName,
        projectName,
        projectNumber,
        modularTypeID,
        mainCustomerID,
        mainEmployeeID,
        mainSearch
      )
    }, 100)
  }, [])

  function getAllDIYQuotationData(
    tmpQuotationID: number,
    customerName: string,
    bhkName: string,
    carpetAreaName: string,
    projectName: string,
    projectNumber: string,
    modularTypeID: number,
    mainCustomerID: number,
    mainEmployeeID: number,
    mainSearch: string
  ) {
    GetModularCartListByQuotationIDAPI(parseInt(quotationID))
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          const responseUpgradeData = response.data.upGradeItemList
          setState({
            ...state,
            cartListData: responseData,
            temCartListData: responseData,
            upgradeItemList: responseUpgradeData,
            selQuotationID: parseInt(quotationID),
            tmpQuotationID: tmpQuotationID,
            customerName: customerName,
            bhkName: bhkName,
            carpetAreaName: carpetAreaName,
            projectName: projectName,
            projectNumber: projectNumber,
            selModularTypeID: modularTypeID,
            mainCustomerID,
            mainEmployeeID,
            mainSearch,
            loading: false,
          })
          setCartLength(responseData.length)
          localStorage.setItem('totalCounts', responseData.length)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, cartListData: [], upgradeItemList: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, cartListData: [], upgradeItemList: [], loading: false})
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
    deleteDeleteModularQuotationDetailApi(temQuotationDetailID)
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
            state.selModularTypeID,
            state.mainCustomerID,
            state.mainEmployeeID,
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
            state.selModularTypeID,
            state.mainCustomerID,
            state.mainEmployeeID,
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
          state.selModularTypeID,
          state.mainCustomerID,
          state.mainEmployeeID,
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
      state.selModularTypeID,
      state.mainCustomerID,
      state.mainEmployeeID,
      state.mainSearch
    )
    setShowEdit(false)
  }
  const handleShowEdit = (quotationDetailID: number) => {
    getModularTypeListApi()
      .then((response) => {
        if (response.data.isSuccess == true) {
          let resData = response.data.responseObject
          getModularQuotaionDetailByIDAPI(quotationDetailID)
            .then((response) => {
              if (response.data.isSuccess == true) {
                let resDatas = response.data.responseObject
                setState({
                  ...state,
                  modularTypeData: resData,
                  objCartListData: resDatas,
                  selQuotationDetailID: quotationDetailID,
                  planAreaID: resDatas[0].planAreaID,
                })
                setShowEdit(true)
              } else {
                toast.error(`${response.data.message}`)
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
        } else {
          toast.error(`${response.data.message}`)
          setShowEdit(true)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowEdit(true)
      })
  }
  // ==================Upgrade=====================
  const [showUpGrade, setShowUpGrade] = useState(false)
  function handleCloseUpGrade() {
    getAllDIYQuotationData(
      state.selQuotationID,
      state.customerName,
      state.bhkName,
      state.carpetAreaName,
      state.projectName,
      state.projectNumber,
      state.selModularTypeID,
      state.mainCustomerID,
      state.mainEmployeeID,
      state.mainSearch
    )
    setShowUpGrade(false)
  }
  // ========================== For Add UpGrade ====================

  function getUpgradeItemdata() {
    getAllModularProductUpGradeItemListByQuoteID(state.selQuotationID)
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
    AddModularUpgradeItemsDetails(parseInt(quotationID), tmpUpgradeId)
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
  const handleShowDeletUpgrade = (modularUpgrageItemMapID: number) => {
    setState({
      ...state,
      selModularUpgrageItemMapID: modularUpgrageItemMapID,
      loading: false,
    })
    setShowDeletUpgrade(true)
  }

  function deleteUpgradeItem(modularUpgrageItemMapID: number) {
    DeleteModularUpgradeItem(modularUpgrageItemMapID)
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
            state.selModularTypeID,
            state.mainCustomerID,
            state.mainEmployeeID,
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
  // ==================Check Out Model Function===============
  const [showCheckOut, setShowCheckOut] = useState(false)
  const handleCloseCheckOut = () => {
    setShowCheckOut(false)
  }
  const handleCheckOut = (quotationID: number) => {
    ModularCheckoutQutationApi(quotationID, 0)
      .then((response) => {
        const tmpRowData: IModularCheckOutModel[] = []
        if (response.data.isSuccess == true) {
          history.push({
            pathname: `/modular/modular-quotation/backpdf/${quotationID}`,
            state: {
              isDownload: 0,
              customerName: state.customerName,
              bhkName: state.bhkName,
              carpetAreaName: state.carpetAreaName,
              projectName: state.projectName,
              projectNumber: state.projectNumber,
              modularTypeID: state.selModularTypeID,
              mainEmployeeID: state.mainEmployeeID,
              mainCustomerID: state.mainCustomerID,
              mainSearch: state.mainSearch,
            },
          })
        } else if (response.data.isSuccess == false) {
          const responseData = response.data.responseObject
          for (let k in responseData) {
            let tmpAllData: IModularCheckOutModel = {
              primaryID: parseInt(k + 1),
              productID: responseData[k]['productID'],
              productName: responseData[k]['productName'],
              description: responseData[k]['description'],
              areaName: responseData[k]['areaName'],
              productCategoryName: responseData[k]['productCategoryName'],
              unitName: responseData[k]['unitName'],
              parentName: responseData[k]['parentName'],
              modularTypeID: responseData[k]['modularTypeID'],
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

  return (
    <>
      {/* <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
            to={{
              pathname: `/modular/modular-quotation/list`,
              state: {
                modularTypeID: state.selModularTypeID,
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
                pathname: `/modular/modular-quotation/add-cart/${state.selQuotationID}`,
                state: {
                  quotationID: state.selQuotationID,
                  customerName: state.customerName,
                  bhkName: state.bhkName,
                  carpetAreaName: state.carpetAreaName,
                  projectName: state.projectName,
                  projectNumber: state.projectNumber,
                  modularTypeID: state.selModularTypeID,
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
          <div className='card-toolbar rounded' data-bs-toggle='tooltip' data-bs-placement='top'>
            <span
              className='btn btn-sm btn-primary bg-info fs-5'
              onClick={() => getUpgradeItemdata()}
            >
              UpGrade Item
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
              to={`/modular/modular-quotation/pdf/${parseInt(quotationID)}`}
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
                pathname: `/modular/modular-quotation/list`,
                state: {
                  modularTypeID: state.selModularTypeID,
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
        <LoaderInTable loading={state.loading} column={15} />
        {state.cartListData.length > 0 &&
          state.cartListData.map((data, index) => {
            return (
              <>
                <div key={index} className='d-flex align-items-sm-center p-3 mb-4 shadow-sm'>
                  {/* begin::Symbol */}
                  <div className='d-block justify-content-center align-items-center text-center'>
                    <div className='symbol symbol-75px symbol-2by3 text-center'>
                      {data.photoPath !== '' ? (
                        <img src={process.env.REACT_APP_API_URL + data.photoPath} alt='' />
                      ) : (
                        <img src={toAbsoluteUrl('/media/img/NoProductImage.png')} alt='' />
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
                        <label className='text-muted fw-bold pt-1'>
                          Modular Type Name : &nbsp;
                        </label>
                        <span className='text-gray-800 fw-bolder text-hover-primary fs-5'>
                          {data.areaName}
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
        {/* ======================================Add Upgrade List======================================== */}
        <div className={state.upgradeItemList.length > 0 ? 'py-0 ' : 'py-0 d-none'}>
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
                  })}
                {/* =================== Image no data ============== */}
              </tbody>
            </table>
          </div>
        </div>
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
                    <tbody className="border-bottom">
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
        {/* =================== Image no data ============== */}
        <BlankDataImage length={state.cartListData.length} loading={state.loading} />
      </div>

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
        id={state.selModularUpgrageItemMapID}
        pageName={'UpGrade Item'}
        show={showDeletUpgrade}
        handleClose={handleCloseDeletUpgrade}
        deleteData={() => deleteUpgradeItem(state.selModularUpgrageItemMapID)}
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
            <EditCartModularQuotationList
              productList={state.objCartListData}
              modularTypeData={state.modularTypeData}
              selQuotationId={state.selQuotationID}
              tmpplanAreaID={state.planAreaID}
              tmpQuotationDetailsID={state.selQuotationDetailID}
              pageName={'Edit'}
              loading={state.loading}
              show={showEdit}
              handleClose={handleCloseEdit}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseEdit}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ModularCheckOutList
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
            state.selModularTypeID,
            state.mainCustomerID,
            state.mainEmployeeID,
            state.mainSearch
          )
        }
        customerName={state.customerName}
        bhkName={state.bhkName}
        carpetAreaName={state.carpetAreaName}
        projectName={state.projectName}
        projectNumber={state.projectNumber}
        modularTypeID={state.selModularTypeID}
        mainEmployeeID={state.mainEmployeeID}
        mainCustomerID={state.mainCustomerID}
        mainSearch={state.mainSearch}
      />
    </>
  )
}

export default CartListModularQuotation
