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
import {getAllPlanArea} from '../../../../modules/product-master-page/plan-area-master-page/PlanAreaCRUD'
import {ModalPopUpImageView} from '../../../common-pages/ModalPopUpImageView'
// import {getActiveBHKApi} from '../../../../modules/master-page/bhk-master-page/BHKCRUD'
import {getAllCarpetArea} from '../../../../modules/master-page/carpet-area-page/CarpetAreaCRUD'
import {IBHKMasterModel} from '../../../../models/master-page/IBHKMasterModel'
import {ICarpetAreaModel} from '../../../../models/master-page/ICarpetAreaModel'
import {IPlanAreaModel} from '../../../../models/product-page/IPlanAreaModel'
import {EditCartCarpetryPackageList} from './EditCartCarpetryPackageList'
import {
  GetCartListByPackageIDApi,
  checkoutPackageApi,
  deletePackageDetailIDApi,
  getUpdateQuotaionDetailObj,
  updatePackageApi,
} from '../../../../modules/carpetry-master-page/carpetry-package-master-page/TurnkeyPackageCRUD'
import {
  IBranchRateMapModel,
  ICartLisyByPackageModel,
  IDIYCheckOutModel,
  IDIYProductListModel,
} from '../../../../models/carpetry-page/ICarpetryPackageModel'
import {CheckOutCarpetryList} from './CheckOutCarpetryList'
import clsx from 'clsx'
import {IProjectTypeodel} from '../../../../models/projects-page/IProjectsModel'
import {GetProjectTypeDropdownListAPI} from '../../../../modules/project-master-page/project-master/ProjectCRUD'
import {getActiveBHKApi} from '../../../../modules/master-page/bhk-master-page/NewBHKCRUD'
import {GetBranchRateMap_List} from '../../../../modules/master-page/branch-master-page/BranchCRUD'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'
import {Pagination} from 'antd'

type Props = {}

interface IDIY {
  loading: boolean
  cartListData: ICartLisyByPackageModel[]
  temCartListData: ICartLisyByPackageModel[]
  objCartListData: IDIYProductListModel[]
  planAreaData: IPlanAreaModel[]
  checkOutData: IDIYCheckOutModel[]
  ProjectTypeData: IProjectTypeodel[]
  branchRateMapData: IBranchRateMapModel[]
  SearchText: string
  selPackageID: number
  tmpPackageID: number
  packageAmount: number
  selPackageDetailID: number
  planAreaID: number
  packageName: string
  bhkName: string
  carpetAreaName: string
  projectType: string
  photoPath: string
  selTitle: string
  selListTypeID: number
  mainSearch: string
  projectTypeID: number
  carpetAreaID: number
  bhkID: number
  selAmount: number
}

