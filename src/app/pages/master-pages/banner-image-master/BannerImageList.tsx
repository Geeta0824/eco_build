import React, {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {Pagination} from 'antd'

import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'

import {Button, Modal} from 'react-bootstrap-v5'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {BannerImageCard} from './BannerImageCard'
import {IBannerImageModel} from '../../../models/master-page/IBannerImageModel'
import {
  GetBannerImageApi,
  IsActiveBanner,
  deleteBannerImage,
} from '../../../modules/master-page/banner-image-master-page/BannerImageCRUD'
import {useParams} from 'react-router-dom'
import {
  deleteBannerImage_new,
  GetBannerImageApi_new,
  IsActiveBanner_new,
} from '../../../modules/master-page/banner-image-master-page/BannerImageNewCRUD'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ModelPopUp_ShowImage} from '../../../../components/modal-popup/ModelPopUp_ShowImage'

interface IItem {
  loading: boolean
  bannerImageData: IBannerImageModel[]
  tmpBannerImageData: IBannerImageModel[]

  imageShow: string
  SearchText: string
  selItemName: string
  selBannerId: number
  activeID: number
  activeType: any
  pathUrl: any
  selBannerTitle: string
}

type Props = {}

const BannerImageList: React.FC<Props> = () => {
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IItem>({
    loading: false,
    bannerImageData: [] as IBannerImageModel[],
    tmpBannerImageData: [] as IBannerImageModel[],

    imageShow: '',
    SearchText: '',
    selItemName: '',
    selBannerId: 0,
    activeID: 0,
    activeType: false,
    pathUrl: process.env.REACT_APP_API_URL,
    selBannerTitle: '',
  })

  useEffect(() => {
    setState({...state, loading: false})
    setTimeout(() => {
      getbannerImageData()
    }, 100)
  }, [])

  function getbannerImageData() {
    GetBannerImageApi_new()
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess === true) {
          let responseData = resp.responseObject
          console.log(responseData)
          setState({
            ...state,
            bannerImageData: responseData,
            tmpBannerImageData: responseData,
            loading: false,
          })
        } else {
          toast.error(`${resp.message}`)
          setState({...state, bannerImageData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          bannerImageData: [],
          loading: false,
        })
      })
  }
  // ===================== IsActive Model ==================
  const [showActive, setShowActive] = useState(false)
  const handleClose_Active = () => setShowActive(false)
  function handleShow_Active(event: React.ChangeEvent<HTMLInputElement>) {
    const Cid = event.target.id
    const tmpIsActive = event.target.checked
    setState({
      ...state,
      activeID: parseInt(Cid),
      activeType: tmpIsActive,
      loading: false,
    })
    setShowActive(true)
  }

  // ==================== IsActive API Call ===================
  function checkedFunction(tmpBanner: number, temIsAct: boolean) {
    const values = {bannerID: tmpBanner, isActive: temIsAct}
    console.log(values)
    var objEmp = btoa(JSON.stringify(values))
    IsActiveBanner_new(`${objEmp}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          getbannerImageData()
          setShowActive(false)
        } else {
          toast.error(`${resp.message}`)
          setShowActive(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowActive(false)
      })
  }
  // ==================== Delete Model ============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (bannerID: number) => {
    setState({
      ...state,
      selBannerId: bannerID,
      loading: false,
    })
    setShow(true)
  }

  // ==================== Delete API Call ===================
  const deleteBannerData = (BannerId: number) => {
    const values = {bannerID: BannerId}
    console.log(values)
    var objEmp = btoa(JSON.stringify(values))
    deleteBannerImage_new(`${objEmp}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))

        let resp = decodeResp
        if (resp.isSuccess === true) {
          toast.success('Deleted Successfully')
          getbannerImageData()
          setShow(false)
        } else {
          toast.error(`${resp.message}`)
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }
  // ==================== Country Flag ====================
  const [showFlag, setShowFlag] = useState(false)
  const handleClose_Flag = () => {
    setState({...state, imageShow: '', loading: false})
    setShowFlag(false)
  }
  const handleShow_Flag = (selImg: string, bannerTitle: string) => {
    setState({
      ...state,
      imageShow: state.pathUrl + selImg,
      selBannerTitle: bannerTitle,
      loading: false,
    })
    setShowFlag(true)
  }

  // ============== Search Function =======================
  const [name, setName] = useState('')
  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value
    if (keyword !== '') {
      const results = state.tmpBannerImageData.filter((user) => {
        return user.bannerTitle.toLowerCase().includes(keyword.toLowerCase())
      })
      setState({...state, bannerImageData: results, loading: false})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, bannerImageData: state.tmpBannerImageData, loading: false})
      // If the text field is empty, show all users
      setTotal(state.tmpBannerImageData.length)
      setPage(1)
    }

    setName(keyword)
  }

  // ----------------------pagination---------------------------------------------
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IBannerImageModel[] = state.bannerImageData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )
  // -----------

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/master/bannerimage/add'}
          title='Click to add a country'
        />
        {/* end::Header */}
        {/* <CountryCard data={currentPosts} /> */}
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-striped align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-primary'>
                <tr className='fw-bolder fs-5 text-white'>
                  <th className='min-w-150px'>Image</th>
                  <th className='min-w-150px'>Title</th>
                  <th className='min-w-150px'>IsActive</th>
                  <th className='min-w-100px text-end'>Edit | Delete </th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody>
                {state.loading ? (
                  <LoaderInTable loading={state.loading} column={5} />
                ) : (
                  <>
                    {currentPosts.length > 0 &&
                      currentPosts.map((data, index) => {
                        return (
                          <BannerImageCard
                            data={data}
                            handleShowFlag={() =>
                              handleShow_Flag(data.bannerPath, data.bannerTitle)
                            }
                            handleShowActive={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleShow_Active(e)
                            }
                            handleShow={handleShow}
                          />
                        )
                      })}
                    {/* =================== Loading get Api Data ============== */}
                    <BlankDataImageInTable
                      length={currentPosts.length}
                      loading={state.loading}
                      colSpan={5}
                    />
                  </>
                )}
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
              showTotal={(total) => `Total ${total} items`}
            ></Pagination>
          </div>
        </div>
      </div>
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selBannerId}
        pageName={'Banner Image'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteBannerData(state.selBannerId)}
      />
      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Banner Image '}
        showActive={showActive}
        handleCloseActive={handleClose_Active}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
      {/* =====================Image Model=================== */}
      <ModelPopUp_ShowImage
        imageShow={state.imageShow}
        pageName={state.selBannerTitle}
        show={showFlag}
        handleClose={handleClose_Flag}
      />
    </>
  )
}
export default BannerImageList
