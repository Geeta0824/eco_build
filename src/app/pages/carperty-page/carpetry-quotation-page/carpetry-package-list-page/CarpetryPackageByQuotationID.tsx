import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {toAbsoluteUrl} from '../../../../../_Ecd/helpers'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup'
import {INewPackageModel} from '../../../../models/package-page/IPackageModel'
import Search from 'antd/es/input/Search'
import Loader from '../../../common-pages/Loader'
import {IBHKMasterModel} from '../../../../models/master-page/IBHKMasterModel'
import {ICarpetAreaModel} from '../../../../models/master-page/ICarpetAreaModel'
// import {getActiveBHKApi} from '../../../../modules/master-page/bhk-master-page/BHKCRUD'
import {getAllCarpetArea} from '../../../../modules/master-page/carpet-area-page/CarpetAreaCRUD'
import {ListCarpetryPackageCard} from './ListCarpetryPackageCard'
import {GetTurnkeyPackageList} from '../../../../modules/carpetry-master-page/carpetry-package-master-page/TurnkeyPackageCRUD'
import {IProjectTypeodel} from '../../../../models/projects-page/IProjectsModel'
import {GetProjectTypeDropdownListAPI} from '../../../../modules/project-master-page/project-master/ProjectCRUD'
import { getActiveBHKApi } from '../../../../modules/master-page/bhk-master-page/NewBHKCRUD'

type Props = {}

interface IDIY {
  packageData: INewPackageModel[]
  bhkData: IBHKMasterModel[]
  carpetAreaData: ICarpetAreaModel[]
  ProjectTypeData: IProjectTypeodel[]
  selPackageID: number
  selBHKID: number
  selCarpetAreaID: number
  selProjectTypeID: number
  selCustomerName: string
  selBHKName: string
  selCarpetAreaName: string
  selProjectName: string
  searchText: string
  selProjectNo: string
  selDiscountCondition: string
  mainEmployeeID: number
  mainCustomerID: number
}

