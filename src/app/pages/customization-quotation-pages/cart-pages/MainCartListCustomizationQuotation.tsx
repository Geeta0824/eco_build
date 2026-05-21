import {Drawer, DrawerProps, Pagination, Space} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams, useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  ICartLisyByQuotationModel,
  IDIYCheckOutModel,
  IDIYProductListModel,
} from '../../../models/quotations-page/diy-quotation-page/IDIYQuotationModel'
import Loader from '../../common-pages/Loader'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {Button, Modal} from 'react-bootstrap-v5'
import {EditCartDIYQuotationList} from './EditCartDIYQuotationList'
import {IPlanAreaModel} from '../../../models/product-page/IPlanAreaModel'
import {getAllPlanArea} from '../../../modules/product-master-page/plan-area-master-page/PlanAreaCRUD'
import {CheckOutList} from './CheckOutList'
import {
  GetCartListByQuotationIDApi,
  GetCartListFromPackageIDApi,
  checkoutCustomizationQuotationApi,
  deleteQuotationDetailIDApi,
  getUpdateQuotaionDetailObj,
  saveQuotationDetailinCartApi,
} from '../../../modules/customization-quotation-master-page/CustomizationQuotationsCRUD'
import {DrawerChangeProduct} from './DrawerChangeProduct'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'

type Props = {}

interface IDIY {
  loading: boolean
  cartListData: ICartLisyByQuotationModel[]
  temCartListData: ICartLisyByQuotationModel[]
  objCartListData: IDIYProductListModel[]
  planAreaData: IPlanAreaModel[]
  checkOutData: IDIYCheckOutModel[]
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
  mainCustomerID: number
  mainEmployeeID: number
  mainSearch: string
  SearchInView: string
  SearchInAddCart: string
  addCartPlanAreaId: number
  addCartCategoryId: number
}

