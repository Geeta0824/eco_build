/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import React, {useState} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../_Ecd/helpers'
import {Link, useHistory} from 'react-router-dom'
import {UserModel} from '../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../setup'
import axios from 'axios'
import {toast} from 'react-toastify'

type Props = {
  packageID: number
  className: string
  color: string
  image: string
  title: string
  projectType: string
  bhkName: string
  areaName: string
  projectTypeId: number
  bhkId: number
  areaId: number
  packageAmount: string
  totalProducts: string
  searchText: string
  mianBhkID: number
  mainProjectTypeID: number
  mainCarpetAreaID: number
  showData: (_id: number) => void
  handleRefresh: () => void
}

const ListPackageCard: React.FC<Props> = ({
  packageID,
  className,
  color,
  image,
  title,
  projectType,
  bhkName,
  areaName,
  projectTypeId,
  bhkId,
  areaId,
  packageAmount,
  totalProducts,
  searchText,
  mianBhkID,
  mainProjectTypeID,
  mainCarpetAreaID,
  showData,
  handleRefresh,
}) => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [selDwID, setSelDwID] = useState<number>(0)
  const [downloadLoader, setDownloadLoader] = useState<boolean>(false)
  const [selAdmDwID, setSelAdmDwID] = useState<number>(0)
  const [admindwnldLoader, setAdmindwnldLoader] = useState<boolean>(false)

  function getQuotationPdf(packageName: string, isDownload: number, pathname: string) {
    var URL = ''
    if (pathname == `/package/admin-pdf/${packageID}`) {
      setAdmindwnldLoader(true)
      setSelAdmDwID(packageID)
      URL = `${process.env.REACT_APP_API_URL}/PDF/DownloadPackagePDFForAdmin`
    } else {
      setDownloadLoader(true)
      setSelDwID(packageID)
      URL = `${process.env.REACT_APP_API_URL}/PDF/DownloadPackagePDF`
    }
    axios.post(URL, {packageID: packageID, isDownload: isDownload}).then((response) => {
      // The Base64 string of a simple PDF file
      var b64 = response.data.pdfData

      const linkSource = `data:application/pdf;base64,${b64}`
      const aPdfDownload = document.createElement('a')
      var fileName1 = ''
      if (pathname == `/package/admin-pdf/${packageID}`) {
        setAdmindwnldLoader(false)
        setSelAdmDwID(0)
        fileName1 = `${packageName}_admin`
      } else {
        setDownloadLoader(false)
        setSelDwID(0)
        fileName1 = `${packageName}`
      }
      const fileName = fileName1 + '.pdf'
      aPdfDownload.setAttribute('download', fileName)
      aPdfDownload.href = linkSource
      aPdfDownload.download = fileName
      document.body.append(aPdfDownload)
      aPdfDownload.click()
      aPdfDownload.remove()
    })
  }

  // const [photo, setPhoto] = useState('')
  // const [fileLoader, setFileLoader] = useState(false)
  // const imageUpload = (e: any, ID: number) => {
  //   if (e.target.files[0].size > 20971520) {
  //     return toast.error('File size has exceeded it max limit of 20MB')
  //   }
  //   // setFileLoader(true)
  //   e.preventDefault()
  //   const formData = new FormData()
  //   formData.append('file', e.target.files[0], e.target.files[0].name)
  //   fetch(process.env.REACT_APP_API_URL + `/Package/UpdatePackagePhoto/${ID}`, {
  //     method: 'POST',
  //     body: formData,
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //    //  console.log(data)
  //       if (data.isSuccess === true) {
  //         // setPhoto(data.photoPath)
  //         handleRefresh()
  //         // setFileLoader(false)
  //       } else {
  //         toast.error(`${data.message}`)
  //         // setFileLoader(false)
  //       }
  //     })
  //     .catch((err) => {
  //       toast.error(`${err.message}`)
  //       // setFileLoader(false)
  //     })
  // }

  return (
    <>
      <div className={`${className} h-100`} key={packageID}>
        <div className='shadow rounded overlay overflow-hidden'>
          {image == '/media/img/NoProductImage.png' ? (
            <img
              src={toAbsoluteUrl(image)}
              className={'card-img-top rounded h-150px'}
              alt='image'
            />
          ) : (
            <img
              src={toAbsoluteUrl(process.env.REACT_APP_API_URL + image)}
              className={'card-img-top rounded h-150px'}
              alt='image'
            />
          )}
          <div className='card-body p-5'>
            <h4 className='card-title'>{title}</h4>
            <div className='card-toolbar mb-2'>
              <span className={`badge badge-light-${color} fw-bolder me-auto px-4 py-3`}>
                {projectType}
              </span>
            </div>
            {/* begin::Row */}
            <div className='row g-0 mt-2'>
              <div className='col'>
                {/* begin::Label */}
                <div className='fs-7 text-muted fw-bold'>BHK : </div>
                {/* end::Label */}
                <div className='d-flex align-items-center'>
                  <div className='fs-4 fw-bolder'>{bhkName}</div>
                </div>
              </div>
              <div className='col'>
                {/* begin::Label */}
                <div className='fs-7 text-muted fw-bold'>Area : </div>
                {/* end::Label */}
                <div className='d-flex align-items-center'>
                  <div className='fs-4 fw-bolder'>{areaName}</div>
                </div>
              </div>
            </div>
            <div className='row g-0 mt-2'>
              <div className='col'>
                {/* begin::Label */}
                <div className='fs-7 text-muted fw-bold'>Product : </div>
                {/* end::Label */}
                <div className='d-flex align-items-center'>
                  <div className='fs-4 fw-bolder'>{totalProducts}</div>
                </div>
              </div>
              <div className='col'>
                {/* begin::Label */}
                <div className='fs-7 text-muted fw-bold'>Amount : </div>
                {/* end::Label */}
                <div className='d-flex align-items-center'>
                  <div className='fs-4 fw-bolder'>{packageAmount}</div>
                </div>
              </div>
            </div>
            {/* end::Row */}
            {/* <div className='d-flex align-items-center'>
              <span className='fs-7 text-muted fw-bold pe-2'>BHK : </span>
              <div className='fs-5 fw-bolder'>{bhkName}</div>
            </div>
            <div className='d-flex align-items-center'>
              <span className='fs-7 text-muted fw-bold pe-2'>Area : </span>
              <div className='fs-5 fw-bolder'>{areaName}&nbsp;</div>
              <span className='fs-7 fw-bold pe-2'> sqft</span>
            </div> */}
            {/* <p className='card-text'>
              This is a longer card with supporting text below as a natural lead-in to additional
              content. This content is a little bit longer.
            </p> */}
          </div>

          <div className='overlay-layer bg-dark bg-opacity-10 row gx-5'>
            {/* <!--begin::Image input--> */}
            {/* <div className='image-input image-input-empty' data-kt-image-input='true'>
              {/* <!--begin::Image preview wrapper--> 
              <div className='image-input-wrapper w-0px h-0px'></div>
              {/* <!--end::Image preview wrapper--> 
              {/* <!--begin::Edit button--> 
              <label
                className='btn btn-icon btn-circle btn-color-muted btn-active-color-primary w-35px h-25px bg-body shadow'
                style={{left: '90%'}}
                data-kt-image-input-action='change'
                data-bs-toggle='tooltip'
                data-bs-dismiss='click'
                title='Change avatar'
              >
                <i className='bi bi-pencil-fill fs-7'></i>
                {/* <!--begin::Inputs--> 
                <input
                  type='file'
                  onChange={(e) => imageUpload(e, packageID)}
                  name='avatar'
                  accept='.png, .jpg, .jpeg'
                />
                {/* <!--end::Inputs--> 
              </label>
              {/* <!--end::Edit button--> 
            </div> */}
            {/* <!--end::Image input--> */}
            <span className='col-sm-6 col-lg-3'>
              <Link
                to={{
                  pathname: `/package/view-cart/${packageID}`,
                  state: {
                    packageID: packageID,
                    packageName: title,
                    bhkName: bhkName,
                    carpetAreaName: areaName,
                    projectType: projectType,
                    bhkId: bhkId,
                    carpetAreaId: areaId,
                    projectTypeId: projectTypeId,
                    photoPath: image,
                    mianBhkID: mianBhkID,
                    mainCarpetAreaID: mainCarpetAreaID,
                    mainProjectTypeID: mainProjectTypeID,
                    mainSearch: searchText,
                  },
                }}
                className='btn btn-light-success btn-shadow'
              >
                <span className='fa fa-eye fs-2'></span>
              </Link>
            </span>
            <span className='col-sm-6 col-lg-3'>
              {downloadLoader && selDwID == packageID ? (
                <span className='d-block justify-content-center m-5 p-5'>
                  <span
                    className='spinner-border text-primary'
                    style={{width: '2rem', height: '2rem'}}
                    role='status'
                  >
                    <span className='visually-hidden'>Loading...</span>
                  </span>
                </span>
              ) : (
                <span
                  onClick={() => getQuotationPdf(title, 1, `/package/pdf/${packageID}`)}
                  // <Link
                  // to={{
                  //   pathname: `/package/pdf/${packageID}`,
                  //   state: {
                  //     packageName: title,
                  //   },
                  // }}
                  className='btn btn-light-primary btn-shadow ms-2'
                >
                  <span className='fa fa-download fs-2'></span>
                  {/* </Link> */}
                </span>
              )}
            </span>
            <span className='col-sm-6 col-lg-3'>
              {admindwnldLoader && selAdmDwID == packageID ? (
                <span className='d-block justify-content-center m-5 p-5'>
                  <span
                    className='spinner-border text-primary'
                    style={{width: '2rem', height: '2rem'}}
                    role='status'
                  >
                    <span className='visually-hidden'>Loading...</span>
                  </span>
                </span>
              ) : (
                <span
                  onClick={() => getQuotationPdf(title, 1, `/package/admin-pdf/${packageID}`)}
                  // <Link
                  // to={{
                  //   pathname: `/package/admin-pdf/${packageID}`,
                  //   state: {
                  //     packageName: title,
                  //   },
                  // }}
                  className={user.roleID === 2 ? 'btn btn-light-info btn-shadow ms-2' : 'd-none'}
                >
                  <span className='fa fa-download fs-2'></span>
                  {/* </Link> */}
                </span>
              )}
            </span>
            <span className='col-sm-6 col-lg-3'>
              <span
                onClick={() => showData(packageID)}
                className='btn btn-light-danger btn-shadow ms-2 text-center'
              >
                <span className='fa fa-trash fs-2'></span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export {ListPackageCard}