const CardListCarpetryPackage: React.FC<Props> = () => {
  const {packageID} = useParams<{packageID: string}>()
  const location = useLocation()
  const history = useHistory()
  const dispatch = useDispatch()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [cartLength, setCartLength] = useState<number>(0)
  const [packageName, setPackageName] = useState<string>('')
  const [projectTypeId, setProjectTypeId] = useState<number>(0)
  const [packageAmount, setpackageAmount] = useState<number>(0)
  const [bhkID, setBhkID] = useState<number>(0)
  const [carpetAreaID, setCarpetAreaID] = useState<number>(0)
  const [projectType, setProjectType] = useState<string>('')
  const [photoPath, setPhotoPath] = useState<string>('')

  const [bhkData, setBhkData] = useState<IBHKMasterModel[]>([] as IBHKMasterModel[])
  const [carpetAreaData, setCarpetAreaData] = useState<ICarpetAreaModel[]>([] as ICarpetAreaModel[])

  const [state, setState] = useState<IDIY>({
    loading: false,
    cartListData: [] as ICartLisyByPackageModel[],
    temCartListData: [] as ICartLisyByPackageModel[],
    objCartListData: [] as IDIYProductListModel[],
    planAreaData: [] as IPlanAreaModel[],
    checkOutData: [] as IDIYCheckOutModel[],
    ProjectTypeData: [] as IProjectTypeodel[],
    branchRateMapData: [] as IBranchRateMapModel[],
    SearchText: '',
    selPackageID: 0,
    tmpPackageID: 0,
    selPackageDetailID: 0,
    planAreaID: 0,
    packageName: '',
    packageAmount: 0,
    bhkName: '',
    carpetAreaName: '',
    projectType: '',
    photoPath: '',
    selTitle: '',
    selListTypeID: 0,
    mainSearch: '',
    projectTypeID: 0,
    carpetAreaID: 0,
    bhkID: 0,
    selAmount: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      var lc: any = location.state
      var tmpPackageID = lc.packageID
      var packageName = lc.packageName
      var bhkName = lc.bhkName
      var carpetAreaName = lc.carpetAreaName
      var projectType = lc.projectType
      var photoPath = lc.photoPath
      // var projectTypeId = lc.projectTypeId
      var packageAmount = lc.packageAmount
      // var bhkId = lc.bhkId
      // var carpetAreaId = lc.carpetAreaId
      let mainSearch: string = ''
      let projectTypeID: number = 0
      let carpetAreaID: number = 0
      let bhkID: number = 0
      let tmpCartListData: ICartLisyByPackageModel[] = []
      if (lc.searchText != undefined) {
        mainSearch = lc.searchText
        projectTypeID = lc.selProjectTypeID
        carpetAreaID = lc.selCarpetAreaID
        bhkID = lc.selBhkId
        tmpCartListData = lc.cartListData
      }
      console.log('cartListData', tmpCartListData)
      console.log('selProjectTypeID', projectTypeID)
      console.log('carpetAreaID', carpetAreaID)
      console.log('bhkID', bhkID)
      console.log('photoPath', photoPath)
      console.log('mainSearch', mainSearch)
      setPackageName(packageName)
      setBhkID(bhkID)
      setProjectTypeId(projectTypeID)
      setpackageAmount(packageAmount)
      setCarpetAreaID(carpetAreaID)
      setProjectType(projectType)
      setPhotoPath(photoPath)
      getBHKData()
      getCarpetAreaData()
      getAllPackageData(
        tmpPackageID,
        packageName,
        bhkName,
        packageAmount,
        carpetAreaName,
        projectType,
        photoPath,
        mainSearch,
        projectTypeID,
        carpetAreaID,
        bhkID,
        tmpCartListData
      )
    }, 100)
  }, [])

  function getBHKData() {
    getActiveBHKApi()
      .then((response) => {
        // let responseData = response.data.responseObject

        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess === true) {
          let responseData = resp.responseObject
          setBhkData(responseData)
        } else {
          toast.error(`${response.data.message}`)
          setBhkData([] as IBHKMasterModel[])
        }
      })
      .catch((error) => {
        setBhkData([] as IBHKMasterModel[])
        toast.error(`${error}`)
      })
  }

  function getCarpetAreaData() {
    getAllCarpetArea()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setCarpetAreaData(responseData)
        } else {
          toast.error(`${response.data.message}`)
          setCarpetAreaData([] as ICarpetAreaModel[])
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setCarpetAreaData([] as ICarpetAreaModel[])
      })
  }

  function getAllPackageData(
    tmpPackageID: number,
    packageName: string,
    bhkName: string,
    packageAmount: number,
    carpetAreaName: string,
    projectType: string,
    photoPath: string,
    mainSearch: string,
    projectTypeID: number,
    carpetAreaID: number,
    bhkID: number,
    tmpCartListData: ICartLisyByPackageModel[]
  ) {
    GetCartListByPackageIDApi(parseInt(packageID))
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          getProjectTypeData(
            tmpPackageID,
            packageName,
            bhkName,
            packageAmount,
            carpetAreaName,
            projectType,
            photoPath,
            responseData,
            mainSearch,
            projectTypeID,
            carpetAreaID,
            bhkID
          )
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

  function getProjectTypeData(
    tmpPackageID: number,
    packageName: string,
    bhkName: string,
    packageAmount: number,
    carpetAreaName: string,
    projectType: string,
    photoPath: string,
    cartListData: ICartLisyByPackageModel[],
    mainSearch: string,
    projectTypeID: number,
    carpetAreaID: number,
    bhkID: number
  ) {
    GetProjectTypeDropdownListAPI()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            cartListData: cartListData,
            temCartListData: cartListData,
            ProjectTypeData: responseData,
            selPackageID: parseInt(packageID),
            tmpPackageID: tmpPackageID,
            packageName: packageName,
            bhkName: bhkName,
            packageAmount: packageAmount,
            carpetAreaName: carpetAreaName,
            projectType: projectType,
            photoPath: photoPath,
            mainSearch,
            projectTypeID,
            carpetAreaID,
            bhkID,
            loading: false,
          })
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
  const handleShowDelete = (packageDetailID: number) => {
    setState({
      ...state,
      selPackageDetailID: packageDetailID,
    })
    setShowDelete(true)
  }

  function deletePckageDetailsItem(tempackageDetailID: number) {
    deletePackageDetailIDApi(tempackageDetailID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllPackageData(
            state.selPackageID,
            state.packageName,
            state.bhkName,
            state.packageAmount,
            state.carpetAreaName,
            state.projectType,
            state.photoPath,
            state.mainSearch,
            state.projectTypeID,
            state.carpetAreaID,
            state.bhkID,
            state.cartListData
          )
          setShowDelete(false)
        } else {
          toast.error(`${response.data.message}`)
          getAllPackageData(
            state.selPackageID,
            state.packageName,
            state.bhkName,
            state.packageAmount,
            state.carpetAreaName,
            state.projectType,
            state.photoPath,
            state.mainSearch,
            state.projectTypeID,
            state.carpetAreaID,
            state.bhkID,
            state.cartListData
          )
          setShowDelete(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        getAllPackageData(
          state.selPackageID,
          state.packageName,
          state.bhkName,
          state.packageAmount,
          state.carpetAreaName,
          state.projectType,
          state.photoPath,
          state.mainSearch,
          state.projectTypeID,
          state.carpetAreaID,
          state.bhkID,
          state.cartListData
        )
        setShowDelete(false)
      })
  }

  // ==================Edit Model Function===============
  const [showEdit, setShowEdit] = useState(false)
  const handleCloseEdit = () => {
    getAllPackageData(
      state.selPackageID,
      state.packageName,
      state.bhkName,
      state.packageAmount,
      state.carpetAreaName,
      state.projectType,
      state.photoPath,
      state.mainSearch,
      state.projectTypeID,
      state.carpetAreaID,
      state.bhkID,
      state.cartListData
    )
    setShowEdit(false)
  }
  const handleShowEdit = (packageDetailID: number) => {
    getAllPlanArea()
      .then((response) => {
        if (response.data.isSuccess == true) {
          let resData = response.data.responseObject
          getUpdateQuotaionDetailObj(packageDetailID)
            .then((response) => {
              if (response.data.isSuccess == true) {
                let resDatas = response.data.responseObject
                setState({
                  ...state,
                  planAreaData: resData,
                  objCartListData: resDatas,
                  selPackageDetailID: packageDetailID,
                  planAreaID: resDatas[0].planAreaID,
                })
                setShowEdit(true)
              } else {
                toast.error(`${response.data.message}`)
                setState({
                  ...state,
                  selPackageDetailID: packageDetailID,
                })
                setShowEdit(true)
              }
            })
            .catch((error) => {
              toast.error(`${error}`)
              setState({
                ...state,
                selPackageDetailID: packageDetailID,
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
  const handleCheckOut = (packageID: number) => {
    checkoutPackageApi(packageID, 0)
      .then((response) => {
        if (response.data.isSuccess == true) {
          history.push({
            pathname: `/carpetry/carpetry-pkg-mst/pdf/${packageID}`,
            state: {
              isDownload: 0,
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
          user.areaName.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, cartListData: results})
    } else {
      setState({...state, cartListData: state.temCartListData})
    }
    setName(keyword)
  }

  // ====================View Photo============
  const [showImage, setShowImage] = useState(false)
  const handleCloseImage = () => {
    setShowImage(false)
  }
  const handleShowImage = () => {
    setShowImage(true)
  }

  function setPackage(e: any) {
    const uid = e.target.id
    const value = e.target.value
    if (uid == `txtPackage_${state.selPackageID}`) {
      setPackageName(value)
    }
  }

  function handleChange(e: any) {
    const uid = e.target.id
    const value = e.target.value
    setpackageAmount(value)
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    // const valueText = event.target.selectedOptions[0].innerText
    const elementId = event.target.id
    if (elementId === 'bhkid') {
      setBhkID(parseInt(value))
    } else if (elementId === 'carpetAreaID') {
      setCarpetAreaID(parseInt(value))
    } else if (elementId === 'projectTypeID') {
      setProjectTypeId(parseInt(value))
    }
  }

  // const [photo, setPhoto] = useState('')
  const [fileLoader, setFileLoader] = useState(false)
  const imageUpload = (e: any, ID: number) => {
    if (e.target.files[0].size > 20971520) {
      return toast.error('File size has exceeded it max limit of 20MB')
    }
    // setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + `/Package/UpdateCarpetryPackagePhoto/${ID}`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        //  console.log(data)
        if (data.isSuccess === true) {
          setState({...state, photoPath: data.photoPath})
          // handleRefresh()
          setFileLoader(false)
        } else {
          toast.error(`${data.message}`)
          setFileLoader(false)
        }
      })
      .catch((err) => {
        toast.error(`${err.message}`)
        setFileLoader(false)
      })
  }

  function updateProjectInfo() {
    updatePackageApi(
      state.selPackageID,
      packageName,
      carpetAreaID,
      bhkID,
      projectTypeId,
      packageAmount,
      user.employeeID,
      '192.66.22',
      photoPath
    )
      .then((response) => {
        let resData = response.data
        if (response.data.isSuccess == true) {
          toast.success(`${resData.message}`)
        } else {
          toast.error(`${resData.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }
  // =============================Amount Model================================

  const [totalAmount, setTotalAmount] = useState<number>(0)

  const [showPriceModal, setShowPriceModal] = useState(false)
  const handleCloseUnitPrice = () => {
    setShowPriceModal(false)
  }

  const handlePriceShow = (amount: number) => {
    GetBranchRateMap_List()
      .then((response) => {
        if (response.data.isSuccess === true) {
          let responseData = response.data.responseObject
          setState({
            ...state,
            branchRateMapData: responseData,
            selAmount: amount,
          })

          // Calculate total amount based on the first branch rate percentage
          // if (responseData.length > 0) {
          //   const firstBranchRate = responseData[0].readyMadePercentage // Assuming this is the percentage
          //   const calculatedTotal = firstBranchRate > 0 ? (amount * firstBranchRate) / 100  : amount // If percentage is 0, use the current amount
          //   setTotalAmount(calculatedTotal)
          // }
          if (responseData.length > 0) {
            const firstBranchRate = responseData[0].readyMadePercentage

            const calculatedTotal =
              firstBranchRate > 0 ? (amount * firstBranchRate) / 100 + amount : amount

            setTotalAmount(calculatedTotal)
          }
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, branchRateMapData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, branchRateMapData: [], loading: false})
      })
    setShowPriceModal(true)
  }

  return (
    <>
      <div className='text-end '>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          onClick={() => {
            history.push({
              pathname: '/carpetry/carpetry-pkg-mst/list',
              state: {
                search: state.mainSearch,
                projectTypeID: state.projectTypeID,
                selCarpetAreaID: state.carpetAreaID,
                selBHKID: state.bhkID,
              },
            })
          }}
        >
          Back To List
        </span>
      </div>
      <Loader loading={state.loading} />
      <div className={state.loading === true ? 'd-none' : `card`}>
        <div className='row card-header align-items-center border-0 m-1'>
          <div className='col-1 symbol symbol-65px'>
            <span className={clsx(`symbol-label cursor-pointer`)} onClick={handleShowImage}>
              {state.photoPath == '/media/img/NoProductImage.png' ? (
                <img
                  src={toAbsoluteUrl(state.photoPath)}
                  className='h-100 align-self-center w-100'
                  alt=''
                />
              ) : (
                <img
                  src={toAbsoluteUrl(process.env.REACT_APP_API_URL + state.photoPath)}
                  className='h-100 align-self-center w-100'
                  alt=''
                />
              )}
              {/* <!--begin::Image input--> */}
              <div className='image-input image-input-empty' data-kt-image-input='true'>
                {/* <!--begin::Image preview wrapper--> */}
                <div className='image-input-wrapper w-1px h-1px'></div>
                {/* <!--end::Image preview wrapper--> */}
                {/* <!--begin::Edit button--> */}
                <label
                  className='btn btn-icon btn-circle btn-color-muted btn-active-color-primary w-25px h- 
                   25px bg-body shadow'
                  data-kt-image-input-action='change'
                  data-bs-toggle='tooltip'
                  data-bs-dismiss='click'
                  title='Change avatar'
                >
                  <i className='bi bi-pencil-fill fs-7'></i>
                  {/* <!--begin::Inputs--> */}
                  <input
                    type='file'
                    onChange={(e) => imageUpload(e, state.selPackageID)}
                    name='avatar'
                    accept='.png, .jpg, .jpeg'
                  />
                  {/* <!--end::Inputs--> */}
                </label>
                {/* <!--end::Edit button--> */}
              </div>
              {/* <!--end::Image input--> */}
            </span>
          </div>
          {/* <div className='col-1 symbol symbol-65px'> */}
          {/* <span className={clsx(`symbol-label cursor-pointer`)} onClick={handleShowImage}>
            {state.photoPath == '/media/avatars/blank.png' ? (
           
           <img
           src={toAbsoluteUrl(state.photoPath)}
           className='h-100 align-self-center w-100'
           alt=''
         />
          ) : (
            <img
              src={toAbsoluteUrl(process.env.REACT_APP_API_URL + state.photoPath)}
              className='h-100 align-self-center w-100'
              alt=''
            />
          )}
            </span> */}
          {/* </div> */}
          <span className='col-11 flex-column'>
            <h3 className='card-title align-items-start d-flex justify-content-around align-items-center'>
              <span className='col-lg-2 col-sm-12 fw-bolder text-dark ps-5'>Package Name:</span>
              <input
                type='text'
                className='col-lg-8 col-sm-12'
                id={`txtPackage_${state.selPackageID}`}
                onChange={(e) => setPackage(e)}
                value={packageName}
              />
              <button
                className='btn btn-sm btn-primary col-lg-2 fs-4 col-sm-12 m-2'
                onClick={() => updateProjectInfo()}
              >
                Update
              </button>
            </h3>
            <h6 className='row card-title align-items-start mt-1 fs-5'>
              {/* <span className='col-lg-3 col-sm-12 fw-bold text-muted'>
                <span className='row'> */}
              <div className='row'>
                <span className='col-1 d-flex justify-content-right align-items-center'>
                  Amount:
                </span>
                <div className='col-lg-2 fv-row'>
                  <input
                    type='text'
                    value={packageAmount}
                    onChange={handleChange}
                    className='form-control form-control-solid bg-light-primary'
                    placeholder='Amount'
                  />
                </div>
                <div className='col-lg-1 fv-row'>
                  <span
                    onClick={() => handlePriceShow(packageAmount)}
                    className='btn btn-icon btn-bg-light bg-hover-info text-hover-inverse-info btn-sm me-1'
                  >
                    <KTSVG
                      path='/media/icons/duotune/social/soc005.svg'
                      className='svg-icon-2 svg-icon-info'
                    />
                  </span>
                </div>
                {/* </div> */}
                {/* </span>
              </span> */}
                {/* <span className='col-lg-3 col-sm-12 fw-bold text-muted'>
                <span className='row'> */}
                <span className='col-1 d-flex justify-content-end align-items-center'>
                  Project Type:
                </span>
                <select
                  className='col-2 form-select bg-light-primary w-auto p-5 lineHeightByD'
                  aria-label='Default select example'
                  onChange={selectChange}
                  id='projectTypeID'
                >
                  <option selected={projectTypeId === 0 ? true : false} value={0}>
                    Select Type
                  </option>
                  {state.ProjectTypeData.length > 0 &&
                    state.ProjectTypeData.map((data, index) => {
                      return (
                        <option
                          key={index}
                          value={data.projectTypeID}
                          selected={projectTypeId == data.projectTypeID ? true : false}
                        >
                          {data.projectType}
                        </option>
                      )
                    })}
                </select>
                {/* </span>
              </span> */}
                {/* <span className='col-lg-3 col-sm-12 fw-bold text-muted'>
                <span className='row'> */}
                <span className='col-1 d-flex justify-content-end align-items-center'>BHK :</span>
                <select
                  className='col-2 form-select bg-light-primary w-auto p-5 lineHeightByD'
                  aria-label='Default select example'
                  onChange={selectChange}
                  id='bhkid'
                >
                  <option selected={bhkID === 0 ? true : false} value={0}>
                    Select BHK
                  </option>
                  {bhkData.length > 0 &&
                    bhkData.map((data, index) => {
                      return (
                        <option
                          key={index}
                          value={data.bhkid}
                          selected={data.bhkid === bhkID ? true : false}
                        >
                          {data.bhkName}
                        </option>
                      )
                    })}
                </select>
                {/* </span>
              </span> */}
                {/* <span className='col-lg-3 col-sm-12 fw-bold text-muted'>
                <span className='row'> */}
                <span className='col-1 d-flex justify-content-end align-items-center'>
                  Carpet Area :
                </span>
                <select
                  className='col-2 form-select bg-light-primary w-auto p-5 lineHeightByD'
                  aria-label='Default select example'
                  onChange={selectChange}
                  id='carpetAreaID'
                >
                  <option selected={carpetAreaID === 0 ? true : false} value={0}>
                    Carpet Area
                  </option>
                  {carpetAreaData.length > 0 &&
                    carpetAreaData.map((data, index) => {
                      return (
                        <option
                          key={index}
                          value={data.carpetAreaID}
                          selected={data.carpetAreaID === carpetAreaID ? true : false}
                        >
                          {data.carpetArea}
                        </option>
                      )
                    })}
                </select>
                {/* </span>
              </span> */}
              </div>
            </h6>
          </span>
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
                pathname: `/carpetry/carpetry-pkg-mst/add-cart/${state.selPackageID}`,
                state: {
                  packageID: state.selPackageID,
                  packageAmount: state.packageAmount,
                  packageName: state.packageName,
                  bhkName: state.bhkName,
                  carpetAreaName: state.carpetAreaName,
                  projectType: state.projectType,
                  photoPath: state.photoPath,
                  search: state.mainSearch,
                  ProjectTypeID: state.projectTypeID,
                  CarpetAreaID: state.carpetAreaID,
                  selBhkId: state.bhkID,
                },
              }}
              className='btn btn-sm btn-light-primary bg-white'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr002.svg' className='svg-icon-3' />
              Back to Add Item list
            </Link>
          </div>
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
              onClick={() => handleCheckOut(parseInt(packageID))}
            >
              Check out
            </span>
          </div>
        </div>
        {/* begin::Body */}
        <LoaderInTable loading={state.loading} column={15} />
        {state.cartListData.length > 0 &&
          state.cartListData.map((data, index) => {
            return (
              <>
                <div
                  key={data.packageDetailID}
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
                        className='card-toolbar border border-danger rounded m-1'
                        data-bs-toggle='tooltip'
                        data-bs-placement='top'
                        title='Delete'
                      >
                        <span
                          className='btn btn-sm btn-light-danger bg-white fs-6 p-2'
                          onClick={() => handleShowDelete(data.packageDetailID)}
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
        {/* =================== Image no data ============== */}
        <BlankDataImage length={state.cartListData.length} loading={state.loading} />
      </div>
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selPackageDetailID}
        pageName={'Package Item'}
        show={showDelete}
        handleClose={handleCloseDelete}
        deleteData={() => deletePckageDetailsItem(state.selPackageDetailID)}
      />

      {/* =========================Edit Model============================ */}
      <Modal size='xl' scrollable={true} show={showEdit} onHide={handleCloseEdit}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Package Data</Modal.Title>
          </Modal.Header>
        </div>
        <Modal.Body>
          <div className='card-body p-0 m-0'>
            <EditCartCarpetryPackageList
              productList={state.objCartListData}
              planAreaList={state.planAreaData}
              selPackageId={state.selPackageID}
              tmpPlanAreaID={state.planAreaID}
              tmpPackageDetailsID={state.selPackageDetailID}
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

      <CheckOutCarpetryList
        checkOutList={state.checkOutData}
        title={state.selTitle}
        show={showCheckOut}
        listTypeID={state.selListTypeID}
        packageID={parseInt(packageID)}
        handleClose={handleCloseCheckOut}
        handleCheckOut={() => handleCheckOut(state.selPackageID)}
        getAllAddonItemData={() =>
          getAllPackageData(
            state.selPackageID,
            state.packageName,
            state.bhkName,
            state.packageAmount,
            state.carpetAreaName,
            state.projectType,
            state.photoPath,
            state.mainSearch,
            state.projectTypeID,
            state.carpetAreaID,
            state.bhkID,
            state.cartListData
          )
        }
      />
      {/* ============================Amount Popup======================= */}

      <Modal
        fullscreen='md-down'
        show={showPriceModal}
        onHide={handleCloseUnitPrice}
        keyboard={false}
      >
        <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
          <Modal.Title className='text-white'>Amount : {state.selAmount}</Modal.Title>
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
                      <th className='min-w-150px'>Branch</th>
                      {/* <th className='min-w-150px'> Branch Code</th> */}
                      <th className='min-w-150px'> (%)</th>
                      <th className='min-w-150px'>Total Amount</th>
                    </tr>
                  </thead>
                  {/* end::Table head */}
                  {/* begin::Table body */}
                  <tbody className='border-bottom'>
                    <LoaderInTable loading={state.loading} column={5} />
                    {state.branchRateMapData.length > 0 &&
                      state.branchRateMapData.map((data, index) => {
                        const totalForBranch =
                          (state.selAmount * data.readyMadePercentage) / 100 + state.selAmount
                        return (
                          <tr>
                            <td className='text-dark fs-6'>{data.branchName} </td>
                            {/* <td className='text-dark fs-6'>{data.branchCode}</td> */}
                            <td className='text-dark fs-6'>({data.readyMadePercentage} %)</td>
                            <td className='text-dark fs-6'>
                              {data.readyMadePercentage === 0
                                ? state.selAmount.toFixed(2)
                                : totalForBranch.toFixed(2)}
                            </td>
                          </tr>
                        )
                      })}
                    <BlankDataImageInTable
                      length={state.branchRateMapData.length}
                      loading={state.loading}
                      colSpan={5}
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* =====================Image Model=================== */}
      <ModalPopUpImageView
        pageName1={'Package Name'}
        title1={state.packageName}
        pageName2={'Project Type'}
        title2={state.projectType}
        show={showImage}
        imageShow={process.env.REACT_APP_API_URL + state.photoPath}
        handleClose={handleCloseImage}
      />
    </>
  )
}

export default CardListCarpetryPackage
