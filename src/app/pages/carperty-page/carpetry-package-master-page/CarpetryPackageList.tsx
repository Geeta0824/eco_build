import {Pagination} from 'antd'
import React, {useEffect, useRef, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'

import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import Search from 'antd/es/input/Search'
import Loader from '../../common-pages/Loader'
import {IBHKMasterModel} from '../../../models/master-page/IBHKMasterModel'
import {ICarpetAreaModel} from '../../../models/master-page/ICarpetAreaModel'
import {getActiveBHKApi} from '../../../modules/master-page/bhk-master-page/BHKCRUD'
import {getAllCarpetArea} from '../../../modules/master-page/carpet-area-page/CarpetAreaCRUD'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ListCarpetryPackageCard} from './ListCarpetryPackageCard'
import {
  GetTurnkeyPackageList,
  deletePackageMainIDApi,
} from '../../../modules/carpetry-master-page/carpetry-package-master-page/TurnkeyPackageCRUD'
import {INewPackageModel} from '../../../models/carpetry-page/ICarpetryPackageModel'
import {IProjectTypeodel} from '../../../models/projects-page/IProjectsModel'
import {GetProjectTypeDropdownListAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import {geMultipleDropdownListCarpetryPkgApi} from '../../../modules/package-master-page/PackageCRUD'

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

const CarpetryPackageList: React.FC<Props> = () => {
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
      let mainSearch: string = ''
      let projectTypeID: number = 0
      let carpetAreaID: number = 0
      let bhkID: number = 0
      if (lc != undefined) {
        mainSearch = lc.search
        projectTypeID = lc.projectTypeID
        carpetAreaID = lc.selCarpetAreaID
        bhkID = lc.selBHKID
      }
      // getBHKData()
      getMultipleDropdownListCarpetryPkgData(mainSearch, projectTypeID, carpetAreaID, bhkID)
    }, 100)
  }, [])

  function getMultipleDropdownListCarpetryPkgData(
    mainSearch: string,
    projectTypeID: number,
    carpetAreaID: number,
    bhkID: number
  ) {
    geMultipleDropdownListCarpetryPkgApi()
      .then((response) => {
        let bhkData = response.data.bhkList
        let carpetAreaData = response.data.carpetAreaList
        let projectTypeData = response.data.projectTypeList
        if (response.data.isSuccess === true) {
          getAllPackageData(
            // state.selBHKID,
            // state.selCarpetAreaID,
            // state.projectTypeID,
            // state.searchText,
            bhkID,
            carpetAreaID,
            projectTypeID,
            mainSearch,
            bhkData,
            carpetAreaData,
            projectTypeData
          )
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, carpetAreaData: [], ProjectTypeData: [], bhkData: []})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, carpetAreaData: [], ProjectTypeData: [], bhkData: []})
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
  //         getProjectTypeData(
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

  // function getProjectTypeData(
  //   selBHKID: number,
  //   selCarpetAreaID: number,
  //   projectTypeID: number,
  //   searchText: string,
  //   bhkData: IBHKMasterModel[],
  //   carpetAreaData: ICarpetAreaModel[]
  // ) {
  //   GetProjectTypeDropdownListAPI()
  //     .then((response) => {
  //       const responseData = response.data.responseObject
  //       if (response.data.isSuccess === true) {
  //         getAllPackageData(
  //           selBHKID,
  //           selCarpetAreaID,
  //           projectTypeID,
  //           searchText,
  //           bhkData,
  //           carpetAreaData,
  //           responseData
  //         )
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, carpetAreaData: []})
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, carpetAreaData: []})
  //     })
  // }

  function getAllPackageData(
    selBHKID: number,
    selCarpetAreaID: number,
    projectTypeID: number,
    searchText: string,
    bhkData: IBHKMasterModel[],
    carpetAreaData: ICarpetAreaModel[],
    ProjectTypeData: IProjectTypeodel[]
  ) {
    GetTurnkeyPackageList(selBHKID, selCarpetAreaID, projectTypeID, searchText)
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
            ProjectTypeData: ProjectTypeData,
            packageData: responseData,
          })
          setName(searchText)
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
          <div className='mb-2 col-xl-2 col-md-4 col-sm-6 mx-1'>
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

          <div className='mb-2 col-xl-2 col-md-4 col-sm-6'>
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
                pathname: '/carpetry/carpetry-pkg-mst/add',
                state: {
                  search: name,
                  CarpetAreaID: state.selCarpetAreaID,
                  selBhkId: state.selBHKID,
                  ProjectTypeID: state.projectTypeID,
                },
              }}
              className='btn btn-sm btn-light-primary bg-white text-center lineHeightByD'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3 me-0' />
              Add
            </Link>
          </div>
          <div
            className='card-toolbar col-xl-1 col-md-2 col-sm-3 mt-4'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add clone package'
          >
            <Link
              to={{
                pathname: '/carpetry/carpetry-pkg-mst/clone',
                state: {
                  search: name,
                  CarpetAreaID: state.selCarpetAreaID,
                  selBhkId: state.selBHKID,
                  ProjectTypeID: state.projectTypeID,
                },
              }}
              className='btn btn-sm btn-light-dark bg-success text-center lineHeightByD'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3 me-0' />
              Clone
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
                <ListCarpetryPackageCard
                  packageID={data.packageID}
                  className='col col-xxl-3 col-xl-4 col-md-4 col-sm-6 mb-xl-5'
                  image={
                    data.photoPath == '' ? '/media/img/NoProductImage.png' : `${data.photoPath}`
                  }
                  // image={
                  //   data.photoPath == ''
                  //     ? '/media/avatars/blank.png'
                  //     : // : `${process.env.REACT_APP_API_URL + data.photoPath}`
                  //       `${data.photoPath}`
                  // }
                  color={bgcolor}
                  title={data.packageName}
                  projectType={data.projectType}
                  bhkName={data.bhkName === '' ? 'N.A.' : data.bhkName}
                  areaName={data.carpetArea === '' ? 'N.A.' : data.carpetArea}
                  projectTypeId={data.packageTypeID}
                  bhkId={data.bhkID}
                  areaId={data.carpetAreaID}
                  packageAmount={
                    data.turnkeyPackageAmount === '' ? 'N.A.' : data.turnkeyPackageAmount
                  }
                  totalProducts={data.totalProducts === '' ? 'N.A.' : data.totalProducts}
                  showData={() => handleShow(data.packageID)}
                  name={name}
                  CarpetAreaID={state.selCarpetAreaID}
                  selBhkId={state.selBHKID}
                  ProjectTypeID={state.projectTypeID}
                />
              )
            })}
        </div>
      </div>

      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selPackageID}
        pageName={'Carpetry Package'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deletePackageMasterItem(state.selPackageID)}
      />
    </>
  )
}

export default CarpetryPackageList