const CarpetryPackageByQuotationID: React.FC<Props> = () => {
  const {quotationID} = useParams<{quotationID: string}>()
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
    selProjectTypeID: 0,
    selCustomerName: '',
    selBHKName: '',
    selCarpetAreaName: '',
    selProjectName: '',
    searchText: '',
    selProjectNo: '',
    selDiscountCondition: '',
    mainEmployeeID: 0,
    mainCustomerID: 0,
  })

  useEffect(() => {
    setMainLoading(true)
    var lc: any = location.state
    var selPackageID = lc.packageID
    var packageTypeID = lc.packageTypeID
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

    localStorage.setItem('totalCounts', '0')
    setTimeout(() => {
      getBHKData(
        selPackageID,
        customerName,
        bhkName,
        carpetAreaName,
        projectName,
        projectNumber,
        bhkid,
        carpetAreaID,
        projectTypeID,
        mainEmployeeID,
        mainCustomerID,
        mainSearch
      )
    }, 100)
  }, [])

  function getBHKData(
    selPackageID: number,
    selCustomerName: string,
    selBHKName: string,
    selCarpetAreaName: string,
    selProjectName: string,
    selProjectNumber: string,
    selBHKID: number,
    selCarpetAreaID: number,
    projectTypeID: number,
    mainEmployeeID: number,
    mainCustomerID: number,
    mainSearch: string
  ) {
    getActiveBHKApi()
      .then((response) => {
        // let responseData = response.data.responseObject
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        let responseData = resp.responseObject
        getCarpetAreaData(
          selPackageID,
          selCustomerName,
          selBHKName,
          selCarpetAreaName,
          selProjectName,
          selProjectNumber,
          selBHKID,
          selCarpetAreaID,
          projectTypeID,
          mainEmployeeID,
          mainCustomerID,
          mainSearch,
          responseData
        )
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, bhkData: []})
        setMainLoading(false)
      })
  }

  function getCarpetAreaData(
    selPackageID: number,
    selCustomerName: string,
    selBHKName: string,
    selCarpetAreaName: string,
    selProjectName: string,
    selProjectNumber: string,
    selBHKID: number,
    selCarpetAreaID: number,
    projectTypeID: number,
    mainEmployeeID: number,
    mainCustomerID: number,
    mainSearch: string,
    bhkData: IBHKMasterModel[]
  ) {
    getAllCarpetArea()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          getAllPackageData(
            selPackageID,
            selCustomerName,
            selBHKName,
            selCarpetAreaName,
            selProjectName,
            selProjectNumber,
            selBHKID,
            selCarpetAreaID,
            projectTypeID,
            mainEmployeeID,
            mainCustomerID,
            mainSearch,

            bhkData,
            responseData
          )
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, carpetAreaData: []})
          setMainLoading(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, carpetAreaData: []})
        setMainLoading(false)
      })
  }

  function getAllPackageData(
    selPackageID: number,
    selCustomerName: string,
    selBHKName: string,
    selCarpetAreaName: string,
    selProjectName: string,
    selProjectNumber: string,
    selBHKID: number,
    selCarpetAreaID: number,
    projectTypeID: number,
    mainEmployeeID: number,
    mainCustomerID: number,
    searchText: string,
    bhkData: IBHKMasterModel[],
    carpetAreaData: ICarpetAreaModel[]
  ) {
    GetTurnkeyPackageList(selBHKID, selCarpetAreaID, projectTypeID, searchText)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          getProjectTypeData(
            selPackageID,
            selCustomerName,
            selBHKName,
            selCarpetAreaName,
            selProjectName,
            selProjectNumber,
            selBHKID,
            selCarpetAreaID,
            projectTypeID,
            mainEmployeeID,
            mainCustomerID,
            searchText,
            bhkData,
            carpetAreaData,
            responseData
          )
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

  function getProjectTypeData(
    selPackageID: number,
    selCustomerName: string,
    selBHKName: string,
    selCarpetAreaName: string,
    selProjectName: string,
    selProjectNumber: string,
    selBHKID: number,
    selCarpetAreaID: number,
    projectTypeID: number,
    mainEmployeeID: number,
    mainCustomerID: number,

    searchText: string,
    bhkData: IBHKMasterModel[],
    carpetAreaData: ICarpetAreaModel[],
    packageData: INewPackageModel[]
  ) {
    GetProjectTypeDropdownListAPI()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            selPackageID: selPackageID,
            selCustomerName: selCustomerName,
            selBHKName: selBHKName,
            selCarpetAreaName: selCarpetAreaName,
            selProjectName: selProjectName,
            selProjectNo: selProjectNumber,
            selBHKID: selBHKID,
            selCarpetAreaID: selCarpetAreaID,
            selProjectTypeID: projectTypeID,
            mainEmployeeID,
            mainCustomerID,
            searchText: searchText,
            bhkData: bhkData,
            carpetAreaData: carpetAreaData,
            packageData: packageData,
            ProjectTypeData: responseData,
          })
          setName(searchText)
          setMainLoading(false)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, carpetAreaData: []})
          setMainLoading(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, carpetAreaData: []})
        setMainLoading(false)
      })
  }

  // ===================BHK Filter Function===========
  function getlistbyBHKIdValue(event: any) {
    setMainLoading(true)
    const tmpBHKId = event.target.value
    getAllPackageData(
      state.selPackageID,
      state.selCustomerName,
      state.selBHKName,
      state.selCarpetAreaName,
      state.selProjectName,
      state.selProjectNo,
      parseInt(tmpBHKId),
      state.selCarpetAreaID,
      state.selProjectTypeID,
      state.mainEmployeeID,
      state.mainCustomerID,

      state.searchText,
      state.bhkData,
      state.carpetAreaData
    )
  }

  // ===================CarpetArea Filter Function===========
  function getlistbyCarpetAreaIdValue(event: any) {
    setMainLoading(true)
    const tmpCarpetAreaId = event.target.value
    getAllPackageData(
      state.selPackageID,
      state.selCustomerName,
      state.selBHKName,
      state.selCarpetAreaName,
      state.selProjectName,
      state.selProjectNo,
      state.selBHKID,
      parseInt(tmpCarpetAreaId),
      state.selProjectTypeID,
      state.mainEmployeeID,
      state.mainCustomerID,
      state.searchText,
      state.bhkData,
      state.carpetAreaData
    )
  }

  // ===================ProjectType Filter Function===========
  function getlistbyProjectTypeIDValue(event: any) {
    setMainLoading(true)
    const tmpProjectTypeId = event.target.value
    getAllPackageData(
      state.selPackageID,
      state.selCustomerName,
      state.selBHKName,
      state.selCarpetAreaName,
      state.selProjectName,
      state.selProjectNo,
      state.selBHKID,
      state.selCarpetAreaID,
      parseInt(tmpProjectTypeId),
      state.mainEmployeeID,
      state.mainCustomerID,
      state.searchText,
      state.bhkData,
      state.carpetAreaData
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
        state.selPackageID,
        state.selCustomerName,
        state.selBHKName,
        state.selCarpetAreaName,
        state.selProjectName,
        state.selProjectNo,
        state.selBHKID,
        state.selCarpetAreaID,
        state.selProjectTypeID,
        state.mainEmployeeID,
        state.mainCustomerID,
        keyword,
        state.bhkData,
        state.carpetAreaData
      )
    } else {
      getAllPackageData(
        state.selPackageID,
        state.selCustomerName,
        state.selBHKName,
        state.selCarpetAreaName,
        state.selProjectName,
        state.selProjectNo,
        state.selBHKID,
        state.selCarpetAreaID,
        state.selProjectTypeID,
        state.mainEmployeeID,
        state.mainCustomerID,
        '',
        state.bhkData,
        state.carpetAreaData
      )
    }
  }

  // ------------------------------reset button---------------------
  function resetFilter() {
    setMainLoading(true)
    setName('')
    getAllPackageData(
      state.selPackageID,
      state.selCustomerName,
      state.selBHKName,
      state.selCarpetAreaName,
      state.selProjectName,
      state.selProjectNo,
      0,
      0,
      0,
      0,
      0,
      '',
      state.bhkData,
      state.carpetAreaData
    )
  }

  return (
    <>
      <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
            to={{
              pathname: '/quotations/ready-made-quotation/list',
              state: {
                employeeID: state.mainEmployeeID,
                customerID: state.mainCustomerID,
                mainSearch: state.searchText,
              },
            }}
          >
            Back To List
          </Link>
        </span>
      </div>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header align-items-center border-0 m-1'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='fw-bolder text-dark'>Customer : {state.selCustomerName}</span>
            <span className='fw-bold text-muted mt-1 fs-5'>
              Project : {state.selProjectName}({state.selProjectNo})
            </span>
          </h3>
          <h6 className='card-title align-items-start flex-column'>
            <span className='fw-bold text-muted mt-1 fs-5'>BHK : {state.selBHKName}</span>
            <span className='fw-bold text-muted mt-1 fs-5'>
              Carpet Area : {state.selCarpetAreaName}
            </span>
          </h6>
          <div className='card-toolbar'></div>
        </div>
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
              <option selected={state.selProjectTypeID === 0 ? true : false} value={0}>
                Select Type
              </option>
              {state.ProjectTypeData.length > 0 &&
                state.ProjectTypeData.map((data, index) => {
                  return (
                    <option
                      key={index}
                      value={data.projectTypeID}
                      selected={state.selProjectTypeID === data.projectTypeID ? true : false}
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
        </div>
        {/* end::Header */}
        <Loader loading={mainLoading} />
        {/* begin::Row */}
        {/* <div className='row g-5 g-xl-8 p-5 mx-2'> */}
        <div className='row g-6 g-xl-9 m-xl-5 m-3'>
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
                <div className='col-md-6 col-xl-4' key={data.packageID}>
                  <ListCarpetryPackageCard
                    quotationID={parseInt(quotationID)}
                    packageID={data.packageID}
                    customerName={state.selCustomerName}
                    projectNumber={state.selProjectNo}
                    image={
                      data.photoPath == ''
                        ? '/media/avatars/blank.png'
                        : `${process.env.REACT_APP_API_URL + data.photoPath}`
                    }
                    color={bgcolor}
                    title={data.packageName}
                    projectType={data.projectType}
                    bhkName={data.bhkName === '' ? 'N.A.' : data.bhkName}
                    areaName={data.carpetArea === '' ? 'N.A.' : data.carpetArea}
                    packageAmount={
                      data.turnkeyPackageAmount === '' ? 'N.A.' : data.turnkeyPackageAmount
                    }
                    totalProducts={data.totalProducts === '' ? 'N.A.' : data.totalProducts}
                    bhkid={data.bhkID}
                    carpetAreaID={data.carpetAreaID}
                    mainCustomerID={state.mainCustomerID}
                    mainEmployeeID={state.mainEmployeeID}
                    mainSearch={state.searchText}
                  />
                </div>
              )
            })}
        </div>
      </div>
    </>
  )
}

export default CarpetryPackageByQuotationID
