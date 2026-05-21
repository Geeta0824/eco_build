import {Pagination} from 'antd'
import React, {useEffect, useRef, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import Search from 'antd/es/input/Search'
import {
  deleteComanyInfo,
  getCompanyInfoList,
} from '../../../modules/organization-page/comany-info-master/ComanyInfoCRUD'
import {ICompanyInfoModel} from '../../../models/company-info/ICompanyInfoModel'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
type Props = {}

interface IDIY {
  loading: boolean
  companyInfoData: ICompanyInfoModel[]
  tmpCompanyInfoData: ICompanyInfoModel[]
  searchText: string
  mainSearch: string
  selCompanyID: number
  companyID: number
  pathUrl: any
}

const CompanyInfoList: React.FC<Props> = () => {
  const location = useLocation()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IDIY>({
    loading: false,
    companyInfoData: [] as ICompanyInfoModel[],
    tmpCompanyInfoData: [] as ICompanyInfoModel[],
    searchText: '',
    mainSearch: '',
    selCompanyID: 0,
    companyID: 0,
    pathUrl: process.env.REACT_APP_API_URL,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.search
      }
      getCompanyInfoData(mainSearch)
    }, 100)
  }, [])

  function getCompanyInfoData(mainSearch: string) {
    getCompanyInfoList()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.companyName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.countryName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.cityName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.addressLine1.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.addressLine2.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.gstNumber.toLowerCase().includes(mainSearch.toLowerCase())
              )
            })

            setState({
              ...state,
              companyInfoData: results,
              tmpCompanyInfoData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              companyInfoData: responseData,
              tmpCompanyInfoData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, companyInfoData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, companyInfoData: [], loading: false})
      })
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpCompanyInfoData.filter((user) => {
        return (
          user.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.countryName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.cityName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.addressLine1.toLowerCase().includes(keyword.toLowerCase()) ||
          user.addressLine2.toLowerCase().includes(keyword.toLowerCase()) ||
          user.gstNumber.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, companyInfoData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, companyInfoData: state.tmpCompanyInfoData})
      setTotal(state.tmpCompanyInfoData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ===========================================Delete Model==========================
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (companyID: number) => {
    setState({
      ...state,
      selCompanyID: companyID,
      loading: false,
    })
    setShow(true)
  }

  function deleteCompanyInfoData(companyID: number) {
    deleteComanyInfo(companyID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getCompanyInfoData(state.mainSearch)
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

  // ================Download============
  const [downloading, setDownloading] = useState(false)
  async function downloadLogoFile(imageUrl: string) {
    setDownloading(false)
    try {
      const response = await fetch(
        `${state.pathUrl}/Document/DownloadImage/download?imageUrl=${imageUrl}`
      )
      if (!response.ok) {
        throw new Error('Failed to download image')
      }
      const blob = await response.blob()
      const fileName = getFileNameFromUrl(imageUrl)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setDownloading(false)
    } catch (error: any) {
      console.log(error.message)
      setDownloading(false)
    }
  }

  const getFileNameFromUrl = (url: any) => {
    const uri: any = new URL(url)
    return decodeURIComponent(uri.pathname.split('/').pop())
  }

  //   ------View on other tab --------------
  async function downloadSignFile(imageUrl: string) {
    setDownloading(false)
    try {
      const response = await fetch(
        `${state.pathUrl}/Document/DownloadImage/download?imageUrl=${imageUrl}`
      )
      if (!response.ok) {
        throw new Error('Failed to download image')
      }
      const blob = await response.blob()
      const fileName = getFileNameLogoFromUrl(imageUrl)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setDownloading(false)
    } catch (error: any) {
      console.log(error.message)
      setDownloading(false)
    }
  }

  const getFileNameLogoFromUrl = (url: any) => {
    const uri: any = new URL(url)
    return decodeURIComponent(uri.pathname.split('/').pop())
  }

  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.companyInfoData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: ICompanyInfoModel[] = state.companyInfoData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='mb-2 col-xl-3 col-sm-6'>
            <label className='form-label fw-bold text-white'>Search :</label>
            <input
              type='text'
              className='form-control form-control-solid px-15 bg-light-primary'
              // name='search'
              placeholder='Search'
              onChange={(e) => filter(e)}
              value={name}
            />
          </div>
          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link
              to={{pathname: '/organization/company-info/add', state: {mainSearch: name}}}
              className='btn btn-sm btn-light-primary bg-white mt-5'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-125px '>Company Name</th>
                  <th className='min-w-125px '>GST No</th>
                  <th className='min-w-125px '>Address Line1</th>
                  <th className='min-w-125px '>Address Line2</th>
                  <th className='min-w-125px '>City Name</th>
                  <th className='min-w-25px '>Logo Download</th>
                  <th className='min-w-25px '>Sign Download</th>
                  <th className='min-w-25px '>Edit</th>
                  <th className='min-w-25px '>Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Loading ============== */}

                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.companyName}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.gstNumber}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.addressLine1}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.addressLine2}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.cityName}
                          </span>
                        </td>
                        <td className='text-center'>
                          <span
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm'
                            title='Download'
                            onClick={() => downloadLogoFile(state.pathUrl + data.logoPath)}
                          >
                            <KTSVG
                              path='/media/icons/duotune/files/fil017.svg'
                              className='svg-icon-fluid svg-icon-primary'
                            />
                          </span>
                        </td>

                        <td className='text-center'>
                          <span
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm'
                            title='Download'
                            onClick={() => downloadSignFile(state.pathUrl + data.signaturePath)}
                          >
                            <KTSVG
                              path='/media/icons/duotune/files/fil017.svg'
                              className='svg-icon-fluid svg-icon-primary'
                            />
                          </span>
                        </td>
                        <td className='text-center'>
                          <div className='d-flex  flex-shrink-0'>
                            <Link
                              to={{
                                pathname: `/organization/company-info/edit/${data.companyID}`,
                                state: {mainSearch: name},
                              }}
                              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                            >
                              <KTSVG
                                path='/media/icons/duotune/art/art005.svg'
                                className='svg-icon-3 svg-icon-primary'
                              />
                            </Link>
                          </div>
                        </td>

                        <td className='text-ceter'>
                          <div
                            onClick={(e) => handleShow(data.companyID)}
                            className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                          >
                            <KTSVG
                              path='/media/icons/duotune/general/gen027.svg'
                              className='svg-icon-3 svg-icon-danger'
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                {/* =================== Blank Api Data ============== */}
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={9}
                />
              </tbody>
            </table>
          </div>
          <div className='text-center'>
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
          </div>
        </div>
      </div>
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selCompanyID}
        pageName={'_Company_info'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteCompanyInfoData(state.selCompanyID)}
      />
    </>
  )
}

export default CompanyInfoList
