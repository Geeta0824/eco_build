import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../_Ecd/helpers'
import {UserModel} from '../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../setup'
import {INewPackageModel} from '../../models/package-page/IPackageModel'
import {
  GetPackageListApi,
  deletePackageMainIDApi,
  geMultipleDropdownListCarpetryPkgApi,
} from '../../modules/package-master-page/PackageCRUD'
import Search from 'antd/es/input/Search'
import {ListPackageCard} from './ListPackageCard'
import Loader from '../common-pages/Loader'
import {IBHKMasterModel} from '../../models/master-page/IBHKMasterModel'
import {ICarpetAreaModel} from '../../models/master-page/ICarpetAreaModel'
import {getActiveBHKApi} from '../../modules/master-page/bhk-master-page/BHKCRUD'
import {getAllCarpetArea} from '../../modules/master-page/carpet-area-page/CarpetAreaCRUD'
import {ModelPopUpDelete} from '../common-pages/ModelPopUpDelete'
import {IProjectTypeodel} from '../../models/projects-page/IProjectsModel'
import {GetProjectTypeDropdownListAPI} from '../../modules/project-master-page/project-master/ProjectCRUD'

type Props = {}

interface IDIY {
  packageData: INewPackageModel[]
  bhkData: IBHKMasterModel[]
  carpetAreaData: ICarpetAreaModel[]
  ProjectTypeData: IProjectTypeodel[]
  selPackageID: number
  selBHKID: number
  selCarpetAreaID: number
  projectTypeID: number
  searchText: string
  selProjectNo: string
  selDiscountCondition: string
}