const MainCartListCustomizationQuotation: React.FC<Props> = () => {
  const {quotationID} = useParams<{quotationID: string}>()
  const location = useLocation()
  const history = useHistory()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [cartLength, setCartLength] = useState<number>(0)

  const [state, setState] = useState<IDIY>({
    loading: false,
    cartListData: [] as ICartLisyByQuotationModel[],
    temCartListData: [] as ICartLisyByQuotationModel[],
    objCartListData: [] as IDIYProductListModel[],
    planAreaData: [] as IPlanAreaModel[],
    checkOutData: [] as IDIYCheckOutModel[],
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
      var mainEmployeeID: number = 0
      var mainCustomerID: number = 0
      var addCartPlanAreaId: number = 0
      var addCartCategoryId: number = 0
      var mainSearch: string = ''
      var SearchInView: string = ''
      var SearchInAddCart: string = ''

      if (
        lc.mainEmployeeID !== undefined ||
        lc.mainCustomerID !== undefined ||
        lc.mainSearch !== undefined ||
        lc.SearchInView !== undefined ||
        lc.addCartPlanAreaId !== undefined ||
        lc.addCartCategoryId !== undefined ||
        lc.SearchInAddCart !== undefined
      ) {
        mainEmployeeID = lc.mainEmployeeID
        mainCustomerID = lc.mainCustomerID
        mainSearch = lc.mainSearch
        SearchInView = lc.SearchInView
        SearchInAddCart = lc.SearchInAddCart
        addCartPlanAreaId = lc.addCartPlanAreaId
        addCartCategoryId = lc.addCartCategoryId
      }

      getAllDIYQuotationData(
        selPackageID,
        selPackageTypeID,
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
        addCartCategoryId
      )
      console.log('plan1',addCartPlanAreaId)
      console.log('cate1',addCartCategoryId)
    }, 100)
  }, [])
 
  function getAllDIYQuotationData(
    selPackageID: number,
    selPackageTypeID: number,
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
    addCartCategoryId: number
  ) {
    GetCartListFromPackageIDApi(parseInt(quotationID), selPackageID, selPackageTypeID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject

          let prvTmpAreaID: number = 0
          const temRows = []
          const Rows: ICartLisyByQuotationModel[] = responseData
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
            temCartListData: temRows,
            selQuotationID: parseInt(quotationID),
            selPackageID: selPackageID,
            customerName: customerName,
            bhkName: bhkName,
            carpetAreaName: carpetAreaName,
            projectName: projectName,
            projectNumber: projectNumber,
            selQuotationDetailID: 0,
            mainCustomerID,
            mainEmployeeID,
            mainSearch,
            SearchInAddCart,
            addCartPlanAreaId,
            addCartCategoryId,
            loading: false,
          })
        console.log('plan',addCartPlanAreaId)
        console.log('cate',addCartCategoryId)

          setName(SearchInView)
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
            state.selPackageID,
            state.selPackageTypeID,
            state.customerName,
            state.bhkName,
            state.carpetAreaName,
            state.projectName,
            state.projectNumber,
            state.mainCustomerID,
            state.mainEmployeeID,
            state.mainSearch,
            state.SearchInView,
            state.SearchInAddCart,
            state.addCartPlanAreaId,
            state.addCartCategoryId,
          )
          // dispatch(decrement(1, state.selQuotationID))
          setShowDelete(false)
        } else {
          toast.error(`${response.data.message}`)
          getAllDIYQuotationData(
            state.selPackageID,
            state.selPackageTypeID,
            state.customerName,
            state.bhkName,
            state.carpetAreaName,
            state.projectName,
            state.projectNumber,
            state.mainCustomerID,
            state.mainEmployeeID,
            state.mainSearch,
            state.SearchInView,
            state.SearchInAddCart,
            state.addCartPlanAreaId,
            state.addCartCategoryId,
          )
          setShowDelete(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        getAllDIYQuotationData(
          state.selPackageID,
          state.selPackageTypeID,
          state.customerName,
          state.bhkName,
          state.carpetAreaName,
          state.projectName,
          state.projectNumber,
          state.mainCustomerID,
          state.mainEmployeeID,
          state.mainSearch,
          state.SearchInView,
          state.SearchInAddCart,
          state.addCartPlanAreaId,
          state.addCartCategoryId
        )
        setShowDelete(false)
      })
  }

  // ==================Edit Model Function===============
  const [showEdit, setShowEdit] = useState(false)
  const handleCloseEdit = () => {
    getAllDIYQuotationData(
      state.selPackageID,
      state.selPackageTypeID,
      state.customerName,
      state.bhkName,
      state.carpetAreaName,
      state.projectName,
      state.projectNumber,
      state.mainCustomerID,
      state.mainEmployeeID,
      state.mainSearch,
      state.SearchInView,
      state.SearchInAddCart,
      state.addCartPlanAreaId,
      state.addCartCategoryId
    )
    setShowEdit(false)
  }
  const handleShowEdit = (quotationDetailID: number) => {
    getAllPlanArea()
      .then((response) => {
        if (response.data.isSuccess == true) {
          let resData = response.data.responseObject
          getUpdateQuotaionDetailObj(quotationDetailID)
            .then((response) => {
              if (response.data.isSuccess == true) {
                let resDatas = response.data.responseObject
                setState({
                  ...state,
                  planAreaData: resData,
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

  // ==================Check Out Model Function===============
  const [showCheckOut, setShowCheckOut] = useState(false)
  const handleCloseCheckOut = () => {
    setShowCheckOut(false)
  }
  const handleCheckOut = (quotationID: number) => {
    checkoutCustomizationQuotationApi(quotationID, 0)
      .then((response) => {
        if (response.data.isSuccess == true) {
          history.push({
            pathname: `/customization-quotations/pdf/${quotationID}`,
            state: {
              mainEmployeeID: state.mainEmployeeID,
              mainCustomerID: state.mainCustomerID,
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
          // setShowCheckOut(true)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        // setShowCheckOut(true)
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
          user.description.toLowerCase().includes(keyword.toLowerCase()) ||
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
    getAllDIYQuotationData(
      state.selPackageID,
      state.selPackageTypeID,
      state.customerName,
      state.bhkName,
      state.carpetAreaName,
      state.projectName,
      state.projectNumber,
      state.mainCustomerID,
      state.mainEmployeeID,
      state.mainSearch,
      state.SearchInView,
      state.SearchInAddCart,
      state.addCartPlanAreaId,
      state.addCartCategoryId
    )
    setOpen(false)
  }

  return (
    <>
      <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
            to={{
              pathname: '/customization-quotations/list',
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
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Back to Item'
          >
            <Link
              to={{
                pathname: `/customization-quotations/add-cart/${state.selQuotationID}`,
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
                  SearchInAddCart: state.SearchInAddCart,
                  SearchInView: name,
                 selPlanAreaId: state.addCartPlanAreaId,
                 selCategoryId: state.addCartCategoryId
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
          <div
            className='card-toolbar border border-primary rounded'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
          >
            <span
              className='btn btn-sm btn-light-primary bg-white fs-5'
              onClick={() => handleCheckOut(parseInt(quotationID))}
            >
              Check out
            </span>
            {/* <Link
              to={`/customization-quotations/pdf/${parseInt(quotationID)}`}
              className='btn btn-sm btn-light-primary bg-white fs-5'
              // onClick={() => onAddToCart(data, data.planAreaID)}
            >
              Check out
            </Link> */}
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
                  <th className='w-15px text-center'>Change</th>
                  <th className='min-w-50px text-end'>Edit | Delete</th>
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
                          className={data.titleAreaID == 0 ? '' : 'd-none'}
                          key={data.quotationDetailID}
                        >
                          <td
                            colSpan={9}
                            className='text-primary text-center text-hover-primary fw-bolder fs-4'
                          >
                            {data.titleAreaName}
                          </td>
                        </tr>
                        <tr className='border-bottom'>
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
                          <td className='text-center'>
                            <div
                              onClick={() => showDrawer(data.quotationDetailID)}
                              className='btn btn-icon btn-bg-light bg-hover-info text-hover-inverse-info btn-sm me-1'
                            >
                              <KTSVG
                                path='/media/icons/duotune/social/soc005.svg'
                                className='svg-icon-2x svg-icon-info'
                              />
                            </div>
                          </td>
                          <td>
                            <div className='d-flex justify-content-end flex-shrink-0'>
                              <span
                                onClick={() => handleShowEdit(data.quotationDetailID)}
                                className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                              >
                                <KTSVG
                                  path='/media/icons/duotune/art/art005.svg'
                                  className='svg-icon-3 svg-icon-primary'
                                />
                              </span>
                              <div
                                onClick={() => handleShowDelete(data.quotationDetailID)}
                                className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                              >
                                <KTSVG
                                  path='/media/icons/duotune/general/gen027.svg'
                                  className='ssvg-icon-3 svg-icon-danger'
                                />
                              </div>
                            </div>
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
      </div>
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selQuotationDetailID}
        pageName={'Quotation Item'}
        show={showDelete}
        handleClose={handleCloseDelete}
        deleteData={() => deletePlanAreaItem(state.selQuotationDetailID)}
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

      {/* -----------------Check Out --------------- */}
      <CheckOutList
        checkOutList={state.checkOutData}
        title={state.selTitle}
        show={showCheckOut}
        listTypeID={state.selListTypeID}
        quotationID={parseInt(quotationID)}
        handleClose={handleCloseCheckOut}
        handleCheckOut={() => handleCheckOut(state.selQuotationID)}
        mainEmployeeID={state.mainEmployeeID}
        mainCustomerID={state.mainCustomerID}
        mainSearch={state.mainSearch}
        getAllAddonItemData={() =>
          getAllDIYQuotationData(
            state.selPackageID,
            state.selPackageTypeID,
            state.customerName,
            state.bhkName,
            state.carpetAreaName,
            state.projectName,
            state.projectNumber,
            state.mainCustomerID,
            state.mainEmployeeID,
            state.mainSearch,
            state.SearchInView,
            state.SearchInAddCart,
            state.addCartPlanAreaId,
            state.addCartCategoryId
          )
        }
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
    </>
  )
}

export default MainCartListCustomizationQuotation
