import React, {useEffect, useState} from 'react'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {IProductCategoryModel} from '../../../models/product-page/IProductCategoryModel'
import {IDIYProductListModel} from '../../../models/package-page/IPackageModel'
import {IPlanAreaModel} from '../../../models/product-page/IPlanAreaModel'
import {AddCartPackageList} from './AddCartPackageList'
import Loader from '../../common-pages/Loader'
import clsx from 'clsx'
import {toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {ModalPopUpImageView} from '../../common-pages/ModalPopUpImageView'

interface IDIY {
  loading: boolean
  selPackageId: number
  tmpPackageID: number
  tmpCartLength: number
  packageName: string
  bhkName: string
  carpetAreaName: string
  projectType: string
  photoPath: string
  mianBhkID: number
  mainCarpetAreaID: number
  mainProjectTypeID: number
  mainSearch: string
}

const PackageByPackageID = () => {
  const {packageID} = useParams<{packageID: string}>()
  const location = useLocation()
  const history = useHistory()

  const [state, setState] = useState<IDIY>({
    loading: false,
    selPackageId: 0,
    tmpPackageID: 0,
    tmpCartLength: 0,
    packageName: '',
    bhkName: '',
    carpetAreaName: '',
    projectType: '',
    photoPath: '',
    mianBhkID: 0,
    mainCarpetAreaID: 0,
    mainProjectTypeID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      var lc: any = location.state
      console.log(lc)
      var tmpPackageID = lc.packageID
      var packageName = lc.packageName
      var bhkName = lc.bhkName
      var carpetAreaName = lc.carpetAreaName
      var projectType = lc.projectType
      var photoPath = lc.photoPath

      var mianBhkID: number = 0
      var mainCarpetAreaID: number = 0
      var mainProjectTypeID: number = 0
      var mainSearch: string = ''
      if (lc !== undefined) {
        mianBhkID = lc.mianBhkID
        mainCarpetAreaID = lc.mainCarpetAreaID
        mainProjectTypeID = lc.mainProjectTypeID
        mainSearch = lc.mainSearch
      }
      getProdCategoryData(
        tmpPackageID,
        packageName,
        bhkName,
        carpetAreaName,
        projectType,
        photoPath,
        mianBhkID,
        mainCarpetAreaID,
        mainProjectTypeID,
        mainSearch,
        state.tmpCartLength
      )
    }, 100)
  }, [])

  function getProdCategoryData(
    tmpPackageID: number,
    packageName: string,
    bhkName: string,
    carpetAreaName: string,
    projectType: string,
    photoPath: string,
    mianBhkID: number,
    mainCarpetAreaID: number,
    mainProjectTypeID: number,
    mainSearch: string,
    tmpCount: number
  ) {
    setState({
      ...state,
      selPackageId: parseInt(packageID),
      tmpPackageID: tmpPackageID,
      tmpCartLength: tmpCount,
      packageName: packageName,
      bhkName: bhkName,
      carpetAreaName: carpetAreaName,
      projectType: projectType,
      photoPath: photoPath,
      mianBhkID,
      mainCarpetAreaID,
      mainProjectTypeID,
      mainSearch,
      loading: false,
    })
  }

  // ====================View Photo============
  const [showImage, setShowImage] = useState(false)
  const handleCloseImage = () => {
    setShowImage(false)
  }
  const handleShowImage = () => {
    setShowImage(true)
  }

  return (
    <>
      <div className='text-end '>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          onClick={() => {
            history.push({
              pathname: '/package/list',
              state: {
                BHKID: state.mianBhkID,
                carpetAreaID: state.mainCarpetAreaID,
                projectTypeID: state.mainProjectTypeID,
                searchText: state.mainSearch,
              },
            })
          }}
        >
          Back To List
        </span>
      </div>
      <Loader loading={state.loading} />
      <div className={state.loading === true ? 'd-none' : 'card card-xl-stretch mb-5 mb-xl-8'}>
        {/* begin::Header */}
        <div className='card-header align-items-center border-0 m-1'>
          <div className='symbol symbol-60px me-5'>
            <span
              className={clsx(`symbol-label`, `bg-success-light w-90px `)}
              onClick={handleShowImage}
            >
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
              {/* <img
                src={toAbsoluteUrl(process.env.REACT_APP_API_URL + state.photoPath)}
                className='h-100 w-100 align-self-center'
                alt=''
              /> */}
            </span>
          </div>
          <h3 className='card-title align-items-start flex-column'>
            <span className='fw-bolder text-dark'>Package Name : {state.packageName}</span>
            <span className='fw-bold text-muted mt-1 fs-5'>Project Type : {state.projectType}</span>
          </h3>
          <h6 className='card-title align-items-start flex-column'>
            <span className='fw-bold text-muted mt-1 fs-5'>BHK : {state.bhkName}</span>
            <span className='fw-bold text-muted mt-1 fs-5'>
              Carpet Area : {state.carpetAreaName}
            </span>
          </h6>
          <div className='card-toolbar'></div>
        </div>
        {/* end::Header */}
        {/* begin::Item */}
        <AddCartPackageList
          selPackageId={state.selPackageId}
          pageName={'Add'}
          packageName={state.packageName}
          bhkName={state.bhkName}
          carpetAreaName={state.carpetAreaName}
          projectType={state.projectType}
          photoPath={state.photoPath}
          mianBhkID={state.mianBhkID}
          mainCarpetAreaID={state.mainCarpetAreaID}
          mainProjectTypeID={state.mainProjectTypeID}
          mainSearch={state.mainSearch}
        />
        {/* end::Item */}
      </div>

      {/* =====================Image Model=================== */}
      <ModalPopUpImageView
        pageName1={'Package Name'}
        title1={state.packageName}
        pageName2={'Project Type'}
        title2={state.projectType}
        show={showImage}
        imageShow={state.photoPath}
        handleClose={handleCloseImage}
      />
    </>
  )
}

export default PackageByPackageID