const PackageListPage: React.FC<Props> = () => {
  const location = useLocation()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [state, setState] = useState<IDIY>({
    packageData: [] as INewPackageModel[],
    bhkData: [] as IBHKMasterModel[],
    carpetAreaData: [] as ICarpetAreaModel[],
    ProjectTypeData: [] as IProjectTypeodel[],
    selPackageID: 0,
    selBHKID: 0,
    selCarpetAreaID: 0,
    projectTypeID: 0,
    searchText: '',
    selProjectNo: '',
    selDiscountCondition: '',
  })

  useEffect(() => {
    setMainLoading(true)
    localStorage.setItem('totalCounts', '0')
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mianBhkID: number = 0
      var mainCarpetAreaID: number = 0
      var mainProjectTypeID: number = 0
      var mainSearch: string = ''
      if (lc !== undefined) {
        mianBhkID = lc.BHKID
        mainCarpetAreaID = lc.carpetAreaID
        mainProjectTypeID = lc.projectTypeID
        mainSearch = lc.searchText
      }
      getMultipleDropdownListCarpetryPkgData(
        mianBhkID,
        mainCarpetAreaID,
        mainProjectTypeID,
        mainSearch
      )
      // getBHKData()
    }, 100)
  }, [])

  function getMultipleDropdownListCarpetryPkgData(
    mianBhkID: number,
    mainCarpetAreaID: number,
    mainProjectTypeID: number,
    mainSearch: string
  ) {
    geMultipleDropdownListCarpetryPkgApi()
      .then((response) => {
        let bhkData = response.data.bhkList
        let carpetAreaData = response.data.carpetAreaList
        let projectTypeData = response.data.projectTypeList
        if (response.data.isSuccess === true) {
          getAllPackageData(
            mianBhkID,
            mainCarpetAreaID,
            mainProjectTypeID,
            mainSearch,
            bhkData,
            carpetAreaData,
            projectTypeData
          )
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, carpetAreaData: [], ProjectTypeData: []})
        }
        setName(mainSearch)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, carpetAreaData: [], ProjectTypeData: []})
      })
  }
  function getAllPackageData(
    selBHKID: number,
    selCarpetAreaID: number,
    projectTypeID: number,
    searchText: string,
    bhkData: IBHKMasterModel[],
    carpetAreaData: ICarpetAreaModel[],
    ProjectTypeData: IProjectTypeodel[]
  ) {
    GetPackageListApi(selBHKID, selCarpetAreaID, projectTypeID, searchText)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            selBHKID: selBHKID,
            selCarpetAreaID: selCarpetAreaID,
            projectTypeID: projectTypeID,
            searchText: searchText,
            bhkData: bhkData,
            carpetAreaData: carpetAreaData,
            packageData: responseData,
            ProjectTypeData: ProjectTypeData,
          })
          setMainLoading(false)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, packageData: []})
          setMainLoading(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, packageData: []})
        setMainLoading(false)
      })
  }

  // function getBHKData() {
  //   getActiveBHKApi()
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       getCarpetAreaData(responseData)
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, bhkData: []})
  //       setMainLoading(false)
  //     })
  // }

  // function getCarpetAreaData(bhkData: IBHKMasterModel[]) {
  //   getAllCarpetArea()
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       if (response.data.isSuccess === true) {
  //         getAllPackageData(
  //           state.selBHKID,
  //           state.selCarpetAreaID,
  //           state.projectTypeID,
  //           state.searchText,
  //           bhkData,
  //           responseData
  //         )
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, carpetAreaData: []})
  //         setMainLoading(false)
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, carpetAreaData: []})
  //       setMainLoading(false)
  //     })
  // }

  // function getAllPackageData(
  //   selBHKID: number,
  //   selCarpetAreaID: number,
  //   projectTypeID: number,
  //   searchText: string,
  //   bhkData: IBHKMasterModel[],
  //   carpetAreaData: ICarpetAreaModel[]
  // ) {
  //   GetPackageListApi(selBHKID, selCarpetAreaID, projectTypeID, searchText)
  //     .then((response) => {
  //       if (response.data.isSuccess == true) {
  //         const responseData = response.data.responseObject
  //         getProjectTypeData(
  //           state.selBHKID,
  //           state.selCarpetAreaID,
  //           state.projectTypeID,
  //           state.searchText,
  //           bhkData,
  //           carpetAreaData,
  //           responseData
  //         )
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, packageData: []})
  //         setMainLoading(false)
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, packageData: []})
  //       setMainLoading(false)
  //     })
  // }

  // function getProjectTypeData(
  //   selBHKID: number,
  //   selCarpetAreaID: number,
  //   projectTypeID: number,
  //   searchText: string,
  //   bhkData: IBHKMasterModel[],
  //   carpetAreaData: ICarpetAreaModel[],
  //   packageData: INewPackageModel[]
  // ) {
  //   GetProjectTypeDropdownListAPI()
  //     .then((response) => {
  //       const responseData = response.data.responseObject
  //       if (response.data.isSuccess === true) {
  //         setState({
  //           ...state,
  //           selBHKID: selBHKID,
  //           selCarpetAreaID: selCarpetAreaID,
  //           projectTypeID: projectTypeID,
  //           searchText: searchText,
  //           bhkData: bhkData,
  //           carpetAreaData: carpetAreaData,
  //           packageData: packageData,
  //           ProjectTypeData: responseData,
  //         })
  //         setName(searchText)
  //         setMainLoading(false)
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, carpetAreaData: []})
  //         setMainLoading(false)
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, carpetAreaData: []})
  //       setMainLoading(false)
  //     })
  // }

  // ===================BHK Filter Function===========
  function getlistbyBHKIdValue(event: any) {
    setMainLoading(true)
    const tmpBHKId = event.target.value
    getAllPackageData(
      parseInt(tmpBHKId),
      state.selCarpetAreaID,
      state.projectTypeID,
      state.searchText,
      state.bhkData,
      state.carpetAreaData,
      state.ProjectTypeData
    )
  }

  // ===================CarpetArea Filter Function===========
  function getlistbyCarpetAreaIdValue(event: any) {
    setMainLoading(true)
    const tmpCarpetAreaId = event.target.value
    getAllPackageData(
      state.selBHKID,
      parseInt(tmpCarpetAreaId),
      state.projectTypeID,
      state.searchText,
      state.bhkData,
      state.carpetAreaData,
      state.ProjectTypeData
    )
  }

  // ===================ProjectType Filter Function===========
  function getlistbyProjectTypeIDValue(event: any) {
    setMainLoading(true)
    const tmpProjectTypeId = event.target.value
    getAllPackageData(
      state.selBHKID,
      state.selCarpetAreaID,
      parseInt(tmpProjectTypeId),
      state.searchText,
      state.bhkData,
      state.carpetAreaData,
      state.ProjectTypeData
    )
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState<string>('')
  //------------------- the search result-----------------
  const searchFilter = (value: string) => {
    setMainLoading(true)
    const keyword = value
    if (keyword !== '') {
      getAllPackageData(
        state.selBHKID,
        state.selCarpetAreaID,
        state.projectTypeID,
        keyword,
        state.bhkData,
        state.carpetAreaData,
        state.ProjectTypeData
      )
    } else {
      getAllPackageData(
        state.selBHKID,
        state.selCarpetAreaID,
        state.projectTypeID,
        '',
        state.bhkData,
        state.carpetAreaData,
        state.ProjectTypeData
      )
    }
  }

  function handleRefresh() {
    getAllPackageData(
      state.selBHKID,
      state.selCarpetAreaID,
      state.projectTypeID,
      state.searchText,
      state.bhkData,
      state.carpetAreaData,
      state.ProjectTypeData
    )
  }

  // ------------------------------reset button---------------------
  function resetFilter() {
    setMainLoading(true)
    setName('')
    getAllPackageData(0, 0, 0, '', state.bhkData, state.carpetAreaData, state.ProjectTypeData)
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (packageID: number) => {
    setState({
      ...state,
      selPackageID: packageID,
    })
    setShow(true)
  }

  function deletePackageMasterItem(temPackageId: number) {
    deletePackageMainIDApi(temPackageId)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllPackageData(
            state.selBHKID,
            state.selCarpetAreaID,
            state.projectTypeID,
            state.searchText,
            state.bhkData,
            state.carpetAreaData,
            state.ProjectTypeData
          )
          setShow(false)
        } else {
          toast.error(`${response.data.message}`)
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2' style={{backgroundColor: '#000000'}}>
          <div className='mb-2 col-xl-2 col-md-4 col-sm-6'>
            <label className='form-label fw-bold text-white'>BHK:</label>
            <select
              className='form-select form-select-white lineHeightByD'
              onChange={(e) => getlistbyBHKIdValue(e)}
            >
              <option selected={state.selBHKID === 0 ? true : false} value={0}>
                Select BHK
              </option>
              {state.bhkData.length > 0 &&
                state.bhkData.map((data, index) => {
                  return (
                    <option
                      key={index}
                      value={data.bhkid}
                      selected={state.selBHKID === data.bhkid ? true : false}
                    >
                      {data.bhkName}
                    </option>
                  )
                })}
            </select>
          </div>

          <div className='mb-2 col-xl-2 col-md-4 col-sm-6'>
            <label className='form-label fw-bold text-white'>Carpet Area:</label>
            <select
              className='form-select form-select-white lineHeightByD'
              onChange={(e) => getlistbyCarpetAreaIdValue(e)}
            >
              <option selected={state.selCarpetAreaID === 0 ? true : false} value={0}>
                Select Area
              </option>
              {state.carpetAreaData.length > 0 &&
                state.carpetAreaData.map((data, index) => {
                  return (
                    <option
                      key={index}
                      value={data.carpetAreaID}
                      selected={state.selCarpetAreaID === data.carpetAreaID ? true : false}
                    >
                      {data.carpetArea}
                    </option>
                  )
                })}
            </select>
          </div>

          <div className='mb-2 col-xl-2 col-md-4 col-sm-6'>
            <label className='form-label fw-bold text-white'>Project Type:</label>
            <select
              className='form-select form-select-white lineHeightByD'
              onChange={(e) => getlistbyProjectTypeIDValue(e)}
            >
              <option selected={state.projectTypeID === 0 ? true : false} value={0}>
                Select Type
              </option>
              {state.ProjectTypeData.length > 0 &&
                state.ProjectTypeData.map((data, index) => {
                  return (
                    <option
                      key={index}
                      value={data.projectTypeID}
                      selected={state.projectTypeID == data.projectTypeID ? true : false}
                    >
                      {data.projectType}
                    </option>
                  )
                })}
            </select>
          </div>

          <div className='mb-2 col-xl-3 col-md-4 col-sm-6'>
            <label className='form-label fw-bold text-white'>Search :</label>
            <Search
              placeholder='input search text'
              value={name}
              allowClear
              onChange={(e) => setName(e.target.value)}
              onSearch={(value) => searchFilter(value)}
            />
          </div>

          <span className='col-xl-1 col-md-2 col-sm-3 d-flex align-content-around flex-wrap justify-content-center'>
            <span
              className='symbol symbol-30px btn btn-sm btn-light-white p-1'
              title='Reset'
              onClick={resetFilter}
            >
              <img src={toAbsoluteUrl('/media/img/reset_white.png')} alt='' />
            </span>
            {/* Reset */}
          </span>

          <div
            className='card-toolbar col-xl-1 col-md-2 col-sm-3 mt-4'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a new package'
          >
            <Link
              to={{
                pathname: '/package/add',
                state: {
                  bhkId: state.selBHKID,
                  carpetAreaId: state.selCarpetAreaID,
                  projectTypeId: state.projectTypeID,
                  searchText: state.searchText,
                },
              }}
              className='btn btn-sm btn-light-primary bg-white text-center lineHeightByD'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3 me-0' />
              Add
            </Link>
          </div>
        </div>
        {/* end::Header */}
        <Loader loading={mainLoading} />
        {/* begin::Row */}
        <div className='row g-5 g-xl-8 p-5 mx-2'>
          {state.packageData.length > 0 &&
            state.packageData.map((data, index) => {
              let bgcolor = ''
              if (data.packageTypeID === 1) {
                bgcolor = 'primary'
              } else if (data.packageTypeID === 2) {
                bgcolor = 'success'
              } else if (data.packageTypeID === 3) {
                bgcolor = 'info'
              } else if (data.packageTypeID === 4) {
                bgcolor = 'danger'
              } else {
                bgcolor = 'primary'
              }
              return (
                <ListPackageCard
                  packageID={data.packageID}
                  className='col col-xxl-3 col-xl-4 col-md-4 col-sm-6 mb-xl-5'
                  image={
                    data.photoPath == '' ? '/media/img/NoProductImage.png' : `${data.photoPath}`
                  }
                  color={bgcolor}
                  title={data.packageName}
                  projectType={data.projectType}
                  bhkName={data.bhkName === '' ? 'N.A.' : data.bhkName}
                  areaName={data.carpetArea === '' ? 'N.A.' : data.carpetArea}
                  projectTypeId={data.packageTypeID}
                  bhkId={data.bhkID}
                  areaId={data.carpetAreaID}
                  packageAmount={data.packageAmount === '' ? 'N.A.' : data.packageAmount}
                  totalProducts={data.totalProducts === '' ? 'N.A.' : data.totalProducts}
                  showData={() => handleShow(data.packageID)}
                  handleRefresh={handleRefresh}
                  mianBhkID={state.selBHKID}
                  mainCarpetAreaID={state.selCarpetAreaID}
                  mainProjectTypeID={state.projectTypeID}
                  searchText={state.searchText}
                />
              )
            })}
        </div>
      </div>

      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selPackageID}
        pageName={'Package'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deletePackageMasterItem(state.selPackageID)}
      />
    </>
  )
}

export default PackageListPage
