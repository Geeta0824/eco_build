import React, {useEffect, useState} from 'react'
import {useHistory, useLocation, useParams} from 'react-router-dom'

import Loader from '../../../common-pages/Loader'
import clsx from 'clsx'
import {toAbsoluteUrl} from '../../../../../_Ecd/helpers'
import {ModalPopUpImageView} from '../../../common-pages/ModalPopUpImageView'
import {AddCartCarpetryPackageList} from './AddCartCarpetryPackageList'
import {ICartLisyByPackageModel} from '../../../../models/carpetry-page/ICarpetryPackageModel'

interface IDIY {
  // cartListData: ICartLisyByPackageModel[]
  loading: boolean
  selPackageId: number
  tmpPackageID: number
  tmpCartLength: number
  packageName: string
  bhkName: string
  packageAmount: number
  carpetAreaName: string
  projectType: string
  photoPath: string
  mainSearch: string
  projectTypeID: number
  carpetAreaID: number
  bhkID: number
}

const CarpetryPackageByPackageID = () => {
  const {packageID} = useParams<{packageID: string}>()
  const location = useLocation()
  const history = useHistory()

  const [state, setState] = useState<IDIY>({
    // cartListData: [] as ICartLisyByPackageModel[],
    loading: false,
    selPackageId: 0,
    tmpPackageID: 0,
    tmpCartLength: 0,
    packageName: '',
    bhkName: '',
    carpetAreaName: '',
    projectType: '',
    packageAmount: 0,
    photoPath: '',
    mainSearch: '',
    projectTypeID: 0,
    carpetAreaID: 0,
    bhkID: 0,
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
      var packageAmount = lc.packageAmount
      let mainSearch: string = ''
      let projectTypeID: number = 0
      let carpetAreaID: number = 0
      let bhkID: number = 0
      // let cartListData: ICartLisyByPackageModel[] = []
      if (lc.search != undefined) {
        mainSearch = lc.search
        projectTypeID = lc.ProjectTypeID
        carpetAreaID = lc.CarpetAreaID
        // cartListData = lc.cartListData
        bhkID = lc.selBhkId
      }
      // console.log('cartListData', cartListData)
      getProdCategoryData(
        tmpPackageID,
        packageName,
        bhkName,
        carpetAreaName,
        packageAmount,
        projectType,
        photoPath,
        state.tmpCartLength,
        mainSearch,
        projectTypeID,
        carpetAreaID,
        bhkID
        // cartListData
      )
    }, 100)
  }, [])

  function getProdCategoryData(
    tmpPackageID: number,
    packageName: string,
    bhkName: string,
    carpetAreaName: string,
    packageAmount: number,
    projectType: string,
    photoPath: string,
    tmpCount: number,
    mainSearch: string,
    projectTypeID: number,
    carpetAreaID: number,
    bhkID: number
    // cartListData:ICartLisyByPackageModel[]
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
      packageAmount: packageAmount,
      mainSearch,
      projectTypeID,
      carpetAreaID,
      bhkID,
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
      <div className={state.loading === true ? 'd-none' : 'card card-xl-stretch mb-5 mb-xl-8'}>
        {/* begin::Header */}
        <div className='card-header align-items-center border-0 m-1'>
          <div className='symbol symbol-60px me-5'>
            <span
              className={clsx(`symbol-label`, `bg-success-light w-90px `)}
              onClick={handleShowImage}
            >
              <img
                src={toAbsoluteUrl(state.photoPath)}
                className='h-100 w-100 align-self-center'
                alt=''
              />
            </span>
          </div>
          <h3 className='card-title align-items-start flex-column'>
            <span className='fw-bolder text-dark'>Package Name : {state.packageName}</span>
            <span className='fw-bold text-muted mt-1 fs-5'>
              Package Amount : {state.packageAmount}
            </span>
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
        <AddCartCarpetryPackageList
          selPackageId={state.selPackageId}
          pageName={'Add'}
          packageName={state.packageName}
          bhkName={state.bhkName}
          packageAmount={state.packageAmount}
          carpetAreaName={state.carpetAreaName}
          projectType={state.projectType}
          photoPath={state.photoPath}
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

export default CarpetryPackageByPackageID
